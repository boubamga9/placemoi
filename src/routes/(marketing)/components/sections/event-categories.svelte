<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';

	const events = [
		{
			href: '/plan-de-table-mariage',
			emoji: '💍',
			title: 'Mariage',
			description:
				'Plan de table élégant pour votre mariage. QR code discret et personnalisation complète.',
			bgColor: '#F5E6D3',
		},
		{
			href: '/plan-de-table-anniversaire',
			emoji: '🎂',
			title: 'Anniversaire',
			description:
				"Organisez l'anniversaire parfait. Ambiance décontractée ou formelle, PLACEMOI s'adapte.",
			bgColor: '#E8DCCF',
		},
		{
			href: '/plan-de-table-bapteme',
			emoji: '👶',
			title: 'Baptême',
			description:
				'Organisation par familles pour votre baptême. Petit comité ou groupe élargi.',
			bgColor: '#F0E8DF',
		},
		{
			href: '/plan-de-table-conference',
			emoji: '📊',
			title: 'Conférence & Séminaire',
			description:
				"Solution professionnelle pour vos événements d'entreprise. ROI garanti et intégration facile.",
			bgColor: '#E6D8C8',
		},
		{
			href: '/plan-de-table-gala',
			emoji: '🎭',
			title: 'Gala',
			description:
				'Événements premium et galas caritatifs. Respect du protocole et organisation par catégories.',
			bgColor: '#F5E6D3',
		},
	];
</script>

<!-- Event Categories Section -->
<section class="py-16 sm:py-20 md:py-24" style="background-color: white;">
	<div class="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
		<div class="text-center">
			<p
				class="text-sm font-semibold uppercase tracking-[0.3em]"
				style="color: #d4a574;"
			>
				Pour tous vos événements
			</p>
			<h2
				class="mt-4 text-2xl font-normal leading-[120%] tracking-tight lg:text-3xl xl:text-4xl"
				style="color: #2C3E50; font-family: 'Playfair Display', serif;"
			>
				Choisissez votre type d'événement
			</h2>
			<p
				class="mt-6 text-base leading-relaxed md:text-lg"
				style="color: #2C3E50; opacity: 0.85;"
			>
				PLACEMOI s'adapte à tous vos événements, du mariage intime au gala
				premium.
			</p>
		</div>

		<div class="relative mt-12 px-8 md:px-0">
			<Carousel.Root
				opts={{
					align: 'start',
					loop: true,
				}}
				class="w-full"
			>
				<Carousel.Content class="-ml-2 pb-2 pt-2 md:-ml-4">
					{#each events as event}
						<Carousel.Item
							class="basis-full pl-2 sm:basis-1/2 md:pl-4 lg:basis-1/3"
						>
							<a
								href={event.href}
								class="group flex h-full flex-col rounded-2xl border border-[#e8dccf] bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
							>
								<div class="mb-4 flex justify-center">
									<div
										class="flex h-16 w-16 items-center justify-center rounded-full text-3xl transition-all duration-300 group-hover:scale-110"
										style="background-color: {event.bgColor};"
									>
										{event.emoji}
									</div>
								</div>
								<h3 class="mb-2 text-xl font-semibold" style="color: #2C3E50;">
									{event.title}
								</h3>
								<p
									class="mb-6 flex-grow text-sm leading-relaxed"
									style="color: #2C3E50; opacity: 0.8;"
								>
									{event.description}
								</p>
								<span
									class="inline-flex items-center justify-center rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-colors duration-200"
									style="border-color: #d4a574; color: #d4a574;"
								>
									En savoir plus
								</span>
							</a>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<Carousel.Previous
					class="absolute -left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 md:left-0 md:h-10 md:w-10 md:-translate-x-4"
					style="background-color: white; border-color: #e8dccf; box-shadow: 0 2px 8px rgba(0,0,0,0.1); z-index: 10;"
				/>
				<Carousel.Next
					class="absolute -right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 md:right-0 md:h-10 md:w-10 md:translate-x-4"
					style="background-color: white; border-color: #e8dccf; box-shadow: 0 2px 8px rgba(0,0,0,0.1); z-index: 10;"
				/>
			</Carousel.Root>
		</div>
	</div>
</section>
