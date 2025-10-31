import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isEventAccessible } from '$lib/utils/event-utils';

export const GET: RequestHandler = async ({ params, url, locals: { supabase } }) => {
    const { id } = params;
    const name = url.searchParams.get('name');

    if (!name) {
        throw error(400, 'Le nom est requis');
    }

    // Check if event exists and is accessible
    const { data: event, error: eventError } = await supabase
        .from('events')
        .select('event_date')
        .eq('id', id)
        .single();

    if (eventError || !event) {
        throw error(404, 'Événement non trouvé');
    }

    if (!isEventAccessible(event.event_date)) {
        throw error(410, 'Cet événement n\'est plus accessible');
    }

    // Search for guest in the event
    const { data: guest, error: searchError } = await supabase
        .from('guests')
        .select('table_number, seat_number')
        .eq('event_id', id)
        .ilike('guest_name', `%${name}%`)
        .single();

    if (searchError || !guest) {
        return json({ success: false, guest: null });
    }

    return json({
        success: true,
        guest: {
            table_number: guest.table_number,
            seat_number: guest.seat_number
        }
    });
};
