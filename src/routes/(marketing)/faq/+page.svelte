<script lang="ts">
	import { WebsiteName } from '../../../config';
	import {
		Collapsible,
		CollapsibleContent,
		CollapsibleTrigger,
	} from '$lib/components/ui/collapsible';
	import { ChevronDown } from 'lucide-svelte';

	const faqSections = [
		{
			id: 'general',
			title: 'Général',
			items: [
				{
					question: 'Comment fonctionne Placemoi ?',
					answer:
						"Créez votre événement, importez votre liste d'invités (CSV ou manuel) puis personnalisez la page invitée. Vous recevez automatiquement un QR code et un lien à partager. Vos invités recherchent leur nom et découvrent leur table en quelques secondes.",
				},
				{
					question: 'Combien de temps faut-il pour être opérationnel ?',
					answer:
						"La majorité des couples mettent moins de 10 minutes : import de la liste, vérification des tables, personnalisation rapide et tout est prêt pour être partagé.",
				},
				{
					question: 'Combien d\'invités puis-je gérer ?',
					answer:
						'Placemoi prend en charge jusqu’à 500 invités par événement. Si vous avez un besoin plus important, écrivez-nous et nous ouvrons la limite ensemble.',
				},
				{
					question: 'Puis-je modifier ma liste après le paiement ?',
					answer:
						'Oui, la liste des invités, les tables et le contenu de la page invitée peuvent être ajustés sans limite jusqu’au jour J.',
				},
			],
		},
		{
			id: 'guests',
			title: 'Expérience invités',
			items: [
				{
					question: 'Comment les invités accèdent-ils à leur table ?',
					answer:
						'Affichez le QR code à l’entrée ou envoyez-leur le lien. Ils le scannent, tapent leur nom et voient immédiatement leur table (et leur place si vous l’avez précisée).',
				},
				{
					question: 'Les invités doivent-ils installer une application ?',
					answer:
						'Aucune installation requise. La page invitée est responsive et fonctionne sur tous les téléphones, tablettes ou ordinateurs.',
				},
				{
					question: 'Puis-je personnaliser l’apparence de la page invitée ?',
					answer:
						'Oui : logo, image de fond, couleurs, polices, textes d’accueil… La page se met à vos couleurs pour rester cohérente avec votre papeterie.',
				},
			],
		},
		{
			id: 'photos',
			title: 'Collecte de photos',
			items: [
				{
					question: 'Comment fonctionne la collecte de photos ?',
					answer:
						"En plus de la recherche de table, les invités peuvent déposer leurs photos depuis le même QR code. Vous retrouvez ensuite toutes les images dans votre espace organisateur.",
				},
				{
					question: 'Les photos sont-elles sécurisées ?',
					answer:
						'Toutes les photos sont hébergées de façon sécurisée. Seul l’organisateur peut les télécharger ou les supprimer.',
				},
				{
					question: 'Puis-je activer la collecte plus tard ?',
					answer:
						'Oui, vous pouvez commencer avec le plan Placement et ajouter la collecte de photos quand vous êtes prêts depuis votre tableau de bord.',
				},
			],
		},
		{
			id: 'pricing',
			title: 'Tarifs & paiement',
			items: [
				{
					question: 'Comment fonctionne la tarification ?',
					answer:
						'Chaque plan est facturé par événement : 49,99€ pour le plan Placement, 99,99€ pour Placement + Photos. Vous payez une seule fois pour activer l’ensemble des fonctionnalités jusqu’au jour J.',
				},
				{
					question: 'Quels moyens de paiement acceptez-vous ?',
					answer:
						'Les paiements se font en ligne par carte bancaire via Stripe (Visa, Mastercard, etc.). Le paiement est sécurisé et instantané.',
				},
				{
					question: 'La TVA est-elle incluse ?',
					answer:
						'Oui, les prix affichés incluent la TVA française. Une facture est automatiquement envoyée après paiement.',
				},
			],
		},
		{
			id: 'support',
			title: 'Support & accompagnement',
			items: [
				{
					question: 'Comment puis-je vous contacter ?',
					answer:
						'Vous pouvez nous écrire à tout moment via le formulaire de contact. Nous répondons sous 24h (souvent plus rapidement).',
				},
				{
					question: 'Proposez-vous une aide à la mise en place ?',
					answer:
						'Nous avons des tutoriels pas-à-pas et des guides rapides pour importer votre liste ou personnaliser la page. Besoin d’un coup de main ? Contactez-nous et nous vous accompagnons.',
				},
				{
					question: 'Puis-je tester avant de payer ?',
					answer:
						'Vous pouvez créer un événement, importer quelques invités et visualiser la page avant de régler. Le paiement est demandé uniquement pour activer le partage auprès de vos invités.',
				},
			],
		},
	];

	const faqStructuredData = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqSections.flatMap((section) =>
			section.items.map((item) => ({
				'@type': 'Question',
				name: item.question,
				acceptedAnswer: {
					'@type': 'Answer',
					text: item.answer,
				},
			})),
		),
	};
