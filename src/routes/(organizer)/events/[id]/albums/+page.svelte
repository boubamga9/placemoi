<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Database } from '$lib/database/database.types';
	import { LoaderCircle, Download, Image as ImageIcon, Video, DownloadCloud, Trash2, Clock } from 'lucide-svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { WebsiteName } from '../../../../../config';

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
	let deletingPhotoId: string | null = null;
	let showDeleteDialog = false;
	let photoToDelete: Photo | null = null;

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

	// Calculer la date de suppression (3 mois après l'événement)
	function getDeletionDate(): Date {
		const eventDate = new Date(data.event.event_date);
		const deletionDate = new Date(eventDate);
		deletionDate.setMonth(deletionDate.getMonth() + 3);
		return deletionDate;
	}

	// Calculer le temps restant avant suppression
	function getTimeRemaining(): { days: number; hours: number; minutes: number; isExpired: boolean } {
		const deletionDate = getDeletionDate();
		const now = new Date();
		const diff = deletionDate.getTime() - now.getTime();

		if (diff <= 0) {
			return { days: 0, hours: 0, minutes: 0, isExpired: true };
		}

		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

		return { days, hours, minutes, isExpired: false };
	}

	// Formater le temps restant en texte lisible
	function formatTimeRemaining(): string {
		const { days, hours, minutes, isExpired } = getTimeRemaining();

		if (isExpired) {
			return 'Les photos seront supprimées prochainement';
		}

		if (days > 0) {
			return `${days} jour${days > 1 ? 's' : ''} restant${days > 1 ? 's' : ''}`;
		}

		if (hours > 0) {
			return `${hours} heure${hours > 1 ? 's' : ''} restante${hours > 1 ? 's' : ''}`;
		}

		return `${minutes} minute${minutes > 1 ? 's' : ''} restante${minutes > 1 ? 's' : ''}`;
	}

	// Vérifier si on est proche de la date de suppression (moins de 7 jours)
	function isNearDeletion(): boolean {
		const { days, isExpired } = getTimeRemaining();
		return isExpired || days <= 7;
	}

	// Calculer la classe de l'icône Clock
	$: clockIconClass = isNearDeletion() ? 'h-5 w-5 flex-shrink-0' : 'h-5 w-5 flex-shrink-0';

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

	function confirmDelete(photo: Photo) {
		photoToDelete = photo;
		showDeleteDialog = true;
	}

	function cancelDelete() {
		showDeleteDialog = false;
		photoToDelete = null;
	}

	async function deletePhoto() {
		if (!photoToDelete || deletingPhotoId) return;

		deletingPhotoId = photoToDelete.id;

		try {
			const response = await fetch(`/api/events/${data.event.id}/photos/${photoToDelete.id}`, {
				method: 'DELETE',
			});

			const result = await response.json();

			if (response.ok && result.success) {
				// Retirer la photo de la liste
				photos = photos.filter((p) => p.id !== photoToDelete.id);
				showDeleteDialog = false;
				photoToDelete = null;
			} else {
				error = result.message || result.error || "Erreur lors de la suppression";
			}
		} catch (err) {
			console.error('Error deleting photo:', err);
			error = "Erreur lors de la suppression de la photo";
		} finally {
			deletingPhotoId = null;
		}
	}
</script>

<svelte:head>
	<title>Album photos — {data.event.event_name} - {WebsiteName}</title>
	<meta
		name="description"
		content="Consultez et téléchargez les photos envoyées par vos invités pour l'événement {data.event.event_name}."
	/>
</svelte:head>

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
	<p class="mb-4 text-sm" style="color: #2C3E50; opacity: 0.75;">
		Consultez et téléchargez les photos envoyées par vos invités.
	</p>

	<!-- Indicateur de temps restant avant suppression -->
	{#if photos.length > 0}
		<div
			class="mb-6 flex items-center gap-2 rounded-lg border px-4 py-3"
			style="background-color: {isNearDeletion() ? '#FFF9F4' : '#F8F9FA'}; border-color: {isNearDeletion() ? '#D4A574' : '#2C3E50'}; border-width: 1px;"
		>
			<Clock
				class={clockIconClass}
				style="color: {isNearDeletion() ? '#D4A574' : '#2C3E50'};"
			/>
			<div class="flex-1">
				<p
					class="text-sm font-medium"
					style="color: #2C3E50;"
				>
					Suppression automatique dans {formatTimeRemaining()}
				</p>
				<p
					class="mt-0.5 text-xs"
					style="color: #2C3E50; opacity: 0.75;"
				>
					Les photos seront automatiquement supprimées 3 mois après l'événement ({getDeletionDate().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}).
					{#if isNearDeletion()}
						Pensez à télécharger vos photos avant cette date.
					{/if}
				</p>
			</div>
		</div>
	{/if}

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
						<div class="mt-3 flex gap-2">
							{#if photo.downloadUrl}
								<a
									href={`/api/events/${data.event.id}/photos/${photo.id}/download`}
									download={photo.fileName}
									class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral-50"
									style="color: #2C3E50;"
								>
									<Download class="h-4 w-4" />
									Télécharger
								</a>
							{/if}
							<button
								type="button"
								on:click={() => confirmDelete(photo)}
								disabled={deletingPhotoId === photo.id}
								class="rounded-lg border bg-white p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								on:mouseover={(e) => (e.currentTarget.style.backgroundColor = '#FFF5F5')}
								on:mouseout={(e) => (e.currentTarget.style.backgroundColor = 'white')}
								style="color: #9B4A4A; border-color: #9B4A4A;"
								title="Supprimer la photo"
							>
								<Trash2 class="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Dialog de confirmation de suppression -->
<AlertDialog.Root bind:open={showDeleteDialog}>
	<AlertDialog.Content
		class="rounded-xl border"
		style="background-color: #FFF9F4; border-color: #E5E5E5;"
	>
		<AlertDialog.Header>
			<AlertDialog.Title
				style="color: #2C3E50; font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 600;"
			>
				Supprimer la photo
			</AlertDialog.Title>
			<AlertDialog.Description style="color: #2C3E50; opacity: 0.8;">
				Êtes-vous sûr de vouloir supprimer cette photo ? Cette action est
				irréversible.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel
				on:click={cancelDelete}
				class="cancel-button rounded-lg border px-4 py-2 transition-colors"
				style="border-color: #D4A574; color: #2C3E50; background-color: white;"
			>
				Annuler
			</AlertDialog.Cancel>
			<AlertDialog.Action
				on:click={deletePhoto}
				disabled={deletingPhotoId !== null}
				class="delete-button rounded-lg px-4 py-2 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				style="background-color: #9B4A4A;"
			>
				{#if deletingPhotoId}
					<span class="flex items-center gap-2">
						<LoaderCircle class="h-4 w-4 animate-spin" />
						Suppression...
					</span>
				{:else}
					Supprimer
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<style>
	:global(.cancel-button:hover) {
		background-color: #f5e6d3 !important;
	}

	:global(.delete-button:hover:not(:disabled)) {
		background-color: #8B3E3E !important;
	}
</style>
