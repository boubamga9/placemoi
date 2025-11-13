-- Add column to store the Stripe price identifier used for the payment
alter table payments
    add column if not exists stripe_price_id text;

-- Optional: index to speed up lookups by price if needed in the future
create index if not exists payments_stripe_price_id_idx on payments (stripe_price_id);
