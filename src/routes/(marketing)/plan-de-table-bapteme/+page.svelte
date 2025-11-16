<script lang="ts">
	import { WebsiteName } from '../../../config';
	import { Button } from '$lib/components/ui/button';
	import {
		Collapsible,
		CollapsibleContent,
		CollapsibleTrigger,
	} from '$lib/components/ui/collapsible';
	import { ChevronDown } from 'lucide-svelte';

	const baptismBenefits = [
		{
			icon: '🙏',
			title: 'Discret et élégant',
			description:
				"Un QR code discret à l'entrée permet aux invités de trouver leur table sans perturber l'ambiance familiale et spirituelle du baptême.",
		},
		{
			icon: '🎨',
			title: 'Personnalisation simple',
			description:
				'Couleurs douces, photo de votre enfant, message personnalisé pour accueillir vos proches : la page invitée reflète votre cérémonie.',
		},
		{
			icon: '🔄',
			title: 'Modifications de dernière minute',
			description:
				"Ajoutez un invité, changez une table, corrigez une faute : tout se met à jour instantanément, sans réimpression d'affiches.",
		},
		{
			icon: '📸',
			title: 'Collecte de photos en option',
			description:
				"Les proches partagent leurs photos du jour depuis le même QR code. Vous récupérez tout dans un album unique (optionnel).",
		},
	];

	const baptismTimeline = [
		{
			time: '2-3 semaines avant',
			title: 'Créez votre page invitée',
			description:
				"Ajoutez vos invités, organisez les tables (ou les groupes), personnalisez les couleurs et le message d'accueil.",
		},
		{
			time: '1 semaine avant',
			title: 'Partagez le QR code',
			description:
				"Envoyez le lien par message ou email aux proches, ou imprimez un petit QR code à poser à l'entrée de la salle.",
		},
		{
			time: 'Jour J',
			title: 'Un accueil fluide',
			description:
				"Les invités scannent, trouvent leur table en 3 secondes, et s'installent sereinement. Vous profitez du moment.",
		},
	];

	const baptismFaq = [
		{
			question: 'Est-ce adapté à un petit baptême familial ?',
			answer:
				'Oui, même pour 20 à 50 invités, le QR code évite les files et les panneaux. C’est discret, élégant et pratique.',
		},
		{
			question: 'Peut-on personnaliser aux couleurs du baptême ?',
			answer:
				'Oui, vous pouvez choisir des couleurs douces, ajouter une photo et un message, et adapter le style à votre cérémonie.',
		},
		{
			question: 'Peut-on changer les tables au dernier moment ?',
			answer:
				'Oui, vous pouvez mettre à jour la liste et les tables jusqu’au jour J. Les invités voient automatiquement la dernière version.',
		},
		{
			question: 'Les invités doivent-ils installer une application ?',
			answer:
				'Non. Ils scannent simplement le QR code avec leur appareil photo et accèdent immédiatement à la page invitée.',
		},
	];

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'Plan de table baptême en ligne - PLACEMOI',
		description:
			"Créez votre plan de table de baptême en ligne avec QR code. Discret, personnalisable, modifiable jusqu'au jour J. Parfait pour 20 à 150 invités.",
		about: {
			'@type': 'Thing',
			name: 'Plan de table baptême',
		},
	};
</script>

<svelte:head>
	<title
		>Plan de table baptême en ligne | QR code + Placement invités - {WebsiteName}</title
	>
	<meta
		name="description"
		content="Créez votre plan de table de baptême en ligne en 5 minutes. QR code discret, page personnalisée, modifications jusqu'au jour J. Parfait pour 20 à 150 invités."
	/>
	<meta
		name="keywords"
		content="plan de table baptême, placement invités baptême, QR code baptême, organisation baptême, plan de table baptême en ligne, gestion invités baptême, plan de table discret, page invités baptême, collecte photos baptême, idées plan de table baptême"
	/>
	<meta
		property="og:title"
		content="Plan de table baptême en ligne | QR code + Placement invités - PLACEMOI"
	/>
	<meta
		property="og:description"
		content="Créez votre plan de table de baptême en ligne. QR code discret, page personnalisée, modifications jusqu'au jour J. Vos invités trouvent leur table en 3 secondes."
	/>
	<meta property="og:type" content="website" />
	<meta
		property="og:url"
		content="https://placemoi.com/plan-de-table-bapteme"
	/>
	<meta property="og:image" content="/images/logo_text.svg" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href="https://placemoi.com/plan-de-table-bapteme" />
	<script type="application/ld+json">
		{JSON.stringify(structuredData)}
	</script>
