<script lang="ts">
	import GuestFooter from '../../components/guest-footer.svelte';
	import type { Database } from '$lib/database/database.types';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Trash2 } from 'lucide-svelte';

	type Event = Database['public']['Tables']['events']['Row'];
	type EventCustomization =
		Database['public']['Tables']['event_customizations']['Row'];

	type Photo = {
		id: string;
		fileName: string;
		fileType: string;
		uploadedAt: string;
		downloadUrl: string;
	};

	export let data: {
		event: Event;
		customization: EventCustomization;
	};

	let photos: Photo[] = [];
	let isLoadingPhotos = false;
	let lastFetchTime = 0;
	const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes

	// Générer ou récupérer un identifiant unique pour cet appareil
	function getDeviceId(): string {
		const STORAGE_KEY = `placemoi_device_id_${data.event.id}`;

		// Vérifier si localStorage est disponible
		if (typeof window === 'undefined' || !window.localStorage) {
			console.warn(
				"⚠️ localStorage non disponible, génération d'un device_id temporaire",
			);
			return `temp-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
		}

		let deviceId = localStorage.getItem(STORAGE_KEY);

		if (!deviceId) {
			// Générer un UUID simple (version simplifiée)
			deviceId = `device-${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
			try {
				localStorage.setItem(STORAGE_KEY, deviceId);
			} catch (e) {
				console.error('❌ Erreur lors de la sauvegarde du device_id:', e);
			}
		}

		return deviceId;
	}

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

	$: backgroundStyle = `background-color: ${data.customization.background_color};${
		data.customization.background_image_url
			? ` background-image: url('${data.customization.background_image_url}'); background-size: cover; background-position: center;`
			: ''
	}`;

	$: borderColor = data.customization.font_color || '#2C3E50';

	async function loadPhotos(forceRefresh = false) {
		if (isLoadingPhotos) return;

		// Vérifier le cache : ne pas recharger si on a déjà chargé récemment (sauf si forceRefresh)
		const now = Date.now();
		if (
			!forceRefresh &&
			photos.length > 0 &&
			now - lastFetchTime < CACHE_DURATION
		) {
			return;
		}

		isLoadingPhotos = true;
		try {
			const deviceId = getDeviceId();

			const response = await fetch(
				`/api/events/slug/${data.event.slug}/photos?device_id=${encodeURIComponent(deviceId)}`,
				{
					// Utiliser le cache HTTP si disponible (5 min)
					cache: forceRefresh ? 'no-cache' : 'default',
				},
			);

			if (response.ok) {
				const result = await response.json();
				if (result.success) {
					photos = result.photos || [];
					lastFetchTime = now;
				}
			} else {
				const errorText = await response.text();
				console.error('❌ Erreur API:', response.status, errorText);
			}
		} catch (error) {
			console.error('❌ Error loading photos:', error);
		} finally {
			isLoadingPhotos = false;
		}
	}

	async function deletePhoto(photoId: string) {
		try {
			const deviceId = getDeviceId();
			const response = await fetch(
				`/api/events/slug/${data.event.slug}/photos/${photoId}?device_id=${encodeURIComponent(deviceId)}`,
				{
					method: 'DELETE',
				},
			);

			if (response.ok) {
				// Retirer la photo de la liste localement
				photos = photos.filter((photo) => photo.id !== photoId);
				// Forcer le rafraîchissement du cache en rechargeant les photos
				lastFetchTime = 0;
				await loadPhotos(true);
			} else {
				const errorData = await response.json();
				alert(errorData.message || 'Erreur lors de la suppression de la photo');
			}
		} catch (error) {
			console.error('❌ Error deleting photo:', error);
			alert('Erreur lors de la suppression de la photo');
		}
	}

	onMount(() => {
		// Vérifier si on vient d'un upload (paramètre refresh=true dans l'URL)
		const shouldRefresh = $page.url.searchParams.get('refresh') === 'true';

		if (shouldRefresh) {
			// Forcer le rafraîchissement du cache après un upload
			loadPhotos(true);

			// Nettoyer l'URL en retirant le paramètre refresh
			const newUrl = new URL($page.url);
			newUrl.searchParams.delete('refresh');
			window.history.replaceState({}, '', newUrl.toString());
		} else {
			// Chargement normal avec cache
			loadPhotos();
		}
	});
</script>

<svelte:head>
	<title>Photos partagées - {data.event.event_name}</title>
</svelte:head>

<div class="flex h-screen flex-col overflow-hidden" style={backgroundStyle}>
	<!-- Header fixe : Logo et titre -->
	<div class="flex-shrink-0 py-4 sm:py-6">
		<div class="container mx-auto w-full max-w-4xl px-4">
			{#if data.customization.logo_url}
				<div class="mb-2 flex justify-center sm:mb-4">
					<img
						src={data.customization.logo_url}
						alt="Logo"
						class="h-20 w-auto object-contain sm:h-32"
					/>
				</div>
			{/if}

			<div class="text-center">
				<h1
					class="mb-2 text-3xl font-medium sm:mb-4 sm:text-4xl"
					style="
						color: {data.customization.font_color};
						font-family: '{data.customization.font_family ||
						'Playfair Display'}', {getFontFallback(
						data.customization.font_family || 'Playfair Display',
					)};
					"
				>
					Photos partagées
				</h1>
			</div>
		</div>
	</div>

	<!-- Zone fixe : Titre -->
	{#if !isLoadingPhotos && photos.length > 0}
		<div class="flex-shrink-0 px-4 pb-2">
			<div class="container mx-auto w-full max-w-4xl">
				<p
					class="text-center text-sm font-medium sm:text-base"
					style="color: {data.customization.font_color}; opacity: 0.9;"
				>
					Vos photos partagées ({photos.length})
				</p>
			</div>
		</div>
	{/if}

	<!-- Zone scrollable : Photos uniquement -->
	<div class="relative mb-8 min-h-0 flex-1 px-6 sm:px-6">
		<div
			class="h-full overflow-y-auto rounded-lg border"
			style="border-color: {borderColor};"
		>
			<div class="container mx-auto w-full max-w-4xl px-2 pb-2">
				{#if isLoadingPhotos}
					<div class="flex justify-center">
						<div
							class="text-center"
							style="color: {data.customization.font_color};"
						>
							<p>Chargement des photos...</p>
						</div>
					</div>
				{:else if photos.length === 0}
					<div
						class="rounded-xl p-6 text-center"
						style="background-color: rgba(255, 255, 255, 0.1);"
					>
						<p
							class="text-base sm:text-lg"
							style="color: {data.customization
								.font_color}; opacity: 0.8; font-family: '{data.customization
								.font_family || 'Playfair Display'}', {getFontFallback(
								data.customization.font_family || 'Playfair Display',
							)};"
						>
							Vous n'avez pas encore partagé de photos.
						</p>
					</div>
				{:else}
					<div
						class="rounded-xl p-3 sm:p-4"
						style="background-color: rgba(255, 255, 255, 0.1);"
					>
						<div
							class="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5"
						>
							{#each photos as photo}
								<div class="relative aspect-square overflow-hidden rounded-lg">
									{#if photo.fileType.startsWith('image/')}
										<img
											src={photo.downloadUrl}
											alt={photo.fileName}
											loading="lazy"
											decoding="async"
											class="h-full w-full object-cover"
										/>
									{:else if photo.fileType.startsWith('video/')}
										<video
											src={photo.downloadUrl}
											class="h-full w-full object-cover"
											preload="metadata"
											muted
										/>
										<div
											class="absolute inset-0 flex items-center justify-center"
											style="background-color: rgba(0, 0, 0, 0.3);"
										>
											<svg
												class="h-8 w-8 text-white"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"
												/>
											</svg>
										</div>
									{/if}
									<!-- Bouton de suppression -->
									<button
										on:click={() => deletePhoto(photo.id)}
										class="absolute right-2 top-2 z-10 rounded-full bg-red-500 p-1.5 transition-colors hover:bg-red-600 active:bg-red-700"
										title="Supprimer cette photo"
									>
										<Trash2 class="h-4 w-4 text-white" />
									</button>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
	<GuestFooter
		customization={data.customization}
		fontFallback={getFontFallback}
		buttons={[
			{
				label: 'Retour',
				href: `/${data.event.slug}/photos`,
				variant: 'outline',
			},
		]}
	/>
</div>
