<script lang="ts">
	import { WebsiteName } from '../../../config';
	import { Button } from '$lib/components/ui/button';
	import {
		Collapsible,
		CollapsibleContent,
		CollapsibleTrigger,
	} from '$lib/components/ui/collapsible';
	import { ChevronDown } from 'lucide-svelte';

	const baptismPainPoints = [
		{
			icon: '🍼',
			title: 'Panneaux illisibles et encombrants',
			description:
				"Vous avez famille proche, parrains/marraines et invités? Le panneau avec tous les noms devient illisible et casse l'esthétique du lieu.",
		},
		{
			icon: '🔄',
			title: "Changements de dernière minute",
			description:
				"Un invité en plus, un autre en moins... Vous devez réimprimer les plans. Le stress monte à l'approche du jour J.",
		},
		{
			icon: '⏰',
			title: "Files d'attente à l'entrée",
			description:
				"Tout le monde cherche son nom au même endroit. L'entrée devient un embouteillage alors que vous voulez accueillir sereinement.",
		},
	];

	const baptismBenefits = [
		{
			icon: '🎯',
			title: 'Rapide et clair',
			description:
				'Un QR code discret remplace le panneau géant. Les invités scannent et trouvent leur table en 3 secondes.',
		},
		{
			icon: '🎨',
			title: '100% personnalisable',
			description:
				"Logo, couleurs, message d'accueil: créez une page invitée à l'image de votre baptême.",
		},
		{
			icon: '📸',
			title: 'Souvenirs partagés',
			description:
				"Collecte des photos depuis le même QR code pour rassembler les beaux moments de la journée.",
		},
		{
			icon: '🔄',
			title: "Modifiable jusqu'au jour J",
			description:
				'Vous ajustez en ligne, les invités voient automatiquement la mise à jour. Plus de réimpression.',
		},
	];

	const baptismTimeline = [
		{
			time: '1 mois avant',
			title: 'Créez votre événement',
			description:
				"Importez votre liste d'invités (Excel ou manuel). Organisez vos tables par familles, parrains et marraines.",
		},
		{
			time: '2 semaines avant',
			title: 'Personnalisez la page',
			description:
				"Ajoutez le prénom de l'enfant, vos couleurs et un message d'accueil. La page reflète l'identité de votre baptême.",
		},
		{
			time: '1 semaine avant',
			title: 'Partagez le QR code',
			description:
				"Recevez votre QR code et votre lien unique. Partagez-les avec vos invités par email, sur les réseaux sociaux, ou affichez le QR code à l'entrée.",
		},
		{
			time: 'Jour J',
			title: 'Profitez sereinement',
			description:
				"Les invités scannent, trouvent leur table, s'installent. Vous profitez du moment en famille. Les photos arrivent automatiquement dans votre album.",
		},
	];

	const baptismFaq = [
		{
			question: 'Peut-on gérer des places assises précises ?',
			answer:
				'Oui. Vous pouvez indiquer la table et éventuellement la place. Les invités voient l’information immédiatement.',
		},
		{
			question: "Faut-il une application côté invité ?",
			answer:
				"Non. Ils scannent le QR code avec l'appareil photo de leur téléphone et arrivent sur la page invitée.",
		},
		{
			question: "Puis-je modifier jusqu'au dernier moment ?",
			answer:
				"Oui, vous pouvez ajuster la liste et les tables jusqu'au jour J. Les changements sont instantanés.",
		},
		{
			question: "Combien d'invités peut-on gérer ?",
			answer:
				'Jusqu’à 500 invités par événement. Contactez-nous si vous avez un besoin supérieur.',
		},
	];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'Plan de table baptême en ligne - PLACEMOI',
		description:
			"Créez votre plan de table baptême en ligne avec QR code. Personnalisable, modifiable jusqu'au jour J. Pour 30 à 200 invités.",
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
		content="Créez votre plan de table baptême en ligne en 5 minutes. QR code élégant, page personnalisable, modifications jusqu'au jour J. Pour 30 à 200 invités. À partir de 49,99€."
	/>
	<meta
		name="keywords"
		content="plan de table baptême, placement invités baptême, QR code baptême, organisation baptême, plan de table baptême en ligne, application baptême, logiciel baptême, liste invités baptême, accueil invités baptême, idées plan de table baptême"
	/>
	<meta
		property="og:title"
		content="Plan de table baptême en ligne | QR code + Placement invités - PLACEMOI"
	/>
	<meta
		property="og:description"
		content="Créez votre plan de table baptême en ligne. QR code élégant, page personnalisable, modifications jusqu'au jour J. Vos invités trouvent leur table en 3 secondes."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://placemoi.com/plan-de-table-bapteme" />
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
					Organisez l’accueil de vos invités de baptême en quelques minutes
				</h1>
				<p
					class="mt-6 text-base leading-[160%] md:text-lg"
					style="color: #2c3e50; opacity: 0.85;"
				>
					Fini les panneaux encombrants et les changements de dernière minute.
					Un QR code discret et une page invitée personnalisée guident vos
					invités immédiatement vers leur table.
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

	<!-- Use Cases - Baptême -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: white;">
		<div class="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
			<div class="text-center">
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					Cas d'usage réels
				</p>
				<h2
					class="mt-4 text-2xl font-normal leading-[120%] tracking-tight md:text-3xl xl:text-4xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Deux exemples concrets pour un baptême sans stress
				</h2>
			</div>

			<div class="mt-12 grid gap-8 md:grid-cols-2">
				<!-- Cas 1 -->
				<div class="rounded-3xl border border-[#e8dccf] bg-[#fff9f4] p-8">
					<h3 class="mb-2 text-xl font-semibold" style="color: #2c3e50;">
						Petit comité (40 invités) – Déjeuner de famille
					</h3>
					<p class="text-sm leading-relaxed" style="color: #2c3e50; opacity: 0.85;">
						Accueil dans une salle paroissiale, 6 tables de 6-8 personnes.
						Les invités scannent le QR code à l’entrée et trouvent immédiatement leur table. 
						Aucun panneau à imprimer, changement de dernière minute géré en ligne.
					</p>
					<div class="mt-6 grid grid-cols-2 gap-4 text-sm" style="color: #2c3e50;">
						<div class="rounded-xl bg-white p-4">
							<p class="opacity-70">Invités</p>
							<p class="text-lg font-semibold">40</p>
						</div>
						<div class="rounded-xl bg-white p-4">
							<p class="opacity-70">Tables</p>
							<p class="text-lg font-semibold">6</p>
						</div>
						<div class="rounded-xl bg-white p-4">
							<p class="opacity-70">Mise en place</p>
							<p class="text-lg font-semibold">10 min</p>
						</div>
						<div class="rounded-xl bg-white p-4">
							<p class="opacity-70">Réimpression</p>
							<p class="text-lg font-semibold" style="color:#d4a574;">0</p>
						</div>
					</div>
				</div>

				<!-- Cas 2 -->
				<div class="rounded-3xl border border-[#e8dccf] bg-[#fff9f4] p-8">
					<h3 class="mb-2 text-xl font-semibold" style="color: #2c3e50;">
						Groupe élargi (120 invités) – Salle de réception
					</h3>
					<p class="text-sm leading-relaxed" style="color: #2c3e50; opacity: 0.85;">
						Organisation par familles et parrains/marraines, 12 tables de 10 personnes.
						Le QR code fluidifie l’arrivée, et la personnalisation (prénom de l’enfant, couleurs) 
						offre un rendu élégant. Ajustements possibles jusqu’au matin même.
					</p>
					<div class="mt-6 grid grid-cols-2 gap-4 text-sm" style="color: #2c3e50;">
						<div class="rounded-xl bg-white p-4">
							<p class="opacity-70">Invités</p>
							<p class="text-lg font-semibold">120</p>
						</div>
						<div class="rounded-xl bg-white p-4">
							<p class="opacity-70">Tables</p>
							<p class="text-lg font-semibold">12</p>
						</div>
						<div class="rounded-xl bg-white p-4">
							<p class="opacity-70">Temps accueil</p>
							<p class="text-lg font-semibold">-70%</p>
						</div>
						<div class="rounded-xl bg-white p-4">
							<p class="opacity-70">Appels le jour J</p>
							<p class="text-lg font-semibold" style="color:#d4a574;">0</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Pain Points -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: white;">
		<div class="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
			<div class="text-center">
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					Les problèmes fréquents
				</p>
				<h2
					class="mt-4 text-2xl font-normal leading-[120%] tracking-tight md:text-3xl xl:text-4xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Pourquoi un plan de table numérique pour un baptême ?
				</h2>
			</div>

			<div class="mt-12 grid gap-8 md:grid-cols-2">
				{#each baptismPainPoints as point}
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
							<p
								class="text-sm leading-relaxed md:text-base"
								style="color: #2c3e50; opacity: 0.85;"
							>
								{point.description}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Benefits -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: #fff9f4;">
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
					Votre plan de table baptême, simplifié
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
		</div>
	</section>

	<!-- Timeline -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: white;">
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

	<!-- Family Organization Section - UNIQUE TO BAPTISM -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: #fafafa;">
		<div class="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
			<div class="text-center">
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					Organisation par familles
				</p>
				<h2
					class="mt-4 text-2xl font-normal leading-[120%] tracking-tight md:text-3xl xl:text-4xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Organisez vos tables selon vos liens familiaux
				</h2>
			</div>

			<div class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<div class="rounded-2xl border border-[#e8dccf] bg-white p-6 shadow-sm">
					<div class="mb-4 text-3xl">👨‍👩‍👧‍👦</div>
					<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
						Famille proche
					</h3>
					<p
						class="text-sm leading-relaxed"
						style="color: #2c3e50; opacity: 0.85;"
					>
						Réservez une table pour les parents, grands-parents, frères et sœurs. La famille proche peut être ensemble pour partager ce moment important.
					</p>
				</div>
				<div class="rounded-2xl border border-[#e8dccf] bg-white p-6 shadow-sm">
					<div class="mb-4 text-3xl">👫</div>
					<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
						Parrains et marraines
					</h3>
					<p
						class="text-sm leading-relaxed"
						style="color: #2c3e50; opacity: 0.85;"
					>
						Placez les parrains et marraines à une table privilégiée, proche de la famille. Ils jouent un rôle central dans la cérémonie.
					</p>
				</div>
				<div class="rounded-2xl border border-[#e8dccf] bg-white p-6 shadow-sm">
					<div class="mb-4 text-3xl">👨‍👩‍👦‍👦</div>
					<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
						Famille élargie
					</h3>
					<p
						class="text-sm leading-relaxed"
						style="color: #2c3e50; opacity: 0.85;"
					>
						Organisez les oncles, tantes, cousins par branches familiales. Cela facilite les conversations et crée une ambiance chaleureuse.
					</p>
				</div>
				<div class="rounded-2xl border border-[#e8dccf] bg-white p-6 shadow-sm">
					<div class="mb-4 text-3xl">👥</div>
					<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
						Amis proches
					</h3>
					<p
						class="text-sm leading-relaxed"
						style="color: #2c3e50; opacity: 0.85;"
					>
						Regroupez les amis proches qui se connaissent. Une table dédiée aux amis permet des échanges détendus et joyeux.
					</p>
				</div>
				<div class="rounded-2xl border border-[#e8dccf] bg-white p-6 shadow-sm">
					<div class="mb-4 text-3xl">👶</div>
					<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
						Enfants et jeunes
					</h3>
					<p
						class="text-sm leading-relaxed"
						style="color: #2c3e50; opacity: 0.85;"
					>
						Si vous avez des enfants invités, regroupez-les à une table adaptée. Cela permet aux parents de profiter sereinement de la cérémonie.
					</p>
				</div>
				<div class="rounded-2xl border border-[#e8dccf] bg-white p-6 shadow-sm">
					<div class="mb-4 text-3xl">🤝</div>
					<h3 class="mb-2 text-lg font-semibold" style="color: #2c3e50;">
						Mix famille/amis
					</h3>
					<p
						class="text-sm leading-relaxed"
						style="color: #2c3e50; opacity: 0.85;"
					>
						Pour les baptêmes plus intimes, n'hésitez pas à mixer famille et amis proches. L'important est que chacun se sente à l'aise.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- FAQ -->
	<section class="py-16 sm:py-20 md:py-24" style="background-color: white;">
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
					Tout ce que vous voulez savoir sur le plan de table baptême
				</h2>
			</div>

			<div class="mt-12 space-y-4">
				{#each baptismFaq as faqItem}
					<Collapsible class="rounded-lg border border-[#e8dccf] bg-white shadow-sm">
						<CollapsibleTrigger class="flex w-full items-center justify-between p-6 text-left transition-colors">
							<h3 class="flex-1 break-words pr-4 text-lg font-medium lg:text-xl" style="color: #2c3e50;">
								{faqItem.question}
							</h3>
							<ChevronDown
								class="h-5 w-5 flex-shrink-0 transition-transform duration-200"
								style="color: #2c3e50; opacity: 0.7;"
							/>
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
			<h2
				class="text-2xl font-normal leading-[120%] tracking-tight md:text-3xl"
				style="color: #2c3e50; font-family: 'Playfair Display', serif;"
			>
				Organisez votre baptême sereinement
			</h2>
			<p
				class="mt-4 text-sm leading-relaxed md:text-base"
				style="color: #2c3e50; opacity: 0.85;"
			>
				Rejoignez les familles qui ont choisi PLACEMOI pour simplifier leur plan de table baptême. Créez votre événement dès maintenant.
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


