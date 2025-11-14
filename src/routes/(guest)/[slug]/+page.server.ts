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

    // OPTIMIZED: Get event and customization in a single query with relation
    const { data: eventData, error: fetchError } = await supabase
        .from('events')
        .select(`
            *,
            event_customizations (*)
        `)
        .eq('slug', slug)
        .single();

    if (fetchError || !eventData) {
        throw error(404, 'Événement non trouvé');
    }

    // Extract event (without the nested relation)
    const { event_customizations, ...event } = eventData as any;
    // event_customizations is returned as an array by Supabase even for one-to-one relations
    const customization = Array.isArray(event_customizations)
        ? event_customizations[0]
        : event_customizations || null;

    // Check if event is still accessible (5 days after event_date)
    if (!isEventAccessible(event.event_date)) {
        throw error(410, {
            message: 'Cet événement n\'est plus accessible',
            eventName: event.event_name,
            eventDate: event.event_date
        });
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
        updated_at: customization?.updated_at || new Date().toISOString()
    };

    // 🚀 OPTIMIZATION: Preload all guests for this event (si < 2000 invités)
    // Au-delà de 2000, on utilise l'API pour éviter de surcharger le navigateur
    const IN_MEMORY_SEARCH_THRESHOLD = 2000;

    // D'abord, on compte les invités pour décider si on précharge
    const { count, error: countError } = await supabase
        .from('guests')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id);

    if (countError) {
        console.error('Error counting guests:', countError);
    }

    let guests: any[] = [];

    // On précharge seulement si < 2000 invités
    if (count !== null && count < IN_MEMORY_SEARCH_THRESHOLD) {
        const { data: guestsData, error: guestsError } = await supabase
            .from('guests')
            .select('guest_name, table_number, seat_number')
            .eq('event_id', event.id);

        if (guestsError) {
            console.error('Error fetching guests for preload:', guestsError);
        } else {
            guests = guestsData || [];
        }
    }

    // Vérifier si l'événement a le plan avec photos activé
    // Utiliser supabaseServiceRole pour bypasser les RLS
    const { data: payment } = await supabase
        .from('payments')
        .select('stripe_price_id')
        .eq('event_id', event.id)
        .eq('status', 'succeeded')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    // Vérifier si l'owner a le plan gratuit via owner_has_free()
    const { data: ownerHasFree, error: ownerHasFreeError } = await supabaseServiceRole
        .rpc('owner_has_free', { p_owner_id: event.owner_id });

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

    return {
        event: event as Event,
        customization: customizationWithDefaults,
        // Preloaded guests data (vide si >= 2000 invités, pour utiliser l'API)
        guests: guests,
        hasPhotosPlan: hasPhotosPlan || false
    };
};
