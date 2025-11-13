<script lang="ts">
	import type { Database } from '$lib/database/database.types';

	type EventCustomization =
		Database['public']['Tables']['event_customizations']['Row'];

	export let customization: EventCustomization;
	export let fontFallback: (fontFamily: string) => string;
	export let buttons: Array<{
		label: string;
		href: string;
		variant?: 'outline' | 'solid';
	}> = [];
</script>

<div class="flex w-full flex-col items-center gap-6 px-4 pb-6 text-center">
	{#if buttons.length > 0}
		<div class="flex flex-wrap items-center justify-center gap-3">
			{#each buttons as button}
				<a
					href={button.href}
					class="rounded-lg border px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
					style={button.variant === 'solid'
						? `
						color: ${customization.background_color};
						background-color: ${customization.font_color};
						border-color: ${customization.font_color};
						font-family: '${customization.font_family || 'Playfair Display'}', ${fontFallback(
							customization.font_family || 'Playfair Display',
						)};
					`
						: `
						color: ${customization.font_color};
						border-color: ${customization.font_color};
						background-color: transparent;
						font-family: '${customization.font_family || 'Playfair Display'}', ${fontFallback(
							customization.font_family || 'Playfair Display',
						)};
					`}
				>
					{button.label}
				</a>
			{/each}
		</div>
	{/if}
	<div
		class="h-px w-full"
		style="
			background-color: {customization.font_color};
			opacity: 0.25;
		"
	/>
	<div
		class="flex items-center gap-1 text-sm font-medium"
		style="
			color: {customization.font_color};
			font-family: '{customization.font_family || 'Playfair Display'}', {fontFallback(
			customization.font_family || 'Playfair Display',
		)};
		"
	>
		<span>Fait avec</span>
		<a
			href="/"
			class="group font-semibold text-inherit"
			style="text-decoration: none;"
		>
			<span class="underline-offset-2 group-hover:underline">Placemoi</span>
		</a>
	</div>
</div>
