<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Database } from '$lib/database/database.types';

	const eventType = 'event_name' satisfies keyof Database['public']['Tables']['events']['Row'];

	export let data: {
		event: Database['public']['Tables']['events']['Row'];
	};
</script>

<div class="container mx-auto max-w-4xl px-4 py-12">
	<button
		on:click={() => goto(`/events/${data.event.id}`)}
		class="mb-6 text-base font-medium text-[#D4A574] transition-colors hover:text-[#C49863]"
	>
		← Retour à l'événement
	</button>

	<h1
		class="mb-4 text-3xl font-medium leading-tight"
		style="color: #2C3E50; font-family: 'Playfair Display', serif;"
	>
		Album photos — {data.event.event_name}
	</h1>
	<p class="mb-10 text-sm" style="color: #2C3E50; opacity: 0.75;">
		Vous pourrez bientôt consulter, filtrer et télécharger les photos envoyées
		par vos invités. Cette page est en cours de conception.
	</p>

	<div class="rounded-xl border border-dashed border-neutral-300 bg-white/40 p-10 text-center text-sm" style="color: #2C3E50;">
		<p class="font-medium">Aucune photo à afficher pour le moment.</p>
		<p class="mt-2 opacity-70">
			Dès qu’un invité partage ses souvenirs, vous pourrez les retrouver ici.
		</p>
	</div>
</div>
