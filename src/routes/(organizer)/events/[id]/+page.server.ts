import { error, redirect } from '@sveltejs/kit';
import type { Database } from '$lib/database/database.types';
import { STRIPE_PRICES } from '$lib/config/server';

type Event = Database['public']['Tables']['events']['Row'];

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

    // Get guests count
    const { count, error: countError } = await supabase
        .from('guests')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id);

    if (countError) {
        console.error('Error counting guests:', countError);
    }

    // Check if there's a successful payment for this event
    const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('id, status')
        .eq('event_id', id)
        .eq('status', 'succeeded')
        .single();

    if (paymentError && paymentError.code !== 'PGRST116') {
        console.error('Error checking payment:', paymentError);
    }

    return {
        event: event as Event,
        guestsCount: count || 0,
        hasPayment: !!payment,
        stripePriceId: STRIPE_PRICES.EVENT
    };
};

// No server-side QR code generation needed anymore
// QR code is generated client-side with custom colors
