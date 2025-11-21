import { v2 as cloudinary } from 'cloudinary';
import { env } from '$env/dynamic/private';

/**
 * Configuration et initialisation de Cloudinary
 * 
 * Ce module fournit des utilitaires pour gérer l'upload et la manipulation
 * d'images via Cloudinary
 */

// Configuration de Cloudinary avec les variables d'environnement
cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
});

/**
 * Options pour l'upload d'image
 */
export interface CloudinaryUploadOptions {
    /**
     * Dossier dans Cloudinary où stocker l'image
     * Exemple: "events", "products", "logos"
     */
    folder?: string;

    /**
     * Format de transformation automatique
     * Par défaut: "auto" (Cloudinary détecte automatiquement le meilleur format)
     */
    format?: 'auto' | 'jpg' | 'png' | 'webp';

    /**
     * Qualité de compression (1-100)
     * Par défaut: "auto" (Cloudinary optimise automatiquement)
     */
    quality?: string | number;

    /**
     * Largeur maximale en pixels
     */
    width?: number;

    /**
     * Hauteur maximale en pixels
     */
    height?: number;

    /**
     * Redimensionnement intelligent (crop, fill, scale, etc.)
     * Par défaut: "limit" (ne dépasse jamais les dimensions)
     */
    crop?: 'limit' | 'fill' | 'fit' | 'scale' | 'thumb';

    /**
     * ID public personnalisé pour l'image
     * Si non fourni, Cloudinary génère un ID unique
     */
    public_id?: string;

    /**
     * Tags pour organiser les images
     */
    tags?: string[];
}

/**
 * Résultat d'un upload Cloudinary
 */
export interface CloudinaryUploadResult {
    /**
     * URL publique de l'image uploadée
     */
    url: string;

    /**
     * URL sécurisée (HTTPS) de l'image
     */
    secure_url: string;

    /**
     * ID public de l'image dans Cloudinary
     */
    public_id: string;

    /**
     * Format de l'image (jpg, png, webp, etc.)
     */
    format: string;

    /**
     * Largeur de l'image en pixels
     */
    width: number;

    /**
     * Hauteur de l'image en pixels
     */
    height: number;

    /**
     * Taille du fichier en bytes
     */
    bytes: number;
}

/**
 * Erreur d'upload Cloudinary
 */
export class CloudinaryUploadError extends Error {
    constructor(message: string, public readonly originalError?: any) {
        super(message);
        this.name = 'CloudinaryUploadError';
    }
}

/**
 * Upload une image vers Cloudinary à partir d'un buffer
 * 
 * @param buffer - Buffer contenant l'image
 * @param options - Options d'upload et de transformation
 * @returns Résultat de l'upload avec les URLs et métadonnées
 * @throws CloudinaryUploadError si l'upload échoue
 */
export async function uploadImageFromBuffer(
    buffer: Buffer,
    options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> {
    try {
        // Construire les options d'upload
        const uploadOptions: any = {
            resource_type: 'image' as const,
            ...options
        };

        if ((options.width || options.height) && !options.crop) {
            uploadOptions.crop = 'limit';
        }

        // Utiliser upload_stream avec un stream créé depuis le buffer
        // C'est la méthode recommandée pour éviter la conversion en base64
        const { Readable } = await import('stream');
        const bufferStream = new Readable({
            read() {
                this.push(buffer);
                this.push(null); // Fin du stream
            }
        });

        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else if (!result) {
                        reject(new Error('Aucun résultat retourné par Cloudinary'));
                    } else {
                        resolve({
                            url: result.url,
                            secure_url: result.secure_url,
                            public_id: result.public_id,
                            format: result.format,
                            width: result.width,
                            height: result.height,
                            bytes: result.bytes
                        });
                    }
                }
            );

            // Pipe le buffer stream dans l'upload stream
            bufferStream.pipe(uploadStream);
        });

        return result;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur lors de l\'upload vers Cloudinary';
        throw new CloudinaryUploadError(message, error);
    }
}

/**
 * Upload une image vers Cloudinary à partir d'un fichier File
 * 
 * @param file - Fichier File à uploader
 * @param options - Options d'upload et de transformation
 * @returns Résultat de l'upload avec les URLs et métadonnées
 * @throws CloudinaryUploadError si l'upload échoue
 */
