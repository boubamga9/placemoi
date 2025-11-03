import { error } from '@sveltejs/kit';
import type { Database } from '$lib/database/database.types';
import { isEventAccessible } from '$lib/utils/event-utils';

type Event = Database['public']['Tables']['events']['Row'];
type EventCustomization = Database['public']['Tables']['event_customizations']['Row'];

export const load = async ({ params, locals: { supabase } }: any) => {
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

    return {
        event: event as Event,
        customization: customizationWithDefaults
    };
};
