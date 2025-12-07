import type { PageServerLoad } from './$types';

type PricingPlan = {
	id: string;
	name: string;
	price: number;
	description: string;
	badge?: string;
	highlight?: string;
	features: string[];
	extras: string[];
	ctaLabel: string;
	ctaHref: string;
};

export const load: PageServerLoad = async () => {
	const plans: PricingPlan[] = [
		{
			id: 'placement',
			name: 'Plan Placement',
			price: 49.99,
			description:
				'Les essentiels pour que vos invités trouvent leur table en moins de 3 secondes.',
			badge: 'Essentiel',
			features: [
				'Import CSV de vos invités et gestion des tables',
				'Page invités personnalisable (logo, couleurs, messages)',
				'QR code & lien unique pour l’événement',
				'Mises à jour illimitées jusqu’au jour J',
			],
			extras: [],
			ctaLabel: 'Commencer avec le placement',
			ctaHref: '/auth',
		},
		{
			id: 'wedding-planners',
			name: 'Pour Wedding Planners',
			price: 0, // 0 signifie "Sur devis"
			description:
				'Tarifs dégressifs et gestion multi-événements pour les professionnels.',
			badge: 'Professionnel',
			features: [
				'Toutes les fonctionnalités du plan Placement',
				'Gestion de plusieurs événements simultanés',
				'Tableau de bord professionnel centralisé',
				'Tarifs dégressifs selon volume',
				'Support prioritaire dédié',
			],
			extras: [],
			ctaLabel: 'Contactez-nous',
			ctaHref: '/wedding-planners',
		},
	];

	return {
		plans,
	};
};