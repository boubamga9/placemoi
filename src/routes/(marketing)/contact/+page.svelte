<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import ContactForm from './contact-form.svelte';
	import { WebsiteName } from '../../../config';

	export let data;
</script>

<svelte:head>
	<title>{WebsiteName} - Contact</title>
	<meta
		name="description"
		content="Contactez l'équipe PLACEMOI pour toute question sur notre solution de placement d'invités pour vos événements."
	/>
	<meta
		name="keywords"
		content="contact, support, aide, événements, placement d'invités"
	/>
</svelte:head>

<div class="mb-24 mt-36">
	<Card.Root
		class="mx-auto max-w-lg rounded-xl border border-neutral-200 bg-white shadow-sm"
	>
		<Card.Header class="text-center">
			<Card.Title
				tag="h1"
				class="text-2xl font-normal leading-[120%] tracking-tight lg:text-3xl"
				style="color: #2C3E50; font-family: 'Playfair Display', serif;"
				>Nous contacter</Card.Title
			>
			<Card.Description class="text-sm" style="color: #2C3E50; opacity: 0.9;"
				>Dites-nous comment nous pouvons vous aider.</Card.Description
			>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4">
			<ContactForm data={data.form} />
		</Card.Content>
	</Card.Root>
</div>
