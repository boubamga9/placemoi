<script lang="ts">
	import GuestFooter from '../components/guest-footer.svelte';
	import type { Database } from '$lib/database/database.types';

	type EventCustomization =
		Database['public']['Tables']['event_customizations']['Row'];

	type Guest = {
		guest_name: string;
		table_number: string;
		seat_number: string | null;
	};

	export let data: {
		event: Database['public']['Tables']['events']['Row'];
		customization: EventCustomization;
		guests: Guest[];
		hasPhotosPlan: boolean;
	};

	let searchTerm = '';
	let result: { table_number: string; seat_number: string | null } | null =
		null;
	let suggestions: Array<{ name: string }> = [];
	let selectedIndex = -1;
	let showSuggestions = false;
	let _isLoading = false;

	// 🚀 OPTIMIZATION: Preloaded guests data (loaded once, searched in-memory)
	const guestsData = data.guests || [];

	// Seuil pour basculer vers l'API si trop d'invités (évite de surcharger le navigateur)
	const IN_MEMORY_SEARCH_THRESHOLD = 2000;
	const useInMemorySearch = guestsData.length < IN_MEMORY_SEARCH_THRESHOLD;

	// Fonction pour déterminer le fallback CSS approprié selon le type de police
	function getFontFallback(fontFamily: string): string {
		const serifFonts = [
			'Playfair Display',
			'Crimson Pro',
			'Cormorant Garamond',
			'Lora',
		];
		const scriptFonts = ['Dancing Script', 'Great Vibes'];

		if (serifFonts.includes(fontFamily)) {
			return 'serif';
		} else if (scriptFonts.includes(fontFamily)) {
			return 'cursive';
		} else {
			return 'sans-serif';
		}
	}

	// Compute background style
	$: backgroundStyle = `background-color: ${data.customization.background_color};${
		data.customization.background_image_url
			? ` background-image: url('${data.customization.background_image_url}'); background-size: cover; background-position: center;`
			: ''
	}`;

	// 🚀 OPTIMIZATION: Search adaptatif (mémoire si < 2000, API sinon)
	async function searchGuest() {
		// Require at least 3 characters to start searching
		const trimmedTerm = searchTerm.trim();
		if (!trimmedTerm || trimmedTerm.length < 3) {
			result = null;
			suggestions = [];
			showSuggestions = false;
			return;
		}

		// Si < 2000 invités : recherche en mémoire (instantané)
		if (useInMemorySearch) {
			const searchLower = trimmedTerm.toLowerCase();
			const matchingGuests = guestsData
				.filter((guest) => guest.guest_name.toLowerCase().includes(searchLower))
				.slice(0, 10); // Limit to 10 suggestions

			if (matchingGuests.length > 0) {
				suggestions = matchingGuests.map((g) => ({ name: g.guest_name }));
				showSuggestions = true;
				result = null;
			} else {
				suggestions = [];
				showSuggestions = false;
				result = null;
			}
		} else {
			// Si >= 2000 invités : recherche via API (évite de surcharger le navigateur)
			_isLoading = true;
			try {
				const response = await fetch(
					`/api/events/${data.event.id}/search-autocomplete?name=${encodeURIComponent(trimmedTerm)}`,
				);
				const searchData = await response.json();

				if (searchData.success && searchData.guests) {
					suggestions = searchData.guests;
					showSuggestions = suggestions.length > 0;
					result = null;
				} else {
					suggestions = [];
					showSuggestions = false;
					result = null;
				}
			} catch (error) {
				console.error('Error searching for guest:', error);
				suggestions = [];
				showSuggestions = false;
				result = null;
			} finally {
				_isLoading = false;
			}
		}
	}

	// 🚀 OPTIMIZATION: Find guest (mémoire si < 2000, API sinon)
	async function selectGuest(guestName: string) {
		searchTerm = guestName;
		suggestions = [];
		showSuggestions = false;

		// Si < 2000 invités : recherche en mémoire (instantané)
		if (useInMemorySearch) {
			const guest = guestsData.find(
				(g) => g.guest_name.toLowerCase() === guestName.toLowerCase(),
			);

			if (guest) {
				result = {
					table_number: guest.table_number,
					seat_number: guest.seat_number,
				};
			} else {
				result = null;
			}
		} else {
			// Si >= 2000 invités : recherche via API
			_isLoading = true;
			try {
				const response = await fetch(
					`/api/events/${data.event.id}/search?name=${encodeURIComponent(guestName)}`,
				);
				const searchData = await response.json();

				if (searchData.success && searchData.guest) {
					result = {
						table_number: searchData.guest.table_number,
						seat_number: searchData.guest.seat_number,
					};
				} else {
					result = null;
				}
			} catch (error) {
				console.error('Error searching for guest:', error);
				result = null;
			} finally {
				_isLoading = false;
			}
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (!showSuggestions || suggestions.length === 0) return;

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, -1);
		} else if (event.key === 'Enter' && selectedIndex >= 0) {
			event.preventDefault();
			selectGuest(suggestions[selectedIndex].name);
		}
	}
