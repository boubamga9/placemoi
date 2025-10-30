import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyWebhookSignature } from '../utils/webhook-verification';
import { checkIdempotence } from '../utils/idempotence';
import { handleCheckoutSessionCompleted } from '../handlers/checkout-handlers';
import type { Stripe } from 'stripe';
import { PRIVATE_STRIPE_WEBHOOK_SECRET_PAYMENTS } from '$env/static/private';

const endpointSecret = PRIVATE_STRIPE_WEBHOOK_SECRET_PAYMENTS;

export const POST: RequestHandler = async ({ request, locals }) => {

    try {

        const event = await verifyWebhookSignature(request, endpointSecret);

        // 2. Vérifier l'idempotence
        await checkIdempotence(event.id, locals);

        // 3. Router vers le bon handler
        switch (event.type) {
            case 'checkout.session.completed':
                console.error('💳 checkout.session.completed event received');
                const session = event.data.object as Stripe.Checkout.Session;

                await handleCheckoutSessionCompleted(session, locals);
                console.error('✅ checkout.session.completed handled successfully');
                break;

            default:
                console.error(`⚠️ Unhandled event type: ${event.type}`);
        }

        console.log('✅ Webhook processing completed successfully');
        return json({ received: true });

    } catch (err) {
        console.error('❌ Webhook processing failed:', err);
        return new Response('Webhook processing failed', { status: 500 });
    }
};