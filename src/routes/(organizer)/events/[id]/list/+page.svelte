<script lang="ts">
	import type { Database } from '$lib/database/database.types';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import LoaderCircle from '~icons/lucide/loader-circle';

	type Event = Database['public']['Tables']['events']['Row'];
	type Guest = Database['public']['Tables']['guests']['Row'];

	export let data: {
		event: Event;
		guestsByTable: Record<string, Guest[]>;
		totalGuests: number;
		isEventAccessible: boolean;
	};

	let isRemoving = new Set<string>();
	let showDeleteAllDialog = false;
	let isAddingGuest = false;
	let addGuestForm: HTMLFormElement;

	async function removeGuest(guestId: string) {
		if (isRemoving.has(guestId)) return;

		isRemoving.add(guestId);

		try {
			const formData = new FormData();
			formData.append('guest_id', guestId);

			const response = await fetch(`?/removeGuest`, {
				method: 'POST',
				body: formData,
			});

			if (response.ok) {
				// Reload page to refresh the list
				window.location.reload();
			}
		} catch (error) {
			console.error('Error removing guest:', error);
		} finally {
			isRemoving.delete(guestId);
		}
	}

	function confirmDeleteAll() {
		showDeleteAllDialog = true;
	}

	function cancelDeleteAll() {
		showDeleteAllDialog = false;
	}

	function handleDeleteAllSuccess() {
		showDeleteAllDialog = false;
	}
</script>

<svelte:head>
	<title>Liste d'invités - {data.event.event_name}</title>
</svelte:head>

