import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url, locals: { supabase } }) => {
    const { id } = params;
    const name = url.searchParams.get('name');

    if (!name) {
        throw error(400, 'Le nom est requis');
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
