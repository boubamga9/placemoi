<!-- Wedding Planners CTA Section -->
<section
	class="relative w-full border-y py-12 sm:py-16 md:py-20"
	style="background-color: #2C3E50; border-color: #3A4E66;"
>
	<!-- Content -->
	<div
		class="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12"
	>
		<div
			class="mx-auto inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
			style="border-color: #d4a574; background-color: rgba(212, 165, 116, 0.1); color: #d4a574;"
		>
			💼 Pour les professionnels
		</div>
		<h2
			class="mt-6 text-2xl font-normal leading-[120%] tracking-tight md:text-3xl"
			style="color: white; font-family: 'Playfair Display', serif;"
		>
			Vous êtes wedding planner ?
		</h2>
		<p
			class="mt-4 text-base leading-relaxed md:text-lg"
			style="color: white; opacity: 0.85;"
		>
			Gérez plusieurs mariages simultanément, économisez du temps et proposez un
			service premium à vos clients.
		</p>
		<div class="mt-8">
			<a
				href="/wedding-planners"
				class="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105"
				style="background-color: #D4A574;"
				on:mouseover={(e) =>
					(e.currentTarget.style.backgroundColor = '#C49863')}
				on:mouseout={(e) => (e.currentTarget.style.backgroundColor = '#D4A574')}
				on:focus={(e) => (e.currentTarget.style.backgroundColor = '#C49863')}
				on:blur={(e) => (e.currentTarget.style.backgroundColor = '#D4A574')}
			>
				Découvrir PLACEMOI pour les wedding planners
			</a>
		</div>
	</div>
</section>
