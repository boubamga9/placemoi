-- ============================================================================
-- INITIAL SCHEMA FOR SEATLY - Wedding Seating Management (FIXED RLS)
-- ============================================================================

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE event_type_enum AS ENUM ('wedding', 'anniversary', 'baptism', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS owners (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
    event_name TEXT NOT NULL,
    event_date DATE NOT NULL,
    slug TEXT UNIQUE,
    event_type event_type_enum NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_customizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    background_image_url TEXT,
    background_color TEXT DEFAULT '#FFF9F4',
    font_color TEXT DEFAULT '#2C3E50',
    font_family TEXT DEFAULT 'Inter',
    logo_url TEXT,
    welcome_text TEXT,
    subtitle_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id)
);

CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    table_number TEXT NOT NULL,
    seat_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT,
    stripe_session_id TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'eur',
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stripe_events (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TRIGGERS AND FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_owner_on_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.owners (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_owners_updated_at BEFORE UPDATE ON owners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_customizations_updated_at BEFORE UPDATE ON event_customizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guests_updated_at BEFORE UPDATE ON guests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER create_owner_on_signup_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_owner_on_signup();

-- ============================================================================
-- ENABLE RLS
-- ============================================================================

ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES (FIXED)
-- ============================================================================

-- 🧍 OWNERS
CREATE POLICY "Owners can view their own data" ON owners FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Owners can update their own data" ON owners FOR UPDATE USING (auth.uid() = id);

-- 📅 EVENTS
CREATE POLICY "Owners can manage their events"
ON events FOR ALL TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Public can view paid events"
ON events FOR SELECT TO public
USING (
  slug IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM payments
    WHERE payments.event_id = events.id
    AND payments.status = 'succeeded'
  )
);

-- 🎨 EVENT CUSTOMIZATIONS
CREATE POLICY "Owners can manage their customizations"
ON event_customizations FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM events WHERE events.id = event_customizations.event_id AND events.owner_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM events WHERE events.id = event_customizations.event_id AND events.owner_id = auth.uid())
);

CREATE POLICY "Public can view customization of paid events"
ON event_customizations FOR SELECT TO public
USING (
  EXISTS (
    SELECT 1
    FROM events
    JOIN payments ON payments.event_id = events.id
    WHERE events.id = event_customizations.event_id
    AND events.slug IS NOT NULL
    AND payments.status = 'succeeded'
  )
);

-- 🪑 GUESTS
CREATE POLICY "Owners can manage their guests"
ON guests FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM events WHERE events.id = guests.event_id AND events.owner_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM events WHERE events.id = guests.event_id AND events.owner_id = auth.uid())
);

CREATE POLICY "Public can view guests of paid events"
ON guests FOR SELECT TO public
USING (
  EXISTS (
    SELECT 1
    FROM events
    JOIN payments ON payments.event_id = events.id
    WHERE events.id = guests.event_id
    AND events.slug IS NOT NULL
    AND payments.status = 'succeeded'
  )
);

-- 💳 PAYMENTS
CREATE POLICY "Owners can view their payments" ON payments FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Public can view succeeded payments" ON payments FOR SELECT TO public USING (status = 'succeeded');
CREATE POLICY "System can insert payments" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update payments" ON payments FOR UPDATE USING (true);

-- 📩 CONTACT MESSAGES
CREATE POLICY "Anyone can send messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- ⚙️ STRIPE EVENTS
CREATE POLICY "Service role can manage stripe_events" ON stripe_events
FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- ============================================================================
-- STORAGE BUCKET (Event Assets)
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('event-customizations', 'event-customizations', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload event customizations"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'event-customizations');

CREATE POLICY "Anyone can read event customizations"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'event-customizations');

CREATE POLICY "Anyone can delete their own event customizations"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'event-customizations');
