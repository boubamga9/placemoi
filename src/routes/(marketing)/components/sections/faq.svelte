<script lang="ts">
	import {
		Collapsible,
		CollapsibleContent,
		CollapsibleTrigger,
	} from '$lib/components/ui/collapsible';
	import { ChevronDown } from 'lucide-svelte';

	// FAQ data - facile à modifier et ajouter
	const faqItems = [
		{
			question: 'Combien de temps ça prend pour créer mon événement ?',
			answer:
				"Environ 5 minutes ! Créez votre événement, importez votre liste d'invités (CSV ou manuellement), et recevez immédiatement votre QR code et votre lien partageable.",
		},
		{
			question: 'Comment mes invités trouvent-ils leur table ?',
			answer:
				"Vos invités scannent simplement le QR code que vous affichez à l'entrée ou suivent le lien. Ils tapent leur nom, et le système leur indique leur table et leur place en un instant.",
		},
		{
			question: "Combien d'invités puis-je ajouter ?",
			answer:
				"Jusqu'à 500 invités par événement. Vous pouvez importer votre liste via un fichier CSV ou les ajouter un par un.",
		},
		{
			question: "Puis-je personnaliser l'apparence de la page ?",
			answer:
				'Absolument ! Choisissez les couleurs, ajoutez une image de fond ou un logo pour que la page corresponde à votre événement.',
		},
		{
			question: 'Combien ça coûte ?',
			answer:
				"29,99€ par événement, paiement unique. Aucun abonnement, aucune limite de durée. Vous gardez l'accès à votre événement tant que vous en avez besoin.",
		},
		{
			question: "Puis-je modifier ma liste d'invités après paiement ?",
			answer:
				'Oui, vous pouvez ajouter, modifier ou supprimer des invités à tout moment depuis votre tableau de bord.',
		},
	];
</script>

<section id="faq" class="py-16 sm:py-20 md:py-24" style="background-color: #FFF9F4;">
	<div class="mx-auto max-w-4xl px-6">
		<!-- Header -->
		<div class="mb-16 text-center">
			<h2
				class="mb-4 text-2xl font-normal leading-[120%] tracking-tight lg:text-3xl xl:text-4xl"
				style="color: #2C3E50; font-family: 'Playfair Display', serif;"
			>
				Questions fréquentes
			</h2>
			<p class="text-lg lg:text-xl" style="color: #2C3E50; opacity: 0.9;">
				Tout ce que vous voulez savoir sur PLACEMOI
			</p>
		</div>

		<!-- FAQ Accordions -->
		<div class="space-y-4">
			{#each faqItems as faqItem}
				<Collapsible
					class="rounded-lg border border-neutral-200 bg-white shadow-sm"
				>
					<CollapsibleTrigger
						class="flex w-full items-center justify-between p-6 text-left transition-colors"
						style="hover:background-color: #F5E6D3;"
					>
						<h3
							class="flex-1 break-words pr-4 text-lg font-medium lg:text-xl"
							style="color: #2C3E50;"
						>
							{faqItem.question}
						</h3>
						<ChevronDown
							class="h-5 w-5 flex-shrink-0 transition-transform duration-200"
							style="color: #2C3E50; opacity: 0.7;"
						/>
					</CollapsibleTrigger>
					<CollapsibleContent class="px-6 pb-6">
						<p
							class="text-base leading-relaxed lg:text-lg"
							style="color: #2C3E50; opacity: 0.9;"
						>
							{faqItem.answer}
						</p>
					</CollapsibleContent>
				</Collapsible>
			{/each}
		</div>

		<!-- CTA sous la FAQ -->
		<div class="mt-16 text-center">
			<p class="mb-6 text-lg font-medium lg:text-xl" style="color: #2C3E50;">
				Vous avez d'autres questions ?
			</p>
			<a
				href="/contact"
				class="inline-flex items-center justify-center rounded-xl border-2 bg-transparent px-8 py-4 text-base font-medium transition-all duration-200"
				style="border-color: #D4A574; color: #D4A574;"
				on:mouseover={(e) => {
					e.currentTarget.style.backgroundColor = '#D4A574';
					e.currentTarget.style.color = 'white';
				}}
				on:mouseout={(e) => {
					e.currentTarget.style.backgroundColor = 'transparent';
					e.currentTarget.style.color = '#D4A574';
				}}
			>
				Contactez-nous
			</a>
		</div>
	</div>
</section>
