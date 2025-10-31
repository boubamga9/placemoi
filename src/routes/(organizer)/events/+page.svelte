<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { enhance } from '$app/forms';
	import type { Database } from '$lib/database/database.types';
	import { WebsiteName } from '../../../config';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Trash2 } from 'lucide-svelte';
	import { formatEventTypeFr } from '$lib/i18n/event-type';

	type Event = Database['public']['Tables']['events']['Row'];

	export let data: {
		events: Event[];
	};

	export let form;

	$: events = data.events || [];
	$: supabase = $page.data.supabase;

	let eventToDelete: string | null = null;
	let showDeleteDialog = false;

	async function handleLogout() {
		await supabase.auth.signOut();
		goto('/auth');
	}

	function confirmDelete(eventId: string) {
		eventToDelete = eventId;
		showDeleteDialog = true;
	}

	function cancelDelete() {
		showDeleteDialog = false;
		eventToDelete = null;
	}

	function handleDeleteSuccess() {
		showDeleteDialog = false;
		eventToDelete = null;
	}
</script>

<svelte:head>
	<title>Mes événements - {WebsiteName}</title>
	<meta
		name="description"
		content="Gérez vos événements et placements d'invités avec PLACEMOI."
	/>
</svelte:head>

<div class="container relative mx-auto px-4 py-12">
	<!-- Logout button -->
	<button
		type="button"
		class="absolute right-4 top-4 text-sm font-medium transition-colors"
		style="color: #2C3E50; opacity: 0.7;"
		on:click={handleLogout}
		on:mouseover={(e) => (e.currentTarget.style.opacity = '1')}
		on:mouseout={(e) => (e.currentTarget.style.opacity = '0.7')}
		on:focus={(e) => (e.currentTarget.style.opacity = '1')}
		on:blur={(e) => (e.currentTarget.style.opacity = '0.7')}
	>
		Déconnexion
	</button>

	<!-- Header -->
	<div class="mb-8 text-center">
		<h1
			class="text-3xl font-normal leading-[120%] tracking-tight lg:text-4xl"
			style="color: #2C3E50; font-family: 'Playfair Display', serif;"
		>
			Mes événements
		</h1>
		<p class="mt-2 text-base" style="color: #2C3E50; opacity: 0.8;">
			Créez et gérez vos événements de placement d'invités
		</p>
	</div>

	<!-- Create Event Button -->
	<div class="mb-8 flex justify-center">
		<Button
			class="rounded-xl px-6 py-6 shadow-lg transition-all duration-200 hover:scale-105"
			style="background-color: #D4A574; border: none; color: white; width: 100%; max-width: 300px;"
			on:click={() => goto('/events/new')}
		>
			+ Créer un événement
		</Button>
	</div>

	<!-- Events Grid -->
	{#if events.length > 0}
		<div class="flex flex-wrap justify-center gap-6">
			{#each events as event}
				<Card.Root
					class="w-full cursor-pointer rounded-xl border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-lg sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
				>
					<Card.Header>
						<Card.Title
							tag="h2"
							class="text-xl font-medium"
							style="color: #2C3E50;"
						>
							{event.event_name}
						</Card.Title>
						{#if event.event_date}
							<Card.Description style="color: #2C3E50; opacity: 0.7;">
								{new Date(event.event_date).toLocaleDateString('fr-FR', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</Card.Description>
						{/if}
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-between">
							<span
								class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize"
								style="background-color: #F5E6D3; color: #2C3E50;"
							>
								{formatEventTypeFr(event.event_type)}
							</span>
							<button
								type="button"
								class="rounded-lg p-2 transition-colors"
								on:mouseover={(e) => (e.currentTarget.style.backgroundColor = '#FFF5F5')}
								on:mouseout={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
								style="color: #9B4A4A;"
								on:click|stopPropagation={() => confirmDelete(event.id)}
								title="Supprimer l'événement"
							>
								<Trash2 class="h-4 w-4" />
							</button>
						</div>
					</Card.Content>
					<Card.Footer>
						<Button
							variant="outline"
							class="w-full"
							style="border-color: #D4A574; color: #D4A574;"
							on:click={() => goto(`/events/${event.id}`)}
						>
							Voir les détails
						</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	{:else}
		<!-- Empty state -->
		<Card.Root
			class="mx-auto max-w-2xl rounded-xl border border-neutral-200 bg-white py-12 text-center"
		>
			<Card.Content>
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
					style="background-color: #F5E6D3;"
				>
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
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
				</div>
				<h2
					class="mb-2 text-2xl font-normal"
					style="color: #2C3E50; font-family: 'Playfair Display', serif;"
				>
					Aucun événement pour le moment
				</h2>
				<p class="mb-6 text-base" style="color: #2C3E50; opacity: 0.7;">
					Créez votre premier événement pour commencer à gérer vos placements
					d'invités
				</p>
				<Button
					class="rounded-xl px-8 py-6 shadow-lg transition-all duration-200 hover:scale-105"
					style="background-color: #D4A574; border: none; color: white;"
					on:click={() => goto('/events/new')}
				>
					Créer mon premier événement
				</Button>
			</Card.Content>
		</Card.Root>
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
				Supprimer l'événement
			</AlertDialog.Title>
			<AlertDialog.Description style="color: #2C3E50; opacity: 0.8;">
				Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est
				irréversible et supprimera également tous les invités et données
				associées.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<form
				method="POST"
				action="?/delete"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							handleDeleteSuccess();
							await update();
						} else if (result.type === 'failure') {
							console.error(
								'Erreur lors de la suppression:',
								result.data?.error,
							);
							alert(result.data?.error || 'Erreur lors de la suppression');
						}
					};
				}}
			>
				<input type="hidden" name="eventId" value={eventToDelete || ''} />
				<AlertDialog.Cancel
					on:click={cancelDelete}
					class="cancel-button rounded-lg border px-4 py-2 transition-colors"
					style="border-color: #D4A574; color: #2C3E50; background-color: white;"
				>
					Annuler
				</AlertDialog.Cancel>
				<AlertDialog.Action
					type="submit"
					class="delete-button rounded-lg px-4 py-2 text-white transition-colors"
					style="background-color: #9B4A4A;"
				>
					Supprimer
				</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<style>
	:global(.cancel-button:hover) {
		background-color: #f5e6d3 !important;
	}

	:global(.delete-button:hover) {
		background-color: #8B3E3E !important;
	}
</style>
