import B2 from 'backblaze-b2';
import { env } from '$env/dynamic/private';
import { randomUUID } from 'crypto';

/**
 * Configuration Backblaze B2
 * Les variables d'environnement nécessaires :
 * - BACKBLAZE_APPLICATION_KEY_ID
 * - BACKBLAZE_APPLICATION_KEY
 * - BACKBLAZE_BUCKET_ID (optionnel, sera créé si nécessaire)
 * - BACKBLAZE_BUCKET_NAME (optionnel, par défaut: placemoi-photos)
 */
/**
 * Cache simple pour les URLs signées (TTL: 50 minutes)
 */
interface CachedUrl {
	url: string;
	expiresAt: number;
}

class BackblazeService {
	private b2: B2;
	private bucketId: string | null = null;
	private bucketName: string;
	private accountId: string | null = null;
	private downloadUrl: string | null = null;
	private urlCache: Map<string, CachedUrl> = new Map();

	constructor() {
		if (!env.BACKBLAZE_APPLICATION_KEY_ID || !env.BACKBLAZE_APPLICATION_KEY) {
			throw new Error(
				'Backblaze credentials not configured. Please set BACKBLAZE_APPLICATION_KEY_ID and BACKBLAZE_APPLICATION_KEY environment variables.',
			);
		}

		this.b2 = new B2({
			applicationKeyId: env.BACKBLAZE_APPLICATION_KEY_ID,
			applicationKey: env.BACKBLAZE_APPLICATION_KEY,
		});

		this.bucketName = env.BACKBLAZE_BUCKET_NAME || 'placemoi-photos';
		this.bucketId = env.BACKBLAZE_BUCKET_ID || null;
	}

	/**
	 * Initialise la connexion à Backblaze et récupère l'ID du bucket
	 */
	async initialize(): Promise<void> {
		try {
			// Autoriser l'API - le SDK stocke l'accountId et downloadUrl dans l'instance B2 après authorize()
			await this.b2.authorize();
			
			// Le SDK backblaze-b2 stocke accountId et downloadUrl dans l'instance B2 après authorize()
			// via saveAuthContext qui fait: context.accountId = authResponse.accountId
			// et context.downloadUrl = authResponse.downloadUrl
			this.accountId = (this.b2 as any).accountId;
			this.downloadUrl = (this.b2 as any).downloadUrl;
			
			if (!this.accountId) {
				console.error('❌ Account ID not found in B2 instance after authorize()');
				throw new Error('Account ID not available from Backblaze authorization');
			}

			if (!this.downloadUrl) {
				console.error('❌ Download URL not found in B2 instance after authorize()');
				throw new Error('Download URL not available from Backblaze authorization');
			}

			console.log(`✅ Backblaze initialized - Account ID: ${this.accountId}, Download URL: ${this.downloadUrl}, Bucket: ${this.bucketName}`);

			// Si on n'a pas l'ID du bucket, on le récupère ou on le crée
			if (!this.bucketId) {
				this.bucketId = await this.getOrCreateBucket();
			}
		} catch (error) {
			console.error('❌ Error initializing Backblaze:', error);
			throw new Error('Failed to initialize Backblaze B2 service');
		}
	}

	/**
	 * Récupère l'ID du bucket ou le crée s'il n'existe pas
	 */
	private async getOrCreateBucket(): Promise<string> {
		try {
			// Lister les buckets existants
			const { data } = await this.b2.listBuckets();

			// Chercher le bucket par nom
			const existingBucket = data.buckets.find(
				(bucket) => bucket.bucketName === this.bucketName,
			);

			if (existingBucket) {
				console.log(`✅ Found existing bucket: ${this.bucketName}`);
				return existingBucket.bucketId;
			}

			// Créer le bucket s'il n'existe pas
			console.log(`📦 Creating new bucket: ${this.bucketName}`);
			const { data: newBucket } = await this.b2.createBucket({
				bucketName: this.bucketName,
				bucketType: 'allPrivate', // Les photos sont privées, accès via URLs signées uniquement
			});

			return newBucket.bucketId;
		} catch (error) {
			console.error('❌ Error getting/creating bucket:', error);
			throw error;
		}
	}

	/**
	 * Upload un fichier vers Backblaze B2
	 * @param file - Le fichier à uploader
	 * @param eventId - L'ID de l'événement (pour organiser les fichiers)
	 * @returns Les informations du fichier uploadé
	 */
	async uploadFile(
		file: File | Buffer,
		eventId: string,
		originalFileName: string,
	): Promise<{
		fileId: string;
		fileName: string;
		downloadUrl: string;
	}> {
		await this.initialize();

		if (!this.bucketId) {
			throw new Error('Bucket ID not initialized');
		}

		// Générer un nom de fichier unique : eventId/timestamp-uuid-originalname
		const timestamp = Date.now();
		const uuid = randomUUID();
		const fileExtension = originalFileName.split('.').pop() || '';
		const sanitizedOriginalName = originalFileName
			.replace(/[^a-zA-Z0-9.-]/g, '_')
			.substring(0, 50); // Limiter la longueur

		const fileName = `${eventId}/${timestamp}-${uuid}.${fileExtension}`;

		// Convertir le fichier en Buffer si nécessaire
		let fileBuffer: Buffer;
		if (file instanceof File) {
			const arrayBuffer = await file.arrayBuffer();
			fileBuffer = Buffer.from(arrayBuffer);
		} else {
			fileBuffer = file;
		}

		try {
			// Obtenir l'URL d'upload autorisée
			const { data: uploadData } = await this.b2.getUploadUrl({
				bucketId: this.bucketId,
			});

			// Upload le fichier
			const { data: uploadResult } = await this.b2.uploadFile({
				uploadUrl: uploadData.uploadUrl,
				uploadAuthToken: uploadData.authorizationToken,
				fileName: fileName,
				data: fileBuffer,
				contentType: file instanceof File ? file.type : 'application/octet-stream',
			});

			// Pour un bucket privé, on ne génère pas d'URL publique ici
			// Les URLs seront générées à la demande via getDownloadAuthorization
			// On retourne juste les infos nécessaires pour générer l'URL plus tard

			console.log(`✅ File uploaded successfully: ${fileName}`);

			return {
				fileId: uploadResult.fileId,
				fileName: fileName,
				downloadUrl: '', // Sera généré à la demande via getDownloadUrl
			};
		} catch (error) {
			console.error('❌ Error uploading file to Backblaze:', error);
			throw new Error('Failed to upload file to Backblaze B2');
		}
	}