</svelte:head>

<main class="flex flex-col">
	<!-- Hero Section -->
	<section class="w-full pt-20" style="background-color: #fff9f4;">
		<div
			class="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-20 pt-12 sm:px-8 md:flex-row md:items-center md:justify-between md:gap-16 lg:px-12 lg:pt-16"
		>
			<div class="max-w-2xl text-center md:text-left">
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					Plan de table baptême
				</p>
				<h1
					class="mt-4 text-3xl font-normal leading-[120%] tracking-tight md:text-4xl xl:text-5xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Organisez le placement de vos invités de baptême en toute sérénité
				</h1>
				<p
					class="mt-6 text-base leading-[160%] md:text-lg"
					style="color: #2c3e50; opacity: 0.85;"
				>
					Un QR code discret, une page personnalisée et des invités sereins. Vous
					maîtrisez l’accueil sans stress et profitez pleinement de la cérémonie.
				</p>
				<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
					<Button
						href="/auth"
						class="inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02]"
						style="background-color: #d4a574;"
					>
						Créer mon plan de table baptême
					</Button>
					<Button
						href="/pricing"
						variant="outline"
						class="inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold transition-colors duration-200"
						style="color: #2c3e50; border: 1px solid #d4a574;"
					>
						Voir les tarifs
					</Button>
				</div>
				<p class="mt-3 text-xs" style="color: #2c3e50; opacity: 0.7;">
					Vous avez des questions ? Consultez la <a href="/faq" class="underline"
						>FAQ</a
					> ou <a href="/contact" class="underline">contactez-nous</a>.
				</p>
			</div>
			<div class="flex-1">
				<img
					src="https://res.cloudinary.com/dv7gvfcof/image/upload/f_auto,q_auto,w_600/v1763033544/qr_code_placemoi_exemple1_wyzizr.png"
					alt="Exemple de plan de table baptême PLACEMOI avec QR code"
					class="mx-auto w-full max-w-md rounded-2xl border-2 border-[#D4A574] object-cover shadow-lg"
				/>
			</div>
		</div>
	</section>

	<!-- Benefits -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: white;">
		<div class="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
			<div class="text-center">
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					La solution PLACEMOI
				</p>
				<h2
					class="mt-4 text-2xl font-normal leading-[120%] tracking-tight md:text-3xl xl:text-4xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Votre plan de table baptême, discret et fluide
				</h2>
			</div>

			<div class="mt-12 grid gap-8 md:grid-cols-2">
				{#each baptismBenefits as benefit}
					<div class="flex gap-4">
						<div
							class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-2xl"
							style="background-color: #f5e6d3;"
						>
							{benefit.icon}
						</div>
						<div>
							<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
								{benefit.title}
							</h3>
							<p
								class="text-sm leading-relaxed md:text-base"
								style="color: #2c3e50; opacity: 0.85;"
							>
								{benefit.description}
							</p>
						</div>
					</div>
				{/each}
			</div>

			<p class="mt-10 text-center text-sm" style="color: #2c3e50; opacity: 0.8;">
				Questions fréquentes ? Découvrez la <a href="/faq" class="underline">FAQ</a> ou
				<a href="/pricing" class="underline">nos tarifs</a>.
			</p>
		</div>
	</section>

	<!-- Timeline -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: #fff9f4;">
		<div class="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
			<div class="text-center">
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					Comment ça marche
				</p>
				<h2
					class="mt-4 text-2xl font-normal leading-[120%] tracking-tight md:text-3xl xl:text-4xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Votre timeline de préparation
				</h2>
			</div>

			<div class="mt-12 space-y-8">
				{#each baptismTimeline as item, index}
					<div class="flex gap-6">
						<div class="flex flex-col items-center">
							<span
								class="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold shadow-sm"
								style="background-color: {index === 0 ? '#2c3e50' : '#d4a574'}; color: white;"
							>
								{index + 1}
							</span>
							{#if index < baptismTimeline.length - 1}
								<span class="mt-2 h-full w-px flex-1 bg-[#f0e8df]"></span>
							{/if}
						</div>
						<div class="flex-1">
							<p
								class="text-xs font-semibold uppercase tracking-[0.2em]"
								style="color: #2c3e50; opacity: 0.6;"
							>
								{item.time}
							</p>
							<h3 class="mt-2 text-lg font-semibold md:text-xl" style="color: #2c3e50;">
								{item.title}
							</h3>
							<p
								class="mt-2 text-sm leading-relaxed md:text-base"
								style="color: #2c3e50; opacity: 0.85;"
							>
								{item.description}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- FAQ -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: #fafafa;">
		<div class="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12">
			<div class="text-center">
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					Questions fréquentes
				</p>
				<h2
					class="mt-4 text-2xl font-normal leading-[120%] tracking-tight md:text-3xl xl:text-4xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Tout sur le plan de table baptême
				</h2>
			</div>
			<div class="mt-12 space-y-4">
				{#each baptismFaq as faqItem}
					<Collapsible class="rounded-lg border border-[#e8dccf] bg-white shadow-sm">
						<CollapsibleTrigger
							class="flex w-full items-center justify-between p-6 text-left transition-colors"
						>
							<h3
								class="flex-1 break-words pr-4 text-lg font-medium lg:text-xl"
								style="color: #2c3e50;"
							>
								{faqItem.question}
							</h3>
							<ChevronDown
								class="h-5 w-5 flex-shrink-0 transition-transform duration-200"
								style="color: #2c3e50; opacity: 0.7;"
							/>
						</CollapsibleTrigger>
						<CollapsibleContent class="px-6 pb-6">
							<p
								class="text-base leading-relaxed lg:text-lg"
								style="color: #2c3e50; opacity: 0.9;"
							>
								{faqItem.answer}
							</p>
						</CollapsibleContent>
					</Collapsible>
				{/each}
			</div>
			<div class="mt-8 text-center">
				<a
					href="/pricing"
					class="inline-flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-semibold transition-colors duration-200"
					style="border-color: #d4a574; color: #2c3e50;"
				>
					Voir les tarifs
				</a>
			</div>
		</div>
	</section>

	<!-- Final CTA -->
	<section
		class="border-t py-16 sm:py-20 md:py-24"
		style="background-color: #fff9f4; border-color: #f0e8df;"
	>
		<div class="mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12">
			<h2
				class="text-2xl font-normal leading-[120%] tracking-tight md:text-3xl"
				style="color: #2c3e50; font-family: 'Playfair Display', serif;"
			>
				Un baptême serein et mémorable
			</h2>
			<p
				class="mt-4 text-sm leading-relaxed md:text-base"
				style="color: #2c3e50; opacity: 0.85;"
			>
				Créez votre événement dès maintenant, testez gratuitement, puis activez
				quand tout est prêt. <a href="/faq" class="underline">Questions ?</a>
			</p>
			<div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
				<a href="/auth">
					<Button
						class="h-12 rounded-xl px-8 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105"
						style="background-color: #d4a574; border: none;"
					>
						Commencer maintenant
					</Button>
				</a>
				<a
					href="/contact"
					class="inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold transition-colors duration-200"
					style="border: 1px solid #2c3e50; color: #2c3e50;"
				>
					Nous contacter
				</a>
			</div>
		</div>
	</section>
</main>


