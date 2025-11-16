<script lang="ts">
	import { WebsiteName } from '../../../config';

	export let data: {
		plans: Array<{
			id: string;
			name: string;
			price: number;
			description: string;
			badge?: string;
			highlight?: string;
			features: string[];
			extras: string[];
			ctaLabel: string;
			ctaHref: string;
		}>;
	};

	const { plans } = data;

	const faqs = [
		{
			question: 'Comment se passe le paiement ?',
			answer:
				'Chaque plan est facturé par événement. Vous payez une seule fois pour activer la page invitée et profiter des fonctionnalités jusqu’au jour J.',
		},
		{
			question: 'Les photos sont-elles sécurisées ?',
			answer:
				'Toutes les photos sont hébergées de façon sécurisée. Seul l’organisateur peut les télécharger ou les supprimer.',
		},
	];

	let _offerStructuredDataJson = '';

	$: _offerStructuredDataJson = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: 'Placemoi',
		description:
			'Outil de placement et collecte de photos pour les événements et mariages.',
		offers: plans.map((plan) => ({
			'@type': 'Offer',
			name: plan.name,
			price: plan.price.toFixed(2),
			priceCurrency: 'EUR',
			availability: 'https://schema.org/InStock',
			url: `https://placemoi.com/pricing#${plan.id}`,
		})),
	});
</script>

