-- Remove the full_name column from owners and update signup trigger function

-- 1) Drop column if it exists
ALTER TABLE public.owners
DROP COLUMN IF EXISTS full_name;

-- 2) Update the signup trigger function to stop referencing full_name
CREATE OR REPLACE FUNCTION create_owner_on_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.owners (id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

