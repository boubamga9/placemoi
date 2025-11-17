<script lang="ts">
	import GuestFooter from '../../components/guest-footer.svelte';
	import type { Database } from '$lib/database/database.types';
	import { LoaderCircle, XCircle } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	type Event = Database['public']['Tables']['events']['Row'];
	type EventCustomization =
		Database['public']['Tables']['event_customizations']['Row'];

	export let data: {
		event: Event;
		customization: EventCustomization;
	};

	let fileInput: HTMLInputElement;
	let isUploading = false;
	let uploadError = '';
	let selectedFiles: File[] = [];
	let dragActive = false;

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
				console.log('✅ Nouveau device_id généré et sauvegardé:', deviceId);
			} catch (e) {
				console.error('❌ Erreur lors de la sauvegarde du device_id:', e);
			}
		} else {
			console.log('✅ Device_id récupéré depuis localStorage:', deviceId);
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

	function handleFileSelect(event: globalThis.Event) {
		const target =
			(event.target as HTMLInputElement) ||
			(event.currentTarget as HTMLInputElement);
		if (target?.files) {
			selectedFiles = Array.from(target.files);
			handleUpload();
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		dragActive = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		dragActive = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		dragActive = false;

		if (event.dataTransfer?.files) {
			selectedFiles = Array.from(event.dataTransfer.files);
			handleUpload();
		}
	}

	async function handleUpload() {
		if (selectedFiles.length === 0 || isUploading) return;

		isUploading = true;
		uploadError = '';

		const formData = new FormData();
		selectedFiles.forEach((file) => {
			formData.append('files', file);
		});
		// Ajouter l'identifiant de l'appareil
		const deviceId = getDeviceId();
		formData.append('device_id', deviceId);
		console.log('📤 Upload avec device_id:', deviceId);

		try {
			// Log des fichiers avant upload pour debug
			selectedFiles.forEach((file) => {
				console.log('📤 Uploading file:', {
					name: file.name,
					type: file.type,
					size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
					isVideo: file.type.startsWith('video/'),
					isImage: file.type.startsWith('image/'),
				});
			});

			const response = await fetch(
				`/api/events/${data.event.id}/photos/upload`,
				{
					method: 'POST',
					body: formData,
				},
			);

			let result;
			try {
				result = await response.json();
				console.log('📦 Response data:', result);
			} catch (jsonError) {
				console.error('❌ Error parsing JSON response:', jsonError);
				const text = await response.text();
				console.error('❌ Response text:', text);
				uploadError = `Erreur serveur (${response.status}): ${text.substring(0, 200)}`;
				return;
			}

			if (response.ok && result.success) {
				selectedFiles = [];
				// Rediriger immédiatement vers la page des photos partagées
				// Ajouter ?refresh=true pour forcer le rafraîchissement du cache
				goto(`/${data.event.slug}/shared?refresh=true`);
			} else {
				// Améliorer les messages d'erreur
				uploadError =
					result.message || result.error || "Erreur lors de l'upload";
			}
		} catch (error) {
			console.error('❌ Upload error:', error);
			if (error instanceof Error) {
				console.error('Error message:', error.message);
				console.error('Error stack:', error.stack);
				uploadError = `Erreur réseau: ${error.message}`;
			} else {
				uploadError = "Erreur lors de l'upload des photos";
			}
		} finally {
			isUploading = false;
		}
	}

	function triggerFileInput() {
		fileInput?.click();
	}
</script>

<svelte:head>
	<title>Envoyer des photos - {data.event.event_name}</title>
</svelte:head>

<div
	class="flex h-screen flex-col items-center justify-between overflow-hidden"
	style={backgroundStyle}
>
	<div class="flex min-h-0 w-full flex-1 items-center justify-center">
		<div class="container mx-auto max-w-2xl px-4 py-6 sm:py-12">
			{#if data.customization.logo_url}
				<div class="mb-2 flex justify-center sm:mb-4">
					<img
						src={data.customization.logo_url}
						alt="Logo"
						class="h-20 w-auto object-contain sm:h-32"
					/>
				</div>
			{/if}

			<div class="mb-4 text-center sm:mb-2">
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
					Partagez vos souvenirs
				</h1>
			</div>

			<div class="mx-auto w-full max-w-2xl">
				<!-- Bouton pour voir les photos partagées -->
				<div class="mb-4 flex justify-center">
					<a
						href={`/${data.event.slug}/shared`}
						class="rounded-lg border px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
						style="
							color: {data.customization.font_color};
							border-color: {data.customization.font_color};
							background-color: transparent;
							font-family: '{data.customization.font_family ||
							'Playfair Display'}', {getFontFallback(
							data.customization.font_family || 'Playfair Display',
						)};
						"
					>
						Voir mes photos partagées
					</a>
				</div>

				<!-- Zone d'upload -->
				<div
					class="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 text-center transition-colors sm:px-6 sm:py-10"
					class:opacity-50={isUploading}
					class:border-opacity-100={dragActive}
					class:border-opacity-60={!dragActive}
					style={`color: ${data.customization.font_color}; border-color: ${data.customization.font_color}${dragActive ? 'CC' : '66'}; font-family: '${data.customization.font_family || 'Playfair Display'}', ${getFontFallback(data.customization.font_family || 'Playfair Display')};`}
					on:click={triggerFileInput}
					on:keydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							triggerFileInput();
						}
					}}
					on:dragover={handleDragOver}
					on:dragleave={handleDragLeave}
					on:drop={handleDrop}
					role="button"
					tabindex="0"
				>
					{#if isUploading}
						<LoaderCircle
							class="h-10 w-10 animate-spin sm:h-12 sm:w-12"
							style={`color: ${data.customization.font_color};`}
						/>
						<h2 class="mt-3 text-lg font-semibold sm:mt-4 sm:text-xl">
							Upload en cours...
						</h2>
					{:else if uploadError}
						<XCircle
							class="h-10 w-10 sm:h-12 sm:w-12"
							style={`color: ${data.customization.font_color};`}
						/>
						<h2 class="mt-3 text-lg font-semibold sm:mt-4 sm:text-xl">
							Erreur
						</h2>
						<p class="mt-2 text-xs opacity-80 sm:text-sm">{uploadError}</p>
					{:else}
						<div
							class="text-3xl sm:text-4xl"
							style={`color: ${data.customization.font_color};`}
						>
							+
						</div>
						<h2 class="mt-3 text-lg font-semibold sm:mt-4 sm:text-xl">
							Déposez vos photos/vidéos ici
						</h2>
					{/if}

					<input
						bind:this={fileInput}
						type="file"
						multiple
						accept="image/*,video/*"
						class="hidden"
						on:change={handleFileSelect}
					/>

					{#if !isUploading && !uploadError}
						<p class="mt-4 text-xs opacity-70 sm:mt-6">
							Vos photos restent privées : seul l'organisateur peut les
							télécharger.
						</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
	<GuestFooter
		customization={data.customization}
		fontFallback={getFontFallback}
		buttons={[
			{
				label: 'Trouver ma place',
				href: `/${data.event.slug}`,
				variant: 'solid',
			},
		]}
	/>
</div>
