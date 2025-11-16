<script lang="ts">
	import { WebsiteName } from '../../../config';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import {
		Collapsible,
		CollapsibleContent,
		CollapsibleTrigger,
	} from '$lib/components/ui/collapsible';
	import { ChevronDown } from 'lucide-svelte';

	const plannerBenefits = [
		{
			icon: '⚡',
			title: 'Gagnez du temps sur chaque événement',
			description:
				"Plus besoin de créer des panneaux imprimés, de gérer les modifications de dernière minute ou de répondre aux appels d'invités perdus. PLACEMOI automatise tout.",
		},
		{
			icon: '💼',
			title: 'Proposez un service premium à vos clients',
			description:
				"Offrez une expérience moderne et élégante qui impressionne vos clients. Le QR code remplace le panneau géant et s'intègre parfaitement à votre décoration.",
		},
		{
			icon: '📊',
			title: 'Gérez plusieurs événements simultanément',
			description:
				'Créez et gérez tous les plans de table de vos clients depuis un seul tableau de bord. Organisez plusieurs mariages en même temps sans vous perdre.',
		},
		{
			icon: '🎨',
			title: 'Personnalisation complète pour chaque client',
			description:
				"Chaque page invitée reflète l'identité du mariage : logo, couleurs, image de fond, messages personnalisés. Vos clients adorent cette attention aux détails.",
		},
		{
			icon: '📸',
			title: 'Album photo collaboratif inclus',
			description:
				'Vos clients récupèrent automatiquement toutes les photos partagées par les invités. Un service supplémentaire qui fait la différence.',
		},
		{
			icon: '💰',
			title: 'Tarifs préférentiels pour professionnels',
			description:
				'Bénéficiez de tarifs dégressifs pour vos événements multiples. Plus vous organisez, plus vous économisez. Contactez-nous pour un devis personnalisé.',
		},
	];

	const useCases = [
		{
			title: 'Mariage de 200 invités avec changements fréquents',
			description:
				'Votre client modifie le plan de table 3 fois la semaine précédant le mariage. Avec PLACEMOI, vous mettez à jour en 2 minutes, sans réimprimer. Les invités voient automatiquement les changements.',
			benefit: "Économie de 4-6h de travail + coûts d'impression",
		},
		{
			title: 'Mariage premium avec décoration soignée',
			description:
				"Votre client veut une entrée élégante sans panneau géant. Le QR code discret s'intègre parfaitement à la décoration. Les invités scannent et trouvent leur table en 3 secondes.",
			benefit: 'Expérience premium qui valorise votre travail',
		},
		{
			title: 'Mariage avec collecte de photos souvenirs',
			description:
				'Vos clients veulent récupérer toutes les photos prises par les invités. PLACEMOI collecte automatiquement les photos via le même QR code. Plus besoin de courir après les fichiers.',
			benefit: 'Service supplémentaire facturable à vos clients',
		},
		{
			title: 'Saison avec 10+ mariages simultanés',
			description:
				'Vous gérez plusieurs mariages en même temps. PLACEMOI centralise tout dans un tableau de bord unique. Vous suivez chaque événement sans vous perdre.',
			benefit: 'Organisation simplifiée, moins de stress',
		},
	];

	const faq = [
		{
			question: 'Puis-je utiliser PLACEMOI pour tous mes clients ?',
			answer:
				"Absolument ! PLACEMOI est conçu pour être utilisé par des professionnels. Vous pouvez créer autant d'événements que nécessaire et gérer tous vos clients depuis un seul compte.",
		},
		{
			question: 'Y a-t-il des tarifs préférentiels pour les wedding planners ?',
			answer:
				'Oui, nous proposons des tarifs dégressifs pour les professionnels qui organisent plusieurs événements. Contactez-nous pour discuter de vos besoins et obtenir un devis personnalisé.',
		},
		{
			question: 'Puis-je personnaliser la page pour chaque client ?',
			answer:
				"Oui, chaque page invitée est 100% personnalisable : logo du mariage, couleurs du thème, image de fond, messages personnalisés. La page reflète parfaitement l'identité de chaque événement.",
		},
		{
			question: 'Comment mes clients accèdent-ils à leur plan de table ?',
			answer:
				"Vos clients reçoivent un QR code et un lien unique qu'ils peuvent partager avec leurs invités. Le QR code peut être affiché à l'entrée, et le lien peut être envoyé par email ou partagé sur le site de mariage.",
		},
		{
			question: 'Puis-je modifier le plan de table la veille du mariage ?',
			answer:
				"Oui, c'est même l'un des avantages majeurs ! Vous pouvez modifier les tables, ajouter ou retirer des invités jusqu'au jour J. Les changements sont instantanés et visibles par tous les invités.",
		},
		{
			question: "Combien d'événements puis-je gérer simultanément ?",
			answer:
				"Il n'y a pas de limite ! Vous pouvez créer et gérer autant d'événements que nécessaire. Tous vos événements sont accessibles depuis votre tableau de bord.",
		},
		{
			question: 'Puis-je facturer ce service à mes clients ?',
			answer:
				"Bien sûr ! PLACEMOI est un service que vous pouvez intégrer à votre offre. Vous pouvez le facturer à vos clients comme un service supplémentaire ou l'inclure dans votre package complet.",
		},
		{
			question: 'Y a-t-il un support dédié pour les professionnels ?',
			answer:
				'Oui, nous offrons un support prioritaire pour les wedding planners. Vous avez accès à une équipe dédiée qui comprend vos besoins et peut vous aider rapidement en cas de besoin.',
		},
	];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'PLACEMOI pour Wedding Planners - Solution plan de table professionnelle',
		description:
			'Solution de plan de table événement pour wedding planners. Gérez plusieurs mariages simultanément, personnalisez chaque page, économisez du temps. Tarifs préférentiels professionnels.',
		about: {
			'@type': 'Thing',
			name: 'Plan de table pour wedding planners',
		},
	};
