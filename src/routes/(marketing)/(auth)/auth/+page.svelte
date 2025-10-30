<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import { WebsiteName } from '../../../../config';
	import SocialsAuth from '../components/socials-auth.svelte';
	import AuthForm from './auth-form.svelte';

	export let data;
	export let form;

	// Check form status
	$: signupDisabled = form?.signupDisabled;
</script>

<svelte:head>
	<title>Accéder à votre compte - {WebsiteName}</title>
	<meta
		name="description"
		content="Accédez à votre compte PLACEMOI pour gérer vos événements et placements d'invités. Création d'événements simples et efficaces."
	/>
	<meta
		name="keywords"
		content="connexion, accès, événements, placement, invités"
	/>
</svelte:head>

{#if signupDisabled}
	<Alert.Root class="mb-6 mt-36" variant="destructive">
		<Alert.Title>Inscriptions temporairement désactivées</Alert.Title>
		<Alert.Description>
			Nous sommes désolés, mais l'accès de nouveaux utilisateurs est
			actuellement désactivé. Réessayez plus tard ou contactez le support pour
			obtenir de l'aide.
		</Alert.Description>
	</Alert.Root>
{/if}

<div class="py-8">
	<Card.Root
		class="mx-auto max-w-sm rounded-xl border border-neutral-200 bg-white shadow-sm"
	>
		<Card.Header class="text-center">
			<Card.Title
				tag="h1"
				class="text-2xl font-normal leading-[120%] tracking-tight lg:text-3xl"
				style="color: #2C3E50; font-family: 'Playfair Display', serif;"
			>
				Accéder à votre compte <span class="sr-only">sur {WebsiteName}</span>
			</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4">
			<SocialsAuth />

			<div class="flex flex-col gap-3">
				<p class="text-center text-sm" style="color: #2C3E50; opacity: 0.9;">
					Entrez votre email pour recevoir un code d'accès.
				</p>
				<AuthForm data={data.form} />
			</div>
		</Card.Content>
	</Card.Root>
</div>
