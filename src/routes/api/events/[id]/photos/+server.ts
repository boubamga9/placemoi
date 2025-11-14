import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { backblazeService } from '$lib/storage/backblaze';

/**
 * API endpoint pour récupérer les photos d'un événement
 * GET /api/events/[id]/photos
 * Retourne la liste des photos avec leurs URLs signées (valides 1h)
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
		.select('id, owner_id')
		.eq('id', eventId)
		.eq('owner_id', session.user.id)
		.single();

	if (eventError || !event) {
		throw error(404, 'Événement non trouvé ou accès refusé');
	}

	try {
		// Récupérer les photos depuis la base de données
		const { data: photos, error: photosError } = await supabase
			.from('event_photos')
			.select('*')
			.eq('event_id', eventId)
			.order('uploaded_at', { ascending: false });

		if (photosError) {
			console.error('❌ Error fetching photos from database:', photosError);
			throw error(500, 'Erreur lors de la récupération des photos');
		}

		// Générer les URLs signées pour chaque photo
		const photosWithUrls = await Promise.all(
			(photos || []).map(async (photo) => {
				try {
					const downloadUrl = await backblazeService.getDownloadUrl(
						photo.backblaze_file_name,
						3600, // URL valide 1 heure
					);

					return {
						id: photo.id,
						fileName: photo.file_name,
						fileSize: photo.file_size,
						fileType: photo.file_type,
						uploadedAt: photo.uploaded_at,
						downloadUrl: downloadUrl,
					};
				} catch (urlError) {
					console.error(
						`❌ Error generating URL for photo ${photo.id}:`,
						urlError,
					);
					// Retourner la photo sans URL si erreur
					return {
						id: photo.id,
						fileName: photo.file_name,
						fileSize: photo.file_size,
						fileType: photo.file_type,
						uploadedAt: photo.uploaded_at,
						downloadUrl: null,
						error: 'Impossible de générer l\'URL',
					};
				}
			}),
		);

		return json({
			success: true,
			photos: photosWithUrls,
			count: photosWithUrls.length,
		});
	} catch (err) {
		console.error('❌ Error in GET /api/events/[id]/photos:', err);
		if (err instanceof Error && err.message.includes('status')) {
			throw err;
		}
		throw error(500, 'Erreur lors de la récupération des photos');
	}
};

