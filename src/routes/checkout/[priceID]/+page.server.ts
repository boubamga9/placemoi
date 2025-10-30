import { error, redirect } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
	params,
	url,
	locals: { safeGetSession, supabaseServiceRole: _supabaseServiceRole, stripe },
}) => {
	const { session, user } = await safeGetSession();
	if (!session || !user) {
		const search = new URLSearchParams(url.search);
		search.set('next', url.pathname);
		return redirect(303, `/register?${search.toString()}`);
	}

	let price;
	try {
		price = await stripe.prices.retrieve(params.priceID);

	} catch (stripeError: unknown) {
		error(404, `Price ID "${params.priceID}" not found in Stripe. Please configure your Stripe products and prices.`);
	}

	const customAmount = price.custom_unit_amount
		? url.searchParams.has('customAmount')
			? parseInt(url.searchParams.get('customAmount') || '0', 10) * 100
			: price.custom_unit_amount.preset || 0
		: null;

	const amount =
		customAmount !== null && !isNaN(customAmount)
			? customAmount
			: price.unit_amount;
	if (amount === 0) {
		return redirect(303, '/dashboard');
	}

	// Créer ou récupérer un customer Stripe (Stripe déduplique automatiquement par email)
	let customer: string;
	try {
		const stripeCustomer = await stripe.customers.create({
			email: user.email,
			metadata: {
				user_id: user.id,
			},
		});
		customer = stripeCustomer.id;
	} catch (customerError) {
		console.error('Error creating Stripe customer:', customerError);
		throw error(500, 'Error creating customer. Please try again.');
	}

	const lineItems: Stripe.Checkout.SessionCreateParams['line_items'] = [
		{
			...(price.custom_unit_amount
				? {
					price_data: {
						unit_amount:
							customAmount != null && !isNaN(customAmount) ? customAmount : 0,
						currency: price.currency,
						product: price.product as string,
					},
				}
				: { price: price.id }),
			quantity: 1,
		},
	];

	let checkoutUrl;
	try {
		// Check if this is an event payment
		const eventId = url.searchParams.get('eventId');
		const isEventPayment = eventId !== null;

		const metadata: Record<string, string> = isEventPayment
			? {
				type: 'event_payment',
				eventId: eventId!,
				ownerId: user.id,
			}
			: {};

		const successUrl = isEventPayment
			? `${url.origin}/events/${eventId}`
			: `${url.origin}/dashboard`;

		const cancelUrl = isEventPayment
			? `${url.origin}/events/${eventId}`
			: `${url.origin}/subscription`;

		const checkoutSession = await stripe.checkout.sessions.create({
			line_items: lineItems,
			customer,
			mode: 'payment',
			success_url: successUrl,
			cancel_url: cancelUrl,
			metadata,
			invoice_creation: {
				enabled: true,
			},
		});

		checkoutUrl = checkoutSession.url;
	} catch (e) {
		if (e instanceof Stripe.errors.StripeError) {
			throw error(500, `Stripe Error: ${e.message}`);
		} else {
			throw error(500, 'Unknown Error: If issue persists please contact us.');
		}
	}

	redirect(303, checkoutUrl ?? '/pricing');
};
