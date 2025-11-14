import { error } from '@sveltejs/kit';
import type { Database } from '$lib/database/database.types';
import { isEventAccessible } from '$lib/utils/event-utils';
import { STRIPE_PRICES } from '$lib/config/server';

type Event = Database['public']['Tables']['events']['Row'];
type EventCustomization = Database['public']['Tables']['event_customizations']['Row'];

export const load = async ({ params, locals: { supabase, supabaseServiceRole } }: any) => {
	const { slug } = params;

	if (!slug) {
		throw error(404, 'Événement non trouvé');
	}

	const { data: eventData, error: fetchError } = await supabase
		.from('events')
		.select(
			`
			*,
			event_customizations (*)
		`,
		)
		.eq('slug', slug)
		.single();

	if (fetchError || !eventData) {
		throw error(404, 'Événement non trouvé');
	}

	const { event_customizations, ...event } = eventData as any;
	const customization = Array.isArray(event_customizations)
		? event_customizations[0]
		: event_customizations || null;

	if (!isEventAccessible(event.event_date)) {
		throw error(410, {
			message: "Cet événement n'est plus accessible",
			eventName: event.event_name,
			eventDate: event.event_date,
		});
	}

	// 🚀 OPTIMIZATION: Paralléliser les vérifications du plan photos
	const [
		{ data: payment },
		{ data: ownerHasFree, error: ownerHasFreeError }
	] = await Promise.all([
		// 1. Vérifier si l'événement a le plan avec photos activé
		supabase
			.from('payments')
			.select('stripe_price_id')
			.eq('event_id', event.id)
			.eq('status', 'succeeded')
			.order('created_at', { ascending: false })
			.limit(1)
			.maybeSingle(),
		// 2. Vérifier si l'owner a le plan gratuit via owner_has_free()
		supabaseServiceRole
			.rpc('owner_has_free', { p_owner_id: event.owner_id })
	]);

	// Si l'appel RPC échoue, fallback: récupérer directement le flag
	let hasFreePlan = false;
	if (ownerHasFreeError) {
		console.error('Error checking owner_has_free:', ownerHasFreeError);
		const { data: owner } = await supabaseServiceRole
			.from('owners')
			.select('can_generate_qr_free')
			.eq('id', event.owner_id)
			.maybeSingle();
		hasFreePlan = owner?.can_generate_qr_free === true;
	} else {
		hasFreePlan = ownerHasFree === true;
	}

	const hasPhotosPlan =
		payment?.stripe_price_id === STRIPE_PRICES.EVENT_WITH_PHOTOS ||
		hasFreePlan;

	// Si l'événement n'a pas le plan photos, retourner une erreur 403
	if (!hasPhotosPlan) {
		throw error(403, "Cet événement n'a pas le plan avec photos activé");
	}

	const customizationWithDefaults: EventCustomization = {
		id: customization?.id || '',
		event_id: event.id,
		background_color: customization?.background_color || '#FFFFFF',
		font_color: customization?.font_color || '#2C3E50',
		font_family: customization?.font_family || 'Playfair Display',
		background_image_url: customization?.background_image_url || null,
		logo_url: customization?.logo_url || null,
		welcome_text: customization?.welcome_text || '',
		subtitle_text: customization?.subtitle_text || '',
		created_at: customization?.created_at || new Date().toISOString(),
		updated_at: customization?.updated_at || new Date().toISOString(),
	};

	return {
		event: event as Event,
		customization: customizationWithDefaults,
	};
};


