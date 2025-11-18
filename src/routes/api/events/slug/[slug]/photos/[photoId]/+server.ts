import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { backblazeService } from '$lib/storage/backblaze';
import { isEventAccessible } from '$lib/utils/event-utils';

/**
 * API endpoint pour supprimer une photo partagée par un invité
 * DELETE /api/events/slug/[slug]/photos/[photoId]
 * Vérifie que la photo appartient au device_id fourni
 */
export const DELETE: RequestHandler = async ({ params, request, locals: { supabase, supabaseServiceRole } }) => {
	const { slug, photoId } = params;

	if (!slug || !photoId) {
		throw error(400, 'Slug et photoId sont requis');
	}

	// Récupérer device_id depuis les query params (obligatoire pour la sécurité)
	const url = new URL(request.url);
	const deviceId = url.searchParams.get('device_id');

	if (!deviceId) {
		throw error(400, 'device_id est requis pour supprimer une photo');
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
		// Récupérer la photo et vérifier qu'elle appartient au device_id
		const { data: photo, error: photoError } = await supabase
			.from('event_photos')
			.select('id, event_id, device_id, backblaze_file_id, backblaze_file_name')
			.eq('id', photoId)
			.eq('event_id', event.id)
			.eq('device_id', deviceId) // Vérification de sécurité : seul le propriétaire peut supprimer
			.single();

		if (photoError || !photo) {
			throw error(404, 'Photo non trouvée ou vous n\'avez pas la permission de la supprimer');
		}

		// Supprimer le fichier de Backblaze
		if (photo.backblaze_file_id && photo.backblaze_file_name) {
			try {
				await backblazeService.deleteFile(photo.backblaze_file_id, photo.backblaze_file_name);
				console.log(`✅ Photo supprimée de Backblaze: ${photo.backblaze_file_name}`);
			} catch (backblazeError) {
				console.error('❌ Erreur lors de la suppression de Backblaze:', backblazeError);
				// On continue quand même pour supprimer l'enregistrement de la DB
			}
		}

		// Supprimer l'enregistrement de la base de données
		// Utiliser supabaseServiceRole pour contourner les politiques RLS
		// car les invités (non authentifiés) ne peuvent pas supprimer via le client normal
		const { error: deleteError } = await supabaseServiceRole
			.from('event_photos')
			.delete()
			.eq('id', photoId)
			.eq('device_id', deviceId); // Double vérification de sécurité

		if (deleteError) {
			console.error('❌ Error deleting photo from database:', deleteError);
			throw error(500, 'Erreur lors de la suppression de la photo');
		}

		return json({
			success: true,
			message: 'Photo supprimée avec succès',
		});
	} catch (err) {
		console.error('❌ Error in DELETE /api/events/slug/[slug]/photos/[photoId]:', err);
		if (err instanceof Error && err.message.includes('status')) {
			throw err;
		}
		throw error(500, 'Erreur lors de la suppression de la photo');
	}
};

