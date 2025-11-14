import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { backblazeService } from '$lib/storage/backblaze';

/**
 * API endpoint pour télécharger une photo
 * GET /api/events/[id]/photos/[photoId]/download
 * Télécharge le fichier depuis Backblaze et le renvoie avec les headers pour forcer le téléchargement
 */
export const GET: RequestHandler = async ({ params, locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		throw error(401, 'Non autorisé');
	}

	const { id: eventId, photoId } = params;

	if (!eventId || !photoId) {
		throw error(400, 'Event ID and Photo ID are required');
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
		// Récupérer les informations de la photo
		const { data: photo, error: photoError } = await supabase
			.from('event_photos')
			.select('*')
			.eq('id', photoId)
			.eq('event_id', eventId)
			.single();

		if (photoError || !photo) {
			throw error(404, 'Photo non trouvée');
		}

		// Générer l'URL signée Backblaze
		const downloadUrl = await backblazeService.getDownloadUrl(
			photo.backblaze_file_name,
			3600, // URL valide 1 heure
		);

		// Télécharger le fichier depuis Backblaze
		const response = await fetch(downloadUrl);

		if (!response.ok) {
			console.error('❌ Error downloading file from Backblaze:', response.status, response.statusText);
			throw error(500, 'Erreur lors du téléchargement du fichier depuis Backblaze');
		}

		// Récupérer le contenu du fichier
		const fileBuffer = await response.arrayBuffer();

		// Déterminer le Content-Type
		const contentType = photo.file_type || 'application/octet-stream';

		// Retourner le fichier avec les headers pour forcer le téléchargement
		return new Response(fileBuffer, {
			headers: {
				'Content-Type': contentType,
				'Content-Disposition': `attachment; filename="${photo.file_name}"`,
				'Content-Length': fileBuffer.byteLength.toString(),
			},
		});
	} catch (err) {
		console.error('❌ Error in GET /api/events/[id]/photos/[photoId]/download:', err);
		if (err instanceof Error && err.message.includes('status')) {
			throw err;
		}
		throw error(500, 'Erreur lors du téléchargement de la photo');
	}
};