</script>

<svelte:head>
	<title
		>{data.customization.welcome_text || 'Bienvenue'} - {data.event
			.event_name}</title
	>
</svelte:head>

<div
	class="flex min-h-screen flex-col items-center justify-between"
	style={backgroundStyle}
>
	<div class="flex w-full flex-1 items-center justify-center">
		<div class="container mx-auto max-w-2xl px-4 py-12">
			<!-- Logo (if exists) -->
			{#if data.customization.logo_url}
				<div class="flex justify-center">
					<img
						src={data.customization.logo_url}
						alt="Logo"
						class="h-32 w-auto object-contain"
					/>
				</div>
			{/if}

			<!-- Welcome Section -->
			<div class="mb-8 text-center">
				<h1
					class="mb-4 text-5xl font-medium"
					style="
						color: {data.customization.font_color};
						font-family: '{data.customization.font_family ||
						'Playfair Display'}', {getFontFallback(
						data.customization.font_family || 'Playfair Display',
					)};
					"
				>
					{data.customization.welcome_text || 'Bienvenue'}
				</h1>
				<p
					class="text-xl"
					style="color: {data.customization
						.font_color}; opacity: 0.9; font-family: '{data.customization
						.font_family || 'Playfair Display'}', {getFontFallback(
						data.customization.font_family || 'Playfair Display',
					)};"
				>
					{data.customization.subtitle_text || 'Trouvez votre place'}
				</p>
			</div>

			<!-- Search Section -->
			<div id="guest-search-section" class="mb-6">
				<div class="relative">
					<input
						id="guest-search"
						type="text"
						bind:value={searchTerm}
						on:input={searchGuest}
						on:keydown={handleKeyDown}
						placeholder="Tapez votre nom..."
						class="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					{#if showSuggestions && suggestions.length > 0}
						<div
							class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-neutral-200 bg-white shadow-lg"
						>
							{#each suggestions as suggestion, index}
								<button
									type="button"
									on:click={() => selectGuest(suggestion.name)}
									class="w-full px-4 py-2 text-left text-base transition-colors hover:bg-neutral-50 {selectedIndex ===
									index
										? 'bg-neutral-50'
										: ''}"
									on:mouseenter={() => (selectedIndex = index)}
								>
									{suggestion.name}
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Result Section (always reserve space) -->
			<div class="min-h-[220px]">
				{#if result}
					<div
						class="rounded-xl p-6 shadow-lg"
						style="background-color: {data.customization.font_color};"
					>
						<div class="text-center">
							<div
								class="mb-2 text-sm font-medium uppercase"
								style="color: {data.customization
									.background_color}; opacity: 0.8;"
							>
								Table
							</div>
							<div
								class="mb-4 text-5xl font-bold"
								style="color: {data.customization.background_color};"
							>
								{result.table_number}
							</div>
							{#if result.seat_number}
								<div
									class="text-base"
									style="color: {data.customization
										.background_color}; opacity: 0.8;"
								>
									Place {result.seat_number}
								</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
	<GuestFooter
		customization={data.customization}
		fontFallback={getFontFallback}
		buttons={
			data.hasPhotosPlan
				? [
						{
							label: 'Envoyer des photos',
							href: `/${data.event.slug}/photos`,
							variant: 'solid',
						},
					]
				: []
		}
	/>
</div>
