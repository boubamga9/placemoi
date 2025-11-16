<script lang="ts">
	import { WebsiteName } from '../../../config';
	import { Button } from '$lib/components/ui/button';
	import {
		Collapsible,
		CollapsibleContent,
		CollapsibleTrigger,
	} from '$lib/components/ui/collapsible';
	import { ChevronDown } from 'lucide-svelte';

	const weddingPainPoints = [
		{
			icon: '📞',
			title: 'Les appels de dernière minute',
			description:
				'La veille du mariage, vous recevez encore des messages : "À quelle table je suis ?" alors que vous avez déjà assez à gérer.',
		},
		{
			icon: '📋',
			title: 'Le panneau géant illisible',
			description:
				"Vous avez 200, 300, 400 invités ? Le panneau avec tous les noms devient illisible et casse l'esthétique de votre décoration.",
		},
		{
			icon: '🔄',
			title: 'Les changements de dernière minute',
			description:
				'Un invité annule, un autre arrive en plus. Vous devez tout réimprimer, tout refaire. Le stress monte.',
		},
		{
			icon: '⏰',
			title: "Les files d'attente à l'entrée",
			description:
				"Tous vos invités cherchent leur nom en même temps devant le panneau. L'entrée devient un embouteillage.",
		},
	];

	const weddingBenefits = [
		{
			icon: '💍',
			title: 'Élégant et moderne',
			description:
				"Un QR code discret à l'entrée remplace le panneau géant. Vos invités scannent et trouvent leur table en 3 secondes. Votre décoration reste intacte.",
		},
		{
			icon: '🎨',
			title: '100% personnalisable',
			description:
				"Logo de votre mariage, couleurs de votre thème, image de fond, messages personnalisés. La page invitée s'adapte à votre univers.",
		},
		{
			icon: '📸',
			title: 'Collecte de photos intégrée',
			description:
				'Vos invités partagent leurs photos souvenirs via le même QR code. Vous récupérez toutes les photos dans un album dédié, sans courir après les fichiers.',
		},
		{
			icon: '🔄',
			title: "Modifications jusqu'au jour J",
			description:
				'Changement de dernière minute ? Pas de problème. Vous modifiez en ligne, vos invités voient automatiquement la mise à jour. Plus besoin de réimprimer.',
		},
	];

	const weddingTimeline = [
		{
			time: '3 mois avant',
			title: 'Créez votre événement',
			description:
				"Importez votre liste d'invités depuis Excel ou ajoutez-les manuellement. Organisez vos tables et assignez les places.",
		},
		{
			time: '1 mois avant',
			title: 'Personnalisez la page',
			description:
				"Ajoutez votre logo, choisissez vos couleurs, personnalisez les messages d'accueil. La page reflète l'identité de votre mariage.",
		},
		{
			time: '2 semaines avant',
			title: 'Partagez le QR code',
			description:
				"Recevez votre QR code et votre lien unique. Partagez-les avec vos invités par email, sur votre site de mariage, ou affichez le QR code à l'entrée.",
		},
		{
			time: 'Jour J',
			title: 'Profitez de votre mariage',
			description:
				"Vos invités scannent, trouvent leur table, s'installent. Vous, vous profitez de votre journée sans stress. Les photos arrivent automatiquement dans votre album.",
		},
	];

	const weddingFaq = [
		{
			question: 'Puis-je modifier le plan de table la veille du mariage ?',
			answer:
				"Absolument ! C'est même l'un des avantages majeurs. Vous pouvez modifier les tables, ajouter ou retirer des invités jusqu'au jour J. Les changements sont instantanés et visibles par tous vos invités.",
		},
		{
			question: 'Mes invités doivent-ils installer une application ?',
			answer:
				'Non, aucune installation requise. Vos invités scannent simplement le QR code avec leur téléphone (appareil photo natif) et accèdent directement à la page. Ça fonctionne sur tous les smartphones.',
		},
		{
			question: "Combien d'invités puis-je gérer ?",
			answer:
				"PLACEMOI supporte jusqu'à 500 invités par événement. Si vous avez un mariage plus important, contactez-nous et nous trouverons une solution ensemble.",
		},
		{
			question:
				'Puis-je personnaliser la page avec les couleurs de mon mariage ?',
			answer:
				"Oui, totalement ! Vous pouvez choisir les couleurs de fond, la couleur du texte, ajouter votre logo, une image de fond, et personnaliser les messages d'accueil. La page s'adapte à votre thème de mariage.",
		},
		{
			question: 'Comment mes invités trouvent-ils leur table ?',
			answer:
				"Très simplement : ils scannent le QR code affiché à l'entrée (ou suivent le lien que vous leur avez envoyé), tapent leur nom dans la barre de recherche, et voient immédiatement leur numéro de table et leur place.",
		},
		{
			question: 'Les photos partagées par les invités sont-elles sécurisées ?',
			answer:
				"Oui, toutes les photos sont hébergées de manière sécurisée en Europe. Seul vous (les mariés) pouvez accéder à l'album photo. Les autres invités ne voient pas les photos partagées par les autres.",
		},
		{
			question: "Que se passe-t-il si un invité n'a pas de smartphone ?",
			answer:
				"Pas de problème ! Vous pouvez partager le lien directement. L'invité peut aussi demander à quelqu'un de scanner le QR code pour lui. La page fonctionne aussi sur tablette et ordinateur.",
		},
		{
			question: 'Puis-je tester avant de payer ?',
			answer:
				"Oui, vous pouvez créer votre événement, importer quelques invités et tester la page invitée gratuitement. Le paiement n'est demandé que lorsque vous êtes prêts à partager le QR code avec vos invités.",
		},
	];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'Plan de table mariage en ligne - PLACEMOI',
		description:
			"Créez votre plan de table mariage en ligne avec QR code. Personnalisable, modifiable jusqu'au jour J. Pour mariages de 50 à 500 invités.",
		about: {
			'@type': 'Thing',
			name: 'Plan de table mariage',
		},
	};
