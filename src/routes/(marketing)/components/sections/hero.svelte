<script lang="ts">
	const heroImageUrl =
		'https://res.cloudinary.com/dv7gvfcof/image/upload/v1763033544/qr_code_placemoi_exemple1_wyzizr.png';
</script>

<div
	class="flex min-h-screen w-full items-center justify-center px-6 pt-32 pb-20 sm:px-8 sm:pt-20 lg:px-12"
	style="background-color: #FFF9F4;"
>
	<div
		class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2"
	>
		<!-- Text content -->
		<div class="text-center lg:text-left">
			<h1
				class="text-3xl font-bold leading-[120%] md:text-4xl lg:text-5xl"
				style="color: #2C3E50; font-family: 'Playfair Display', serif;"
			>
				Organisez le placement <br class="hidden sm:block" />de vos invités<br
					class="block sm:hidden"
				/><br class="hidden sm:block" /> en quelques minutes.
			</h1>

			<p
				class="my-6 text-base leading-[160%] md:text-lg"
				style="color: #2C3E50;"
			>
				Importez votre liste. Recevez votre QR code et votre lien<br
					class="hidden md:block"
				/>
				partageable. Vos invités trouvent leur place en 3 secondes.
			</p>

			<div class="flex justify-center lg:justify-start">
				<a
					href="/auth"
					class="mb-4 inline-block flex h-14 w-[270px] items-center justify-center rounded-xl text-base text-white shadow-lg transition-all duration-200 hover:scale-105"
					style="background-color: #D4A574;"
					on:mouseover={(e) =>
						(e.currentTarget.style.backgroundColor = '#C49863')}
					on:mouseout={(e) =>
						(e.currentTarget.style.backgroundColor = '#D4A574')}
					on:focus={(e) => (e.currentTarget.style.backgroundColor = '#C49863')}
					on:blur={(e) => (e.currentTarget.style.backgroundColor = '#D4A574')}
				>
					Créer mon plan de table
				</a>
			</div>

			<p class="text-sm font-light" style="color: #2C3E50; opacity: 0.8;">
				✔️ QR code + lien partageable • <strong>à partir de 49,99€</strong> par événement
			</p>
		</div>

		<!-- Image on mobile (below text) -->
		<div class="block lg:hidden">
			<img
				src={heroImageUrl}
				alt="Interface de gestion des événements"
				class="mx-auto w-3/4 max-w-md rounded-2xl border-2 border-[#D4A574]"
				loading="eager"
			/>
		</div>

		<!-- Image on desktop -->
		<div class="hidden lg:block">
			<img
				src={heroImageUrl}
				alt="Interface de gestion des événements"
				class="mx-auto w-3/4 max-w-lg rounded-2xl border-2 border-[#D4A574]"
				loading="eager"
			/>
		</div>
	</div>
</div>