export async function uploadImageFromFile(
    file: File,
    options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> {
    try {
        // Convertir le File en Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Utiliser uploadImageFromBuffer qui gère le stream correctement
        return await uploadImageFromBuffer(buffer, options);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur lors de l\'upload vers Cloudinary';
        throw new CloudinaryUploadError(message, error);
    }
}

/**
 * Upload une image vers Cloudinary à partir d'une URL
 * 
 * @param imageUrl - URL de l'image à télécharger et uploader
 * @param options - Options d'upload et de transformation
 * @returns Résultat de l'upload avec les URLs et métadonnées
 * @throws CloudinaryUploadError si l'upload échoue
 */
export async function uploadImageFromUrl(
    imageUrl: string,
    options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> {
    try {
        const uploadOptions: any = {
            resource_type: 'image' as const,
            ...options
        };

        const result = await cloudinary.uploader.upload(imageUrl, uploadOptions);

        return {
            url: result.url,
            secure_url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur lors de l\'upload vers Cloudinary';
        throw new CloudinaryUploadError(message, error);
    }
}

/**
 * Upload un fichier validé vers Cloudinary
 * 
 * Cette fonction prend un File, le convertit et l'upload vers Cloudinary
 * avec les options appropriées selon le type d'image.
 * 
 * @param file - Fichier à uploader
 * @param type - Type d'image ('BACKGROUND' ou 'LOGO')
 * @param userId - ID de l'utilisateur pour le dossier
 * @param eventId - ID de l'événement pour organiser les images par événement (optionnel)
 * @returns Résultat de l'upload avec l'URL sécurisée
 * @throws CloudinaryUploadError si l'upload échoue
 */
export async function uploadValidatedImage(
    file: File,
    type: 'BACKGROUND' | 'LOGO',
    userId: string,
    eventId?: string
): Promise<CloudinaryUploadResult> {
    // Configuration selon le type d'image
    // Cloudinary optimise automatiquement avec q_auto (qualité) et f_auto (format)
    // Organisation des dossiers : events/{userId}/{eventId} pour une meilleure organisation
    const folder = eventId 
        ? `events/${userId}/${eventId}` 
        : `events/${userId}`;
    
    const options: CloudinaryUploadOptions = {
        folder,
        // Utiliser eager pour appliquer les transformations immédiatement à l'upload
        // Cela permet d'optimiser l'image dès le stockage
    };

    if (type === 'LOGO') {
        options.width = 400;
        options.height = 400;
        options.crop = 'limit';
        // Pour les logos, on peut forcer PNG si nécessaire pour la transparence
        // mais on laisse Cloudinary optimiser avec f_auto
    } else if (type === 'BACKGROUND') {
        options.width = 1920;
        options.height = 1080;
        options.crop = 'limit';
    }

    // Utiliser uploadImageFromFile qui va appliquer les transformations
    // Cloudinary optimisera automatiquement la qualité et le format
    return await uploadImageFromFile(file, options);
}

/**
 * Supprime une image de Cloudinary
 * 
 * @param publicId - ID public de l'image à supprimer
 * @returns true si la suppression a réussi
 * @throws CloudinaryUploadError si la suppression échoue
 */
export async function deleteImage(publicId: string): Promise<boolean> {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result.result === 'ok';
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'image';
        throw new CloudinaryUploadError(message, error);
    }
}

/**
 * Génère une URL de transformation pour une image existante
 * 
 * @param publicId - ID public de l'image
 * @param options - Options de transformation
 * @returns URL transformée de l'image
 */
export function getTransformedImageUrl(
    publicId: string,
    options: Omit<CloudinaryUploadOptions, 'folder' | 'public_id' | 'tags'> = {}
): string {
    return cloudinary.url(publicId, {
        format: options.format || 'auto',
        quality: options.quality || 'auto',
        width: options.width,
        height: options.height,
        crop: options.crop || 'limit',
        secure: true // Utiliser HTTPS par défaut
    });
}

/**
 * Extrait le public_id d'une URL Cloudinary
 * 
 * @param cloudinaryUrl - URL Cloudinary complète
 * @returns Le public_id extrait, ou null si l'URL n'est pas valide
 */
export function extractPublicIdFromUrl(cloudinaryUrl: string): string | null {
    if (!cloudinaryUrl) return null;

    try {
        const uploadIndex = cloudinaryUrl.indexOf('/upload/');
        if (uploadIndex === -1) {
            return null;
        }

        let pathAfterUpload = cloudinaryUrl.substring(uploadIndex + '/upload/'.length);
        const segments = pathAfterUpload.split('/');

        // Trouver le segment qui contient une extension de fichier
        let fileSegmentIndex = -1;
        for (let i = segments.length - 1; i >= 0; i--) {
            if (segments[i].includes('.')) {
                fileSegmentIndex = i;
                break;
            }
        }

        if (fileSegmentIndex === -1) {
            return null;
        }

        // Extraire le nom du fichier sans extension
        const fileName = segments[fileSegmentIndex];
        const dotIndex = fileName.lastIndexOf('.');
        const fileNameWithoutExt = dotIndex > 0 ? fileName.substring(0, dotIndex) : fileName;

        // Construire le public_id en prenant les segments valides
        const validSegments: string[] = [];

        for (let i = 0; i <= fileSegmentIndex; i++) {
            const segment = segments[i];

            // Ignorer les transformations (contiennent underscore avec nombre)
            if (segment.includes('_') && /[a-z]_?\d+/.test(segment)) {
                continue;
            }

            // Ignorer les versions (commencent par 'v' suivi de chiffres)
            if (/^v\d+$/.test(segment)) {
                continue;
            }

            if (segment.trim() === '') {
                continue;
            }

            if (i === fileSegmentIndex) {
                validSegments.push(fileNameWithoutExt);
            } else {
                validSegments.push(segment);
            }
        }

        if (validSegments.length === 0) {
            return null;
        }

        return validSegments.join('/');
    } catch (error) {
        return null;
    }
}

/**
 * Vérifie si les variables d'environnement Cloudinary sont configurées
 * 
 * @returns true si toutes les variables sont présentes
 */
export function isCloudinaryConfigured(): boolean {
    return !!(
        env.CLOUDINARY_CLOUD_NAME &&
        env.CLOUDINARY_API_KEY &&
        env.CLOUDINARY_API_SECRET
    );
}
