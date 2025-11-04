import { error, redirect } from '@sveltejs/kit';
import type { Database } from '$lib/database/database.types';

type Event = Database['public']['Tables']['events']['Row'];
type EventCustomization = Database['public']['Tables']['event_customizations']['Row'];

export const load = async ({ params, locals: { supabase, safeGetSession } }: any) => {
    const { session } = await safeGetSession();

    if (!session) {
        throw redirect(303, '/auth');
    }

    const { id } = params;

    // Get the event
    const { data: event, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .eq('owner_id', session.user.id)
        .single();

    if (fetchError || !event) {
        throw error(404, 'Événement non trouvé');
    }

    // Get customizations with defaults
    const { data: customization } = await supabase
        .from('event_customizations')
        .select('*')
        .eq('event_id', id)
        .single();

    const customizationWithDefaults: EventCustomization = {
        id: customization?.id || '',
        event_id: id,
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
        .eq('event_id', id);

    if (countError) {
        console.error('Error counting guests:', countError);
    }

    let guests: any[] = [];

    // On précharge seulement si < 2000 invités
    if (count !== null && count < IN_MEMORY_SEARCH_THRESHOLD) {
        const { data: guestsData, error: guestsError } = await supabase
            .from('guests')
            .select('guest_name, table_number, seat_number')
            .eq('event_id', id);

        if (guestsError) {
            console.error('Error fetching guests for preload:', guestsError);
        } else {
            guests = guestsData || [];
        }
    }

    return {
        event: event as Event,
        customization: customizationWithDefaults,
        // Preloaded guests data (vide si >= 2000 invités, pour utiliser l'API)
        guests: guests
    };
};
