/**
 * Utilitaire de validation d'images
 * 
 * La compression et l'optimisation sont gérées par Cloudinary.
 * Ce fichier contient uniquement la validation des types de fichiers.
 */

/**
 * Valide qu'un fichier est bien une image
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Vérifier le type MIME
    if (!file.type.startsWith('image/')) {
        return { isValid: false, error: 'Le fichier doit être une image' };
    }

    // Types acceptés
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        return { isValid: false, error: 'Format d\'image non supporté. Utilisez JPG, PNG ou WebP' };
    }

    return { isValid: true };
}
