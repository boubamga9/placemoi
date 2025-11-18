<script lang="ts">
	import { WebsiteName } from './../../config';
	import HeroSection from './components/sections/hero.svelte';
	import PainPoints from './components/sections/pain-points.svelte';
	import EventCategories from './components/sections/event-categories.svelte';
	import Solutions from './components/sections/benefits.svelte';
	import PhotoSharing from './components/sections/photo-sharing.svelte';
	import Pricing from './components/sections/pricing.svelte';
	import WeddingPlannersCta from './components/sections/wedding-planners-cta.svelte';
	import LastCta from './components/sections/last-cta.svelte';
	import Faq from './components/sections/faq.svelte';
	import ScrollToTop from './components/scroll-to-top.svelte';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'PLACEMOI',
		url: 'https://placemoi.com',
		logo: {
			'@type': 'ImageObject',
			url: 'https://placemoi.com/images/logo_icone.png',
			width: 400,
			height: 400,
		},
		image: 'https://placemoi.com/images/logo_icone.png',
		description:
			'PLACEMOI - Solution de plan de table événement en ligne avec QR code. Pour mariages, anniversaires, baptêmes, conférences, séminaires et galas.',
		sameAs: [],
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const websiteStructuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'PLACEMOI',
		url: 'https://placemoi.com',
		description:
			'Créez votre plan de table événement en ligne en 5 minutes. Mariage, anniversaire, conférence, séminaire. QR code + lien partageable. Vos invités trouvent leur place en 3 secondes.',
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: 'https://placemoi.com/search?q={search_term_string}',
			},
			'query-input': 'required name=search_term_string',
		},
		// Sitelinks suggérés pour Google (Google décide finalement quels liens afficher)
		// Ces pages importantes sont déjà dans le sitemap et la navigation
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Tarifs',
					url: 'https://placemoi.com/pricing',
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Plan de table mariage',
					url: 'https://placemoi.com/plan-de-table-mariage',
				},
				{
					'@type': 'ListItem',
					position: 3,
					name: 'Plan de table anniversaire',
					url: 'https://placemoi.com/plan-de-table-anniversaire',
				},
				{
					'@type': 'ListItem',
					position: 4,
					name: 'FAQ',
					url: 'https://placemoi.com/faq',
				},
				{
					'@type': 'ListItem',
					position: 5,
					name: 'Contact',
					url: 'https://placemoi.com/contact',
				},
			],
		},
	};

	// FAQ structured data for SEO
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const faqStructuredData = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{
				'@type': 'Question',
				name: 'Combien de temps ça prend pour créer mon événement ?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: "Environ 5 minutes ! Créez votre événement, importez votre liste d'invités (CSV ou manuellement), et recevez immédiatement votre QR code et votre lien partageable.",
				},
			},
			{
				'@type': 'Question',
				name: 'Comment mes invités trouvent-ils leur table ?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: "Vos invités scannent simplement le QR code que vous affichez à l'entrée ou suivent le lien. Ils tapent leur nom, et le système leur indique leur table et leur place en un instant.",
				},
			},
			{
				'@type': 'Question',
				name: "Combien d'invités puis-je ajouter ?",
				acceptedAnswer: {
					'@type': 'Answer',
					text: "Jusqu'à 500 invités par événement. Vous pouvez importer votre liste via un fichier CSV ou les ajouter un par un.",
				},
			},
			{
				'@type': 'Question',
				name: "Puis-je personnaliser l'apparence de la page ?",
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Absolument ! Choisissez les couleurs, ajoutez une image de fond ou un logo pour que la page corresponde à votre événement.',
				},
			},
			{
				'@type': 'Question',
				name: 'Combien ça coûte ?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: "À partir de 49,99€ par événement, paiement unique. Aucun abonnement, aucune limite de durée. Vous gardez l'accès à votre événement tant que vous en avez besoin.",
				},
			},
			{
				'@type': 'Question',
				name: "Puis-je modifier ma liste d'invités après paiement ?",
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Oui, vous pouvez ajouter, modifier ou supprimer des invités à tout moment depuis votre tableau de bord.',
				},
			},
		],
	};
</script>

<svelte:head>
	<title
		>{WebsiteName} - Plan de table événement en ligne | QR code + Placement invités</title
	>
	<meta
		name="description"
		content="Créez votre plan de table événement en ligne en 5 minutes. Mariage, anniversaire, conférence, séminaire. QR code + lien partageable. Vos invités trouvent leur place en 3 secondes. À partir de 49,99€ par événement."
	/>
	<meta
		name="keywords"
		content="plan de table événement, plan de table mariage, plan de table anniversaire, plan de table baptême, plan de table conférence, plan de table séminaire, placement invités, QR code événement, QR code mariage, gestion invités, plan de table en ligne, organisation événement, liste invités, page invités, album photo collaboratif, collecte photos événement, logiciel plan de table, application plan de table, plan de table personnalisé, placement invités mariage, placement invités anniversaire, plan de table gala"
	/>
	<meta
		property="og:title"
		content="{WebsiteName} - Plan de table événement en ligne | QR code + Placement invités"
	/>
	<meta
		property="og:description"
		content="Créez votre plan de table événement en ligne en 5 minutes. Mariage, anniversaire, conférence, séminaire. QR code + lien partageable. Vos invités trouvent leur place en 3 secondes."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://placemoi.com/" />
	<meta
		property="og:image"
		content="https://placemoi.com/images/logo_text.svg"
	/>
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href="https://placemoi.com/" />
	<script type="application/ld+json">
		{JSON.stringify(structuredData)}
	</script>
	<script type="application/ld+json">
		{JSON.stringify(websiteStructuredData)}
	</script>
	<script type="application/ld+json">
		{JSON.stringify(faqStructuredData)}
	</script>
</svelte:head>

<div class="flex flex-col">
	<!-- Hero section takes full viewport height -->
	<HeroSection />
	<PainPoints />
	<EventCategories />
	<Solutions />
	<PhotoSharing />
	<Pricing />
	<WeddingPlannersCta />
	<LastCta />
	<Faq />
	<ScrollToTop />
</div>
