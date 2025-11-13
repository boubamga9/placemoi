import { env } from '$env/dynamic/private';

/**
 * Configuration côté serveur uniquement
 * Contient les variables d'environnement privées
 */


/**
 * Stripe Price ID (one-off payments only)
 */
export const STRIPE_PRICES = {
    EVENT: env.STRIPE_PRICE_ID,
    EVENT_WITH_PHOTOS: env.STRIPE_PRICE_ID_WITH_PHOTOS
} as const;
