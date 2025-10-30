import { Stripe } from 'stripe';
import type { PageServerLoad } from './$types';

type Plan = {
    id: string;
    name: string;
    price: number;
    currency: string;
    stripePriceId: string;
    features: string[];
};

export const load: PageServerLoad = async ({ locals: { stripe }, url }) => {
    try {
        // Un seul prix pour un paiement one-off (par événement)
        // On privilégie un paramètre ?priceId= pour la flexibilité; sinon fallback à la liste active
        const priceId = url.searchParams.get('priceId');

        let price: Stripe.Price | null = null;
        if (priceId) {
            price = await stripe.prices.retrieve(priceId);
        } else {
            const { data: prices } = await stripe.prices.list({ active: true, limit: 1 });
            price = prices[0] ?? null;
        }

        if (!price) {
            return { plans: [] as Plan[] };
        }

        const plan: Plan = {
            id: 'event',
            name: 'Pack Événement',
            price: (price.unit_amount || 0) / 100,
            currency: (price.currency || 'eur').toUpperCase(),
            stripePriceId: price.id,
            features: [
                'Page de recherche des invités',
                'Personnalisation (couleurs, polices, logo)',
                'QR code et lien partageable',
            ],
        };

        return { plans: [plan] };
    } catch {
        return { plans: [] as Plan[] };
    }
};
