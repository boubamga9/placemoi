<script lang="ts">
	import GuestFooter from '../../components/guest-footer.svelte';
	import type { Database } from '$lib/database/database.types';
	import { LoaderCircle, CheckCircle2, XCircle } from 'lucide-svelte';

	type Event = Database['public']['Tables']['events']['Row'];
	type EventCustomization =
		Database['public']['Tables']['event_customizations']['Row'];

	export let data: {
		event: Event;
		customization: EventCustomization;
	};

	let fileInput: HTMLInputElement;
	let isUploading = false;
	let uploadSuccess = false;
	let uploadError = '';
	let selectedFiles: File[] = [];
	let dragActive = false;

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
		uploadSuccess = false;
		uploadError = '';

		const formData = new FormData();
		selectedFiles.forEach((file) => {
			formData.append('files', file);
		});

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

			console.log('📥 Response status:', response.status);
			console.log(
				'📥 Response headers:',
				Object.fromEntries(response.headers.entries()),
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
				uploadSuccess = true;
				selectedFiles = [];
				// Reset after 3 seconds
				setTimeout(() => {
					uploadSuccess = false;
				}, 3000);
			} else {
				// Améliorer les messages d'erreur
				let errorMsg =
					result.message || result.error || "Erreur lors de l'upload";

				// Si l'erreur contient des détails sur les fichiers rejetés, les afficher
				if (errorMsg.includes('fichier trop volumineux')) {
					errorMsg =
						'Vidéo trop volumineuse. Taille maximum : 100MB. Essayez de compresser votre vidéo ou choisissez une vidéo plus courte.';
				} else if (errorMsg.includes('type non supporté')) {
					errorMsg =
						'Format de fichier non supporté. Formats acceptés : MP4, MOV, AVI, WebM, MKV.';
				} else if (errorMsg.includes('Aucun fichier valide')) {
					errorMsg =
						"Aucun fichier valide. Vérifiez que vos fichiers sont des images ou vidéos et qu'ils ne dépassent pas 100MB.";
				} else if (!response.ok) {
					// Si la réponse n'est pas OK, inclure le status
					errorMsg = `Erreur ${response.status}: ${errorMsg}`;
				}

				uploadError = errorMsg;
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
	class="flex min-h-screen flex-col items-center justify-between"
	style={backgroundStyle}
>
	<div class="flex w-full flex-1 items-center justify-center">
		<div class="container mx-auto max-w-2xl px-4 py-12">
			{#if data.customization.logo_url}
				<div class="flex justify-center">
					<img
						src={data.customization.logo_url}
						alt="Logo"
						class="h-32 w-auto object-contain"
					/>
				</div>
			{/if}

			<div class="mb-8 text-center">
				<h1
					class="mb-4 text-4xl font-semibold"
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
				<div
					class="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors"
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
							class="h-12 w-12 animate-spin"
							style={`color: ${data.customization.font_color};`}
						/>
						<h2 class="mt-4 text-xl font-semibold">Upload en cours...</h2>
					{:else if uploadSuccess}
						<CheckCircle2
							class="h-12 w-12"
							style={`color: ${data.customization.font_color};`}
						/>
						<h2 class="mt-4 text-xl font-semibold">
							Photos envoyées avec succès !
						</h2>
					{:else if uploadError}
						<XCircle
							class="h-12 w-12"
							style={`color: ${data.customization.font_color};`}
						/>
						<h2 class="mt-4 text-xl font-semibold">Erreur</h2>
						<p class="mt-2 text-sm opacity-80">{uploadError}</p>
					{:else}
						<div
							class="text-4xl"
							style={`color: ${data.customization.font_color};`}
						>
							+
						</div>
						<h2 class="mt-4 text-xl font-semibold">
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

					{#if !isUploading && !uploadSuccess && !uploadError}
						<p class="mt-6 text-xs opacity-70">
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
