import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isEventAccessible } from '$lib/utils/event-utils';
import { backblazeService } from '$lib/storage/backblaze';
import { STRIPE_PRICES } from '$lib/config/server';

/**
 * API endpoint pour uploader des photos/vidéos par les invités
 * POST /api/events/[id]/photos/upload
 */
export const POST: RequestHandler = async ({ request, params, locals: { supabase } }) => {
	const { id: eventId } = params;

	if (!eventId) {
		throw error(400, 'Event ID is required');
	}

	// Vérifier que l'événement existe et est accessible
	const { data: event, error: eventError } = await supabase
		.from('events')
		.select('id, event_date, slug')
		.eq('id', eventId)
		.single();

	if (eventError || !event) {
		throw error(404, 'Événement non trouvé');
	}

	// Vérifier que l'événement est accessible (pas plus de 5 jours après la date)
	if (!isEventAccessible(event.event_date)) {
		throw error(410, "Cet événement n'est plus accessible pour l'upload de photos");
	}

	// Vérifier que l'événement a le plan avec photos activé
	const { data: payment, error: paymentError } = await supabase
		.from('payments')
		.select('stripe_price_id')
		.eq('event_id', eventId)
		.eq('status', 'succeeded')
		.order('created_at', { ascending: false })
		.limit(1)
		.single();

	// Si pas de paiement, vérifier si c'est un événement gratuit (can_generate_qr_free)
	const { data: owner } = await supabase
		.from('events')
		.select('owner_id, owners!inner(can_generate_qr_free)')
		.eq('id', eventId)
		.single();

	const hasPhotosPlan =
		payment?.stripe_price_id === STRIPE_PRICES.EVENT_WITH_PHOTOS ||
		owner?.owners?.can_generate_qr_free === true;

	if (!hasPhotosPlan) {
		throw error(403, "Cet événement n'a pas le plan avec photos activé");
	}

	// Récupérer les fichiers depuis FormData
	const formData = await request.formData();
	const files = formData.getAll('files') as File[];

	if (!files || files.length === 0) {
		throw error(400, 'Aucun fichier fourni');
	}

	// Limiter le nombre de fichiers par requête (par exemple 10)
	if (files.length > 10) {
		throw error(400, 'Maximum 10 fichiers par upload');
	}

	// Valider les types de fichiers (images et vidéos)
	const allowedTypes = [
		'image/jpeg',
		'image/jpg',
		'image/png',
		'image/heic',
		'image/heif',
		'video/mp4',
		'video/mov',
		'video/quicktime',
	];

	const maxFileSize = 50 * 1024 * 1024; // 50MB

	const uploadedPhotos = [];

	try {
		for (const file of files) {
			// Vérifier le type
			if (!allowedTypes.includes(file.type)) {
				console.warn(`⚠️ File type not allowed: ${file.type}`);
				continue;
			}

			// Vérifier la taille
			if (file.size > maxFileSize) {
				console.warn(`⚠️ File too large: ${file.name} (${file.size} bytes)`);
				continue;
			}

			// Upload vers Backblaze
			const uploadResult = await backblazeService.uploadFile(
				file,
				eventId,
				file.name,
			);

			// Enregistrer dans la base de données
			const { data: photoRecord, error: dbError } = await supabase
				.from('event_photos')
				.insert({
					event_id: eventId,
					file_name: file.name,
					file_size: file.size,
					file_type: file.type,
					backblaze_file_id: uploadResult.fileId,
					backblaze_file_name: uploadResult.fileName,
				})
				.select()
				.single();

			if (dbError) {
				console.error('❌ Error saving photo to database:', dbError);
				// Essayer de supprimer le fichier de Backblaze si l'insertion DB échoue
				try {
					await backblazeService.deleteFile(
						uploadResult.fileId,
						uploadResult.fileName,
					);
				} catch (deleteError) {
					console.error('❌ Error deleting file from Backblaze:', deleteError);
				}
				continue;
			}

			uploadedPhotos.push({
				id: photoRecord.id,
				fileName: file.name,
				size: file.size,
				type: file.type,
			});
		}

		if (uploadedPhotos.length === 0) {
			throw error(400, 'Aucun fichier valide n\'a pu être uploadé');
		}

		return json({
			success: true,
			uploaded: uploadedPhotos.length,
			photos: uploadedPhotos,
		});
	} catch (err) {
		console.error('❌ Error uploading photos:', err);
		if (err instanceof Error && err.message.includes('status')) {
			throw err;
		}
		throw error(500, 'Erreur lors de l\'upload des photos');
	}
};