	/**
	 * Supprime un fichier de Backblaze B2
	 * @param fileId - L'ID du fichier à supprimer
	 * @param fileName - Le nom du fichier à supprimer
	 */
	async deleteFile(fileId: string, fileName: string): Promise<void> {
		await this.initialize();

		try {
			await this.b2.deleteFileVersion({
				fileId: fileId,
				fileName: fileName,
			});

			console.log(`✅ File deleted successfully: ${fileName}`);
		} catch (error) {
			console.error('❌ Error deleting file from Backblaze:', error);
			throw new Error('Failed to delete file from Backblaze B2');
		}
	}

	/**
	 * Génère une URL signée pour télécharger un fichier (valide 1 heure)
	 * @param fileName - Le nom du fichier dans Backblaze
	 * @param validDurationInSeconds - Durée de validité en secondes (défaut: 3600 = 1h)
	 */
	async getDownloadUrl(
		fileName: string,
		validDurationInSeconds: number = 3600,
	): Promise<string> {
		await this.initialize();

		if (!this.bucketId) {
			throw new Error('Bucket ID not initialized');
		}

		try {
			// OPTIMISATION: Vérifier le cache (TTL: 50 minutes pour laisser une marge)
			const cacheKey = `${fileName}_${validDurationInSeconds}`;
			const cached = this.urlCache.get(cacheKey);
			const now = Date.now();
			
			if (cached && cached.expiresAt > now) {
				return cached.url;
			}

			// S'assurer que downloadUrl est initialisé
			if (!this.downloadUrl || !this.accountId) {
				await this.initialize();
			}

			if (!this.downloadUrl) {
				throw new Error('Download URL not available');
			}

			// Obtenir l'autorisation de téléchargement
			const downloadAuthResponse = await this.b2.getDownloadAuthorization({
				bucketId: this.bucketId,
				fileNamePrefix: fileName,
				validDurationInSeconds: validDurationInSeconds,
			});

			const downloadAuth = downloadAuthResponse.data;
			
			if (!downloadAuth || !downloadAuth.authorizationToken) {
				console.error('❌ Invalid download authorization response:', downloadAuthResponse);
				throw new Error('Invalid download authorization response');
			}

			// Construire l'URL signée en utilisant le downloadUrl de base
			// Format: {downloadUrl}/file/{bucketName}/{fileName}?Authorization={token}
			// Le downloadUrl est déjà au format https://f{accountId}.backblazeb2.com
			const signedUrl = `${this.downloadUrl}/file/${this.bucketName}/${fileName}?Authorization=${downloadAuth.authorizationToken}`;

			// OPTIMISATION: Mettre en cache (TTL: 50 minutes = 3000 secondes)
			const cacheTTL = Math.min(validDurationInSeconds - 600, 3000); // 50 min max, ou validDuration - 10 min
			this.urlCache.set(cacheKey, {
				url: signedUrl,
				expiresAt: now + cacheTTL * 1000,
			});

			// Nettoyer le cache périodiquement (garder seulement les entrées valides)
			if (this.urlCache.size > 1000) {
				for (const [key, value] of this.urlCache.entries()) {
					if (value.expiresAt <= now) {
						this.urlCache.delete(key);
					}
				}
			}

			console.log(`✅ Generated download URL for: ${fileName}`);
			return signedUrl;
		} catch (error) {
			console.error('❌ Error generating download URL:', error);
			if (error instanceof Error) {
				console.error('Error details:', error.message, error.stack);
			}
			throw new Error('Failed to generate download URL');
		}
	}

	/**
	 * Liste tous les fichiers d'un événement
	 * @param eventId - L'ID de l'événement
	 */
	async listEventFiles(eventId: string): Promise<
		Array<{
			fileId: string;
			fileName: string;
			uploadTimestamp: number;
			size: number;
		}>
	> {
		await this.initialize();

		if (!this.bucketId) {
			throw new Error('Bucket ID not initialized');
		}

		try {
			const { data } = await this.b2.listFileNames({
				bucketId: this.bucketId,
				prefix: `${eventId}/`,
			});

			return (
				data.files?.map((file) => ({
					fileId: file.fileId,
					fileName: file.fileName,
					uploadTimestamp: file.uploadTimestamp,
					size: file.contentLength || 0,
				})) || []
			);
		} catch (error) {
			console.error('❌ Error listing files from Backblaze:', error);
			throw new Error('Failed to list files from Backblaze B2');
		}
	}
}

// Export une instance singleton
export const backblazeService = new BackblazeService();

