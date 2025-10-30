<script lang="ts">
	import { page } from '$app/stores';
	import * as Card from '$lib/components/ui/card';
	import ConfirmationForm from './confirmation-form.svelte';

	export let data;

	// Récupérer l'email depuis les paramètres d'URL ou les données
	$: userEmail =
		$page.url.searchParams.get('email') || data?.userEmail || 'votre email';
</script>

<svelte:head>
	<title>Confirmez votre email - PLACEMOI</title>
	<meta
		name="description"
		content="Confirmez votre adresse email pour continuer"
	/>
	<meta
		name="keywords"
		content="confirmation email, vérification, événements, placement d'invités"
	/>
</svelte:head>

<div class="mb-24 mt-36">
	<Card.Root
		class="mx-auto max-w-sm rounded-xl border border-neutral-200 bg-white shadow-sm"
	>
		<Card.Header class="text-center">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
				style="background-color: #D4A574;"
			>
				<svg
					class="h-8 w-8 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					/>
				</svg>
			</div>
			<Card.Title
				tag="h1"
				class="text-2xl font-normal leading-[120%] tracking-tight lg:text-3xl"
				style="color: #2C3E50; font-family: 'Playfair Display', serif;"
			>
				Confirmez votre email
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<ConfirmationForm data={data.form} email={userEmail} type={data.type} />

			<div
				class="mt-6 text-center text-sm"
				style="color: #2C3E50; opacity: 0.8;"
			>
				Vous n'avez pas reçu le code ?
				<a
					href="/auth"
					class="font-medium underline transition-colors"
					style="color: #D4A574;"
					on:mouseover={(e) => (e.currentTarget.style.color = '#C49863')}
					on:mouseout={(e) => (e.currentTarget.style.color = '#D4A574')}
				>
					Réessayer
				</a>
			</div>
		</Card.Content>
	</Card.Root>
</div>
