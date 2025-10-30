<script lang="ts">
	// Pain points data - facile à modifier et ajouter
	const painPoints = [
		{
			bgColor: '#F5E6D3',
			rotation: '-5deg',
			text: '📋 Vos invités vous appellent ou vous envoient des messages<br /><br />→ "A quelle table je suis ?" 😫',
		},
		{
			bgColor: '#E8DCCF',
			rotation: '5deg',
			text: '📝 Afficher un tableau géant avec tous les noms<br /><br />→ vos invités ne sont pas à un concours, ni à une école 😅',
		},
		{
			bgColor: '#E6D8C8',
			rotation: '5deg',
			text: '📱 Créer un plan papier<br /><br />→ ça se salit, ça s&#39;égare, et surtout... pas d&#39;effet waouw 😴',
		},
	];
</script>

<section class="w-full" style="background-color: #FEFEFE;">
	<div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
		<!-- Left side - Sticky title -->
		<div
			class="sticky top-0 flex h-screen items-center justify-center p-4 text-center lg:justify-start lg:p-8 lg:pl-16 lg:text-left"
		>
			<h2
				class="z-10 text-2xl font-normal leading-[120%] tracking-tight lg:text-3xl xl:text-4xl"
				style="color: #2C3E50; font-family: 'Playfair Display', serif;"
			>
				Organiser le placement de vos invités<br />c&#39;est
				<span class="font-bold" style="color: #D4A574;">facile</span> maintenant.
			</h2>
		</div>

		<!-- Right side - Scrolling cards -->
		<div class="grid gap-4 p-2 sm:gap-6 sm:p-4 lg:gap-8 lg:p-6 lg:pl-2">
			{#each painPoints as painPoint}
				<!-- Card 1 -->
				<figure class="z-20 grid h-screen place-content-center">
					<div
						class="flex h-[280px] w-[320px] items-center justify-center rounded-lg p-6 text-center transition-all duration-300 sm:h-[300px] sm:w-[350px] sm:p-7 lg:h-[340px] lg:w-[430px] lg:p-8"
						style="background-color: {painPoint.bgColor}; transform: rotate({painPoint.rotation});"
					>
						<p
							class="text-base font-light leading-tight sm:text-lg lg:text-lg xl:text-xl"
							style="color: #2C3E50; font-size: 24px; line-height: 120%;"
						>
							{@html painPoint.text}
						</p>
					</div>
				</figure>
			{/each}
			<!-- Reassuring message at the end -->
			<figure class="z-20 grid h-[70vh] place-content-center">
				<div class="flex items-center justify-center text-center">
					<p
						class="text-xl font-normal sm:text-2xl lg:text-3xl"
						style="color: #2C3E50;"
					>
						Il y a une solution simple.. 😊
					</p>
				</div>
			</figure>
		</div>
	</div>
</section>
