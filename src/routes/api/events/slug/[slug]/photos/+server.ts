import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { backblazeService } from '$lib/storage/backblaze';
import { isEventAccessible } from '$lib/utils/event-utils';

/**
 * API endpoint public pour récupérer les dernières photos d'un événement (pour les invités)
 * GET /api/events/slug/[slug]/photos
 * Retourne les dernières photos avec leurs URLs signées (limitées pour la performance)
 */
export const GET: RequestHandler = async ({ params, request, locals: { supabase } }) => {
	const { slug } = params;

	if (!slug) {
		throw error(400, 'Slug is required');
	}

	// Récupérer device_id depuis les query params (obligatoire pour la sécurité)
	const url = new URL(request.url);
	const deviceId = url.searchParams.get('device_id');

	if (!deviceId) {
		throw error(400, 'device_id est requis pour récupérer les photos');
	}

	// Récupérer l'événement par slug
	const { data: event, error: eventError } = await supabase
		.from('events')
		.select('id, event_date')
		.eq('slug', slug)
		.single();

	if (eventError || !event) {
		throw error(404, 'Événement non trouvé');
	}

	// Vérifier que l'événement est accessible
	if (!isEventAccessible(event.event_date)) {
		throw error(410, "Cet événement n'est plus accessible");
	}

	try {
		// Construire la requête avec filtrage obligatoire par device_id
		const { data: photos, error: photosError } = await supabase
			.from('event_photos')
			.select('id, file_name, file_type, uploaded_at, backblaze_file_name, device_id')
			.eq('event_id', event.id)
			.eq('device_id', deviceId) // Filtrage obligatoire par device_id pour la sécurité
			.order('uploaded_at', { ascending: false })
			.limit(30); // Limite pour la performance

		if (photosError) {
			console.error('❌ Error fetching photos:', photosError);
			throw error(500, 'Erreur lors de la récupération des photos');
		}

		if (!photos || photos.length === 0) {
			return json({
				success: true,
				photos: [],
				count: 0,
			});
		}

		// Générer les URLs signées pour chaque photo (valides 1h)
		const photosWithUrls = await Promise.all(
			photos.map(async (photo) => {
				try {
					const downloadUrl = await backblazeService.getDownloadUrl(
						photo.backblaze_file_name,
						3600, // URL valide 1 heure
					);

					return {
						id: photo.id,
						fileName: photo.file_name,
						fileType: photo.file_type,
						uploadedAt: photo.uploaded_at,
						downloadUrl: downloadUrl,
					};
				} catch (urlError) {
					console.error(
						`❌ Error generating URL for photo ${photo.id}:`,
						urlError,
					);
					return null; // Ignorer les photos avec erreur
				}
			}),
		);

		// Filtrer les nulls
		const validPhotos = photosWithUrls.filter((photo) => photo !== null);

		// Retourner avec cache HTTP (5 minutes) pour éviter de recharger les mêmes photos
		// Le cache est invalidé automatiquement si de nouvelles photos sont uploadées
		return json(
			{
				success: true,
				photos: validPhotos,
				count: validPhotos.length,
			},
			{
				headers: {
					'Cache-Control': 'private, max-age=300', // 5 minutes de cache côté client
				},
			},
		);
	} catch (err) {
		console.error('❌ Error in GET /api/events/slug/[slug]/photos:', err);
		if (err instanceof Error && err.message.includes('status')) {
			throw err;
		}
		throw error(500, 'Erreur lors de la récupération des photos');
	}
};

