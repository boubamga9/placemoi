import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { backblazeService } from '$lib/storage/backblaze';
import {
    deleteImage,
    extractPublicIdFromUrl,
    isCloudinaryConfigured,
} from '$lib/utils/cloudinary';
import { isEventAccessible } from '$lib/utils/event-utils';

/**
 * Endpoint de nettoyage automatique des photos
 * Supprime les photos des événements qui ont eu lieu il y a plus de 3 mois
 * 
 * Ce endpoint est appelé par un cron job Vercel quotidiennement
 * 
 * Sécurité : Vérifie que la requête vient de Vercel Cron (via header Authorization)
 */
export const GET: RequestHandler = async ({ request, locals: { supabaseServiceRole } }) => {
    // Vérifier que la requête vient de Vercel Cron
    // Vercel envoie un header Authorization avec un token secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Calculer la date limite : 3 mois avant aujourd'hui
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        console.log(`🧹 Début du nettoyage des photos pour les événements avant le ${threeMonthsAgo.toISOString()}`);

        // Récupérer tous les événements qui ont eu lieu il y a plus de 3 mois
        const { data: oldEvents, error: eventsError } = await supabaseServiceRole
            .from('events')
            .select('id, event_date, slug')
            .lt('event_date', threeMonthsAgo.toISOString());

        // Récupérer aussi les événements qui ne sont plus accessibles (plus de 5 jours après la date)
        // pour supprimer leurs images de personnalisation Cloudinary
        const { data: allEvents, error: allEventsError } = await supabaseServiceRole
            .from('events')
            .select('id, event_date, slug');

        if (allEventsError) {
            console.error('❌ Erreur lors de la récupération de tous les événements:', allEventsError);
        }

        // Filtrer les événements non accessibles
        const inaccessibleEvents =
            allEvents?.filter((event) => !isEventAccessible(event.event_date)) || [];

        if (eventsError) {
            console.error('❌ Erreur lors de la récupération des événements:', eventsError);
            return json({ error: 'Erreur lors de la récupération des événements' }, { status: 500 });
        }

        if (!oldEvents || oldEvents.length === 0) {
            console.log('✅ Aucun événement ancien à nettoyer');
            return json({
                success: true,
                message: 'Aucun événement à nettoyer',
                eventsProcessed: 0,
                photosDeleted: 0,
            });
        }

        console.log(`📋 ${oldEvents.length} événement(s) à nettoyer`);

        let totalPhotosDeleted = 0;
        let totalFilesDeleted = 0;
        let totalCustomizationImagesDeleted = 0;
        let totalErrors = 0;

        // Nettoyer les images de personnalisation Cloudinary pour les événements non accessibles
        if (inaccessibleEvents.length > 0 && isCloudinaryConfigured()) {
            console.log(
                `🎨 Nettoyage des images de personnalisation pour ${inaccessibleEvents.length} événement(s) non accessible(s)`,
            );

            for (const event of inaccessibleEvents) {
                try {
                    // Récupérer les customizations de l'événement
                    const { data: customization, error: customizationError } =
                        await supabaseServiceRole
                            .from('event_customizations')
                            .select('id, background_image_url, logo_url')
                            .eq('event_id', event.id)
                            .single();

                    if (customizationError || !customization) {
                        continue;
                    }

                    // Supprimer l'image de fond si elle existe et est sur Cloudinary
                    if (customization.background_image_url?.includes('cloudinary.com')) {
                        const publicId = extractPublicIdFromUrl(customization.background_image_url);
                        if (publicId) {
                            try {
                                await deleteImage(publicId);
                                totalCustomizationImagesDeleted++;
                                console.log(
                                    `  ✅ Image de fond supprimée de Cloudinary pour l'événement ${event.id}`,
                                );
                            } catch (cloudinaryError) {
                                console.error(
                                    `  ⚠️  Erreur lors de la suppression de l'image de fond Cloudinary pour ${event.id}:`,
                                    cloudinaryError,
                                );
                            }
                        }
                    }

                    // Supprimer le logo si il existe et est sur Cloudinary
                    if (customization.logo_url?.includes('cloudinary.com')) {
                        const publicId = extractPublicIdFromUrl(customization.logo_url);
                        if (publicId) {
                            try {
                                await deleteImage(publicId);
                                totalCustomizationImagesDeleted++;
                                console.log(
                                    `  ✅ Logo supprimé de Cloudinary pour l'événement ${event.id}`,
                                );
                            } catch (cloudinaryError) {
                                console.error(
                                    `  ⚠️  Erreur lors de la suppression du logo Cloudinary pour ${event.id}:`,
                                    cloudinaryError,
                                );
                            }
                        }
                    }

                    // Mettre à jour la base de données pour supprimer les URLs
                    await supabaseServiceRole
                        .from('event_customizations')
                        .update({
                            background_image_url: null,
                            logo_url: null,
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', customization.id);
                } catch (eventError) {
                    console.error(
                        `❌ Erreur lors du nettoyage des images de personnalisation pour l'événement ${event.id}:`,
                        eventError,
                    );
                    totalErrors++;
                }
            }
        }

        // Pour chaque événement, supprimer toutes ses photos
        for (const event of oldEvents) {
            try {
                // Récupérer toutes les photos de cet événement
                const { data: photos, error: photosError } = await supabaseServiceRole
                    .from('event_photos')
                    .select('id, backblaze_file_id, backblaze_file_name')
                    .eq('event_id', event.id);

                if (photosError) {
                    console.error(`❌ Erreur lors de la récupération des photos pour l'événement ${event.id}:`, photosError);
                    totalErrors++;
                    continue;
                }

                if (!photos || photos.length === 0) {
                    console.log(`ℹ️  Aucune photo pour l'événement ${event.id} (${event.slug || 'sans slug'})`);
                    continue;
                }

                console.log(`🗑️  Suppression de ${photos.length} photo(s) pour l'événement ${event.id} (${event.slug || 'sans slug'})`);

                // Supprimer chaque photo de Backblaze et de la base de données
                for (const photo of photos) {
                    try {
                        // Supprimer le fichier de Backblaze
                        if (photo.backblaze_file_id && photo.backblaze_file_name) {
                            try {
                                await backblazeService.deleteFile(photo.backblaze_file_id, photo.backblaze_file_name);
                                totalFilesDeleted++;
                                console.log(`  ✅ Photo supprimée de Backblaze: ${photo.backblaze_file_name}`);
                            } catch (backblazeError) {
                                console.error(`  ⚠️  Erreur lors de la suppression de Backblaze pour ${photo.backblaze_file_name}:`, backblazeError);
                                // On continue quand même pour supprimer l'enregistrement de la DB
                            }
                        }

                        // Supprimer l'enregistrement de la base de données
                        const { error: deleteError } = await supabaseServiceRole
                            .from('event_photos')
                            .delete()
                            .eq('id', photo.id);

                        if (deleteError) {
                            console.error(`  ❌ Erreur lors de la suppression de la DB pour la photo ${photo.id}:`, deleteError);
                            totalErrors++;
                        } else {
                            totalPhotosDeleted++;
                        }
                    } catch (photoError) {
                        console.error(`  ❌ Erreur lors du traitement de la photo ${photo.id}:`, photoError);
                        totalErrors++;
                    }
                }
            } catch (eventError) {
                console.error(`❌ Erreur lors du traitement de l'événement ${event.id}:`, eventError);
                totalErrors++;
            }
        }

        console.log(`✅ Nettoyage terminé:`);
        console.log(`   - Événements traités (photos): ${oldEvents.length}`);
        console.log(`   - Photos supprimées de la DB: ${totalPhotosDeleted}`);
        console.log(`   - Fichiers supprimés de Backblaze: ${totalFilesDeleted}`);
        console.log(
            `   - Images de personnalisation supprimées de Cloudinary: ${totalCustomizationImagesDeleted}`,
        );
        console.log(`   - Erreurs: ${totalErrors}`);

        return json({
            success: true,
            message: 'Nettoyage terminé',
            eventsProcessed: oldEvents.length,
            photosDeleted: totalPhotosDeleted,
            filesDeleted: totalFilesDeleted,
            customizationImagesDeleted: totalCustomizationImagesDeleted,
            errors: totalErrors,
        });
    } catch (error) {
        console.error('❌ Erreur lors du nettoyage:', error);
        return json(
            {
                error: 'Erreur lors du nettoyage',
                message: error instanceof Error ? error.message : 'Erreur inconnue',
            },
            { status: 500 },
        );
    }
};

