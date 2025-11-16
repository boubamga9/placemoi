<script lang="ts">
	import { WebsiteName } from '../../../config';
	import { Button } from '$lib/components/ui/button';
	import {
		Collapsible,
		CollapsibleContent,
		CollapsibleTrigger,
	} from '$lib/components/ui/collapsible';
	import { ChevronDown } from 'lucide-svelte';

	const conferencePainPoints = [
		{
			icon: '📋',
			title: 'Les listes papier qui s\'égarent',
			description:
				'Les feuilles avec les noms et tables se perdent, se salissent, ou sont difficiles à consulter pour 200, 300 participants.',
		},
		{
			icon: '⏰',
			title: 'Les files d\'attente à l\'accueil',
			description:
				'Tous les participants cherchent leur nom en même temps. L\'accueil devient un goulot d\'étranglement qui retarde le début de votre événement.',
		},
		{
			icon: '🔄',
			title: 'Les changements de dernière minute',
			description:
				'Un participant annule, un autre s\'inscrit. Vous devez tout réimprimer, tout redistribuer. Le stress monte avant l\'événement.',
		},
		{
			icon: '💼',
			title: 'L\'image peu professionnelle',
			description:
				'Les panneaux géants avec tous les noms donnent une impression désorganisée. Vous voulez une solution moderne et élégante.',
		},
	];

	const conferenceBenefits = [
		{
			icon: '💼',
			title: 'Image professionnelle',
			description:
				'Un QR code discret et moderne remplace les panneaux encombrants. Vos participants accèdent à leur table en 3 secondes. Votre événement garde une image soignée.',
		},
		{
			icon: '🎯',
			title: 'Gain de temps et d\'efficacité',
			description:
				'Plus de files d\'attente à l\'accueil. Vos participants scannent, trouvent leur place, s\'installent. Votre événement démarre à l\'heure.',
		},
		{
			icon: '🔄',
			title: 'Modifications en temps réel',
			description:
				'Changement de dernière minute ? Pas de problème. Vous modifiez en ligne, vos participants voient automatiquement la mise à jour. Plus besoin de réimprimer.',
		},
		{
			icon: '📊',
			title: 'Gestion simplifiée',
			description:
				'Importez votre liste depuis Excel, organisez vos tables, assignez les places. Tout se fait en ligne, depuis votre bureau.',
		},
	];

	const conferenceTimeline = [
		{
			time: '2 semaines avant',
			title: 'Créez votre événement',
			description:
				'Importez votre liste de participants depuis Excel ou ajoutez-les manuellement. Organisez vos tables et assignez les places selon vos besoins.',
		},
		{
			time: '1 semaine avant',
			title: 'Personnalisez la page',
			description:
				'Ajoutez le logo de votre entreprise, choisissez vos couleurs corporate, personnalisez les messages d\'accueil. La page reflète l\'identité de votre événement.',
		},
		{
			time: '3 jours avant',
			title: 'Partagez le QR code',
			description:
				'Recevez votre QR code et votre lien unique. Partagez-les dans les emails de confirmation, sur votre site, ou affichez le QR code à l\'accueil.',
		},
		{
			time: 'Jour J',
			title: 'Votre événement démarre à l\'heure',
			description:
				'Vos participants scannent, trouvent leur table, s\'installent rapidement. Vous, vous vous concentrez sur le contenu de votre événement. Tout se passe sans stress.',
		},
	];

	const conferenceFaq = [
		{
			question: 'Puis-je modifier le plan de table la veille de la conférence ?',
			answer:
				'Absolument ! C\'est même l\'un des avantages majeurs pour les événements professionnels. Vous pouvez modifier les tables, ajouter ou retirer des participants jusqu\'au jour J. Les changements sont instantanés et visibles par tous.',
		},
		{
			question: 'Les participants doivent-ils installer une application ?',
			answer:
				'Non, aucune installation requise. Vos participants scannent simplement le QR code avec leur téléphone (appareil photo natif) et accèdent directement à la page. Ça fonctionne sur tous les smartphones, tablettes et ordinateurs.',
		},
		{
			question: 'Combien de participants puis-je gérer ?',
			answer:
				'PLACEMOI supporte jusqu\'à 500 participants par événement. Si vous avez une conférence ou un séminaire plus important, contactez-nous et nous trouverons une solution ensemble.',
		},
		{
			question: 'Puis-je personnaliser la page avec les couleurs de mon entreprise ?',
			answer:
				'Oui, totalement ! Vous pouvez choisir les couleurs de fond, la couleur du texte, ajouter votre logo d\'entreprise, une image de fond, et personnaliser les messages d\'accueil. La page s\'adapte à votre charte graphique.',
		},
		{
			question: 'Comment mes participants trouvent-ils leur table ?',
			answer:
				'Très simplement : ils scannent le QR code affiché à l\'accueil (ou suivent le lien que vous leur avez envoyé), tapent leur nom dans la barre de recherche, et voient immédiatement leur numéro de table et leur place.',
		},
		{
			question: 'Puis-je exporter la liste des participants ?',
			answer:
				'Oui, vous pouvez exporter votre liste de participants au format CSV depuis votre tableau de bord organisateur, à tout moment.',
		},
		{
			question: 'Que se passe-t-il si un participant n\'a pas de smartphone ?',
			answer:
				'Pas de problème ! Vous pouvez partager le lien directement. Le participant peut aussi demander à quelqu\'un de scanner le QR code pour lui. La page fonctionne aussi sur tablette et ordinateur.',
		},
		{
			question: 'Puis-je tester avant de payer ?',
			answer:
				'Oui, vous pouvez créer votre événement, importer quelques participants et tester la page gratuitement. Le paiement n\'est demandé que lorsque vous êtes prêts à partager le QR code avec vos participants.',
		},
	];

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'Plan de table conférence en ligne - PLACEMOI',
		description:
			'Créez votre plan de table conférence en ligne avec QR code. Personnalisable, modifiable jusqu\'au jour J. Pour conférences et séminaires de 50 à 500 participants.',
		about: {
			'@type': 'Thing',
			name: 'Plan de table conférence',
		},
	};