<div class="container mx-auto max-w-5xl px-4 py-12">
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
		<div
			class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
		>
			<div>
				<h1
					class="text-3xl font-normal leading-[120%] tracking-tight lg:text-4xl"
					style="color: #2C3E50; font-family: 'Playfair Display', serif;"
				>
					Liste d'invités
				</h1>
				<p class="mt-2 text-base" style="color: #2C3E50; opacity: 0.8;">
					{data.event.event_name} • {data.totalGuests}
					{data.totalGuests === 1 ? 'invité' : 'invités'}
				</p>
			</div>
			<button
				class="whitespace-nowrap rounded-xl px-4 py-2 font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
				style="background-color: #D4A574; border: none;"
				on:click={() => goto(`/events/${data.event.id}/upload`)}
				on:mouseover={(e) =>
					!data.isEventAccessible
						? null
						: (e.currentTarget.style.backgroundColor = '#C49863')}
				on:mouseout={(e) =>
					!data.isEventAccessible
						? null
						: (e.currentTarget.style.backgroundColor = '#D4A574')}
				on:focus={(e) =>
					!data.isEventAccessible
						? null
						: (e.currentTarget.style.backgroundColor = '#C49863')}
				on:blur={(e) =>
					!data.isEventAccessible
						? null
						: (e.currentTarget.style.backgroundColor = '#D4A574')}
				disabled={!data.isEventAccessible}
				title={!data.isEventAccessible
					? "Impossible d'ajouter des invités après 5 jours"
					: ''}
			>
				📄 Importer une liste
			</button>
		</div>
	</div>

	<!-- Add Guest Manually Section -->
	<div class="mb-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
		<h2 class="mb-4 text-xl font-medium" style="color: #2C3E50;">
			Ajouter un invité manuellement
		</h2>
		{#if !data.isEventAccessible}
			<div
				class="mb-4 rounded-lg border p-4"
				style="background-color: #FFF5F5; border-color: #9B4A4A;"
			>
				<p class="text-sm" style="color: #9B4A4A;">
					⚠️ Impossible d'ajouter des invités : cet événement n'est plus
					accessible (5 jours après la date de l'événement).
				</p>
			</div>
		{/if}
		<form
			bind:this={addGuestForm}
			method="POST"
			action="?/addGuest"
			use:enhance={() => {
				isAddingGuest = true;
				return async ({ update, result }) => {
					await update();
					isAddingGuest = false;
					// Reset form on success
					if (result.type === 'success' && addGuestForm) {
						addGuestForm.reset();
					}
				};
			}}
			class="space-y-4"
		>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div>
					<label
						for="guest_name"
						class="mb-2 block text-sm font-medium"
						style="color: #2C3E50;"
					>
						Nom de l'invité <span style="color: #DC2626;">*</span>
					</label>
					<input
						id="guest_name"
						name="guest_name"
						type="text"
						required
						placeholder="Ex: Jean Dupont"
						class="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-neutral-400 focus:outline-none"
						style="color: #2C3E50;"
					/>
				</div>

				<div>
					<label
						for="table_number"
						class="mb-2 block text-sm font-medium"
						style="color: #2C3E50;"
					>
						Table <span style="color: #DC2626;">*</span>
					</label>
					<input
						id="table_number"
						name="table_number"
						type="text"
						required
						placeholder="Ex: 1"
						class="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-neutral-400 focus:outline-none"
						style="color: #2C3E50;"
					/>
				</div>

				<div>
					<label
						for="seat_number"
						class="mb-2 block text-sm font-medium"
						style="color: #2C3E50;"
					>
						Place (optionnel)
					</label>
					<input
						id="seat_number"
						name="seat_number"
						type="text"
						placeholder="Ex: 5"
						class="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-neutral-400 focus:outline-none"
						style="color: #2C3E50;"
					/>
				</div>
			</div>

			<button
				type="submit"
				class="w-full rounded-xl px-4 py-2 font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
				style="background-color: #D4A574; border: none;"
				disabled={!data.isEventAccessible || isAddingGuest}
				on:mouseover={(e) =>
					!data.isEventAccessible || isAddingGuest
						? null
						: (e.currentTarget.style.backgroundColor = '#C49863')}
				on:mouseout={(e) =>
					!data.isEventAccessible || isAddingGuest
						? null
						: (e.currentTarget.style.backgroundColor = '#D4A574')}
				on:focus={(e) =>
					!data.isEventAccessible || isAddingGuest
						? null
						: (e.currentTarget.style.backgroundColor = '#C49863')}
				on:blur={(e) =>
					!data.isEventAccessible || isAddingGuest
						? null
						: (e.currentTarget.style.backgroundColor = '#D4A574')}
			>
				{#if isAddingGuest}
					<LoaderCircle class="mr-2 inline h-4 w-4 animate-spin" />
					Ajout en cours...
				{:else}
					Ajouter l'invité
				{/if}
			</button>
		</form>
	</div>

	<!-- Tables -->
	{#if Object.keys(data.guestsByTable).length > 0}
		<div class="mb-6 flex justify-end">
			<button
				type="button"
				class="rounded-xl px-4 py-2 text-sm font-medium transition-colors"
				style="color: #9B4A4A; border: 1px solid #9B4A4A; background-color: white;"
				on:click={confirmDeleteAll}
				on:mouseover={(e) =>
					(e.currentTarget.style.backgroundColor = '#FFF5F5')}
				on:mouseout={(e) => (e.currentTarget.style.backgroundColor = 'white')}
			>
				🗑️ Tout supprimer
			</button>
		</div>
		<div class="space-y-6">
			{#each Object.entries(data.guestsByTable) as [tableNumber, guests]}
				<div
					class="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
				>
					<div class="mb-4 flex items-center justify-between">
						<h2 class="text-xl font-medium" style="color: #2C3E50;">
							Table {tableNumber}
						</h2>
						<span class="text-sm" style="color: #2C3E50; opacity: 0.7;">
							{guests.length}
							{guests.length === 1 ? 'invité' : 'invités'}
						</span>
					</div>
					<div class="space-y-2">
						{#each guests as guest}
							<div
								class="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-3"
							>
								<div class="flex items-center gap-3">
									<div
										class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium"
										style="background-color: #D4A574; color: white;"
									>
										{guest.guest_name.charAt(0).toUpperCase()}
									</div>
									<div class="flex-1">
										<p class="font-medium" style="color: #2C3E50;">
											{guest.guest_name}
										</p>
										{#if guest.seat_number}
											<p class="text-xs" style="color: #2C3E50; opacity: 0.7;">
												Place {guest.seat_number}
											</p>
										{/if}
									</div>
								</div>
								<button
									class="rounded-lg px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50"
									style="color: #2C3E50;"
									on:click={() => removeGuest(guest.id)}
									disabled={isRemoving.has(guest.id)}
								>
									{isRemoving.has(guest.id) ? '...' : 'Retirer'}
								</button>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Empty state -->
		<div class="rounded-xl border border-neutral-200 bg-white p-12 text-center">
			<svg
				class="mx-auto mb-4 h-16 w-16"
				style="color: #D4A574;"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
				/>
			</svg>
			<h2 class="mb-2 text-xl font-medium" style="color: #2C3E50;">
				Aucun invité ajouté
			</h2>
			<p class="mb-6 text-sm" style="color: #2C3E50; opacity: 0.7;">
				Commencez par importer votre liste d'invités
			</p>
			<button
				class="rounded-xl px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
				style="background-color: #D4A574; border: none;"
				on:click={() => goto(`/events/${data.event.id}/upload`)}
				disabled={!data.isEventAccessible}
				title={!data.isEventAccessible
					? "Impossible d'ajouter des invités après 5 jours"
					: ''}
			>
				Importer un fichier
			</button>
		</div>
	{/if}

	{#if data.totalGuests > 0}
		<div class="mt-12 flex justify-center">
			<button
				class="rounded-xl px-6 py-3 text-base font-medium text-white shadow-lg transition-all duration-200 hover:scale-105"
				style="background-color: #2C3E50; border: none;"
				on:click={() => goto(`/events/${data.event.id}/customize`)}
				on:mouseover={(e) =>
					(e.currentTarget.style.backgroundColor = '#1F2B3A')}
				on:mouseout={(e) => (e.currentTarget.style.backgroundColor = '#2C3E50')}
				on:focus={(e) => (e.currentTarget.style.backgroundColor = '#1F2B3A')}
				on:blur={(e) => (e.currentTarget.style.backgroundColor = '#2C3E50')}
			>
				Continuer vers la personnalisation →
			</button>
		</div>
	{/if}
</div>

<!-- Dialog de confirmation de suppression de tous les invités -->
<AlertDialog.Root bind:open={showDeleteAllDialog}>
	<AlertDialog.Content
		class="rounded-xl border"
		style="background-color: #FFF9F4; border-color: #E5E5E5;"
	>
		<AlertDialog.Header>
			<AlertDialog.Title
				style="color: #2C3E50; font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 600;"
			>
				Supprimer tous les invités
			</AlertDialog.Title>
			<AlertDialog.Description style="color: #2C3E50; opacity: 0.8;">
				Êtes-vous sûr de vouloir supprimer tous les invités de cet événement ?
				Cette action est irréversible.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<form
				method="POST"
				action="?/deleteAllGuests"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							handleDeleteAllSuccess();
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
				<AlertDialog.Cancel
					on:click={cancelDeleteAll}
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
					Tout supprimer
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
		background-color: #8b3e3e !important;
	}
</style>
