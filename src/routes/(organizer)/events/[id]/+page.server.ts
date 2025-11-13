import { error, redirect } from '@sveltejs/kit';
import type { Database } from '$lib/database/database.types';
import { STRIPE_PRICES } from '$lib/config/server';
import { generateUniqueSlug } from '$lib/utils/event-utils';

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

    // OPTIMIZED: Execute 3 independent queries in parallel
    const [
        { count, error: countError },
        { data: payment, error: paymentError },
        { data: owner, error: ownerError }
    ] = await Promise.all([
        // 1. Get guests count
        supabase
            .from('guests')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', id),
        // 2. Check if there's a successful payment for this event
        supabase
            .from('payments')
            .select('id, status, stripe_price_id')
            .eq('event_id', id)
            .eq('status', 'succeeded')
            .single(),
        // 3. Check owners flag for free QR generation
        supabase
            .from('owners')
            .select('can_generate_qr_free')
            .eq('id', session.user.id)
            .single()
    ]);

    if (countError) {
        console.error('Error counting guests:', countError);
    }

    if (paymentError && paymentError.code !== 'PGRST116') {
        console.error('Error checking payment:', paymentError);
    }

    if (ownerError && ownerError.code !== 'PGRST116') {
        console.error('Error fetching owner flag:', ownerError);
    }

    const isFree = owner?.can_generate_qr_free === true;

    // If free and no slug yet, generate and persist one so the QR can be built
    if (isFree && !event.slug) {
        try {
            const slug = await generateUniqueSlug(supabase);
            const { error: updateError } = await supabase
                .from('events')
                .update({ slug })
                .eq('id', id);
            if (updateError) {
                console.error('Failed to set slug for free owner:', updateError);
            } else {
                // reflect locally
                (event as Event).slug = slug;
            }
        } catch (e) {
            console.error('Slug generation failed for free owner:', e);
        }
    }

    const hasPayment = isFree || !!payment;
    const activePlan = payment?.stripe_price_id === STRIPE_PRICES.EVENT_WITH_PHOTOS
        ? 'placement_photos'
        : payment
            ? 'placement'
            : isFree
                ? 'placement_photos'
                : null;

    return {
        event: event as Event,
        guestsCount: count || 0,
        hasPayment,
        activePlan,
        stripePrices: {
            placement: STRIPE_PRICES.EVENT,
            placementPhotos: STRIPE_PRICES.EVENT_WITH_PHOTOS || null
        }
    };
};

// No server-side QR code generation needed anymore
// QR code is generated client-side with custom colors
