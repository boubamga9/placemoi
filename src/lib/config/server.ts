import { env } from '$env/dynamic/private';

/**
 * Configuration côté serveur uniquement
 * Contient les variables d'environnement privées
 */

/**
 * Stripe Product ID (one-off payments only)
 */
export const STRIPE_PRODUCTS = {
    EVENT: env.STRIPE_PRODUCT_ID
} as const;

/**
 * Stripe Price ID (one-off payments only)
 */
export const STRIPE_PRICES = {
    EVENT: env.STRIPE_PRICE_ID
} as const;