<svelte:head>
	<title
		>Tarifs plan de table événement | {WebsiteName} - À partir de 49,99€ par événement</title
	>
	<meta
		name="description"
		content="Plan Placement 49,99€ | Plan Placement + Photos 99,99€. QR code, page personnalisée, collecte photos. Pour mariages, anniversaires, conférences, séminaires. Paiement unique par événement, sans abonnement."
	/>
	<meta
		name="keywords"
		content="tarif plan de table mariage, prix placement invités, coût QR code mariage, tarif collecte photos mariage, prix album photo collaboratif, plan de table pas cher, tarif plan de table événement, prix plan de table anniversaire, tarif plan de table conférence, prix plan de table séminaire, placemoi tarifs, plan de table mariage prix, QR code invités prix"
	/>
	<meta
		property="og:title"
		content="Tarifs plan de table événement | {WebsiteName} - À partir de 49,99€"
	/>
	<meta
		property="og:description"
		content="Plan Placement 49,99€ | Plan Placement + Photos 99,99€. QR code, page personnalisée, collecte photos. Pour mariages, anniversaires, conférences, séminaires. Paiement unique."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://placemoi.com/pricing" />
	<meta property="og:image" content="/images/logo_text.svg" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href="https://placemoi.com/pricing" />
	<script type="application/ld+json">
		{_offerStructuredDataJson}
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
					Tarifs Placemoi
				</p>
				<h1
					class="mt-4 text-3xl font-normal leading-[120%] tracking-tight md:text-4xl xl:text-5xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Choisissez l’offre qui correspond à votre événement
				</h1>
				<p
					class="mt-6 text-base leading-[160%] md:text-lg"
					style="color: #2c3e50; opacity: 0.85;"
				>
					Un QR code, une page invitée élégante, et désormais un album photo
					collaboratif. Vous payez par événement, sans abonnement caché.
				</p>
				<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
					<a
						href="/auth"
						class="inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02]"
						style="background-color: #d4a574;"
					>
						Créer mon événement
					</a>
					<a
						href="#plans"
						class="inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold transition-colors duration-200"
						style="color: #2c3e50; border: 1px solid #d4a574;"
					>
						Voir les plans en détail
					</a>
				</div>
			</div>

			<div
				class="mx-auto w-full max-w-md rounded-3xl border border-[#d4a574] bg-white p-8 shadow-lg md:mx-0"
			>
				<p
					class="text-sm font-semibold uppercase tracking-[0.2em]"
					style="color: #2c3e50;"
				>
					Inclus dans tous les plans
				</p>
				<ul class="mt-6 space-y-4 text-sm leading-relaxed md:text-base">
					<li class="flex gap-3" style="color: #2c3e50;">
						<span
							class="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold"
							style="background-color: #d4a574; color: white;">✓</span
						>
						Interface mobile-first pensée pour vos invités
					</li>
					<li class="flex gap-3" style="color: #2c3e50;">
						<span
							class="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold"
							style="background-color: #d4a574; color: white;">✓</span
						>
						Personnalisation complète (logo, couleurs, polices)
					</li>
					<li class="flex gap-3" style="color: #2c3e50;">
						<span
							class="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold"
							style="background-color: #d4a574; color: white;">✓</span
						>
						Assistance par e-mail avant et après le grand jour
					</li>
				</ul>
			</div>
		</div>
	</section>

	<section
		id="plans"
		class="py-16 sm:py-20 md:py-24"
		style="background-color: #fafaFA;"
	>
		<div class="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
			<div class="grid gap-8 lg:grid-cols-2">
				{#each plans as plan}
					<div
						class={`flex h-full flex-col rounded-3xl border bg-white ${plan.id === 'placement-photos' ? 'relative px-10 pb-10 pt-16 shadow-lg' : 'p-10 shadow-sm'}`}
						style={`border-color: ${plan.id === 'placement-photos' ? '#D4A574' : '#E8DCCF'};`}
					>
						<div class="space-y-6">
							<div>
								{#if plan.badge}
									<span
										class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
										style={`background-color: ${plan.id === 'placement-photos' ? 'transparent' : '#FFF1E0'}; color: ${plan.id === 'placement-photos' ? '#2C3E50' : '#D4A574'}; border: ${plan.id === 'placement-photos' ? '1px solid #2C3E50' : 'none'};`}
									>
										{plan.badge}
									</span>
								{/if}
								{#if plan.highlight}
									<span
										class="ml-3 inline-flex items-center rounded-full bg-[#FFF1E0] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
										style="color: #d4a574;"
									>
										{plan.highlight}
									</span>
								{/if}
								<h2
									class="mt-4 text-xl font-semibold leading-snug md:text-2xl"
									style="color: #2c3e50;"
								>
									{plan.name}
								</h2>
								<p
									class="mt-2 text-sm leading-relaxed md:text-base"
									style="color: #2c3e50; opacity: 0.8;"
								>
									{plan.description}
								</p>
							</div>

							<div>
								<span class="text-4xl font-bold" style="color: #2c3e50;"
									>{plan.price.toFixed(2)}€</span
								>
								<span class="ml-2 text-sm" style="color: #2c3e50; opacity: 0.6;"
									>/ événement</span
								>
							</div>

							<ul class="space-y-4 text-sm leading-relaxed md:text-base">
								{#each plan.features as feature}
									<li class="flex items-start gap-3" style="color: #2c3e50;">
										<span
											class="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold"
											style={`background-color: ${plan.id === 'placement-photos' ? '#2C3E50' : '#D4A574'}; color: white;`}
										>
											✓
										</span>
										<span>{feature}</span>
									</li>
								{/each}
							</ul>
						</div>

						{#if plan.extras.length > 0}
							<ul
								class="mt-6 space-y-3 text-sm leading-relaxed md:text-base"
								style="color: #2c3e50; opacity: 0.85;"
							>
								{#each plan.extras as extra}
									<li class="flex items-start gap-3">
										<span
											class="mt-1 inline-block h-2 w-2 rounded-full"
											style="background-color: #d4a574;"
										></span>
										{extra}
									</li>
								{/each}
							</ul>
						{/if}

						<a
							href={plan.ctaHref}
							class="mt-10 inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02]"
							style={`background-color: ${plan.id === 'placement-photos' ? '#2C3E50' : '#D4A574'};`}
						>
							{plan.ctaLabel}
						</a>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="bg-white py-16 sm:py-20 md:py-24">
		<div class="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
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
					On répond à vos interrogations avant de vous lancer
				</h2>
			</div>

			<div class="mt-12 space-y-6">
				{#each faqs as faq}
					<div class="rounded-2xl border border-[#e8dccf] bg-[#fff9f4] p-6">
						<h3
							class="text-lg font-semibold md:text-xl"
							style="color: #2c3e50;"
						>
							{faq.question}
						</h3>
						<p
							class="mt-3 text-sm leading-relaxed md:text-base"
							style="color: #2c3e50; opacity: 0.85;"
						>
							{faq.answer}
						</p>
					</div>
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

			<div
				class="mt-12 rounded-3xl border border-[#d4a574] bg-white p-8 text-center shadow-sm"
			>
				<h3
					class="text-xl font-semibold md:text-2xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Vous hésitez entre les deux plans ?
				</h3>
				<p
					class="mt-4 text-sm leading-relaxed md:text-base"
					style="color: #2c3e50; opacity: 0.85;"
				>
					Racontez-nous votre événement : on vous conseille en 24 heures sur la
					meilleure configuration.
				</p>
				<a
					href="/contact"
					class="mt-6 inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02]"
					style="background-color: #2c3e50;"
				>
					Contacter l’équipe Placemoi
				</a>
			</div>
		</div>
	</section>
</main>
