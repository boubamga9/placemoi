<script lang="ts">
	import { WebsiteName } from './../../config';
	import HeroSection from './components/sections/hero.svelte';
	import PainPoints from './components/sections/pain-points.svelte';
	import Solutions from './components/sections/benefits.svelte';
	import PhotoSharing from './components/sections/photo-sharing.svelte';
	import Pricing from './components/sections/pricing.svelte';
	import LastCta from './components/sections/last-cta.svelte';
	import Faq from './components/sections/faq.svelte';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'PLACEMOI',
		url: 'https://placemoi.com',
		logo: 'https://placemoi.com/images/logo_text.svg',
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
	<meta property="og:image" content="/images/logo_text.svg" />
	<meta name="twitter:card" content="summary_large_image" />
	<script type="application/ld+json">
		{JSON.stringify(structuredData)}
	</script>
	<script type="application/ld+json">
		{JSON.stringify(websiteStructuredData)}
	</script>
</svelte:head>

<div class="flex flex-col">
	<!-- Hero section takes full viewport height -->
	<HeroSection />
	<PainPoints />
	<Solutions />
	<PhotoSharing />
	<Pricing />
	<LastCta />
	<Faq />
</div>
