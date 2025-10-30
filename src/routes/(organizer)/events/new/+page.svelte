<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import {
		superForm,
		type Infer,
		type SuperValidated,
	} from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import LoaderCircle from '~icons/lucide/loader-circle';
	import { createEventSchema, type CreateEventInput } from '$lib/validations';
	import { goto } from '$app/navigation';

	export let data: { form: SuperValidated<Infer<typeof createEventSchema>> };

	const form = superForm(data.form, {
		validators: zodClient(createEventSchema),
	});

	const { form: formData, enhance, submitting } = form;

	const eventTypes = [
		{ value: 'wedding', label: 'Mariage' },
		{ value: 'anniversary', label: 'Anniversaire' },
		{ value: 'baptism', label: 'Baptême' },
		{ value: 'other', label: 'Autre' },
	];

	// Get today's date in YYYY-MM-DD format
	const today = new Date().toISOString().split('T')[0];
</script>

<svelte:head>
	<title>Créer un événement - PLACEMOI</title>
</svelte:head>

<div class="container mx-auto max-w-2xl px-4 py-12">
	<!-- Back button -->
	<div class="mb-6">
		<button
			class="text-base font-medium transition-colors"
			style="color: #D4A574;"
			on:click={() => goto('/events')}
			on:mouseover={(e) => (e.currentTarget.style.color = '#C49863')}
			on:mouseout={(e) => (e.currentTarget.style.color = '#D4A574')}
		>
			← Retour à mes événements
		</button>
	</div>

	<div class="mb-8">
		<h1
			class="text-3xl font-normal leading-[120%] tracking-tight lg:text-4xl"
			style="color: #2C3E50; font-family: 'Playfair Display', serif;"
		>
			Créer un événement
		</h1>
		<p class="mt-2 text-base" style="color: #2C3E50; opacity: 0.8;">
			Remplissez les informations de base de votre événement
		</p>
	</div>

	<form method="POST" use:enhance class="space-y-6">
		<Form.Errors {form} />

		<Form.Field {form} name="event_name">
			<Form.Control let:attrs>
				<Form.Label class="mb-2">Nom de l'événement</Form.Label>
				<Input
					{...attrs}
					type="text"
					placeholder="Ex: Mariage de Marie et Pierre"
					maxlength="100"
					bind:value={$formData.event_name}
				/>
			</Form.Control>
			<Form.FieldErrors />
			<Form.Description class="text-xs" style="color: #2C3E50; opacity: 0.7;">
				{$formData.event_name?.length || 0} / 100 caractères
			</Form.Description>
		</Form.Field>

		<Form.Field {form} name="event_date">
			<Form.Control let:attrs>
				<Form.Label class="mb-2">Date de l'événement</Form.Label>
				<Input
					{...attrs}
					type="date"
					min={today}
					bind:value={$formData.event_date}
				/>
			</Form.Control>
			<Form.FieldErrors />
			<Form.Description class="text-xs" style="color: #2C3E50; opacity: 0.7;">
				La date de votre événement
			</Form.Description>
		</Form.Field>

		<Form.Field {form} name="event_type">
			<Form.Control let:attrs>
				<Form.Label class="mb-2">Type d'événement</Form.Label>
				<select
					{...attrs}
					bind:value={$formData.event_type}
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<option value="" disabled selected>Sélectionnez un type</option>
					{#each eventTypes as type}
						<option value={type.value}>{type.label}</option>
					{/each}
				</select>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<button
			type="submit"
			class="w-full rounded-xl px-4 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
			style="background-color: #D4A574; border: none;"
			disabled={$submitting}
			on:mouseover={(e) =>
				!$submitting &&
				!e.currentTarget.disabled &&
				(e.currentTarget.style.backgroundColor = '#C49863')}
			on:mouseout={(e) => (e.currentTarget.style.backgroundColor = '#D4A574')}
		>
			{#if $submitting}
				<LoaderCircle class="mr-2 inline h-4 w-4 animate-spin" />
				Création...
			{:else}
				Créer l'événement
			{/if}
		</button>
	</form>
</div>