</script>

<svelte:head>
	<title>{WebsiteName} - FAQ</title>
	<meta
		name="description"
		content="Toutes les réponses sur Placemoi : fonctionnement, expérience invités, collecte de photos, tarifs et support. Préparez votre événement en toute confiance."
	/>
	<script type="application/ld+json">
		{JSON.stringify(faqStructuredData)}
	</script>
</svelte:head>

<main class="flex flex-col">
	<section
		class="w-full"
		style="background-color: #fff9f4;"
	>
		<div
			class="mx-auto flex max-w-5xl flex-col gap-10 px-6 pb-20 pt-28 sm:px-8 md:flex-row md:items-center md:justify-between md:gap-16 lg:px-12"
		>
			<div class="max-w-2xl text-center md:text-left">
				<p
					class="text-sm font-semibold uppercase tracking-[0.3em]"
					style="color: #d4a574;"
				>
					Foire aux questions
				</p>
				<h1
					class="mt-4 text-3xl font-normal leading-[120%] tracking-tight md:text-4xl xl:text-5xl"
					style="color: #2c3e50; font-family: 'Playfair Display', serif;"
				>
					On répond à toutes vos questions sur Placemoi
				</h1>
				<p
					class="mt-6 text-base leading-[160%] md:text-lg"
					style="color: #2c3e50; opacity: 0.85;"
				>
					Retrouvez ici les informations essentielles pour préparer votre événement
					et faire vivre la meilleure expérience à vos invités.
				</p>
			</div>

			<div class="mx-auto w-full max-w-md rounded-3xl border border-[#d4a574] bg-white p-8 shadow-lg md:mx-0">
				<h2
					class="text-lg font-semibold"
					style="color: #2c3e50;"
				>
					Par où commencer ?
				</h2>
				<p
					class="mt-3 text-sm leading-relaxed md:text-base"
					style="color: #2c3e50; opacity: 0.85;"
				>
					Créez gratuitement votre événement, importez quelques invités et testez la page invitée.
					Le paiement est demandé uniquement lorsque vous êtes prêts à partager.
				</p>
				<a
					href="/auth"
					class="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl px-6 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02]"
					style="background-color: #d4a574;"
				>
					Créer mon événement
				</a>
			</div>
		</div>
	</section>

	<nav
		class="border-y py-10"
		style="background-color: white; border-color: #f0e8df;"
	>
		<div class="mx-auto flex max-w-5xl flex-wrap justify-center gap-4 px-6 text-sm font-semibold md:text-base">
			{#each faqSections as section}
				<a
					href={`#${section.id}`}
					class="rounded-full border px-5 py-2 transition-colors duration-200"
					style="border-color: #d4a574; color: #2c3e50;"
				>
					{section.title}
				</a>
			{/each}
		</div>
	</nav>

	<section class="py-16 sm:py-20 md:py-24" style="background-color: #fafaFA;">
		<div class="mx-auto flex max-w-5xl flex-col gap-16 px-6 sm:px-8 lg:px-12">
			{#each faqSections as section}
				<div id={section.id} class="scroll-mt-24 space-y-8">
					<div class="text-center">
						<h2
							class="text-2xl font-normal leading-[120%] tracking-tight md:text-3xl"
							style="color: #2c3e50; font-family: 'Playfair Display', serif;"
						>
							{section.title}
						</h2>
					</div>
					<div class="space-y-4">
						{#each section.items as item}
							<Collapsible class="rounded-2xl border border-[#e8dccf] bg-white shadow-sm">
								<CollapsibleTrigger
									class="flex w-full items-center justify-between p-6 text-left transition-colors"
								>
									<h3
										class="flex-1 pr-4 text-lg font-medium md:text-xl"
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
										class="text-sm leading-relaxed md:text-base"
										style="color: #2c3e50; opacity: 0.85;"
									>
										{item.answer}
									</p>
								</CollapsibleContent>
							</Collapsible>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section class="bg-white py-16 sm:py-20 md:py-24">
		<div class="mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12">
			<h2
				class="text-2xl font-normal leading-[120%] tracking-tight md:text-3xl"
				style="color: #2c3e50; font-family: 'Playfair Display', serif;"
			>
				Vous n’avez pas trouvé la réponse ?
			</h2>
			<p
				class="mt-4 text-sm leading-relaxed md:text-base"
				style="color: #2c3e50; opacity: 0.85;"
			>
				Écrivez-nous via le formulaire de contact ou sur Instagram. Nous serons ravis de vous guider pour que votre événement reste un moment fluide et mémorable.
			</p>
			<div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
				<a
					href="/contact"
					class="inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02]"
					style="background-color: #2c3e50;"
				>
					Contacter l’équipe Placemoi
				</a>
				<a
					href="https://www.instagram.com/placemoi"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold transition-colors duration-200"
					style="border: 1px solid #d4a574; color: #d4a574;"
				>
					Nous suivre sur Instagram
				</a>
			</div>
		</div>
	</section>
</main>

