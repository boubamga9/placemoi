-- Add a feature flag to allow certain owners to generate QR codes for free
-- Safe to run multiple times thanks to IF NOT EXISTS checks

DO $$ BEGIN
    ALTER TABLE public.owners
    ADD COLUMN IF NOT EXISTS can_generate_qr_free BOOLEAN NOT NULL DEFAULT FALSE;
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- No RLS policy change needed; existing policies already restrict owners to their own rows

