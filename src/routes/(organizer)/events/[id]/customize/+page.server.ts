import { error, redirect, fail } from '@sveltejs/kit';
import type { Database } from '$lib/database/database.types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { eventCustomizationSchema } from '$lib/validations';
import { sanitizeFileName } from '$lib/utils/filename-sanitizer';
import { validateAndRecompressImage } from '$lib/utils/images/server-image-validation';

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

        // Validate form with superValidate
        const validatedForm = await superValidate(request, zod(eventCustomizationSchema));

        if (!validatedForm.valid) {
            return fail(400, { form: validatedForm });
        }

        // Handle file uploads from form.data - OPTIMIZED: parallel uploads
        const { background_image, logo, background_image_url, logo_url } = validatedForm.data;
        let finalBackgroundImageUrl = background_image_url;
        let finalLogoUrl = logo_url;

        // Prepare upload promises (will run in parallel)
        const uploadPromises: Promise<void>[] = [];

        // Background image upload promise
        if (background_image && background_image.size > 0) {
            uploadPromises.push(
                (async () => {
                    try {
                        // 🔒 SECURITY: Validate and recompress server-side (cannot be bypassed)
                        const validationResult = await validateAndRecompressImage(background_image, 'BACKGROUND');

                        if (!validationResult.isValid) {
                            throw new Error(validationResult.error || 'Image invalide');
                        }

                        // Use server-compressed image if available, otherwise use original (already validated)
                        const fileToUpload = validationResult.compressedFile || background_image;

                        const sanitizedFileName = sanitizeFileName(fileToUpload.name);
                        const fileName = `${session.user.id}/${Date.now()}-${sanitizedFileName}`;

                        const { error: uploadError } = await supabase.storage
                            .from('event-customizations')
                            .upload(fileName, fileToUpload, {
                                cacheControl: '3600',
                                upsert: false
                            });

                        if (uploadError) {
                            throw new Error(`Upload error: ${uploadError.message}`);
                        }

                        // Get public URL
                        const { data: urlData } = supabase.storage
                            .from('event-customizations')
                            .getPublicUrl(fileName);

                        finalBackgroundImageUrl = urlData.publicUrl;
                    } catch (err) {
                        console.error('Background image upload error:', err);
                        throw new Error(err instanceof Error ? err.message : 'Erreur lors de l\'upload de l\'image de fond');
                    }
                })()
            );
        }

        // Logo upload promise
        if (logo && logo.size > 0) {
            uploadPromises.push(
                (async () => {
                    try {
                        // 🔒 SECURITY: Validate and recompress server-side (cannot be bypassed)
                        const validationResult = await validateAndRecompressImage(logo, 'LOGO');

                        if (!validationResult.isValid) {
                            throw new Error(validationResult.error || 'Logo invalide');
                        }

                        // Use server-compressed image if available, otherwise use original (already validated)
                        const fileToUpload = validationResult.compressedFile || logo;

                        const sanitizedFileName = sanitizeFileName(fileToUpload.name);
                        const fileName = `${session.user.id}/logo-${Date.now()}-${sanitizedFileName}`;

                        const { error: uploadError } = await supabase.storage
                            .from('event-customizations')
                            .upload(fileName, fileToUpload, {
                                cacheControl: '3600',
                                upsert: false
                            });

                        if (uploadError) {
                            throw new Error(`Upload error: ${uploadError.message}`);
                        }

                        // Get public URL
                        const { data: urlData } = supabase.storage
                            .from('event-customizations')
                            .getPublicUrl(fileName);

                        finalLogoUrl = urlData.publicUrl;
                    } catch (err) {
                        console.error('Logo upload error:', err);
                        throw new Error(err instanceof Error ? err.message : 'Erreur lors de l\'upload du logo');
                    }
                })()
            );
        }

        // Execute all uploads in parallel
        if (uploadPromises.length > 0) {
            try {
                await Promise.all(uploadPromises);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'upload des images';
                validatedForm.message = errorMessage;
                return { form: validatedForm };
            }
        }

        // OPTIMIZED: Use upsert instead of SELECT + UPDATE/INSERT (saves one database query)
        const { error: upsertError } = await supabase
            .from('event_customizations')
            .upsert({
                event_id: id,
                background_color: validatedForm.data.background_color,
                font_color: validatedForm.data.font_color,
                font_family: validatedForm.data.font_family,
                background_image_url: finalBackgroundImageUrl,
                logo_url: finalLogoUrl,
                welcome_text: validatedForm.data.welcome_text,
                subtitle_text: validatedForm.data.subtitle_text
            }, {
                onConflict: 'event_id'
            });

        if (upsertError) {
            console.error('Error upserting customization:', upsertError);
            validatedForm.message = 'Erreur lors de la sauvegarde de la personnalisation';
            return { form: validatedForm };
        }

        // Redirect to event page after successful save
        // No need to return form since we're redirecting
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
                // Supprimer le fichier du storage
                const fileName = customization.background_image_url.split('/').pop();
                if (fileName) {
                    const { error: deleteError } = await supabase.storage
                        .from('event-customizations')
                        .remove([`${session.user.id}/${fileName}`]);

                    if (deleteError) {
                        console.error('Error deleting background image:', deleteError);
                    } else {
                        console.log('Background image deleted from storage');
                    }
                }
            } catch (error) {
                console.error('Error processing background image deletion:', error);
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
                // Supprimer le fichier du storage
                const fileName = customization.logo_url.split('/').pop();
                if (fileName) {
                    const { error: deleteError } = await supabase.storage
                        .from('event-customizations')
                        .remove([`${session.user.id}/${fileName}`]);

                    if (deleteError) {
                        console.error('Error deleting logo:', deleteError);
                    } else {
                        console.log('Logo deleted from storage');
                    }
                }
            } catch (error) {
                console.error('Error processing logo deletion:', error);
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
