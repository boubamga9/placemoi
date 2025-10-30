<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let error = $page.error;
	$: status = error?.status || 404;
	$: message = error?.message || 'Événement non trouvé';
</script>

<svelte:head>
	<title>Événement non trouvé - PLACEMOI</title>
</svelte:head>

<div
	class="flex min-h-screen flex-col items-center justify-center px-4 py-12"
	style="background-color: #FFF9F4;"
>
	<div class="mx-auto max-w-md text-center">
		<!-- Icon -->
		<div class="mb-6 flex justify-center">
			<div
				class="rounded-full bg-white p-4 shadow-lg"
				style="background-color: #FFF9F4; border: 2px solid #D4A574;"
			>
				<svg
					class="h-16 w-16"
					style="color: #D4A574;"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
					/>
				</svg>
			</div>
		</div>

		<!-- Title -->
		<h1
			class="mb-4 text-4xl font-medium"
			style="color: #2C3E50; font-family: 'Playfair Display', serif;"
		>
			Événement non trouvé
		</h1>

		<!-- Message -->
		<p class="mb-8 text-lg" style="color: #2C3E50; opacity: 0.8;">
			{#if status === 404}
				Cet événement n'existe pas ou n'est plus disponible.
			{:else}
				Une erreur s'est produite. Veuillez réessayer plus tard.
			{/if}
		</p>

		<!-- Actions -->
		<div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
			<button
				on:click={() => goto('/')}
				class="rounded-xl px-6 py-3 font-medium shadow-lg transition-all duration-200 hover:scale-105"
				style="background-color: #D4A574; color: white; border: none;"
			>
				Retour à l'accueil
			</button>
		</div>

		<!-- Optional: Help text -->
		<div class="mt-8 text-sm" style="color: #2C3E50; opacity: 0.6;">
			Si vous pensiez que cette page devrait exister, vérifiez l'URL avec
			l'organisateur de l'événement.
		</div>
	</div>
</div>