</script>

<svelte:head>
	<title
		>PLACEMOI pour Wedding Planners | Solution plan de table professionnelle</title
	>
	<meta
		name="description"
		content="PLACEMOI pour wedding planners : gérez plusieurs mariages simultanément, personnalisez chaque page invitée, économisez du temps. Tarifs préférentiels professionnels. Contactez-nous pour un devis."
	/>
	<meta
		name="keywords"
		content="wedding planner, organisateur mariage, plan de table professionnel, solution événement wedding planner, QR code mariage professionnel, gestion mariages multiples, tarifs wedding planner, plan de table premium, service wedding planner"
	/>
	<meta
		property="og:title"
		content="PLACEMOI pour Wedding Planners | Solution plan de table professionnelle"
	/>
	<meta
		property="og:description"
		content="Gérez plusieurs mariages simultanément avec PLACEMOI. Personnalisez chaque page invitée, économisez du temps, proposez un service premium à vos clients. Tarifs préférentiels professionnels."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://placemoi.com/wedding-planners" />
	<meta property="og:image" content="/images/logo_text.svg" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href="https://placemoi.com/wedding-planners" />
	<script type="application/ld+json">
		{JSON.stringify(structuredData)}
	</script>
</svelte:head>

<main class="flex flex-col pt-20">
	<!-- Hero Section -->
	<section class="w-full" style="background-color: #fff9f4;">
		<div
			class="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-20 pt-16 sm:px-8 lg:px-12"
		>
			<div class="mx-auto max-w-3xl text-center">
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					Pour les professionnels
				</p>
				<h1
					class="mt-4 text-4xl font-normal leading-[120%] tracking-tight md:text-5xl xl:text-6xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					La solution plan de table qui fait gagner du temps aux wedding
					planners
				</h1>
				<p
					class="mt-6 text-lg leading-[160%] md:text-xl"
					style="color: #2c3e50; opacity: 0.85;"
				>
					Gérez plusieurs mariages simultanément, personnalisez chaque page
					invitée, économisez des heures de travail. Proposez un service premium
					à vos clients avec PLACEMOI.
				</p>
				<div class="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
					<Button
						href="/contact"
						class="rounded-xl px-8 py-6 text-base font-medium text-white shadow-lg transition-all duration-200 hover:scale-105"
						style="background-color: #D4A574;"
					>
						Discuter de vos besoins
					</Button>
					<Button
						href="/pricing"
						variant="outline"
						class="rounded-xl border-2 px-8 py-6 text-base font-medium transition-all duration-200 hover:scale-105"
						style="border-color: #d4a574; color: #2c3e50;"
					>
						Voir les tarifs
					</Button>
				</div>
			</div>
		</div>
	</section>

	<!-- Benefits Section -->
	<section
		class="border-y py-16 sm:py-20 md:py-24"
		style="background-color: white; border-color: #f0e8df;"
	>
		<div class="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
			<div class="text-center">
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					Pourquoi PLACEMOI
				</p>
				<h2
					class="mt-4 text-3xl font-normal leading-[120%] tracking-tight md:text-4xl xl:text-5xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Des avantages concrets pour votre activité
				</h2>
				<p
					class="mt-6 text-base leading-relaxed md:text-lg"
					style="color: #2c3e50; opacity: 0.85;"
				>
					PLACEMOI est conçu pour les professionnels qui organisent plusieurs
					événements et veulent offrir le meilleur à leurs clients.
				</p>
			</div>
			<div class="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each plannerBenefits as benefit}
					<div
						class="rounded-2xl border border-[#e8dccf] bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1"
					>
						<div class="text-4xl">{benefit.icon}</div>
						<h3 class="mt-4 text-xl font-semibold" style="color: #2c3e50;">
							{benefit.title}
						</h3>
						<p
							class="mt-3 text-sm leading-relaxed"
							style="color: #2c3e50; opacity: 0.85;"
						>
							{benefit.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Use Cases Section -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: #fafafa;">
		<div class="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
			<div class="text-center">
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					Cas d'usage réels
				</p>
				<h2
					class="mt-4 text-3xl font-normal leading-[120%] tracking-tight md:text-4xl xl:text-5xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Comment PLACEMOI transforme votre quotidien
				</h2>
			</div>
			<div class="mt-16 grid gap-8 md:grid-cols-2">
				{#each useCases as useCase}
					<Card.Root
						class="rounded-2xl border border-[#e8dccf] bg-white p-8 shadow-sm"
					>
						<Card.Header>
							<Card.Title
								tag="h3"
								class="text-xl font-semibold"
								style="color: #2c3e50;"
							>
								{useCase.title}
							</Card.Title>
						</Card.Header>
						<Card.Content>
							<p
								class="mt-3 text-sm leading-relaxed"
								style="color: #2c3e50; opacity: 0.85;"
							>
								{useCase.description}
							</p>
							<div
								class="mt-4 rounded-xl bg-[#fff9f4] p-3 text-sm font-semibold"
								style="color: #d4a574;"
							>
								✓ {useCase.benefit}
							</div>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: #fff9f4;">
		<div class="mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12">
			<h2
				class="text-3xl font-normal leading-[120%] tracking-tight md:text-4xl xl:text-5xl"
				style="color: #2c3e50; font-family: 'Playfair Display', serif;"
			>
				Prêt.e à transformer votre façon de gérer les plans de table ?
			</h2>
			<p
				class="mt-6 text-base leading-relaxed md:text-lg"
				style="color: #2c3e50; opacity: 0.85;"
			>
				Discutons de vos besoins et découvrons comment PLACEMOI peut s'intégrer
				à votre offre. Tarifs préférentiels pour les professionnels.
			</p>
			<div class="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
				<Button
					href="/contact"
					class="rounded-xl px-8 py-6 text-base font-medium text-white shadow-lg transition-all duration-200 hover:scale-105"
					style="background-color: #D4A574;"
				>
					Nous contacter
				</Button>
				<Button
					href="/pricing"
					variant="outline"
					class="rounded-xl border-2 px-8 py-6 text-base font-medium transition-all duration-200 hover:scale-105"
					style="border-color: #d4a574; color: #2c3e50;"
				>
					Voir les tarifs
				</Button>
			</div>
		</div>
	</section>

	<!-- FAQ Section -->
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
					Tout ce que vous voulez savoir
				</h2>
			</div>

			<div class="mt-12 space-y-4">
				{#each faq as item}
					<Collapsible
						class="rounded-lg border border-[#e8dccf] bg-white shadow-sm"
					>
						<CollapsibleTrigger
							class="flex w-full items-center justify-between p-6 text-left transition-colors"
						>
							<h3
								class="flex-1 break-words pr-4 text-lg font-medium lg:text-xl"
								style="color: #2c3e50;"
							>
								{item.question}
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
								{item.answer}
							</p>
						</CollapsibleContent>
					</Collapsible>
				{/each}
			</div>

			<div class="mt-8 text-center">
				<a
					href="/contact"
					class="inline-flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-semibold transition-colors duration-200"
					style="border-color: #d4a574; color: #2c3e50;"
				>
					Une autre question ? Contactez-nous
				</a>
			</div>
		</div>
	</section>
</main>
