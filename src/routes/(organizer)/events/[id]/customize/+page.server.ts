import { error, redirect, fail } from '@sveltejs/kit';
import type { Database } from '$lib/database/database.types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { eventCustomizationSchema } from '$lib/validations';
import { validateAndRecompressImage } from '$lib/utils/images/server-image-validation';
import { uploadValidatedImage, deleteImage, extractPublicIdFromUrl, isCloudinaryConfigured, CloudinaryUploadError } from '$lib/utils/cloudinary';

type Event = Database['public']['Tables']['events']['Row'];
type EventCustomization = Database['public']['Tables']['event_customizations']['Row'];

export const load = async ({ params, locals: { supabase, safeGetSession } }: any) => {
    const { session } = await safeGetSession();

    if (!session) {
        throw redirect(303, '/auth');
    }

    const { id } = params;

    // Get the event
    const { data: event, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .eq('owner_id', session.user.id)
        .single();

    if (fetchError || !event) {
        throw error(404, 'Événement non trouvé');
    }

    // Get existing customizations
    const { data: customization, error: customizationError } = await supabase
        .from('event_customizations')
        .select('*')
        .eq('event_id', id)
        .single();

    if (customizationError && customizationError.code !== 'PGRST116') {
        console.error('Error fetching customization:', customizationError);
    }

    const form = await superValidate(
        customization || {
            background_color: '#FFFFFF',
            font_color: '#2C3E50',
            font_family: 'Playfair Display',
            welcome_text: '',
            subtitle_text: ''
        },
        zod(eventCustomizationSchema)
    );

    return {
        event: event as Event,
        customization: customization as EventCustomization | null,
        form
    };
};

export const actions = {
    save: async ({ request, params, locals: { supabase, safeGetSession } }: any) => {
        const { session } = await safeGetSession();

        if (!session) {
            throw redirect(303, '/auth');
        }

        const { id } = params;
        const formData = await request.formData();

        // 🧩 Valider directement le FormData (pas besoin de recréer un Request)
        const validatedForm = await superValidate(formData, zod(eventCustomizationSchema));

        // Récupérer les fichiers
        const backgroundImageFile = formData.get('background_image') as File | null;
        const logoFile = formData.get('logo') as File | null;

        // Extraire les champs texte depuis validatedForm.data (garanti propre)
        const {
            background_color,
            font_color,
            font_family,
            welcome_text,
            subtitle_text,
            background_image_url,
            logo_url
        } = validatedForm.data;

        let finalBackgroundImageUrl = background_image_url || null;
        let finalLogoUrl = logo_url || null;

        // --- Uploads Cloudinary ---
        const uploadPromises: Promise<void>[] = [];

        if (backgroundImageFile && backgroundImageFile.size > 0) {
            uploadPromises.push(
                (async () => {
                    if (!isCloudinaryConfigured())
                        throw new Error("Cloudinary n'est pas configuré.");

                    const validationResult = await validateAndRecompressImage(backgroundImageFile, 'BACKGROUND');
                    if (!validationResult.isValid) throw new Error(validationResult.error || 'Image invalide');

                    const uploadResult = await uploadValidatedImage(
                        validationResult.compressedFile || backgroundImageFile,
                        'BACKGROUND',
                        session.user.id
                    );

                    finalBackgroundImageUrl = uploadResult.secure_url;
                })()
            );
        }

        if (logoFile && logoFile.size > 0) {
            uploadPromises.push(
                (async () => {
                    if (!isCloudinaryConfigured())
                        throw new Error("Cloudinary n'est pas configuré.");

                    const validationResult = await validateAndRecompressImage(logoFile, 'LOGO');
                    if (!validationResult.isValid) throw new Error(validationResult.error || 'Logo invalide');

                    const uploadResult = await uploadValidatedImage(
                        validationResult.compressedFile || logoFile,
                        'LOGO',
                        session.user.id
                    );

                    finalLogoUrl = uploadResult.secure_url;
                })()
            );
        }

        try {
            await Promise.all(uploadPromises);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Erreur lors de l’upload des images';
            validatedForm.message = msg;
            return { form: validatedForm };
        }

        if (!validatedForm.valid && uploadPromises.length === 0) {
            return fail(400, { form: validatedForm });
        }

        // --- Sauvegarde en DB ---
        const upsertData = {
            event_id: id,
            background_color,
            font_color,
            font_family,
            welcome_text,
            subtitle_text,
            background_image_url: finalBackgroundImageUrl,
            logo_url: finalLogoUrl,
            updated_at: new Date().toISOString()
        };

        console.log('💾 Upsert data:', upsertData);

        const { error: upsertError } = await supabase
            .from('event_customizations')
            .upsert(upsertData, { onConflict: 'event_id' });

        if (upsertError) {
            console.error('❌ Upsert error:', upsertError);
            validatedForm.message = 'Erreur lors de la sauvegarde de la personnalisation';
            return { form: validatedForm };
        }

        throw redirect(303, `/events/${id}`);
    },
    removeBackgroundImage: async ({ params, locals: { supabase, safeGetSession } }: any) => {
        const { session } = await safeGetSession();
        if (!session) {
            return { success: false, error: 'Non autorisé' };
        }

        const { id } = params;

        // Récupérer l'URL actuelle de l'image de fond
        const { data: customization } = await supabase
            .from('event_customizations')
            .select('background_image_url')
            .eq('event_id', id)
            .single();

        if (customization?.background_image_url) {
            try {
                // Vérifier si c'est une URL Cloudinary ou Supabase (pour compatibilité)
                const isCloudinaryUrl = customization.background_image_url.includes('cloudinary.com');

                if (isCloudinaryUrl && isCloudinaryConfigured()) {
                    // Supprimer depuis Cloudinary
                    const publicId = extractPublicIdFromUrl(customization.background_image_url);
                    if (publicId) {
                        try {
                            await deleteImage(publicId);
                        } catch (error) {
                            // On continue quand même pour supprimer l'URL de la DB
                        }
                    }
                } else if (!isCloudinaryUrl) {
                    // Ancien système Supabase Storage - suppression pour compatibilité
                    const fileName = customization.background_image_url.split('/').pop();
                    if (fileName) {
                        const { error: deleteError } = await supabase.storage
                            .from('event-customizations')
                            .remove([`${session.user.id}/${fileName}`]);

                        if (deleteError) {
                            // Ignorer l'erreur de suppression
                        }
                    }
                }
            } catch (error) {
                // On continue quand même pour supprimer l'URL de la DB
            }
        }

        // Mettre à jour la base de données pour supprimer l'URL
        const { error: updateError } = await supabase
            .from('event_customizations')
            .update({
                background_image_url: null,
                updated_at: new Date().toISOString()
            })
            .eq('event_id', id);

        if (updateError) {
            console.error('Error updating customizations:', updateError);
            return { success: false, error: 'Erreur lors de la suppression' };
        }

        return { success: true };
    },
    removeLogo: async ({ params, locals: { supabase, safeGetSession } }: any) => {
        const { session } = await safeGetSession();
        if (!session) {
            return { success: false, error: 'Non autorisé' };
        }

        const { id } = params;

        // Récupérer l'URL actuelle du logo
        const { data: customization } = await supabase
            .from('event_customizations')
            .select('logo_url')
            .eq('event_id', id)
            .single();

        if (customization?.logo_url) {
            try {
                // Vérifier si c'est une URL Cloudinary ou Supabase (pour compatibilité)
                const isCloudinaryUrl = customization.logo_url.includes('cloudinary.com');

                if (isCloudinaryUrl && isCloudinaryConfigured()) {
                    // Supprimer depuis Cloudinary
                    const publicId = extractPublicIdFromUrl(customization.logo_url);
                    if (publicId) {
                        try {
                            await deleteImage(publicId);
                        } catch (error) {
                            // On continue quand même pour supprimer l'URL de la DB
                        }
                    }
                } else if (!isCloudinaryUrl) {
                    // Ancien système Supabase Storage - suppression pour compatibilité
                    const fileName = customization.logo_url.split('/').pop();
                    if (fileName) {
                        const { error: deleteError } = await supabase.storage
                            .from('event-customizations')
                            .remove([`${session.user.id}/${fileName}`]);

                        if (deleteError) {
                            // Ignorer l'erreur de suppression
                        }
                    }
                }
            } catch (error) {
                // On continue quand même pour supprimer l'URL de la DB
            }
        }

        // Mettre à jour la base de données pour supprimer l'URL
        const { error: updateError } = await supabase
            .from('event_customizations')
            .update({
                logo_url: null,
                updated_at: new Date().toISOString()
            })
            .eq('event_id', id);

        if (updateError) {
            console.error('Error updating customizations:', updateError);
            return { success: false, error: 'Erreur lors de la suppression' };
        }

        return { success: true };
    }
};
