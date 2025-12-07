<script lang="ts">
	// Solutions data - décrivant le processus
	const solutions = [
		{
			emoji: '📱',
			bgColor: '#F5E6D3',
			title: '1. Scanne',
			description: "Vos invités scannent le QR code à l'entrée",
		},
		{
			emoji: '🔍',
			bgColor: '#E8DCCF',
			title: '2. Recherche',
			description: 'Ils tapent leur nom et trouvent leur table',
		},
		{
			emoji: '🪑',
			bgColor: '#F0E8DF',
			title: '3. Installation',
			description: 'Ils se dirigent directement vers leur place',
		},
	];
</script>

<section class="py-16 sm:py-20 md:py-24" style="background-color: #FAFAFA;">
	<div class="mx-auto max-w-7xl px-6">
		<!-- Header -->
		<header class="mb-16 text-center">
			<h2
				class="mb-4 text-2xl font-normal leading-[120%] tracking-tight lg:text-3xl xl:text-4xl"
				style="color: #2C3E50; font-family: 'Playfair Display', serif;"
			>
				Vos invités trouvent leur place en <span
					class="font-bold"
					style="color: #D4A574;">un seul geste</span
				>
			</h2>
		</header>

		<!-- Solutions Cards -->
		<div class="grid gap-8 md:grid-cols-3 lg:gap-12">
			{#each solutions as solution}
				<div
					class="group rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:shadow-lg"
				>
					<div class="mb-6 flex justify-center">
						<div
							class="flex h-16 w-16 items-center justify-center rounded-full text-2xl transition-all duration-300 group-hover:scale-110"
							style="background-color: {solution.bgColor};"
						>
							{solution.emoji}
						</div>
					</div>
					<h4
						class="mb-4 text-lg font-medium lg:text-xl"
						style="color: #2C3E50;"
					>
						{solution.title}
					</h4>
					<p
						class="text-sm leading-relaxed lg:text-base"
						style="color: #2C3E50; opacity: 0.8;"
					>
						{solution.description}
					</p>
				</div>
			{/each}
		</div>

		<!-- Description sous les solutions -->
		<div class="mt-16 text-center">
			<p
				class="mx-auto max-w-3xl text-base leading-relaxed lg:text-lg"
				style="color: #2C3E50; opacity: 0.9;"
			>
				Créez votre plan de table, recevez un QR code et un lien partageable.
				Plus besoin de gérer les questions : vos invités se placent seuls, vous
				profitez de votre événement.
			</p>
		</div>
	</div>
</section>