</script>

<svelte:head>
	<title>Plan de table conférence en ligne | QR code + Placement participants - {WebsiteName}</title>
	<meta
		name="description"
		content="Créez votre plan de table conférence en ligne en 5 minutes. QR code professionnel, page personnalisable, modifications jusqu'au jour J. Pour conférences et séminaires de 50 à 500 participants. À partir de 49,99€."
	/>
	<meta
		name="keywords"
		content="plan de table conférence, plan de table séminaire, QR code conférence, placement participants conférence, plan de table conférence en ligne, organisation conférence, plan de table entreprise, gestion participants conférence, plan de table séminaire numérique, placement invités conférence"
	/>
	<meta
		property="og:title"
		content="Plan de table conférence en ligne | QR code + Placement participants - PLACEMOI"
	/>
	<meta
		property="og:description"
		content="Créez votre plan de table conférence en ligne. QR code professionnel, page personnalisable, modifications jusqu'au jour J. Vos participants trouvent leur table en 3 secondes."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://placemoi.com/plan-de-table-conference" />
	<meta property="og:image" content="/images/logo_text.svg" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href="https://placemoi.com/plan-de-table-conference" />
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
					Plan de table conférence
				</p>
				<h1
					class="mt-4 text-3xl font-normal leading-[120%] tracking-tight md:text-4xl xl:text-5xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Organisez le placement de vos participants de conférence en quelques minutes
				</h1>
				<p
					class="mt-6 text-base leading-[160%] md:text-lg"
					style="color: #2c3e50; opacity: 0.85;"
				>
					Fini les listes papier qui s'égarent et les files d'attente à l'accueil. Créez votre plan de table conférence en ligne, recevez un QR code professionnel, et laissez vos participants trouver leur place en 3 secondes. Modifications possibles jusqu'au jour J.
				</p>
				<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
					<a href="/auth">
						<Button
							class="h-12 rounded-xl px-8 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105"
							style="background-color: #d4a574; border: none;"
						>
							Créez votre plan de table conférence
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
				<p class="mt-4 text-sm font-light" style="color: #2c3e50; opacity: 0.8;">
					✔️ <strong>À partir de 49,99€</strong> par événement • Paiement unique • QR code + lien inclus
				</p>
			</div>

			<div class="mx-auto w-full max-w-md rounded-3xl border border-[#d4a574] bg-white p-8 shadow-lg md:mx-0">
				<h2
					class="text-lg font-semibold uppercase tracking-[0.2em] text-center md:text-left"
					style="color: #2c3e50;"
				>
					Pourquoi choisir PLACEMOI pour votre conférence ?
				</h2>
				<ul class="mt-6 space-y-4 text-left">
					<li class="flex gap-3 text-sm leading-relaxed md:text-base" style="color: #2c3e50;">
						<span
							class="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold"
							style="background-color: #d4a574; color: white;"
						>
							✓
						</span>
						<span>Personnalisation complète (logo entreprise, couleurs corporate, charte graphique)</span>
					</li>
					<li class="flex gap-3 text-sm leading-relaxed md:text-base" style="color: #2c3e50;">
						<span
							class="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold"
							style="background-color: #d4a574; color: white;"
						>
							✓
						</span>
						<span>Modifications possibles jusqu'au jour J (plus de réimpression)</span>
					</li>
					<li class="flex gap-3 text-sm leading-relaxed md:text-base" style="color: #2c3e50;">
						<span
							class="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold"
							style="background-color: #d4a574; color: white;"
						>
							✓
						</span>
						<span>Gain de temps : plus de files d'attente à l'accueil</span>
					</li>
					<li class="flex gap-3 text-sm leading-relaxed md:text-base" style="color: #2c3e50;">
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
				{#each conferencePainPoints as point}
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
					Votre plan de table conférence, simplifié
				</h2>
			</div>

			<div class="mt-12 grid gap-8 md:grid-cols-2">
				{#each conferenceBenefits as benefit}
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
				{#each conferenceTimeline as item, index}
					<div class="flex gap-6">
						<div class="flex flex-col items-center">
							<span
								class="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold shadow-sm"
								style="background-color: {index === 0 ? '#2c3e50' : '#d4a574'}; color: white;"
							>
								{index + 1}
							</span>
							{#if index < conferenceTimeline.length - 1}
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

	<!-- ROI Section - UNIQUE TO CONFERENCE -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: white;">
		<div class="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
			<div class="text-center">
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					Retour sur investissement
				</p>
				<h2
					class="mt-4 text-2xl font-normal leading-[120%] tracking-tight md:text-3xl xl:text-4xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Gain de temps et d'efficacité mesurables
				</h2>
			</div>

			<div class="mt-12 rounded-3xl border border-[#e8dccf] bg-[#fff9f4] p-8 md:p-12">
				<div class="grid gap-8 md:grid-cols-3">
					<div class="text-center">
						<div class="mb-4 text-4xl font-bold" style="color: #d4a574;">-75%</div>
						<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
							Temps d'accueil
						</h3>
						<p
							class="text-sm leading-relaxed"
							style="color: #2c3e50; opacity: 0.85;"
						>
							Réduction du temps passé à l'accueil grâce au QR code. Vos participants trouvent leur place en 3 secondes au lieu de chercher sur un panneau.
						</p>
					</div>
					<div class="text-center">
						<div class="mb-4 text-4xl font-bold" style="color: #d4a574;">0</div>
						<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
							Réimpression
						</h3>
						<p
							class="text-sm leading-relaxed"
							style="color: #2c3e50; opacity: 0.85;"
						>
							Plus besoin de réimprimer les plans de table à chaque changement. Les modifications sont instantanées et visibles par tous en ligne.
						</p>
					</div>
					<div class="text-center">
						<div class="mb-4 text-4xl font-bold" style="color: #d4a574;">100%</div>
						<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
							Image professionnelle
						</h3>
						<p
							class="text-sm leading-relaxed"
							style="color: #2c3e50; opacity: 0.85;"
						>
							Votre événement garde une image moderne et soignée. Le QR code remplace élégamment les panneaux encombrants et les listes papier.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Enterprise Use Cases Section - UNIQUE TO CONFERENCE -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: #fafafa;">
		<div class="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
			<div class="text-center">
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					Cas d'usage entreprise
				</p>
				<h2
					class="mt-4 text-2xl font-normal leading-[120%] tracking-tight md:text-3xl xl:text-4xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Idéal pour tous vos événements professionnels
				</h2>
			</div>

			<div class="mt-12 grid gap-6 md:grid-cols-2">
				<div
					class="rounded-2xl border border-[#e8dccf] bg-white p-6 shadow-sm"
				>
					<div class="mb-4 text-3xl">💼</div>
					<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
						Conférences et colloques
					</h3>
					<p
						class="mb-4 text-sm leading-relaxed"
						style="color: #2c3e50; opacity: 0.85;"
					>
						Pour vos conférences de 100 à 500 participants. Gestion des tables par thématique, par entreprise, ou par affinités. Le QR code permet un accueil fluide et professionnel.
					</p>
					<p class="text-xs font-medium" style="color: #d4a574;">
						Idéal pour 100-500 participants
					</p>
				</div>
				<div
					class="rounded-2xl border border-[#e8dccf] bg-white p-6 shadow-sm"
				>
					<div class="mb-4 text-3xl">🎯</div>
					<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
						Séminaires d'entreprise
					</h3>
					<p
						class="mb-4 text-sm leading-relaxed"
						style="color: #2c3e50; opacity: 0.85;"
					>
						Pour vos séminaires internes ou clients. Organisation par équipes, par départements, ou tables de networking. Personnalisation avec votre charte graphique.
					</p>
					<p class="text-xs font-medium" style="color: #d4a574;">
						Idéal pour 50-200 participants
					</p>
				</div>
				<div
					class="rounded-2xl border border-[#e8dccf] bg-white p-6 shadow-sm"
				>
					<div class="mb-4 text-3xl">🏢</div>
					<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
						Événements clients
					</h3>
					<p
						class="mb-4 text-sm leading-relaxed"
						style="color: #2c3e50; opacity: 0.85;"
					>
						Pour vos lancements produits, soirées clients, ou événements de networking. Image professionnelle garantie, accueil soigné, gestion simplifiée.
					</p>
					<p class="text-xs font-medium" style="color: #d4a574;">
						Idéal pour 50-300 participants
					</p>
				</div>
				<div
					class="rounded-2xl border border-[#e8dccf] bg-white p-6 shadow-sm"
				>
					<div class="mb-4 text-3xl">🎓</div>
					<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
						Formations et workshops
					</h3>
					<p
						class="mb-4 text-sm leading-relaxed"
						style="color: #2c3e50; opacity: 0.85;"
					>
						Pour vos formations professionnelles, workshops, ou ateliers. Organisation par groupes de travail, par niveau, ou tables de discussion.
					</p>
					<p class="text-xs font-medium" style="color: #d4a574;">
						Idéal pour 20-100 participants
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Integration Section - UNIQUE TO CONFERENCE -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: white;">
		<div class="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
			<div class="text-center">
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					Intégration facile
				</p>
				<h2
					class="mt-4 text-2xl font-normal leading-[120%] tracking-tight md:text-3xl xl:text-4xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					S'intègre parfaitement à votre workflow
				</h2>
			</div>

			<div class="mt-12 space-y-6">
				<div
					class="flex gap-4 rounded-2xl border border-[#e8dccf] bg-[#fff9f4] p-6"
				>
					<div class="flex-shrink-0">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full text-xl"
							style="background-color: #d4a574; color: white;"
						>
							📊
						</div>
					</div>
					<div>
						<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
							Import depuis Excel
						</h3>
						<p
							class="text-sm leading-relaxed md:text-base"
							style="color: #2c3e50; opacity: 0.85;"
						>
							Importez directement votre liste de participants depuis Excel ou Google Sheets. Format simple : nom, table, place. Pas besoin de reformater vos données.
						</p>
					</div>
				</div>
				<div
					class="flex gap-4 rounded-2xl border border-[#e8dccf] bg-[#fff9f4] p-6"
				>
					<div class="flex-shrink-0">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full text-xl"
							style="background-color: #d4a574; color: white;"
						>
							📧
						</div>
					</div>
					<div>
						<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
							Partage dans vos emails
						</h3>
						<p
							class="text-sm leading-relaxed md:text-base"
							style="color: #2c3e50; opacity: 0.85;"
						>
							Intégrez le lien ou le QR code dans vos emails de confirmation, vos invitations, ou sur votre site événement. Un seul lien pour tous vos participants.
						</p>
					</div>
				</div>
				<div
					class="flex gap-4 rounded-2xl border border-[#e8dccf] bg-[#fff9f4] p-6"
				>
					<div class="flex-shrink-0">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full text-xl"
							style="background-color: #d4a574; color: white;"
						>
							💼
						</div>
					</div>
					<div>
						<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
							Charte graphique entreprise
						</h3>
						<p
							class="text-sm leading-relaxed md:text-base"
							style="color: #2c3e50; opacity: 0.85;"
						>
							Personnalisez la page avec votre logo, vos couleurs corporate, et vos messages. La page reflète l'identité de votre entreprise pour une cohérence visuelle totale.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: #fafafa;">
		<div class="mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12">
			<h2
				class="text-2xl font-normal leading-[120%] tracking-tight md:text-3xl"
				style="color: #2c3e50; font-family: 'Playfair Display', serif;"
			>
				Prêt à simplifier votre plan de table conférence ?
			</h2>
			<p
				class="mt-4 text-sm leading-relaxed md:text-base"
				style="color: #2c3e50; opacity: 0.85;"
			>
				Créez votre événement en 5 minutes, personnalisez la page, recevez votre QR code. Vos participants trouveront leur table en 3 secondes, votre événement démarrera à l'heure.
			</p>
			<div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
				<a href="/auth">
					<Button
						class="h-12 rounded-xl px-8 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105"
						style="background-color: #d4a574; border: none;"
					>
						Créez votre plan de table conférence
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
					Tout ce que vous voulez savoir sur le plan de table conférence
				</h2>
			</div>

			<div class="mt-12 space-y-4">
				{#each conferenceFaq as faqItem}
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
	<section class="border-t py-16 sm:py-20 md:py-24" style="background-color: #fff9f4; border-color: #f0e8df;">
		<div class="mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12">
			<h2
				class="text-2xl font-normal leading-[120%] tracking-tight md:text-3xl"
				style="color: #2c3e50; font-family: 'Playfair Display', serif;"
			>
				Organisez votre conférence sereinement
			</h2>
			<p
				class="mt-4 text-sm leading-relaxed md:text-base"
				style="color: #2c3e50; opacity: 0.85;"
			>
				Rejoignez les organisateurs qui ont choisi PLACEMOI pour simplifier leur plan de table conférence. Créez votre événement dès maintenant.
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

