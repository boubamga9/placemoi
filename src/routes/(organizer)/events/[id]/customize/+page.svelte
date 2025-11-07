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
	import { eventCustomizationSchema } from '$lib/validations';
	import { goto } from '$app/navigation';
	import {
		compressLogo,
		compressBackgroundImage,
	} from '$lib/utils/images/client';

	type Database = import('$lib/database/database.types').Database;
	type Event = Database['public']['Tables']['events']['Row'];
	type EventCustomization =
		Database['public']['Tables']['event_customizations']['Row'];

	export let data: {
		event: Event;
		customization: EventCustomization | null;
		form: SuperValidated<Infer<typeof eventCustomizationSchema>>;
	};

	const form = superForm(data.form, {
		validators: zodClient(eventCustomizationSchema),
	});

	const { form: formData, enhance, submitting } = form;

	let backgroundImageFile: File | null = null;
	let backgroundImagePreview: string | null =
		data.customization?.background_image_url || null;
	let backgroundImageFileName: string | null = null;
	let backgroundInputElement: HTMLInputElement;
	let isBackgroundCompressing = false;

	let logoFile: File | null = null;
	let logoPreview: string | null = data.customization?.logo_url || null;
	let logoFileName: string | null = null;
	let logoInputElement: HTMLInputElement;
	let isLogoCompressing = false;

	const fontFamilies = [
		// Serif élégants
		{ value: 'Playfair Display', label: 'Playfair Display (serif élégant)' },
		{ value: 'Crimson Pro', label: 'Crimson Pro (serif classique)' },
		{
			value: 'Cormorant Garamond',
			label: 'Cormorant Garamond (serif raffiné)',
		},
		{ value: 'Lora', label: 'Lora (serif moderne)' },
		// Sans-serif modernes
		{ value: 'Inter', label: 'Inter (sans-serif moderne)' },
		{ value: 'Montserrat', label: 'Montserrat (sans-serif géométrique)' },
		{ value: 'Poppins', label: 'Poppins (sans-serif arrondi)' },
		{ value: 'Raleway', label: 'Raleway (sans-serif élégant)' },
		{ value: 'Nunito Sans', label: 'Nunito Sans (sans-serif amical)' },
		{ value: 'Roboto', label: 'Roboto (sans-serif propre)' },
		{ value: 'Open Sans', label: 'Open Sans (sans-serif net)' },
		// Display/Bold
		{ value: 'Oswald', label: 'Oswald (display condensé)' },
		{ value: 'Bebas Neue', label: 'Bebas Neue (display bold)' },
		// Script/Élégant
		{ value: 'Dancing Script', label: 'Dancing Script (script élégant)' },
		{ value: 'Great Vibes', label: 'Great Vibes (script délicat)' },
	];

	// Fonction pour déterminer le fallback CSS approprié selon le type de police
	function getFontFallback(fontFamily: string): string {
		const serifFonts = [
			'Playfair Display',
			'Crimson Pro',
			'Cormorant Garamond',
			'Lora',
		];
		const scriptFonts = ['Dancing Script', 'Great Vibes'];

		if (serifFonts.includes(fontFamily)) {
			return 'serif';
		} else if (scriptFonts.includes(fontFamily)) {
			return 'cursive';
		} else {
			return 'sans-serif';
		}
	}

	async function handleBackgroundImageSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file || !file.type.startsWith('image/')) return;

		try {
			isBackgroundCompressing = true;

			// Compress the image
			const compressionResult = await compressBackgroundImage(file);

			// Use compressed image
			backgroundImageFile = compressionResult.file;
			backgroundImageFileName = file.name;

			// Sync the input element with the compressed file
			const dataTransfer = new DataTransfer();
			dataTransfer.items.add(compressionResult.file);
			if (backgroundInputElement) {
				backgroundInputElement.files = dataTransfer.files;
			}

			// Create preview
			const reader = new FileReader();
			reader.onload = (ev) => {
				backgroundImagePreview = ev.target?.result as string;
			};
			reader.readAsDataURL(compressionResult.file);
		} catch (error) {
			console.error('Error compressing background image:', error);
		} finally {
			isBackgroundCompressing = false;
		}
	}

	async function handleLogoSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file || !file.type.startsWith('image/')) return;

		try {
			isLogoCompressing = true;

			// Compress the logo
			const compressionResult = await compressLogo(file);

			// Use compressed logo
			logoFile = compressionResult.file;
			logoFileName = file.name;

			// Sync the input element with the compressed file
			const dataTransfer = new DataTransfer();
			dataTransfer.items.add(compressionResult.file);
			if (logoInputElement) {
				logoInputElement.files = dataTransfer.files;
			}

			// Create preview
			const reader = new FileReader();
			reader.onload = (ev) => {
				logoPreview = ev.target?.result as string;
			};
			reader.readAsDataURL(compressionResult.file);
		} catch (error) {
			console.error('Error compressing logo:', error);
		} finally {
			isLogoCompressing = false;
		}
	}

	async function removeBackgroundImage() {
		try {
			// Supprimer côté client immédiatement pour l'UX
			backgroundImageFile = null;
			backgroundImagePreview = null;
			backgroundImageFileName = null;

			// Supprimer côté serveur si une image Cloudinary existe (pas les data URIs temporaires)
			const existingUrl = $formData.background_image_url;
			if (existingUrl && !existingUrl.startsWith('data:')) {
				const formData = new FormData();

				const response = await fetch('?/removeBackgroundImage', {
					method: 'POST',
					body: formData,
				});

				if (!response.ok) {
					// En cas d'erreur, remettre l'aperçu
					backgroundImagePreview = existingUrl;
					return;
				}

				// Mettre à jour l'état après suppression réussie
				$formData.background_image_url = undefined;
			}

			// Clear the input
			if (backgroundInputElement) {
				backgroundInputElement.value = '';
			}
		} catch {
			// En cas d'erreur, remettre l'aperçu si c'était une URL Cloudinary
			const existingUrl = $formData.background_image_url;
			if (existingUrl && !existingUrl.startsWith('data:')) {
				backgroundImagePreview = existingUrl;
			}
		}
	}

	async function removeLogo() {
		try {
			// Supprimer côté client immédiatement pour l'UX
			logoFile = null;
			logoPreview = null;
			logoFileName = null;

			// Supprimer côté serveur si un logo Cloudinary existe (pas les data URIs temporaires)
			const existingUrl = $formData.logo_url;
			if (existingUrl && !existingUrl.startsWith('data:')) {
				const formData = new FormData();

				const response = await fetch('?/removeLogo', {
					method: 'POST',
					body: formData,
				});

				if (!response.ok) {
					// En cas d'erreur, remettre l'aperçu
					logoPreview = existingUrl;
					return;
				}

				// Mettre à jour l'état après suppression réussie
				$formData.logo_url = undefined;
			}

			// Clear the input
			if (logoInputElement) {
				logoInputElement.value = '';
			}
		} catch {
			// En cas d'erreur, remettre l'aperçu si c'était une URL Cloudinary
			const existingUrl = $formData.logo_url;
			if (existingUrl && !existingUrl.startsWith('data:')) {
				logoPreview = existingUrl;
			}
		}
	}

	// Utiliser enhance avec update pour modifier le FormData avant l'envoi
	// Car superForm n'inclut pas les fichiers mis via DataTransfer dans l'input
	const customEnhance = (node: HTMLFormElement) => {
		return enhance(node, {
			onSubmit: ({ formData: fd }) => {
				// IMPORTANT: Utiliser les valeurs du FormData existantes si présentes,
				// sinon utiliser $formData comme fallback
				// Cela évite d'écraser les bonnes valeurs qui sont déjà dans le FormData
				const background_color =
					fd.get('background_color') || $formData.background_color || '';
				const font_color = fd.get('font_color') || $formData.font_color || '';
				const font_family =
					fd.get('font_family') || $formData.font_family || '';
				const welcome_text =
					fd.get('welcome_text') || $formData.welcome_text || '';
				const subtitle_text =
					fd.get('subtitle_text') || $formData.subtitle_text || '';

				// S'assurer que toutes les valeurs sont bien présentes dans le FormData
				fd.set('background_color', String(background_color));
				fd.set('font_color', String(font_color));
				fd.set('font_family', String(font_family));
				fd.set('welcome_text', String(welcome_text));
				fd.set('subtitle_text', String(subtitle_text));

				// Ajouter les fichiers compressés explicitement au FormData avant l'envoi
				if (
					backgroundImageFile instanceof File &&
					backgroundImageFile.size > 0
				) {
					fd.set('background_image', backgroundImageFile);
				} else {
					// Si pas de nouveau fichier, supprimer le champ pour éviter les conflits
					fd.delete('background_image');
				}

				if (logoFile instanceof File && logoFile.size > 0) {
					fd.set('logo', logoFile);
				} else {
					// Si pas de nouveau fichier, supprimer le champ pour éviter les conflits
					fd.delete('logo');
				}

				// Ne pas envoyer les champs cachés s'ils sont vides ou s'ils contiennent des data URIs temporaires
				// Seulement envoyer les URLs Cloudinary existantes
				const bgUrl = fd.get('background_image_url');
				if (bgUrl) {
					const bgUrlStr = String(bgUrl);
					if (bgUrlStr.trim() === '' || bgUrlStr.startsWith('data:')) {
						fd.delete('background_image_url');
					}
				}

				const logoUrl = fd.get('logo_url');
				if (logoUrl) {
					const logoUrlStr = String(logoUrl);
					if (logoUrlStr.trim() === '' || logoUrlStr.startsWith('data:')) {
						fd.delete('logo_url');
					}
				}
			},
		});
	};
