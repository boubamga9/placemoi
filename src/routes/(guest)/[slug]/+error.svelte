<script lang="ts">
	import { page } from '$app/stores';

	// Extract status and error from page store
	$: status = $page.status;
	$: error = $page.error;

	// Extract event info from error if available (only for 410)
	$: eventName = error && typeof error === 'object' ? (error.eventName || null) : null;
	$: eventDate = error && typeof error === 'object' ? (error.eventDate || null) : null;

	// Determine if it's a 404 (not found) or 410 (expired)
	$: isNotFound = status === 404;
	$: isExpired = status === 410;

	function formatDate(dateString: string | null): string {
		if (!dateString) return '';
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString('fr-FR', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch {
			return dateString;
		}
	}
</script>

<svelte:head>
	<title>{isNotFound ? 'Événement introuvable' : 'Événement expiré'} - PLACEMOI</title>
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center px-6 py-12"
	style="background-color: #FFF9F4;"
>
	<div class="container mx-auto max-w-2xl text-center">
		<!-- Icon -->
		<div
			class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
			style="background-color: #F5E6D3;"
		>
			{#if isNotFound}
				<!-- Icon for 404: Not found -->
				<svg
					class="h-10 w-10"
					style="color: #9B4A4A;"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			{:else}
				<!-- Icon for 410: Expired -->
				<svg
					class="h-10 w-10"
					style="color: #9B4A4A;"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			{/if}
		</div>

		<!-- Title -->
		<h1
			class="mb-4 text-3xl font-normal lg:text-4xl"
			style="color: #2C3E50; font-family: 'Playfair Display', serif;"
		>
			{#if isNotFound}
				Cet événement n'existe pas
			{:else if isExpired}
				Cet événement n'est plus accessible
			{:else}
				Une erreur est survenue
			{/if}
		</h1>

		<!-- Description -->
		<div class="mb-8 space-y-3">
			{#if isNotFound}
				<p class="text-lg leading-relaxed" style="color: #2C3E50; opacity: 0.8;">
					Désolé, nous n'avons pas trouvé d'événement correspondant à ce lien.
					Vérifiez que l'URL est correcte ou contactez l'organisateur de l'événement.
				</p>
			{:else if isExpired}
				<p class="text-lg leading-relaxed" style="color: #2C3E50; opacity: 0.8;">
					Cet événement n'est plus disponible. Les événements restent accessibles
					pendant 5 jours après la date prévue.
				</p>

				{#if eventName}
					<div
						class="mx-auto max-w-md rounded-lg border p-4"
						style="background-color: #F5E6D3; border-color: #E5E5E5;"
					>
						<p class="text-sm font-medium" style="color: #2C3E50; opacity: 0.9;">
							Événement :
						</p>
						<p class="mt-1 text-base font-semibold" style="color: #2C3E50;">
							{eventName}
						</p>
						{#if eventDate}
							<p class="mt-2 text-sm" style="color: #2C3E50; opacity: 0.7;">
								Date : {formatDate(eventDate)}
							</p>
						{/if}
					</div>
				{/if}
			{:else}
				<p class="text-lg leading-relaxed" style="color: #2C3E50; opacity: 0.8;">
					{error?.message || 'Une erreur inattendue est survenue.'}
				</p>
			{/if}
		</div>

		<!-- Contact info -->
		{#if isNotFound || isExpired}
			<p class="text-sm" style="color: #2C3E50; opacity: 0.6;">
				Pour toute question, contactez l'organisateur de l'événement.
			</p>
		{/if}
	</div>
</div>
