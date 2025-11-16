<script lang="ts">
	import { WebsiteName } from '../../../config';
	import { Button } from '$lib/components/ui/button';
	import {
		Collapsible,
		CollapsibleContent,
		CollapsibleTrigger,
	} from '$lib/components/ui/collapsible';
	import { ChevronDown } from 'lucide-svelte';

	const galaPainPoints = [
		{
			icon: '🎟️',
			title: 'Accueil premium, flux d’invités élevé',
			description:
				"Files d’attente, vérification des invités, placement rapide en salle. Le moindre couac se voit dans un événement premium.",
		},
		{
			icon: '📋',
			title: 'Plans de table complexes',
			description:
				'Tables par catégories (donateurs, sponsors, VIP, alumni, artistes), contraintes protocole, changements tardifs.',
		},
		{
			icon: '🔄',
			title: 'Derniers ajustements avant l’ouverture',
			description:
				"Ajouts/suppressions le jour J. Réimprimer n’est pas une option. Il faut une mise à jour instantanée.",
		},
	];

	const galaBenefits = [
		{
			icon: '⚜️',
			title: 'Image irréprochable',
			description:
				"QR code discret à l’entrée, page aux couleurs de votre gala, expérience fluide et haut de gamme dès l’accueil.",
		},
		{
			icon: '🏷️',
			title: 'Placement par catégories',
			description:
				'Tables par niveau de don, rang protocolaire, promotion (écoles/universités), compagnie (spectacle), etc.',
		},
		{
			icon: '⚙️',
			title: 'Modifiable jusqu’au lever de rideau',
			description:
				"Mise à jour en direct, sans réimpression. Les équipes d’accueil placent sans friction.",
		},
		{
			icon: '📈',
			title: 'Opérationnel en 10 minutes',
			description:
				"Import Excel, vérification, personnalisation, QR prêt. Pas de formation lourde pour le staff.",
		},
	];

	const galaTypes = [
		{
			icon: '❤️',
			title: 'Galas caritatifs',
			description:
				'Pour les grandes associations (Croix Rouge, Sidaction, Téléthon, etc.). Gestion de centaines d\'invités, tables par niveau de don, placement des mécènes et partenaires. Accueil fluide pour maximiser l\'impact et les dons.',
		},
		{
			icon: '🏛️',
			title: 'Fondations & recherche',
			description:
				'Pour les fondations médicales (FRM, Fondation pour la Recherche Médicale), fondations d\'entreprises, fondations d\'utilité publique. Organisation par rang protocolaire, tables réservées aux chercheurs, partenaires scientifiques et donateurs majeurs.',
		},
		{
			icon: '🎓',
			title: 'Galas d\'écoles & universités',
			description:
				'Pour les galas de promotion (ingénieurs, grandes écoles), galas d\'alumni, cérémonies de remise de diplômes. Placement par promotion, par filière, tables réservées aux anciens élèves et partenaires académiques.',
		},
		{
			icon: '🩰',
			title: 'Galas de danse / arts du spectacle',
			description:
				'Pour les conservatoires, écoles privées de danse, théâtre, musique. Organisation par niveau, par compagnie, tables pour les professeurs, artistes invités et familles. Accueil élégant pour un événement artistique.',
		},
		{
			icon: '💎',
			title: 'Événements mondains / premium',
			description:
				'Pour les soirées de prestige, événements VIP, réceptions haut de gamme. Placement protocolaire strict, tables réservées, accueil irréprochable. Image premium garantie dès l\'entrée.',
		},
		{
			icon: '🏢',
			title: 'Galas d\'entreprises / corporate',
			description:
				'Pour les soirées de gala d\'entreprise, événements clients premium, lancements produits. Organisation par départements, par niveau hiérarchique, tables pour les partenaires stratégiques et clients VIP.',
		},
	];

	const galaTimeline = [
		{
			time: '3-4 semaines avant',
			title: 'Import & catégories',
			description:
				"Import de la liste (Excel). Définition des catégories: donateurs, sponsors, VIP, alumni, artistes, etc. Organisation par rang protocolaire et tables réservées.",
		},
		{
			time: '2 semaines avant',
			title: 'Personnalisation & validation',
			description:
				"Logo, couleurs corporate, message d'accueil. Validation du plan avec les équipes. Simulation d'un flux d'invités pour optimiser l'entrée.",
		},
		{
			time: '1 semaine avant',
			title: 'Diffusion & briefing équipe',
			description:
				"Le QR code et le lien sont prêts. Diffusion à l'équipe d'accueil et briefing sur l'utilisation. Plan stabilisé mais ajustable jusqu'au dernier moment.",
		},
		{
			time: 'Jour J',
			title: 'Ouverture des portes',
			description:
				"Accueil fluide, scan → recherche nom → table. Ajustements en direct si besoin. Image impeccable pour un événement premium.",
		},
	];

	const galaFaq = [
		{
			question: 'Peut-on gérer des tables VIP et des zones réservées ?',
			answer:
				'Oui. Vous pouvez tagger les invités (VIP, donateurs, sponsors, alumni, artistes) et organiser les tables par catégories.',
		},
		{
			question: "Comment gérer les invités de dernière minute ?",
			answer:
				"Ajoutez/modifiez en direct. Les changements sont visibles immédiatement lors de la recherche d’un nom.",
		},
		{
			question: 'L’outil convient-il à un événement très premium ?',
			answer:
				"Oui. Page personnalisée à votre charte, QR discret, accueil sans friction. Idéal pour une image haut de gamme.",
		},
		{
			question: 'Combien d’invités maximum ?',
			answer:
				'Jusqu’à 500 invités par événement (et plus sur demande). Contactez-nous pour adapter à votre gala.',
		},
	];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'Plan de table gala en ligne - PLACEMOI',
		description:
			"Plan de table gala premium avec QR code. Pour galas caritatifs, fondations, écoles/universités, arts du spectacle, événements mondains.",
		about: {
			'@type': 'Thing',
			name: 'Plan de table gala',
		},
	};
