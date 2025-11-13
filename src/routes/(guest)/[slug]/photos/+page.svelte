<script lang="ts">
	import GuestFooter from '../../components/guest-footer.svelte';
	import type { Database } from '$lib/database/database.types';

	type Event = Database['public']['Tables']['events']['Row'];
	type EventCustomization =
		Database['public']['Tables']['event_customizations']['Row'];

	export let data: {
		event: Event;
		customization: EventCustomization;
	};

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

	$: backgroundStyle = `background-color: ${data.customization.background_color};${
		data.customization.background_image_url
			? ` background-image: url('${data.customization.background_image_url}'); background-size: cover; background-position: center;`
			: ''
	}`;
</script>

<svelte:head>
	<title>Envoyer des photos - {data.event.event_name}</title>
</svelte:head>

<div
	class="flex min-h-screen flex-col items-center justify-between"
	style={backgroundStyle}
>
	<div class="flex w-full flex-1 items-center justify-center">
		<div class="container mx-auto max-w-2xl px-4 py-12">
			{#if data.customization.logo_url}
				<div class="flex justify-center">
					<img
						src={data.customization.logo_url}
						alt="Logo"
						class="h-32 w-auto object-contain"
					/>
				</div>
			{/if}

			<div class="mb-8 text-center">
				<h1
					class="mb-4 text-4xl font-semibold"
					style="
						color: {data.customization.font_color};
						font-family: '{data.customization.font_family ||
						'Playfair Display'}', {getFontFallback(
						data.customization.font_family || 'Playfair Display',
					)};
					"
				>
					Partagez vos souvenirs
				</h1>
			</div>

			<div class="mx-auto w-full max-w-2xl">
				<label
					class="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors hover:border-opacity-80"
					style={`color: ${data.customization.font_color}; border-color: ${data.customization.font_color}66; font-family: '${data.customization.font_family || 'Playfair Display'}', ${getFontFallback(data.customization.font_family || 'Playfair Display')};`}
				>
					<div
						class="text-4xl"
						style={`color: ${data.customization.font_color};`}
					>
						+
					</div>
					<h2 class="mt-4 text-xl font-semibold">
						Déposez vos photos/vidéos ici
					</h2>

					<input type="file" multiple accept="image/*" class="hidden" />

					<p class="mt-6 text-xs opacity-70">
						Vos photos restent privées : seul l'organisateur peut les
						télécharger.
					</p>
				</label>
			</div>
		</div>
	</div>
	<GuestFooter
		customization={data.customization}
		fontFallback={getFontFallback}
		buttons={[
			{
				label: 'Trouver ma place',
				href: `/${data.event.slug}`,
				variant: 'solid',
			},
		]}
	/>
</div>
