import type { Stripe } from 'stripe';
import { error } from '@sveltejs/kit';
import { generateUniqueSlug } from '$lib/utils/event-utils';
import { EmailService } from '$lib/services/email-service';

export async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, locals: any): Promise<void> {

    try {
        // Vérifier que c'est un paiement de commande (pas un abonnement)
        if (session.mode !== 'payment') {
            console.error(`⚠️ Session mode is "${session.mode}", not "payment". Skipping...`);
            return;
        }

        const sessionType = session.metadata?.type;

        console.error('📦 Session type:', sessionType);

        if (sessionType === 'event_payment') {
            console.error('✅ Processing event payment...');
            await handleEventPayment(session, locals);
        } else {
            console.error('⚠️ Unknown session type:', sessionType, 'Metadata:', session.metadata);
        }
    } catch (err) {
        console.error('❌ handleCheckoutSessionCompleted failed:', err);
        throw error(500, 'handleCheckoutSessionCompleted failed: ' + err);
    }
}

export async function handleEventPayment(session: Stripe.Checkout.Session, locals: any): Promise<void> {
    console.error('handleEventPayment called');
    console.error('Session metadata:', session.metadata);

    try {
        const eventId = session.metadata?.eventId;
        const ownerId = session.metadata?.ownerId;
        const amount = session.amount_total ?? 0;

        console.error('Extracted data:', { eventId, ownerId, amount });

        if (!eventId || !ownerId) {
            console.error('Missing required metadata: eventId or ownerId');
            throw error(400, 'Missing required metadata');
        }

        // Generate unique slug for the event
        console.error('Generating unique slug...');
        const slug = await generateUniqueSlug(locals.supabaseServiceRole);
        console.error('Generated slug:', slug);

        // Update event with the slug (no QR code generation here)
        console.error('Updating event with slug...');
        const { error: eventUpdateError } = await locals.supabaseServiceRole
            .from('events')
            .update({ slug })
            .eq('id', eventId);

        if (eventUpdateError) {
            console.error('Event update error:', eventUpdateError);
            throw error(500, 'Failed to update event');
        }

        console.error('Event updated successfully with slug:', slug);

        const { data: paymentData, error: paymentError } = await locals.supabaseServiceRole
            .from('payments')
            .insert({
                event_id: eventId,
                owner_id: ownerId,
                stripe_payment_intent_id: session.payment_intent as string,
                stripe_session_id: session.id,
                amount: amount / 100,
                currency: session.currency || 'eur',
                status: 'succeeded'
            })
            .select();

        if (paymentError) {
            console.error('Payment insert error:', paymentError);
            throw error(500, `Failed to create payment record: ${paymentError.message}`);
        }

        console.error('Payment record created successfully:', paymentData);
        console.error(`Event payment successful: eventId=${eventId}, slug=${slug}`);

        // Fetch event and owner details for email
        const { data: event, error: eventFetchError } = await locals.supabaseServiceRole
            .from('events')
            .select('event_name, event_date')
            .eq('id', eventId)
            .single();

        const { data: owner, error: ownerFetchError } = await locals.supabaseServiceRole
            .from('owners')
            .select('email')
            .eq('id', ownerId)
            .single();

        if (eventFetchError || !event) {
            console.error('Error fetching event for email:', eventFetchError);
        } else if (ownerFetchError || !owner) {
            console.error('Error fetching owner for email:', ownerFetchError);
        } else {
            // Send payment confirmation email (non-blocking)
            EmailService.sendPaymentConfirmation({
                customerEmail: owner.email,
                eventName: event.event_name,
                eventDate: event.event_date,
                amount: amount / 100,
                currency: session.currency || 'eur',
                slug: slug
            }).catch((emailError) => {
                // Log error but don't fail the webhook
                console.error('Error sending payment confirmation email:', emailError);
            });
        }

    } catch (err) {
        console.error('handleEventPayment failed:', err);
        throw error(500, 'handleEventPayment failed: ' + err);
    }
}
