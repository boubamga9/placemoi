<script lang="ts">
	import { WebsiteName } from '../../../config';

	const storyReasons = [
		{
			title: 'Garder un décor élégant',
			description:
				'Le panneau de 400 noms devenait illisible. On voulait préserver l’esthétique du lieu sans compromettre la lisibilité.',
		},
		{
			title: 'Fluidifier l’expérience invitée',
			description:
				'Chaque invité devait trouver sa table en quelques secondes, sans files d’attente ni stress à l’entrée.',
		},
		{
			title: 'Simplifier la préparation',
			description:
				'Importer les invités, personnaliser le message et partager un QR code devait devenir un jeu d’enfant.',
		},
	];

	const timeline = [
		{
			title: 'Le casse‑tête initial',
			tag: 'Aux origines',
			description:
				'Créatrice de panneaux événementiels, je devais concevoir un plan pour 400 personnes. Trop de noms, trop d’infos : le rendu devenait illisible.',
		},
		{
			title: 'Une question simple',
			tag: 'Point de bascule',
			description:
				'Comment présenter tous ces invités en restant élégante et claire ? La réponse s’est dessinée en observant les invités scanner un QR code déco.',
		},
		{
			title: 'Le prototype PlaceMoi',
			tag: 'Premiers tests',
			description:
				'J’ai imaginé une page invitée personnalisable, un QR code unique et un tableau de bord pour tout orchestrer sans stress.',
		},
		{
			title: 'La plateforme d’aujourd’hui',
			tag: 'Ce que c’est devenu',
			description:
				'PlaceMoi accompagne désormais mariages, galas, séminaires… pour que chaque événement reste fluide et mémorable.',
		},
	];

	const teamValues = [
		{
			title: 'Design & cohérence',
			description:
				'Du dashboard au panneau d’accueil, tout est pensé pour se fondre dans votre univers graphique.',
		},
		{
			title: 'Technologie invisible',
			description:
				'Le QR code et la recherche envoyée aux invités sont intuitifs, rapides et accessibles sur tous les écrans.',
		},
		{
			title: 'Accompagnement sincère',
			description:
				'On reste joignables avant, pendant et après votre événement. PlaceMoi c’est une équipe, pas seulement un outil.',
		},
	];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		name: 'À propos de PlaceMoi',
		description:
			'Découvrez l’histoire de PlaceMoi : née d’un plan de table ingérable, la plateforme aide les organisateurs à offrir une expérience fluide, élégante et moderne.',
	};
</script>

<svelte:head>
	<title
		>À propos de {WebsiteName} - Notre histoire | Plan de table événement en ligne</title
	>
	<meta
		name="description"
		content="Découvrez l'histoire de PLACEMOI : née d'un plan de table ingérable, notre plateforme aide les organisateurs d'événements (mariages, anniversaires, conférences, séminaires) à offrir une expérience fluide et moderne à leurs invités."
	/>
	<meta
		name="keywords"
		content="à propos placemoi, histoire placemoi, qui sommes nous, plan de table événement, solution plan de table, organisation événement, QR code événement, placement invités"
	/>
	<meta
		property="og:title"
		content="À propos de {WebsiteName} - Notre histoire | Plan de table événement"
	/>
	<meta
		property="og:description"
		content="Découvrez l'histoire de PLACEMOI : née d'un plan de table ingérable, notre plateforme aide les organisateurs d'événements à offrir une expérience fluide et moderne à leurs invités."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://placemoi.com/about" />
	<meta property="og:image" content="/images/logo_text.svg" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href="https://placemoi.com/about" />
	<script type="application/ld+json">
		{JSON.stringify(structuredData)}
	</script>
</svelte:head>

