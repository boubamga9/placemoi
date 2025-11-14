import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { backblazeService } from '$lib/storage/backblaze';
import archiver from 'archiver';

/**
 * API endpoint pour télécharger toutes les photos d'un événement en ZIP
 * GET /api/events/[id]/photos/download-all
 * Crée un ZIP avec toutes les photos et le renvoie
 */
export const GET: RequestHandler = async ({ params, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession();

    if (!session) {
        throw error(401, 'Non autorisé');
    }

    const { id: eventId } = params;

    if (!eventId) {
        throw error(400, 'Event ID is required');
    }

    // Vérifier que l'utilisateur est le propriétaire de l'événement
    const { data: event, error: eventError } = await supabase
        .from('events')
        .select('id, owner_id, event_name')
        .eq('id', eventId)
        .eq('owner_id', session.user.id)
        .single();

    if (eventError || !event) {
        throw error(404, 'Événement non trouvé ou accès refusé');
    }

    try {
        // Récupérer toutes les photos de l'événement
        const { data: photos, error: photosError } = await supabase
            .from('event_photos')
            .select('*')
            .eq('event_id', eventId)
            .order('uploaded_at', { ascending: false });

        if (photosError) {
            console.error('❌ Error fetching photos:', photosError);
            throw error(500, 'Erreur lors de la récupération des photos');
        }

        if (!photos || photos.length === 0) {
            throw error(404, 'Aucune photo à télécharger');
        }

        // Limiter à 200 photos pour éviter les problèmes de mémoire
        const maxPhotos = 200;
        if (photos.length > maxPhotos) {
            console.warn(`⚠️ Limiting ZIP to ${maxPhotos} photos (${photos.length} total)`);
            photos = photos.slice(0, maxPhotos);
        }

        // Créer un stream pour le ZIP
        const archive = archiver('zip', {
            zlib: { level: 6 }, // Bon compromis vitesse/taille (niveau 9 = trop lent)
        });

        // Collecter tous les chunks dans un tableau
        const chunks: Buffer[] = [];

        // Écouter les événements AVANT de finaliser
        const archivePromise = new Promise<void>((resolve, reject) => {
            archive.on('data', (chunk: Buffer) => {
                chunks.push(chunk);
            });

            archive.on('end', () => {
                resolve();
            });

            archive.on('error', (err) => {
                reject(err);
            });
        });

        // OPTIMISATION: Télécharger les photos en parallèle (batch de 10 pour éviter la surcharge)
        const batchSize = 10;
        for (let i = 0; i < photos.length; i += batchSize) {
            const batch = photos.slice(i, i + batchSize);

            // Télécharger toutes les photos du batch en parallèle
            const photoBuffers = await Promise.all(
                batch.map(async (photo) => {
                    try {
                        // Générer l'URL signée Backblaze
                        const downloadUrl = await backblazeService.getDownloadUrl(
                            photo.backblaze_file_name,
                            3600,
                        );

                        // Télécharger le fichier depuis Backblaze
                        const response = await fetch(downloadUrl);

                        if (!response.ok) {
                            console.error(
                                `❌ Error downloading photo ${photo.id} from Backblaze:`,
                                response.status,
                            );
                            return null; // Skip cette photo
                        }

                        // Récupérer le contenu du fichier
                        const fileBuffer = await response.arrayBuffer();
                        return { photo, buffer: Buffer.from(fileBuffer) };
                    } catch (photoError) {
                        console.error(`❌ Error processing photo ${photo.id}:`, photoError);
                        return null; // Skip cette photo
                    }
                })
            );

            // Ajouter les photos réussies au ZIP
            for (const result of photoBuffers) {
                if (result) {
                    archive.append(result.buffer, {
                        name: result.photo.file_name,
                    });
                }
            }
        }

        // Finaliser l'archive et attendre la fin
        archive.finalize();
        await archivePromise;

        // Concaténer tous les chunks en un seul buffer
        const zipBuffer = Buffer.concat(chunks);

        // Générer un nom de fichier pour le ZIP
        const eventName = event.event_name.replace(/[^a-zA-Z0-9]/g, '_');
        const zipFileName = `${eventName}_photos_${new Date().toISOString().split('T')[0]}.zip`;

        // Retourner le ZIP avec les headers appropriés
        return new Response(zipBuffer, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${zipFileName}"`,
                'Content-Length': zipBuffer.length.toString(),
            },
        });
    } catch (err) {
        console.error('❌ Error in GET /api/events/[id]/photos/download-all:', err);
        if (err instanceof Error && err.message.includes('status')) {
            throw err;
        }
        throw error(500, 'Erreur lors de la création du ZIP');
    }
};

