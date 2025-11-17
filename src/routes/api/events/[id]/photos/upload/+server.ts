import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isEventAccessible } from '$lib/utils/event-utils';
import { backblazeService } from '$lib/storage/backblaze';
import { STRIPE_PRICES } from '$lib/config/server';

/**
 * API endpoint pour uploader des photos/vidéos par les invités
 * POST /api/events/[id]/photos/upload
 */
export const POST: RequestHandler = async ({ request, params, locals: { supabase, supabaseServiceRole } }) => {
	const { id: eventId } = params;

	if (!eventId) {
		throw error(400, 'Event ID is required');
	}

	// Vérifier que l'événement existe et est accessible
	const { data: event, error: eventError } = await supabase
		.from('events')
		.select('id, event_date, slug, owner_id')
		.eq('id', eventId)
		.single();

	if (eventError || !event) {
		throw error(404, 'Événement non trouvé');
	}

	// Vérifier que l'événement est accessible (pas plus de 5 jours après la date)
	if (!isEventAccessible(event.event_date)) {
		throw error(410, "Cet événement n'est plus accessible pour l'upload de photos");
	}

	// 🚀 OPTIMIZATION: Paralléliser les vérifications du plan photos
	const [
		{ data: payment },
		{ data: ownerHasFree, error: ownerHasFreeError }
	] = await Promise.all([
		// 1. Vérifier si l'événement a le plan avec photos activé
		supabase
			.from('payments')
			.select('stripe_price_id')
			.eq('event_id', eventId)
			.eq('status', 'succeeded')
			.order('created_at', { ascending: false })
			.limit(1)
			.maybeSingle(),
		// 2. Vérifier si l'owner a le plan gratuit via owner_has_free()
		supabaseServiceRole
			.rpc('owner_has_free', { p_owner_id: event.owner_id })
	]);

	let hasPhotosPlan: boolean;

	if (ownerHasFreeError) {
		console.error('Error checking owner_has_free:', ownerHasFreeError);
		// Fallback: récupérer directement le flag avec service role
		const { data: owner, error: ownerError } = await supabaseServiceRole
			.from('owners')
			.select('can_generate_qr_free')
			.eq('id', event.owner_id)
			.single();

		if (ownerError) {
			console.error('Error fetching owner:', ownerError);
			throw error(500, 'Erreur lors de la vérification du plan');
		}

		hasPhotosPlan =
			payment?.stripe_price_id === STRIPE_PRICES.EVENT_WITH_PHOTOS ||
			owner?.can_generate_qr_free === true;
	} else {
		hasPhotosPlan =
			payment?.stripe_price_id === STRIPE_PRICES.EVENT_WITH_PHOTOS ||
			ownerHasFree === true;
	}

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
		'video/x-msvideo', // AVI
		'video/webm',
		'video/3gpp',
		'video/x-matroska', // MKV
		'video/', // Accepter tous les types vidéo (fallback pour types non standards)
	];

	const maxFileSize = 100 * 1024 * 1024; // 100MB (augmenté pour les vidéos de galerie)

	// 🚀 OPTIMIZATION: Filtrer d'abord les fichiers valides
	const validFiles = files.filter((file) => {
		// Log pour debug
		console.log(`🔍 Validating file: ${file.name}`, {
			type: file.type,
			size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
			extension: file.name.split('.').pop()?.toLowerCase(),
		});

		// Vérifier si c'est une image ou une vidéo
		const isImage = file.type.startsWith('image/');
		const isVideo = file.type.startsWith('video/');

		// Si le type MIME est vide ou incorrect, essayer de le détecter par extension
		if (!file.type || file.type === 'application/octet-stream' || file.type === '') {
			const extension = file.name.split('.').pop()?.toLowerCase();
			const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv', '3gp', 'm4v', 'flv', 'wmv'];
			const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif'];

			if (extension && videoExtensions.includes(extension)) {
				console.log(`✅ Detected video by extension: ${extension}`);
				// On accepte, le type sera corrigé plus tard si nécessaire
			} else if (extension && imageExtensions.includes(extension)) {
				console.log(`✅ Detected image by extension: ${extension}`);
				// On accepte, le type sera corrigé plus tard si nécessaire
			} else {
				console.warn(`⚠️ File type unknown and extension not recognized: ${file.name} (type: ${file.type}, extension: ${extension})`);
				return false;
			}
		} else {
			// Accepter si c'est une image dans la liste, ou n'importe quelle vidéo
			if (!isImage && !isVideo) {
				console.warn(`⚠️ File type not allowed: ${file.type} (not an image or video)`);
				return false;
			}

			if (isImage && !allowedTypes.includes(file.type)) {
				console.warn(`⚠️ Image type not allowed: ${file.type}`);
				return false;
			}
		}

		// Vérifier la taille
		if (file.size > maxFileSize) {
			console.warn(`⚠️ File too large: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB, max: ${maxFileSize / 1024 / 1024}MB)`);
			return false;
		}

		console.log(`✅ File validated: ${file.name}`);
		return true;
	});

	if (validFiles.length === 0) {
		const rejectedFiles = files.filter((file) => {
			const isImage = file.type.startsWith('image/');
			const isVideo = file.type.startsWith('video/');
			if (!isImage && !isVideo) return true;
			if (isImage && !allowedTypes.includes(file.type)) return true;
			if (file.size > maxFileSize) return true;
			return false;
		});

		const errors = rejectedFiles.map((file) => {
			const isImage = file.type.startsWith('image/');
			const isVideo = file.type.startsWith('video/');
			if (!isImage && !isVideo) {
				return `${file.name}: type non supporté (${file.type})`;
			}
			if (isImage && !allowedTypes.includes(file.type)) {
				return `${file.name}: format image non supporté (${file.type})`;
			}
			if (file.size > maxFileSize) {
				return `${file.name}: fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(2)}MB, max: ${maxFileSize / 1024 / 1024}MB)`;
			}
			return `${file.name}: fichier invalide`;
		});

		throw error(400, `Aucun fichier valide fourni. Erreurs: ${errors.join('; ')}`);
	}

	const uploadedPhotos = [];
	const BATCH_SIZE = 3; // Traiter 3 fichiers en parallèle pour éviter la surcharge

	try {
		// Traiter les fichiers par batch
		for (let i = 0; i < validFiles.length; i += BATCH_SIZE) {
			const batch = validFiles.slice(i, i + BATCH_SIZE);

			// Traiter tous les fichiers du batch en parallèle
			const batchResults = await Promise.all(
				batch.map(async (file) => {
					try {
						// Upload vers Backblaze
						const uploadResult = await backblazeService.uploadFile(
							file,
							eventId,
							file.name,
						);

						// Enregistrer dans la base de données
						// Utiliser supabaseServiceRole pour contourner les politiques RLS
						// car les invités (non authentifiés) ne peuvent pas insérer via le client normal
						const { data: photoRecord, error: dbError } = await supabaseServiceRole
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
							return null;
						}

						return {
							id: photoRecord.id,
							fileName: file.name,
							size: file.size,
							type: file.type,
						};
					} catch (err) {
						console.error(`❌ Error processing file ${file.name}:`, err);
						return null;
					}
				})
			);

			// Ajouter les résultats réussis
			for (const result of batchResults) {
				if (result) {
					uploadedPhotos.push(result);
				}
			}
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

