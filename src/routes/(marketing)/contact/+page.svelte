<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import ContactForm from './contact-form.svelte';
	import { WebsiteName } from '../../../config';

	export let data;

	const contactHighlights = [
		{
			title: 'Support pendant ton événement',
			description:
				'Besoin d’un réglage de dernière minute ou d’un coup de main pour ton plan de table ? On vérifie tout avec toi.',
		},
		{
			title: 'Comprendre toutes les fonctionnalités',
			description:
				'On te montre comment personnaliser la page invitée, partager le QR code et animer l’album photo collaboratif.',
		},
		{
			title: 'Questions tarifaires ou administratives',
			description:
				'Tu veux un devis, mettre à jour une facture ou prévoir plusieurs événements ? On t’accompagne étape par étape.',
		},
	];

	const commitments = [
		{
			title: 'Réponse sous 24h ouvrées',
			description:
				'On lit chaque message et on revient vers toi rapidement avec des réponses claires.',
		},
		{
			title: 'Equipe dédiée aux organisateurs',
			description:
				'Tu discutes directement avec des personnes qui utilisent Placemoi au quotidien.',
		},
		{
			title: 'Guides et ressources utiles',
			description:
				'On partage les tutos qui t’aident à avancer sans attendre notre retour.',
		},
	];

	const quickFaqs = [
		{
			question: 'Puis-je tester avant de payer ?',
			answer:
				'Oui, tu peux créer ton événement gratuitement, configurer ton plan de table et inviter quelques proches pour tester.',
		},
		{
			question: 'Comment prévenir les invités après modification du plan ?',
			answer:
				'Met à jour ton plan, puis partage à nouveau le lien ou le QR code : ils verront automatiquement la dernière version.',
		},
		{
			question: 'Proposez-vous une facture ou un devis ?',
			answer:
				'Bien sûr. Écris-nous simplement le nom de l’événement, les infos de facturation et on t’envoie le document rapidement.',
		},
		{
			question: 'Que se passe-t-il après mon événement ?',
			answer:
				'Tu gardes l’accès à ton tableau de bord pour télécharger les souvenirs et archiver les informations quand tu veux.',
		},
	];
</script>

<svelte:head>
	<title>{WebsiteName} - Contact</title>
	<meta
		name="description"
		content="Contactez l'équipe PLACEMOI pour toute question sur notre solution de placement d'invités pour vos événements."
	/>
	<meta
		name="keywords"
		content="contact, support, aide, événements, placement d'invités"
	/>
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
					Besoin d’un coup de main ?
				</p>
				<h1
					class="mt-4 text-3xl font-normal leading-[120%] tracking-tight md:text-4xl xl:text-5xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					On prend soin de ton événement comme si c’était le nôtre
				</h1>
				<p
					class="mt-6 text-base leading-[160%] md:text-lg"
					style="color: #2c3e50; opacity: 0.85;"
				>
					Écris-nous pour optimiser ton plan de table, rassurer tes invités ou
					préparer l’album photo collaboratif. On répond vite, sans jargon, avec
					des conseils prêts à être appliqués.
				</p>
			</div>

			<div
				class="mx-auto w-full max-w-md rounded-3xl border border-[#d4a574] bg-white p-8 shadow-lg md:mx-0"
			>
				<h2
					class="text-center text-lg font-semibold uppercase tracking-[0.2em] md:text-left"
					style="color: #2c3e50;"
				>
					Nos engagements
				</h2>
				<ul class="mt-6 space-y-4 text-left">
					{#each commitments as item}
						<li class="rounded-2xl bg-[#fff9f4] p-4">
							<h3 class="text-sm font-semibold" style="color: #2c3e50;">
								{item.title}
							</h3>
							<p
								class="mt-1 text-sm leading-relaxed"
								style="color: #2c3e50; opacity: 0.85;"
							>
								{item.description}
							</p>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<section
		class="border-y py-16 sm:py-20 md:py-24"
		style="background-color: white; border-color: #f0e8df;"
	>
		<div class="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
			<div class="text-center md:text-left">
				<h2
					class="text-2xl font-normal leading-[120%] tracking-tight md:text-3xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					Comment on t’aide concrètement
				</h2>
				<p
					class="mt-3 text-sm leading-relaxed md:text-base"
					style="color: #2c3e50; opacity: 0.85;"
				>
					On s’adapte à ton niveau d’avancement : que tu lances tout juste
					Placemoi ou que tu sois à quelques heures de l’événement.
				</p>
			</div>
			<div class="mt-10 grid gap-6 md:grid-cols-3">
				{#each contactHighlights as highlight}
					<div
						class="rounded-2xl border border-[#e8dccf] bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1"
					>
						<h3 class="text-base font-semibold" style="color: #2c3e50;">
							{highlight.title}
						</h3>
						<p
							class="mt-3 text-sm leading-relaxed"
							style="color: #2c3e50; opacity: 0.85;"
						>
							{highlight.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="py-16 sm:py-20 md:py-24" style="background-color: #fafaFA;">
		<div class="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
			<Card.Root
				class="mx-auto max-w-2xl rounded-3xl border border-[#e8dccf] bg-white shadow-sm"
			>
				<Card.Header class="text-center">
					<Card.Title
						tag="h2"
						class="text-2xl font-normal leading-[120%] tracking-tight lg:text-3xl"
						style="color: #2c3e50; font-family: 'Playfair Display', serif;"
						>Nous écrire</Card.Title
					>
					<Card.Description
						class="text-sm"
						style="color: #2c3e50; opacity: 0.9;"
						>Partage le contexte de ton événement et ce que tu veux accomplir.<br
						/> On te répond sous 24h ouvrées.</Card.Description
					>
				</Card.Header>
				<Card.Content class="flex flex-col gap-4">
					<ContactForm data={data.form} />
				</Card.Content>
			</Card.Root>
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
					On te répond avant même ton message
				</h2>
			</div>
			<div class="mt-12 space-y-6">
				{#each quickFaqs as faq}
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
					Explorer toutes les questions fréquentes
				</a>
			</div>
		</div>
	</section>
</main>
