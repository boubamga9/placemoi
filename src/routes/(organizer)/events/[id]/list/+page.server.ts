import { error, redirect, fail } from '@sveltejs/kit';
import type { Database } from '$lib/database/database.types';
import { isEventAccessible } from '$lib/utils/event-utils';
import { handleDuplicateGuestName } from '$lib/utils/guest-utils';

type Event = Database['public']['Tables']['events']['Row'];
type Guest = Database['public']['Tables']['guests']['Row'];

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

    // Get guests for this event
    const { data: guests, error: guestsError } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', id)
        .order('table_number', { ascending: true })
        .order('seat_number', { ascending: true });

    if (guestsError) {
        console.error('Error fetching guests:', guestsError);
    }

    // Group guests by table
    const guestsByTable: Record<string, Guest[]> = {};
    if (guests) {
        for (const guest of guests) {
            const tableNumber = guest.table_number || 'Sans table';
            if (!guestsByTable[tableNumber]) {
                guestsByTable[tableNumber] = [];
            }
            guestsByTable[tableNumber].push(guest as Guest);
        }
    }

    return {
        event: event as Event,
        guestsByTable,
        totalGuests: guests?.length || 0,
        isEventAccessible: isEventAccessible(event.event_date)
    };
};

export const actions = {
    addGuest: async ({ request, params, locals: { supabase, safeGetSession } }: any) => {
        const { session } = await safeGetSession();

        if (!session) {
            throw redirect(303, '/auth');
        }

        const formData = await request.formData();
        let guestName = formData.get('guest_name') as string;
        const tableNumber = formData.get('table_number') as string;
        const seatNumber = formData.get('seat_number') as string;

        if (!guestName || !tableNumber) {
            return fail(400, { error: 'Le nom et la table sont requis' });
        }

        // Check if event is still accessible (5 days after event_date)
        const { data: event, error: eventError } = await supabase
            .from('events')
            .select('event_date')
            .eq('id', params.id)
            .eq('owner_id', session.user.id)
            .single();

        if (eventError || !event) {
            return fail(404, { error: 'Événement non trouvé' });
        }

        if (!isEventAccessible(event.event_date)) {
            return fail(410, { error: 'Impossible d\'ajouter des invités : cet événement n\'est plus accessible (5 jours après la date de l\'événement)' });
        }

        // Check if a guest with the same name already exists and handle duplicates
        const { data: existingGuests, error: checkError } = await supabase
            .from('guests')
            .select('guest_name')
            .eq('event_id', params.id);

        if (checkError) {
            console.error('Error checking existing guests:', checkError);
        }

        // Handle duplicate names using utility function
        const existingNames = existingGuests?.map(g => g.guest_name) || [];
        guestName = handleDuplicateGuestName(guestName, existingNames);

        // Insert guest with potentially modified name
        const { error: insertError } = await supabase
            .from('guests')
            .insert({
                event_id: params.id,
                guest_name: guestName,
                table_number: tableNumber,
                seat_number: seatNumber || null
            });

        if (insertError) {
            console.error('Error inserting guest:', insertError);
            return fail(500, { error: 'Erreur lors de l\'ajout de l\'invité' });
        }

        return { success: true };
    },

    removeGuest: async ({ request, params, locals: { supabase, safeGetSession } }: any) => {
        const { session } = await safeGetSession();

        if (!session) {
            throw redirect(303, '/auth');
        }

        const formData = await request.formData();
        const guestId = formData.get('guest_id') as string;

        if (!guestId) {
            return fail(400, { error: 'ID invité manquant' });
        }

        // Delete guest
        const { error: deleteError } = await supabase
            .from('guests')
            .delete()
            .eq('id', guestId)
            .eq('event_id', params.id);

        if (deleteError) {
            console.error('Error deleting guest:', deleteError);
            return fail(500, { error: 'Erreur lors de la suppression de l\'invité' });
        }

        return { success: true };
    },

    deleteAllGuests: async ({ params, locals: { supabase, safeGetSession } }: any) => {
        const { session } = await safeGetSession();

        if (!session) {
            throw redirect(303, '/auth');
        }

        // Verify event ownership
        const { data: event, error: eventError } = await supabase
            .from('events')
            .select('id')
            .eq('id', params.id)
            .eq('owner_id', session.user.id)
            .single();

        if (eventError || !event) {
            return fail(404, { error: 'Événement non trouvé' });
        }

        // Delete all guests for this event
        const { error: deleteError } = await supabase
            .from('guests')
            .delete()
            .eq('event_id', params.id);

        if (deleteError) {
            console.error('Error deleting all guests:', deleteError);
            return fail(500, { error: 'Erreur lors de la suppression des invités' });
        }

        return { success: true };
    }
};
