/**
 * Service de validation d'images pour les composants Svelte
 * 
 * Ce service centralise la validation des images côté client.
 * La compression et l'optimisation sont gérées par Cloudinary.
 */

import { validateImageFile } from './image-compression';

export interface ImageValidation {
    valid: boolean;
    error?: string;
}

/**
 * Service principal pour la validation d'images
 */
export class ImageService {
    /**
     * Valide une image selon son type
     * La compression et l'optimisation sont gérées par Cloudinary lors de l'upload
     */
    static validateImage(file: File, type: 'product' | 'logo'): ImageValidation {
        // Validation de base du fichier
        const fileValidation = validateImageFile(file);
        if (!fileValidation.isValid) {
            return { valid: false, error: fileValidation.error };
        }

        // Validation de la taille selon le type
        // Limites généreuses car Cloudinary optimisera automatiquement
        const maxSize = type === 'logo' ? 10 * 1024 * 1024 : 20 * 1024 * 1024; // 10MB pour logo, 20MB pour produit
        if (file.size > maxSize) {
            return {
                valid: false,
                error: `L'image ne doit pas dépasser ${type === 'logo' ? '10MB' : '20MB'}`
            };
        }

        return { valid: true };
    }

    /**
     * Crée une URL de prévisualisation locale pour l'image
     */
    static createPreviewUrl(file: File): string {
        return URL.createObjectURL(file);
    }

    /**
     * Nettoie une URL de prévisualisation
     */
    static cleanupPreviewUrl(url: string): void {
        if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
        }
    }
}
