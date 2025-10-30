<script lang="ts">
	import { WebsiteName } from './../../config';
	import HeroSection from './components/sections/hero.svelte';
	import PainPoints from './components/sections/pain-points.svelte';
	import Solutions from './components/sections/benefits.svelte';
	import LastCta from './components/sections/last-cta.svelte';
	import Faq from './components/sections/faq.svelte';
</script>

<svelte:head>
	<title
		>{WebsiteName} - Gérer le placement de vos invités en toute simplicité</title
	>
	<meta
		name="description"
		content="Organisez vos événements sans stress. Vos invités trouvent leur table en tapant leur nom. QR code + lien partageable. Simple et efficace."
	/>
	<meta
		name="keywords"
		content="placement mariage, table invités, mariage, QR code, plan de table, organisation événement"
	/>
	<meta
		property="og:title"
		content="{WebsiteName} - Gérer le placement de vos invités en toute simplicité"
	/>
	<meta
		property="og:description"
		content="Organisez vos événements sans stress. Vos invités trouvent leur table en tapant leur nom. QR code + lien partageable."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://seatly.com" />
	<meta property="og:image" content="/images/logo_text.svg" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="flex flex-col">
	<!-- Hero section takes full viewport height -->
	<HeroSection />
	<PainPoints />
	<Solutions />
	<LastCta />
	<Faq />
</div>
