import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url, locals: { supabase } }) => {
    const { id } = params;
    const name = url.searchParams.get('name');

    if (!name) {
        throw error(400, 'Le nom est requis');
    }

    // Search for matching guest names (limit to 10 suggestions)
    const { data: guests, error: searchError } = await supabase
        .from('guests')
        .select('guest_name')
        .eq('event_id', id)
        .ilike('guest_name', `%${name}%`)
        .limit(10);

    if (searchError) {
        console.error('Search error:', searchError);
        return json({ success: false, guests: [] });
    }

    // Remove duplicates (case-insensitive)
    const uniqueNames = Array.from(
        new Set(guests?.map(g => g.guest_name) || [])
    ).map(name => ({ name }));

    return json({
        success: true,
        guests: uniqueNames
    });
};
