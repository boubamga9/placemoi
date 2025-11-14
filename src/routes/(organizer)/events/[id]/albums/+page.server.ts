import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Database } from '$lib/database/database.types';

type Event = Database['public']['Tables']['events']['Row'];

export const load: PageServerLoad = async ({ params, locals: { safeGetSession, supabase } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		throw redirect(303, '/auth');
	}

	const { id } = params;

	const { data: event, error: fetchError } = await supabase
		.from('events')
		.select('id, event_name, slug, owner_id, event_date')
		.eq('id', id)
		.eq('owner_id', session.user.id)
		.single();

	if (fetchError || !event) {
		throw error(404, 'Événement introuvable ou accès refusé');
	}

	// Récupérer le nombre de photos (pour affichage)
	const { count, error: countError } = await supabase
		.from('event_photos')
		.select('*', { count: 'exact', head: true })
		.eq('event_id', id);

	if (countError) {
		console.error('Error counting photos:', countError);
	}

	return {
		event: event as Event,
		photosCount: count || 0,
	};
};