</script>

<svelte:head>
	<title
		>Plan de table mariage en ligne | QR code + Placement invités - {WebsiteName}</title
	>
	<meta
		name="description"
		content="Créez votre plan de table mariage en ligne en 5 minutes. QR code élégant, page personnalisable, modifications jusqu'au jour J. Pour mariages de 50 à 500 invités. À partir de 49,99€."
	/>
	<meta
		name="keywords"
		content="plan de table mariage, plan de table mariage en ligne, QR code mariage, placement invités mariage, plan de table mariage numérique, organisation mariage, plan de table mariage personnalisé, gestion invités mariage, plan de table mariage QR code, placement mariage"
	/>
	<meta
		property="og:title"
		content="Plan de table mariage en ligne | QR code + Placement invités - PLACEMOI"
	/>
	<meta
		property="og:description"
		content="Créez votre plan de table mariage en ligne. QR code élégant, page personnalisable, modifications jusqu'au jour J. Vos invités trouvent leur table en 3 secondes."
	/>
	<meta property="og:type" content="website" />
	<meta
		property="og:url"
		content="https://placemoi.com/plan-de-table-mariage"
	/>
	<meta property="og:image" content="/images/logo_text.svg" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href="https://placemoi.com/plan-de-table-mariage" />
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
					Plan de table mariage
				</p>
				<h1
					class="mt-4 text-3xl font-normal leading-[120%] tracking-tight md:text-4xl xl:text-5xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Organisez le placement de vos invités de mariage en quelques minutes
				</h1>
				<p
					class="mt-6 text-base leading-[160%] md:text-lg"
					style="color: #2c3e50; opacity: 0.85;"
				>
					Fini le panneau géant illisible et les appels de dernière minute.
					Créez votre plan de table mariage en ligne, recevez un QR code
					élégant, et laissez vos invités trouver leur place en 3 secondes.
					Modifications possibles jusqu'au jour J.
				</p>
				<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
					<a href="/auth">
						<Button
							class="h-12 rounded-xl px-8 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105"
							style="background-color: #d4a574; border: none;"
						>
							Créez votre plan de table mariage
						</Button>
					</a>
					<a
						href="/pricing"
						class="inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold transition-colors duration-200"
						style="border: 1px solid #d4a574; color: #2c3e50;"
					>
						Voir les tarifs
					</a>
				</div>
				<p
					class="mt-4 text-sm font-light"
					style="color: #2c3e50; opacity: 0.8;"
				>
					✔️ <strong>À partir de 49,99€</strong> par mariage • Paiement unique •
					QR code + lien inclus
				</p>
			</div>

			<div
				class="mx-auto w-full max-w-md rounded-3xl border border-[#d4a574] bg-white p-8 shadow-lg md:mx-0"
			>
				<h2
					class="text-center text-lg font-semibold uppercase tracking-[0.2em] md:text-left"
					style="color: #2c3e50;"
				>
					Pourquoi choisir PLACEMOI pour votre mariage ?
				</h2>
				<ul class="mt-6 space-y-4 text-left">
					<li
						class="flex gap-3 text-sm leading-relaxed md:text-base"
						style="color: #2c3e50;"
					>
						<span
							class="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold"
							style="background-color: #d4a574; color: white;"
						>
							✓
						</span>
						<span
							>Personnalisation complète (logo, couleurs, thème de votre
							mariage)</span
						>
					</li>
					<li
						class="flex gap-3 text-sm leading-relaxed md:text-base"
						style="color: #2c3e50;"
					>
						<span
							class="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold"
							style="background-color: #d4a574; color: white;"
						>
							✓
						</span>
						<span
							>Modifications possibles jusqu'au jour J (plus de réimpression)</span
						>
					</li>
					<li
						class="flex gap-3 text-sm leading-relaxed md:text-base"
						style="color: #2c3e50;"
					>
						<span
							class="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold"
							style="background-color: #d4a574; color: white;"
						>
							✓
						</span>
						<span>Collecte de photos souvenirs intégrée (optionnel)</span>
					</li>
					<li
						class="flex gap-3 text-sm leading-relaxed md:text-base"
						style="color: #2c3e50;"
					>
						<span
							class="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold"
							style="background-color: #d4a574; color: white;"
						>
							✓
						</span>
						<span>Support par email jusqu'au jour J</span>
					</li>
				</ul>
			</div>
		</div>
	</section>

	<!-- Pain Points Section -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: #fafafa;">
		<div class="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
			<div class="text-center">
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					Les problèmes du plan de table classique
				</p>
				<h2
					class="mt-4 text-2xl font-normal leading-[120%] tracking-tight md:text-3xl xl:text-4xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Vous reconnaissez-vous dans ces situations ?
				</h2>
			</div>

			<div class="mt-12 grid gap-6 md:grid-cols-2">
				{#each weddingPainPoints as point}
					<div
						class="rounded-2xl border border-[#e8dccf] bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1"
					>
						<div class="mb-4 text-4xl">{point.icon}</div>
						<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
							{point.title}
						</h3>
						<p
							class="text-sm leading-relaxed md:text-base"
							style="color: #2c3e50; opacity: 0.85;"
						>
							{point.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Benefits Section -->
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
					Votre plan de table mariage, simplifié
				</h2>
			</div>

			<div class="mt-12 grid gap-8 md:grid-cols-2">
				{#each weddingBenefits as benefit}
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
		</div>
	</section>

	<!-- Timeline Section -->
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
				{#each weddingTimeline as item, index}
					<div class="flex gap-6">
						<div class="flex flex-col items-center">
							<span
								class="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold shadow-sm"
								style="background-color: {index === 0
									? '#2c3e50'
									: '#d4a574'}; color: white;"
							>
								{index + 1}
							</span>
							{#if index < weddingTimeline.length - 1}
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
							<h3
								class="mt-2 text-lg font-semibold md:text-xl"
								style="color: #2c3e50;"
							>
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

	<!-- Use Case Section - UNIQUE TO WEDDING -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: white;">
		<div class="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
			<div class="text-center">
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					Cas d'usage réel
				</p>
				<h2
					class="mt-4 text-2xl font-normal leading-[120%] tracking-tight md:text-3xl xl:text-4xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Mariage de 200 invités : comment PLACEMOI a simplifié l'organisation
				</h2>
			</div>

			<div
				class="mt-12 rounded-3xl border border-[#e8dccf] bg-[#fff9f4] p-8 md:p-12"
			>
				<div class="grid gap-8 md:grid-cols-2 md:items-center">
					<div>
						<h3
							class="mb-4 text-xl font-semibold"
							style="color: #2c3e50; font-family: 'Playfair Display', serif;"
						>
							Le défi
						</h3>
						<p
							class="mb-6 text-sm leading-relaxed md:text-base"
							style="color: #2c3e50; opacity: 0.85;"
						>
							Un couple organisait son mariage avec 200 invités répartis sur 20
							tables. Le panneau avec tous les noms devenait illisible, et ils
							recevaient encore des appels la veille du mariage pour savoir "à
							quelle table je suis ?".
						</p>
						<h3
							class="mb-4 text-xl font-semibold"
							style="color: #2c3e50; font-family: 'Playfair Display', serif;"
						>
							La solution PLACEMOI
						</h3>
						<p
							class="text-sm leading-relaxed md:text-base"
							style="color: #2c3e50; opacity: 0.85;"
						>
							Ils ont créé leur événement en 10 minutes, importé leur liste
							Excel, personnalisé la page avec leurs couleurs de mariage. Le
							jour J, un QR code discret à l'entrée a remplacé le panneau géant.
							Résultat : aucun appel, aucun stress, et leurs invités ont trouvé
							leur table en 3 secondes.
						</p>
					</div>
					<div
						class="rounded-2xl border border-[#e8dccf] bg-white p-6 shadow-sm"
					>
						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<span
									class="text-sm font-medium"
									style="color: #2c3e50; opacity: 0.7;"
								>
									Invités
								</span>
								<span class="text-lg font-semibold" style="color: #2c3e50;"
									>200</span
								>
							</div>
							<div class="flex items-center justify-between">
								<span
									class="text-sm font-medium"
									style="color: #2c3e50; opacity: 0.7;"
								>
									Tables
								</span>
								<span class="text-lg font-semibold" style="color: #2c3e50;"
									>20</span
								>
							</div>
							<div class="flex items-center justify-between">
								<span
									class="text-sm font-medium"
									style="color: #2c3e50; opacity: 0.7;"
								>
									Temps de création
								</span>
								<span class="text-lg font-semibold" style="color: #2c3e50;"
									>10 min</span
								>
							</div>
							<div class="flex items-center justify-between">
								<span
									class="text-sm font-medium"
									style="color: #2c3e50; opacity: 0.7;"
								>
									Appels reçus le jour J
								</span>
								<span class="text-lg font-semibold" style="color: #d4a574;"
									>0</span
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Tips Section - UNIQUE TO WEDDING -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: #fafafa;">
		<div class="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
			<div class="text-center">
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					Conseils d'organisation
				</p>
				<h2
					class="mt-4 text-2xl font-normal leading-[120%] tracking-tight md:text-3xl xl:text-4xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Comment bien organiser votre plan de table mariage
				</h2>
			</div>

			<div class="mt-12 grid gap-6 md:grid-cols-3">
				<div class="rounded-2xl border border-[#e8dccf] bg-white p-6 shadow-sm">
					<div class="mb-4 text-3xl">👥</div>
					<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
						Organisez par affinités
					</h3>
					<p
						class="text-sm leading-relaxed"
						style="color: #2c3e50; opacity: 0.85;"
					>
						Regroupez les invités qui se connaissent sur les mêmes tables. Cela
						facilite les conversations et crée une meilleure ambiance.
					</p>
				</div>
				<div class="rounded-2xl border border-[#e8dccf] bg-white p-6 shadow-sm">
					<div class="mb-4 text-3xl">📅</div>
					<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
						Prévoyez des places vides
					</h3>
					<p
						class="text-sm leading-relaxed"
						style="color: #2c3e50; opacity: 0.85;"
					>
						Laissez quelques places libres par table pour les changements de
						dernière minute. Avec PLACEMOI, vous pouvez modifier jusqu'au jour
						J.
					</p>
				</div>
				<div class="rounded-2xl border border-[#e8dccf] bg-white p-6 shadow-sm">
					<div class="mb-4 text-3xl">🎨</div>
					<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
						Personnalisez tôt
					</h3>
					<p
						class="text-sm leading-relaxed"
						style="color: #2c3e50; opacity: 0.85;"
					>
						Ajoutez votre logo et vos couleurs dès que possible. Cela vous
						permet de tester l'aperçu et de partager le QR code en avance avec
						vos proches.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: white;">
		<div class="mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12">
			<h2
				class="text-2xl font-normal leading-[120%] tracking-tight md:text-3xl"
				style="color: #2c3e50; font-family: 'Playfair Display', serif;"
			>
				Prêt à simplifier votre plan de table mariage ?
			</h2>
			<p
				class="mt-4 text-sm leading-relaxed md:text-base"
				style="color: #2c3e50; opacity: 0.85;"
			>
				Créez votre événement en 5 minutes, personnalisez la page, recevez votre
				QR code. Vos invités trouveront leur table en 3 secondes, vous
				profiterez de votre journée sans stress.
			</p>
			<div
				class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
			>
				<a href="/auth">
					<Button
						class="h-12 rounded-xl px-8 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105"
						style="background-color: #d4a574; border: none;"
					>
						Créez votre plan de table mariage
					</Button>
				</a>
				<a
					href="/pricing"
					class="inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold transition-colors duration-200"
					style="border: 1px solid #2c3e50; color: #2c3e50;"
				>
					Voir les tarifs
				</a>
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
					Tout ce que vous voulez savoir sur le plan de table mariage
				</h2>
			</div>

			<div class="mt-12 space-y-4">
				{#each weddingFaq as faqItem}
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
	<section
		class="border-t py-16 sm:py-20 md:py-24"
		style="background-color: #fff9f4; border-color: #f0e8df;"
	>
		<div class="mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12">
			<h2
				class="text-2xl font-normal leading-[120%] tracking-tight md:text-3xl"
				style="color: #2c3e50; font-family: 'Playfair Display', serif;"
			>
				Organisez votre mariage sereinement
			</h2>
			<p
				class="mt-4 text-sm leading-relaxed md:text-base"
				style="color: #2c3e50; opacity: 0.85;"
			>
				Rejoignez les couples qui ont choisi PLACEMOI pour simplifier leur plan
				de table mariage. Créez votre événement dès maintenant.
			</p>
			<p class="mt-2 text-sm" style="color:#2c3e50; opacity:.8;">
				Questions ? Consultez la <a href="/faq" class="underline">FAQ</a> ou
				découvrez nos
				<a href="/pricing" class="underline">tarifs</a>.
			</p>
			<div
				class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
			>
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
