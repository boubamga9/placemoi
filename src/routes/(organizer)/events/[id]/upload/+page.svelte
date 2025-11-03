<script lang="ts">
	import type { Database } from '$lib/database/database.types';
	import { goto } from '$app/navigation';

	type Event = Database['public']['Tables']['events']['Row'];

	export let data: { 
		event: Event;
		isEventAccessible: boolean;
	};

	let fileInput: HTMLInputElement;
	let selectedFile: File | null = null;
	let isUploading = false;
	let uploadSuccess = false;
	let uploadMessage = '';

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			selectedFile = target.files[0];
		}
	}

	async function handleUploadWithRetry(event: Event) {
		event.preventDefault();

		if (!selectedFile) return;

		isUploading = true;
		uploadSuccess = false;
		uploadMessage = '';

		const formData = new FormData();
		formData.append('file', selectedFile);

		try {
			console.log('📤 Uploading file...', selectedFile.name);

			const response = await fetch(`/api/events/${data.event.id}/upload`, {
				method: 'POST',
				body: formData,
			});

			console.log('📥 Response status:', response.status);

			const result = await response.json();
			console.log('📦 Response:', result);

			if (response.ok && result?.success) {
				uploadSuccess = true;
				uploadMessage = `${result.guestsCount || 0} invité(s) ajouté(s) avec succès !`;

				// Redirect after 2 seconds
				setTimeout(() => {
					goto(`/events/${data.event.id}/list`);
				}, 2000);
			} else {
				console.log('❌ Upload failed:', result);
				uploadMessage =
					result?.message || result?.error || "Erreur lors de l'upload";
			}
		} catch (error) {
			console.error('Upload error:', error);
			uploadMessage = "Erreur lors de l'upload du fichier";
		} finally {
			isUploading = false;
		}
	}
</script>

<svelte:head>
	<title>Importer des invités - {data.event.event_name}</title>
</svelte:head>

<div class="container mx-auto max-w-2xl px-4 py-12">
	<!-- Back button -->
	<div class="mb-6">
		<button
			class="text-base font-medium transition-colors"
			style="color: #D4A574;"
			on:click={() => goto(`/events/${data.event.id}`)}
			on:mouseover={(e) => (e.currentTarget.style.color = '#C49863')}
			on:mouseout={(e) => (e.currentTarget.style.color = '#D4A574')}
			on:focus={(e) => (e.currentTarget.style.color = '#C49863')}
			on:blur={(e) => (e.currentTarget.style.color = '#D4A574')}
		>
			← Retour
		</button>
	</div>

	<!-- Header -->
	<div class="mb-8">
		<h1
			class="text-3xl font-normal leading-[120%] tracking-tight lg:text-4xl"
			style="color: #2C3E50; font-family: 'Playfair Display', serif;"
		>
			{data.event.event_name}
		</h1>
		{#if data.event.event_date}
			<p class="mt-2 text-base" style="color: #2C3E50; opacity: 0.8;">
				{new Date(data.event.event_date).toLocaleDateString('fr-FR', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				})}
			</p>
		{/if}
	</div>

	<!-- Upload Card -->
	<div class="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
		<h2 class="mb-2 text-2xl font-medium" style="color: #2C3E50;">
			Importer votre liste d'invités
		</h2>
		<p class="mb-6 text-sm" style="color: #2C3E50; opacity: 0.7;">
			Téléchargez votre fichier avec les informations de vos invités. Les fichiers CSV simples sont traités instantanément, sinon notre intelligence artificielle s'occupera de faire correspondre les colonnes à notre format (nom, table, place).
		</p>

		{#if !data.isEventAccessible}
			<div
				class="mb-6 rounded-lg border p-4"
				style="background-color: #FFF5F5; border-color: #9B4A4A;"
			>
				<p class="text-sm" style="color: #9B4A4A;">
					⚠️ Impossible d'importer des invités : cet événement n'est plus accessible (5 jours après la date de l'événement).
				</p>
			</div>
		{/if}

		<!-- File Uploader -->
		<form on:submit={handleUploadWithRetry} class="space-y-4">
			<label
				class="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 p-12 transition-colors {data.isEventAccessible ? 'cursor-pointer hover:border-neutral-400' : 'cursor-not-allowed opacity-50'}"
			>
				<input
					bind:this={fileInput}
					type="file"
					accept=".csv,.xlsx,.xls,.xlsm,.txt,.xlsb,.xltx,.xltm"
					on:change={handleFileSelect}
					class="absolute inset-0 opacity-0 {data.isEventAccessible ? 'cursor-pointer' : 'cursor-not-allowed'}"
					required={data.isEventAccessible}
					disabled={!data.isEventAccessible}
				/>
				<svg
					class="mb-4 h-12 w-12"
					style="color: #D4A574;"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
					/>
				</svg>
				<p class="text-sm font-medium" style="color: #2C3E50;">
					{#if selectedFile}
						{selectedFile.name}
					{:else}
						Cliquez pour sélectionner un fichier
					{/if}
				</p>
				<p class="mt-1 text-xs" style="color: #2C3E50; opacity: 0.7;">
					CSV, Excel, TXT, Sheets - Tous formats acceptés
				</p>
			</label>

			{#if selectedFile}
				<div class="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<svg
								class="h-8 w-8"
								style="color: #D4A574;"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							<div>
								<p class="text-sm font-medium" style="color: #2C3E50;">
									{selectedFile.name}
								</p>
								<p class="text-xs" style="color: #2C3E50; opacity: 0.7;">
									{(selectedFile.size / 1024).toFixed(2)} KB
								</p>
							</div>
						</div>
						<button
							type="button"
							class="rounded-lg px-3 py-1 text-xs font-medium transition-colors"
							style="color: #DC2626; background-color: #FEE2E2;"
							on:click={() => {
								selectedFile = null;
								fileInput.value = '';
							}}
						>
							Retirer
						</button>
					</div>
				</div>
			{/if}

			{#if uploadMessage}
				<div
					class="rounded-lg p-4 text-sm"
					style="background-color: {uploadSuccess
						? '#D1FAE5'
						: '#FEE2E2'}; color: {uploadSuccess ? '#065F46' : '#991B1B'};"
				>
					{uploadMessage}
				</div>
			{/if}

			<div class="flex gap-3">
				<button
					type="submit"
					class="flex-1 rounded-xl px-6 py-3 font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
					style="background-color: #D4A574; border: none;"
					disabled={!selectedFile || isUploading || !data.isEventAccessible}
				>
					{#if isUploading}
						<span class="flex items-center justify-center gap-2">
							<svg
								class="h-4 w-4 animate-spin"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
							Traitement en cours...
						</span>
					{:else}
						Importer et traiter
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