</script>

<svelte:head>
	<title>Personnaliser - {data.event.event_name}</title>
</svelte:head>

<div class="container mx-auto max-w-4xl px-4 py-12">
	<!-- Header -->
	<div class="mb-8">
		<button
			class="mb-4 text-base font-medium transition-colors"
			style="color: #D4A574;"
			on:click={() => goto(`/events/${data.event.id}`)}
			on:mouseover={(e) => (e.currentTarget.style.color = '#C49863')}
			on:mouseout={(e) => (e.currentTarget.style.color = '#D4A574')}
			on:focus={(e) => (e.currentTarget.style.color = '#C49863')}
			on:blur={(e) => (e.currentTarget.style.color = '#D4A574')}
		>
			← Retour
		</button>
		<h1
			class="text-3xl font-normal leading-[120%] tracking-tight lg:text-4xl"
			style="color: #2C3E50; font-family: 'Playfair Display', serif;"
		>
			Personnaliser l'apparence
		</h1>
		<p class="mt-2 text-base" style="color: #2C3E50; opacity: 0.8;">
			{data.event.event_name}
		</p>
	</div>

	<!-- Preview Card -->
	<div class="mb-6 rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
		<h2 class="mb-4 text-lg font-medium" style="color: #2C3E50;">Aperçu</h2>
		<div
			class="rounded-lg border border-neutral-200 p-8"
			style="background-color: {$formData.background_color || '#FFFFFF'};"
		>
			<div class="text-center">
				<h3
					class="text-2xl font-medium"
					style="color: {$formData.font_color ||
						'#2C3E50'}; font-family: '{$formData.font_family ||
						'Playfair Display'}', {$formData.font_family
						? getFontFallback($formData.font_family)
						: 'serif'};"
				>
					Bienvenue
				</h3>
				<p
					class="mt-2 text-sm"
					style="color: {$formData.font_color ||
						'#2C3E50'}; opacity: 0.8; font-family: '{$formData.font_family ||
						'Playfair Display'}', {$formData.font_family
						? getFontFallback($formData.font_family)
						: 'serif'};"
				>
					Trouvez votre place
				</p>
			</div>
		</div>
	</div>

	<!-- Customization Form -->
	<form
		method="POST"
		action="?/save"
		use:customEnhance
		enctype="multipart/form-data"
		class="space-y-6"
	>
		<Form.Errors {form} />

		<div class="grid gap-6 md:grid-cols-2">
			<!-- Background Color -->
			<Form.Field {form} name="background_color">
				<Form.Control let:attrs>
					<Form.Label class="mb-2">Couleur de fond</Form.Label>
					<div class="flex gap-2">
						<input
							{...attrs}
							type="color"
							bind:value={$formData.background_color}
							class="h-10 w-20 rounded-lg border border-neutral-300"
						/>
						<Input
							type="text"
							bind:value={$formData.background_color}
							placeholder="#FFFFFF"
							class="flex-1"
						/>
					</div>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Font Color -->
			<Form.Field {form} name="font_color">
				<Form.Control let:attrs>
					<Form.Label class="mb-2">Couleur du texte</Form.Label>
					<div class="flex gap-2">
						<input
							{...attrs}
							type="color"
							bind:value={$formData.font_color}
							class="h-10 w-20 rounded-lg border border-neutral-300"
						/>
						<Input
							type="text"
							bind:value={$formData.font_color}
							placeholder="#2C3E50"
							class="flex-1"
						/>
					</div>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<!-- Font Family -->
		<Form.Field {form} name="font_family">
			<Form.Control let:attrs>
				<Form.Label class="mb-2">Police de caractères</Form.Label>
				<select
					{...attrs}
					bind:value={$formData.font_family}
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#each fontFamilies as font}
						<option value={font.value}>{font.label}</option>
					{/each}
				</select>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<!-- Welcome Text -->
		<Form.Field {form} name="welcome_text">
			<Form.Control let:attrs>
				<Form.Label class="mb-2">Texte de bienvenue</Form.Label>
				<Input
					{...attrs}
					type="text"
					bind:value={$formData.welcome_text}
					placeholder="Bienvenue"
					maxlength="100"
				/>
				<Form.Description class="mt-1">
					Texte d'accueil principal (max 100 caractères)
				</Form.Description>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<!-- Subtitle Text -->
		<Form.Field {form} name="subtitle_text">
			<Form.Control let:attrs>
				<Form.Label class="mb-2">Sous-titre</Form.Label>
				<Input
					{...attrs}
					type="text"
					bind:value={$formData.subtitle_text}
					placeholder="Trouvez votre place"
					maxlength="150"
				/>
				<Form.Description class="mt-1">
					Texte de description (max 150 caractères)
				</Form.Description>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<!-- Background Image -->
		<div class="flex flex-col space-y-2">
			<label class="text-sm font-medium" style="color: #2C3E50;">
				Image de fond
			</label>
			{#if backgroundImagePreview}
				<div class="relative w-fit">
					<img
						src={backgroundImagePreview}
						alt="Aperçu image de fond"
						class="h-48 w-48 rounded-lg border-2 border-neutral-200 object-cover"
					/>
					<button
						type="button"
						on:click={removeBackgroundImage}
						class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
					>
						×
					</button>
				</div>
			{:else if isBackgroundCompressing}
				<div class="flex items-center gap-2 text-sm text-blue-600">
					<LoaderCircle class="h-4 w-4 animate-spin" />
					Compression en cours...
				</div>
			{:else}
				<label class="cursor-pointer">
					<span
						class="inline-flex items-center rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
					>
						Choisir un fichier
					</span>
					<input
						type="file"
						name="background_image"
						accept="image/*"
						on:change={handleBackgroundImageSelect}
						bind:this={backgroundInputElement}
						class="hidden"
					/>
				</label>
			{/if}
			{#if backgroundImagePreview && !backgroundImagePreview.startsWith('data:')}
				<input
					type="hidden"
					name="background_image_url"
					value={backgroundImagePreview}
				/>
			{/if}
			{#if backgroundImageFileName}
				<p class="text-sm" style="color: #2C3E50;">
					Fichier sélectionné : {backgroundImageFileName}
				</p>
			{:else}
				<p class="text-xs" style="color: #2C3E50; opacity: 0.7;">
					Optionnel : uploader une image de fond
				</p>
			{/if}
		</div>

		<!-- Logo -->
		<div class="flex flex-col space-y-2">
			<label class="text-sm font-medium" style="color: #2C3E50;">Logo</label>
			{#if logoPreview}
				<div class="relative w-fit">
					<img
						src={logoPreview}
						alt="Aperçu logo"
						class="h-32 w-32 rounded-lg border-2 border-neutral-200 object-cover"
					/>
					<button
						type="button"
						on:click={removeLogo}
						class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
					>
						×
					</button>
				</div>
			{:else if isLogoCompressing}
				<div class="flex items-center gap-2 text-sm text-blue-600">
					<LoaderCircle class="h-4 w-4 animate-spin" />
					Compression en cours...
				</div>
			{:else}
				<label class="cursor-pointer">
					<span
						class="inline-flex items-center rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
					>
						Choisir un fichier
					</span>
					<input
						type="file"
						name="logo"
						accept="image/*"
						on:change={handleLogoSelect}
						bind:this={logoInputElement}
						class="hidden"
					/>
				</label>
			{/if}
			{#if logoPreview && !logoPreview.startsWith('data:')}
				<input type="hidden" name="logo_url" value={logoPreview} />
			{/if}
			{#if logoFileName}
				<p class="text-sm" style="color: #2C3E50;">
					Fichier sélectionné : {logoFileName}
				</p>
			{:else}
				<p class="text-xs" style="color: #2C3E50; opacity: 0.7;">
					Optionnel : uploader votre logo
				</p>
			{/if}
		</div>

		<div class="flex gap-4">
			<button
				type="submit"
				class="flex-1 rounded-xl px-6 py-3 font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
				style="background-color: #D4A574; border: none;"
				disabled={$submitting}
			>
				{#if $submitting}
					<LoaderCircle class="mr-2 inline h-4 w-4 animate-spin" />
					Enregistrement...
				{:else}
					Enregistrer les modifications et prévisualiser
				{/if}
			</button>
		</div>
	</form>
</div>
