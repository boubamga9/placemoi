<!-- CTA Section -->
<div
	class="flex flex-col items-center justify-center border-t border-neutral-200 px-6 py-16 text-center sm:py-20 md:py-24"
	style="background-color: #FFF9F4;"
>
	<h2
		class="mb-6 text-2xl font-normal leading-[120%] tracking-tight lg:text-3xl xl:text-4xl"
		style="color: #2C3E50; font-family: 'Playfair Display', serif;"
	>
		Prêt à organiser votre événement ?
	</h2>
	<p
		class="mb-8 max-w-2xl text-center text-lg sm:text-xl lg:text-xl"
		style="color: #2C3E50;"
	>
		Organisez le placement de vos invités en quelques minutes<br />et offrez une
		expérience fluide à vos invités.
	</p>
	<div class="flex flex-col items-center gap-4 md:flex-row md:gap-6">
		<a
			href="/auth"
			class="inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-medium text-white shadow-lg transition-all duration-200 hover:scale-105"
			style="width: 280px; height: 56px; background-color: #D4A574;"
			on:mouseover={(e) => (e.currentTarget.style.backgroundColor = '#C49863')}
			on:mouseout={(e) => (e.currentTarget.style.backgroundColor = '#D4A574')}
			on:focus={(e) => (e.currentTarget.style.backgroundColor = '#C49863')}
			on:blur={(e) => (e.currentTarget.style.backgroundColor = '#D4A574')}
		>
			Créer mon plan de table
		</a>
	</div>
	<p class="mt-4 text-sm font-light" style="color: #2C3E50; opacity: 0.8;">
		✔️ <strong>24,99€</strong> par événement • Paiement unique • QR code + lien inclus
	</p>
</div>