</script>

<svelte:head>
	<title
		>Plan de table gala en ligne | QR code + Placement invités - {WebsiteName}</title
	>
	<meta
		name="description"
		content="Plan de table gala premium avec QR code. Catégories (VIP, donateurs, sponsors, alumni). Personnalisation complète. Modifiable jusqu’au lever de rideau."
	/>
	<meta
		name="keywords"
		content="plan de table gala, gala caritatif, fondation, gala école, gala université, gala danse, événement premium, placement VIP, QR code gala, accueil invités gala, plan de table haute gamme"
	/>
	<meta
		property="og:title"
		content="Plan de table gala en ligne | QR code + Placement invités - PLACEMOI"
	/>
	<meta
		property="og:description"
		content="Plan de table gala premium avec QR code. Catégories (VIP, donateurs, sponsors, alumni). Personnalisation complète. Modifiable jusqu’au lever de rideau."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://placemoi.com/plan-de-table-gala" />
	<meta property="og:image" content="/images/logo_text.svg" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href="https://placemoi.com/plan-de-table-gala" />
	<script type="application/ld+json">
		{JSON.stringify(structuredData)}
	</script>
</svelte:head>

<main class="flex flex-col">
	<!-- Hero -->
	<section class="w-full pt-20" style="background-color: #fff9f4;">
		<div
			class="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-20 pt-12 sm:px-8 md:flex-row md:items-center md:justify-between md:gap-16 lg:px-12 lg:pt-16"
		>
			<div class="max-w-2xl text-center md:text-left">
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					Plan de table gala
				</p>
				<h1
					class="mt-4 text-3xl font-normal leading-[120%] tracking-tight md:text-4xl xl:text-5xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Un accueil irréprochable pour vos galas et événements premium
				</h1>
				<p
					class="mt-6 text-base leading-[160%] md:text-lg"
					style="color: #2c3e50; opacity: 0.85;"
				>
					Remplacez les panneaux par un QR code élégant. Vos invités trouvent leur
					table en quelques secondes. Vous gardez la main jusqu’au lever de rideau.
				</p>
				<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
					<Button
						href="/auth"
						class="inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02]"
						style="background-color: #d4a574;"
					>
						Créer mon plan de table gala
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
			</div>
			<div class="flex-1">
				<img
					src="https://res.cloudinary.com/dv7gvfcof/image/upload/f_auto,q_auto,w_600/v1763033544/qr_code_placemoi_exemple1_wyzizr.png"
					alt="Exemple de plan de table gala PLACEMOI avec QR code"
					class="mx-auto w-full max-w-md rounded-2xl border-2 border-[#D4A574] object-cover shadow-lg"
				/>
			</div>
		</div>
	</section>

	<!-- Pain points -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: white;">
		<div class="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
			<div class="text-center">
				<p class="text-sm font-semibold uppercase tracking-[0.3em]" style="color: #d4a574;">
					Les défis des galas
				</p>
				<h2
					class="mt-4 text-2xl font-normal leading-[120%] tracking-tight md:text-3xl xl:text-4xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Un placement fluide pour une image haut de gamme
				</h2>
			</div>

			<div class="mt-12 grid gap-8 md:grid-cols-2">
				{#each galaPainPoints as point}
					<div class="flex gap-4">
						<div
							class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-2xl"
							style="background-color: #f5e6d3;"
						>
							{point.icon}
						</div>
						<div>
							<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
								{point.title}
							</h3>
							<p class="text-sm leading-relaxed md:text-base" style="color: #2c3e50; opacity: 0.85;">
								{point.description}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Types de galas -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: #fff9f4;">
		<div class="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
			<div class="text-center">
				<p class="text-sm font-semibold uppercase tracking-[0.3em]" style="color: #d4a574;">
					Types de galas
				</p>
				<h2
					class="mt-4 text-2xl font-normal leading-[120%] tracking-tight md:text-3xl xl:text-4xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Adapté à vos formats et à vos publics
				</h2>
			</div>

			<div class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each galaTypes as g}
					<div class="rounded-2xl border border-[#e8dccf] bg-white p-6 shadow-sm">
						<div class="mb-4 text-3xl">{g.icon}</div>
						<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">{g.title}</h3>
						<p class="text-sm leading-relaxed" style="color: #2c3e50; opacity: 0.85;">
							{g.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Use Case Section - UNIQUE TO GALA -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: white;">
		<div class="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
			<div class="text-center">
				<p class="text-sm font-semibold uppercase tracking-[0.3em]" style="color: #d4a574;">
					Cas d'usage réel
				</p>
				<h2
					class="mt-4 text-2xl font-normal leading-[120%] tracking-tight md:text-3xl xl:text-4xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Gala caritatif de 300 invités : comment PLACEMOI a simplifié l'accueil
				</h2>
			</div>

			<div class="mt-12 rounded-3xl border border-[#e8dccf] bg-[#fff9f4] p-8 md:p-12">
				<div class="grid gap-8 md:grid-cols-2 md:items-center">
					<div>
						<h3
							class="mb-4 text-xl font-semibold"
							style="color: #2c3e50; font-family: 'Playfair Display', serif;"
						>
							Le gala précédent : une expérience difficile
						</h3>
						<p
							class="mb-6 text-sm leading-relaxed md:text-base"
							style="color: #2c3e50; opacity: 0.85;"
						>
							L'année précédente, une fondation avait organisé son gala avec 300 invités répartis en 30 tables. Panneau géant illisible, équipe d'accueil débordée à chercher les noms, files d'attente de 10 minutes à l'entrée. L'image premium de l'événement en avait pâti. Ils ont décidé de changer leur méthode pour l'édition suivante.
						</p>
						<h3
							class="mb-4 text-xl font-semibold"
							style="color: #2c3e50; font-family: 'Playfair Display', serif;"
						>
							Le gala suivant : avec PLACEMOI
						</h3>
						<p
							class="text-sm leading-relaxed md:text-base"
							style="color: #2c3e50; opacity: 0.85;"
						>
							Pour le gala suivant, ils ont préparé leur événement avec PLACEMOI : import Excel avec catégories (donateurs, VIP, partenaires), personnalisation aux couleurs de la fondation. Le jour J, un QR code discret a remplacé le panneau. Résultat : accueil fluide en 3 secondes par invité, aucune file d'attente, et une image irréprochable. Le changement de méthode a fait toute la différence.
						</p>
					</div>
					<div class="rounded-2xl border border-[#e8dccf] bg-white p-6 shadow-sm">
						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<span class="text-sm font-medium" style="color: #2c3e50; opacity: 0.7;">
									Invités
								</span>
								<span class="text-lg font-semibold" style="color: #2c3e50;">300</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-sm font-medium" style="color: #2c3e50; opacity: 0.7;">
									Tables
								</span>
								<span class="text-lg font-semibold" style="color: #2c3e50;">30</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-sm font-medium" style="color: #2c3e50; opacity: 0.7;">
									Catégories
								</span>
								<span class="text-lg font-semibold" style="color: #2c3e50;">4</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-sm font-medium" style="color: #2c3e50; opacity: 0.7;">
									Temps d'accueil moyen
								</span>
								<span class="text-lg font-semibold" style="color: #d4a574;">3 sec</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-sm font-medium" style="color: #2c3e50; opacity: 0.7;">
									Files d'attente
								</span>
								<span class="text-lg font-semibold" style="color: #d4a574;">0</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Bénéfices -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: #fff9f4;">
		<div class="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
			<div class="text-center">
				<p class="text-sm font-semibold uppercase tracking-[0.3em]" style="color: #d4a574;">
					La solution PLACEMOI
				</p>
				<h2
					class="mt-4 text-2xl font-normal leading-[120%] tracking-tight md:text-3xl xl:text-4xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Le bon placement, sans compromis
				</h2>
			</div>

			<div class="mt-12 grid gap-8 md:grid-cols-2">
				{#each galaBenefits as benefit}
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
							<p class="text-sm leading-relaxed md:text-base" style="color: #2c3e50; opacity: 0.85;">
								{benefit.description}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Timeline -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: white;">
		<div class="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
			<div class="text-center">
				<p class="text-sm font-semibold uppercase tracking-[0.3em]" style="color: #d4a574;">
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
				{#each galaTimeline as item, index}
					<div class="flex gap-6">
						<div class="flex flex-col items-center">
							<span
								class="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold shadow-sm"
								style="background-color: {index === 0 ? '#2c3e50' : '#d4a574'}; color: white;"
							>
								{index + 1}
							</span>
							{#if index < galaTimeline.length - 1}
								<span class="mt-2 h-full w-px flex-1 bg-[#f0e8df]"></span>
							{/if}
						</div>
						<div class="flex-1">
							<p class="text-xs font-semibold uppercase tracking-[0.2em]" style="color: #2c3e50; opacity: 0.6;">
								{item.time}
							</p>
							<h3 class="mt-2 text-lg font-semibold md:text-xl" style="color: #2c3e50;">
								{item.title}
							</h3>
							<p class="mt-2 text-sm leading-relaxed md:text-base" style="color: #2c3e50; opacity: 0.85;">
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
				<p class="text-sm font-semibold uppercase tracking-[0.3em]" style="color: #d4a574;">
					Questions fréquentes
				</p>
				<h2
					class="mt-4 text-2xl font-normal leading-[120%] tracking-tight md:text-3xl xl:text-4xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Tout ce que vous voulez savoir sur le plan de table gala
				</h2>
			</div>

			<div class="mt-12 space-y-4">
				{#each galaFaq as faqItem}
					<Collapsible class="rounded-lg border border-[#e8dccf] bg-white shadow-sm">
						<CollapsibleTrigger class="flex w-full items-center justify-between p-6 text-left transition-colors">
							<h3 class="flex-1 break-words pr-4 text-lg font-medium lg:text-xl" style="color: #2c3e50;">
								{faqItem.question}
							</h3>
							<ChevronDown class="h-5 w-5 flex-shrink-0 transition-transform duration-200" style="color: #2c3e50; opacity: 0.7;" />
						</CollapsibleTrigger>
						<CollapsibleContent class="px-6 pb-6">
							<p class="text-base leading-relaxed lg:text-lg" style="color: #2c3e50; opacity: 0.9;">
								{faqItem.answer}
							</p>
						</CollapsibleContent>
					</Collapsible>
				{/each}
			</div>

			<div class="mt-8 text-center">
				<a
					href="/faq"
					class="inline-flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-semibold transition-colors duration-200"
					style="border-color: #d4a574; color: #2c3e50;"
				>
					Consulter toutes les questions
				</a>
			</div>
		</div>
	</section>

	<!-- Final CTA -->
	<section class="border-t py-16 sm:py-20 md:py-24" style="background-color: #fff9f4; border-color: #f0e8df;">
		<div class="mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12">
			<h2 class="text-2xl font-normal leading-[120%] tracking-tight md:text-3xl" style="color: #2c3e50; font-family: 'Playfair Display', serif;">
				Offrez une expérience d’accueil à la hauteur de votre gala
			</h2>
			<p class="mt-4 text-sm leading-relaxed md:text-base" style="color: #2c3e50; opacity: 0.85;">
				Créez votre plan de table en quelques minutes. Un QR code élégant, un placement fluide, une image irréprochable.
			</p>
			<div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
				<a href="/auth">
					<Button class="h-12 rounded-xl px-8 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105" style="background-color: #d4a574; border: none;">
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


