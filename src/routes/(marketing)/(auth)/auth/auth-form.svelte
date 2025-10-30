<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import {
		superForm,
		type Infer,
		type SuperValidated,
	} from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import LoaderCircle from '~icons/lucide/loader-circle';
	import { formSchema, type FormSchema } from './schema';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema),
	});

	const { form: formData, enhance, submitting } = form;
</script>

<form method="POST" use:enhance class="grid gap-4">
	<Form.Errors {form} />
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label class="mb-2">Email</Form.Label>
			<Input
				{...attrs}
				type="email"
				placeholder="name@example.com"
				required
				bind:value={$formData.email}
			/>
		</Form.Control>
		<Form.FieldErrors />
		<Form.Description class="text-xs" style="color: #2C3E50; opacity: 0.7;">
			Nous vous enverrons un code d'accès par email
		</Form.Description>
	</Form.Field>
	<button
		type="submit"
		class="w-full rounded-xl px-4 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105"
		style="background-color: #D4A574; border: none;"
		disabled={$submitting}
		on:mouseover={(e) =>
			!$submitting && (e.currentTarget.style.backgroundColor = '#C49863')}
		on:mouseout={(e) =>
			!$submitting && (e.currentTarget.style.backgroundColor = '#D4A574')}
		on:focus={(e) => (e.currentTarget.style.backgroundColor = '#C49863')}
		on:blur={(e) => (e.currentTarget.style.backgroundColor = '#D4A574')}
	>
		{#if $submitting}
			<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
			Envoi du code en cours…
		{:else}
			Continuer
		{/if}
	</button>
</form>
