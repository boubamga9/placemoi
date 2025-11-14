import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { backblazeService } from '$lib/storage/backblaze';

/**
 * API endpoint pour supprimer une photo
 * DELETE /api/events/[id]/photos/[photoId]
 * Supprime la photo de Backblaze et de la base de données
 */
export const DELETE: RequestHandler = async ({ params, locals: { supabase, safeGetSession } }) => {
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

		// Supprimer le fichier depuis Backblaze
		try {
			await backblazeService.deleteFile(
				photo.backblaze_file_id,
				photo.backblaze_file_name,
			);
		} catch (backblazeError) {
			console.error('❌ Error deleting file from Backblaze:', backblazeError);
			// On continue quand même pour supprimer l'entrée de la DB
		}

		// Supprimer l'entrée de la base de données
		const { error: deleteError } = await supabase
			.from('event_photos')
			.delete()
			.eq('id', photoId)
			.eq('event_id', eventId);

		if (deleteError) {
			console.error('❌ Error deleting photo from database:', deleteError);
			throw error(500, 'Erreur lors de la suppression de la photo');
		}

		return json({
			success: true,
			message: 'Photo supprimée avec succès',
		});
	} catch (err) {
		console.error('❌ Error in DELETE /api/events/[id]/photos/[photoId]:', err);
		if (err instanceof Error && err.message.includes('status')) {
			throw err;
		}
		throw error(500, 'Erreur lors de la suppression de la photo');
	}
};

