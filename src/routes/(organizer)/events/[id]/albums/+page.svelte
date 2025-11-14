<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Database } from '$lib/database/database.types';
	import { LoaderCircle, Download, Image as ImageIcon, Video, DownloadCloud } from 'lucide-svelte';

	type Photo = {
		id: string;
		fileName: string;
		fileSize: number;
		fileType: string;
		uploadedAt: string;
		downloadUrl: string | null;
		error?: string;
	};

	export let data: {
		event: Database['public']['Tables']['events']['Row'];
		photosCount: number;
	};

	let photos: Photo[] = [];
	let isLoading = true;
	let error: string | null = null;
	let isDownloadingAll = false;

	onMount(async () => {
		await loadPhotos();
	});

	async function loadPhotos() {
		isLoading = true;
		error = null;

		try {
			const response = await fetch(`/api/events/${data.event.id}/photos`);
			const result = await response.json();

			if (response.ok && result.success) {
				photos = result.photos || [];
			} else {
				error = result.message || result.error || "Erreur lors du chargement des photos";
			}
		} catch (err) {
			console.error('Error loading photos:', err);
			error = "Erreur lors du chargement des photos";
		} finally {
			isLoading = false;
		}
	}

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	}

	function isImage(fileType: string): boolean {
		return fileType.startsWith('image/');
	}

	function isVideo(fileType: string): boolean {
		return fileType.startsWith('video/');
	}

	async function downloadAllPhotos() {
		if (photos.length === 0 || isDownloadingAll) return;

		isDownloadingAll = true;

		try {
			const response = await fetch(`/api/events/${data.event.id}/photos/download-all`);

			if (!response.ok) {
				const result = await response.json();
				error = result.message || result.error || "Erreur lors du téléchargement";
				return;
			}

			// Récupérer le blob du ZIP
			const blob = await response.blob();

			// Créer un lien de téléchargement
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			
			// Récupérer le nom du fichier depuis les headers
			const contentDisposition = response.headers.get('content-disposition');
			const fileName = contentDisposition
				? contentDisposition.split('filename=')[1]?.replace(/"/g, '') || 'photos.zip'
				: 'photos.zip';
			
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		} catch (err) {
			console.error('Error downloading all photos:', err);
			error = "Erreur lors du téléchargement de toutes les photos";
		} finally {
			isDownloadingAll = false;
		}
	}
</script>

<div class="container mx-auto max-w-6xl px-4 py-12">
	<button
		on:click={() => goto(`/events/${data.event.id}`)}
		class="mb-6 text-base font-medium text-[#D4A574] transition-colors hover:text-[#C49863]"
	>
		← Retour à l'événement
	</button>

	<h1
		class="mb-4 text-3xl font-medium leading-tight"
		style="color: #2C3E50; font-family: 'Playfair Display', serif;"
	>
		Album photos — {data.event.event_name}
	</h1>
	<p class="mb-10 text-sm" style="color: #2C3E50; opacity: 0.75;">
		Consultez et téléchargez les photos envoyées par vos invités.
	</p>

	{#if isLoading}
		<div class="flex items-center justify-center py-20">
			<LoaderCircle class="h-8 w-8 animate-spin text-[#D4A574]" />
			<span class="ml-3 text-sm" style="color: #2C3E50;">Chargement des photos...</span>
		</div>
	{:else if error}
		<div class="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
			<p class="font-medium text-red-800">{error}</p>
			<button
				on:click={loadPhotos}
				class="mt-4 text-sm text-red-600 underline hover:text-red-800"
			>
				Réessayer
			</button>
		</div>
	{:else if photos.length === 0}
		<div class="rounded-xl border border-dashed border-neutral-300 bg-white/40 p-10 text-center text-sm" style="color: #2C3E50;">
			<p class="font-medium">Aucune photo à afficher pour le moment.</p>
			<p class="mt-2 opacity-70">
				Dès qu'un invité partage ses souvenirs, vous pourrez les retrouver ici.
			</p>
		</div>
	{:else}
		<div class="mb-6 flex items-center justify-between">
			<div class="text-sm" style="color: #2C3E50; opacity: 0.75;">
				{photos.length} photo{photos.length > 1 ? 's' : ''} au total
			</div>
			<button
				on:click={downloadAllPhotos}
				disabled={isDownloadingAll}
				class="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
				style="color: #2C3E50;"
			>
				{#if isDownloadingAll}
					<LoaderCircle class="h-4 w-4 animate-spin" />
					<span>Préparation...</span>
				{:else}
					<DownloadCloud class="h-4 w-4" />
					<span>Tout télécharger (ZIP)</span>
				{/if}
			</button>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each photos as photo (photo.id)}
				<div class="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md">
					{#if photo.downloadUrl}
						<a
							href={photo.downloadUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="block"
						>
							{#if isImage(photo.fileType)}
								<img
									src={photo.downloadUrl}
									alt={photo.fileName}
									class="h-64 w-full object-cover"
									loading="lazy"
								/>
							{:else if isVideo(photo.fileType)}
								<div class="flex h-64 w-full items-center justify-center bg-neutral-100">
									<Video class="h-16 w-16 text-neutral-400" />
								</div>
							{:else}
								<div class="flex h-64 w-full items-center justify-center bg-neutral-100">
									<ImageIcon class="h-16 w-16 text-neutral-400" />
								</div>
							{/if}
						</a>
					{:else}
						<div class="flex h-64 w-full items-center justify-center bg-neutral-100">
							<ImageIcon class="h-16 w-16 text-neutral-400" />
						</div>
					{/if}

					<div class="p-4">
						<p class="mb-2 truncate text-sm font-medium" style="color: #2C3E50;">
							{photo.fileName}
						</p>
						<div class="flex items-center justify-between text-xs" style="color: #2C3E50; opacity: 0.6;">
							<span>{formatFileSize(photo.fileSize)}</span>
							<span>{formatDate(photo.uploadedAt)}</span>
						</div>
						{#if photo.downloadUrl}
							<a
								href={`/api/events/${data.event.id}/photos/${photo.id}/download`}
								download={photo.fileName}
								class="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral-50"
								style="color: #2C3E50;"
							>
								<Download class="h-4 w-4" />
								Télécharger
							</a>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