<main class="flex flex-col">
	<section class="w-full" style="background-color: #fff9f4;">
		<div
			class="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-20 pt-32 sm:px-8 md:flex-row md:items-center md:justify-between md:gap-16 lg:px-12"
		>
			<div class="max-w-2xl text-center md:text-left">
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					Notre histoire
				</p>
				<h1
					class="mt-4 text-3xl font-normal leading-[120%] tracking-tight md:text-4xl xl:text-5xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					L’origine de Placemoi
				</h1>
				<p
					class="mt-6 text-base leading-[160%] md:text-lg"
					style="color: #2c3e50; opacity: 0.85;"
				>
					PlaceMoi est né d’un constat très simple : un plan de table peut vite
					se transformer en casse-tête. Face à un mariage de 400 invités, il
					fallait une solution élégante, lisible et moderne pour guider chacun —
					sans sacrifier le décor ni multiplier les supports.
				</p>
			</div>

			<div
				class="mx-auto w-full max-w-md rounded-3xl border border-[#d4a574] bg-white p-8 shadow-lg md:mx-0"
			>
				<h2
					class="text-center text-lg font-semibold uppercase tracking-[0.2em] md:text-left"
					style="color: #2c3e50;"
				>
					Le déclic
				</h2>
				<p
					class="mt-4 text-sm leading-relaxed md:text-base"
					style="color: #2c3e50; opacity: 0.85;"
				>
					« Et si les invités retrouvaient leur place en scannant simplement un
					QR code ? »
				</p>
				<p
					class="mt-4 text-sm leading-relaxed md:text-base"
					style="color: #2c3e50; opacity: 0.85;"
				>
					De cette intuition est née une plateforme intuitive qui marie design,
					innovation et praticité — pour faciliter la vie des organisateurs et
					rendre l’expérience invitée fluide.
				</p>
			</div>
		</div>
	</section>

	<section
		class="border-y py-16 sm:py-20 md:py-24"
		style="background-color: white; border-color: #f0e8df;"
	>
		<div class="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
			<div class="mt-12 grid gap-12 md:grid-cols-[3fr,2fr] md:items-start">
				<div class="space-y-6">
					<h2
						class="text-2xl font-normal leading-[120%] tracking-tight md:text-3xl"
						style="color: #2c3e50; font-family: 'Playfair Display', serif;"
					>
						Pourquoi on a créé PlaceMoi
					</h2>
					<p
						class="text-sm leading-relaxed md:text-base"
						style="color: #2c3e50; opacity: 0.85;"
					>
						En concevant ce fameux panneau de mariage, on s’est heurtés à une
						évidence : les solutions existantes n’étaient ni assez modernes, ni
						assez simples pour respecter la scénographie du jour J.
					</p>
					<p
						class="text-sm leading-relaxed md:text-base"
						style="color: #2c3e50; opacity: 0.85;"
					>
						Plutôt que de multiplier les outils, nous avons réuni tout ce qui
						fait gagner du temps aux organisateurs — et ce qui rassure les
						invités — dans une seule expérience.
					</p>
				</div>
				<div class="rounded-3xl border border-[#e8dccf] bg-white p-6 shadow-sm">
					<h3
						class="text-sm font-semibold uppercase tracking-[0.15em]"
						style="color: #2c3e50; opacity: 0.8;"
					>
						Ce que nous voulions résoudre
					</h3>
					<ul class="mt-5 space-y-4">
						{#each storyReasons as reason}
							<li
								class="flex gap-3 text-sm leading-relaxed md:text-base"
								style="color: #2c3e50; opacity: 0.9;"
							>
								<span
									class="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs"
									style="background-color: #d4a574; color: white;"
								>
									✓
								</span>
								<div>
									<strong
										class="block text-sm font-semibold md:text-base"
										style="color: #2c3e50;"
									>
										{reason.title}
									</strong>
									<span
										class="block text-sm md:text-base"
										style="color: #2c3e50; opacity: 0.85;"
										>{reason.description}</span
									>
								</div>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</section>

	<section class="py-16 sm:py-20 md:py-24" style="background-color: #fafaFA;">
		<div class="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
			<div class="rounded-3xl border border-[#e8dccf] bg-white p-8 shadow-sm">
				<div class="md:flex md:items-start md:justify-between">
					<div>
						<h2
							class="text-2xl font-normal leading-[120%] tracking-tight md:text-3xl"
							style="color: #2c3e50; font-family: 'Playfair Display', serif;"
						>
							Une histoire en mouvement
						</h2>
						<p
							class="mt-3 text-sm leading-relaxed md:text-base"
							style="color: #2c3e50; opacity: 0.85;"
						>
							Suis notre ligne du temps : de la première intuition aux
							événements que nous accompagnons aujourd’hui.
						</p>
					</div>
				</div>
				<div class="mt-12 space-y-10">
					{#each timeline as item, index (item.title)}
						{@const isFirst = index === 0}
						{@const isLast = index === timeline.length - 1}
						<div class="flex gap-6 md:gap-8">
							<div class="relative flex flex-col items-center">
								<span
									class="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold shadow-sm"
									style="background-color: {isFirst
										? '#2c3e50'
										: '#d4a574'}; color: white;"
								>
									{index + 1}
								</span>
								{#if !isLast}
									<span class="mt-2 h-full w-px flex-1 bg-[#f0e8df]"></span>
								{/if}
							</div>
							<div>
								<p
									class="text-xs font-semibold uppercase tracking-[0.2em]"
									style="color: #2c3e50; opacity: 0.6;"
								>
									{item.tag}
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
		</div>
	</section>

	<section class="bg-white py-16 sm:py-20 md:py-24">
		<div class="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
			<div class="text-center md:text-left">
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					Nos convictions
				</p>
				<h2
					class="mt-4 text-2xl font-normal leading-[120%] tracking-tight md:text-3xl xl:text-4xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Pourquoi PlaceMoi te facilite la vie
				</h2>
			</div>
			<div class="mt-10 grid gap-6 md:grid-cols-3">
				{#each teamValues as item}
					<div class="rounded-3xl border border-[#e8dccf] bg-[#fff9f4] p-6">
						<h3 class="text-base font-semibold" style="color: #2c3e50;">
							{item.title}
						</h3>
						<p
							class="mt-3 text-sm leading-relaxed md:text-base"
							style="color: #2c3e50; opacity: 0.85;"
						>
							{item.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="relative overflow-hidden bg-white py-16 sm:py-20 md:py-24">
		<div
			class="absolute inset-0 bg-gradient-to-br from-[#fff9f4] via-white to-white opacity-70"
		></div>
		<div class="relative mx-auto max-w-4xl px-6 sm:px-8 lg:px-12">
			<div
				class="rounded-3xl border border-[#e8dccf] bg-white/50 p-8 text-center shadow-sm backdrop-blur-sm"
			>
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					La vision PlaceMoi
				</p>
				<blockquote
					class="mt-6 text-lg leading-relaxed md:text-xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					« On ne voulait plus choisir entre un bel accueil et une organisation
					efficace. PlaceMoi est né pour que les organisateurs retrouvent de la
					sérénité et que les invités vivent un moment fluide. »
				</blockquote>
				<p
					class="mt-6 text-sm leading-relaxed md:text-base"
					style="color: #2c3e50; opacity: 0.75;"
				>
					Nous continuons d’améliorer la plateforme avec les retours de la
					communauté : chaque événement nous inspire une nouvelle attention.
				</p>
			</div>
		</div>
	</section>

	<section class="bg-[#fff9f4] py-16 sm:py-20 md:py-24">
		<div class="mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12">
			<h2
				class="text-2xl font-normal leading-[120%] tracking-tight md:text-3xl"
				style="color: #2c3e50; font-family: 'Playfair Display', serif;"
			>
				Prêt·e à écrire la suite de ton histoire ?
			</h2>
			<p
				class="mt-4 text-sm leading-relaxed md:text-base"
				style="color: #2c3e50; opacity: 0.85;"
			>
				PlaceMoi te permet de guider tes invités en toute simplicité, de
				partager un QR code unique et de collecter leurs souvenirs sans stress.
				On t’accompagne à chaque étape.
			</p>
			<div
				class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
			>
				<a
					href="/auth"
					class="inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02]"
					style="background-color: #d4a574;"
				>
					Créer mon événement
				</a>
				<a
					href="/pricing"
					class="inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold transition-colors duration-200"
					style="border: 1px solid #2c3e50; color: #2c3e50;"
				>
					Découvrir nos plans
				</a>
			</div>
		</div>
	</section>

	<!-- Liens internes contextuels -->
	<div
		class="px-6 pb-10 text-center text-sm sm:px-8 lg:px-12"
		style="color:#2c3e50; opacity:.8;"
	>
		Découvrir nos <a href="/pricing" class="underline">tarifs</a> ou poser une
		question via la
		<a href="/contact" class="underline">page contact</a>.
	</div>
</main>
