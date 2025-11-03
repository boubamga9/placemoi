-- ============================================================================
-- OPTIMIZE RLS POLICIES: Replace auth.uid() with (select auth.uid())
-- and merge multiple permissive policies into single ones
-- ============================================================================
-- This migration fixes performance issues:
-- 1. auth.uid() was being re-evaluated for each row instead of once per query
-- 2. Multiple permissive policies force PostgreSQL to evaluate all of them

-- 🧍 OWNERS
DROP POLICY IF EXISTS "Owners can view their own data" ON owners;
CREATE POLICY "Owners can view their own data" ON owners FOR SELECT USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Owners can update their own data" ON owners;
CREATE POLICY "Owners can update their own data" ON owners FOR UPDATE USING ((select auth.uid()) = id);

-- 📅 EVENTS
-- Merge "Owners can manage their events" and "Public can view paid events"
-- Separate SELECT from other operations to avoid policy overlap
DROP POLICY IF EXISTS "Owners can manage their events" ON events;
DROP POLICY IF EXISTS "Public can view paid events" ON events;

CREATE POLICY "Users can view accessible events"
ON events FOR SELECT
USING (
  -- Owner can see their own events
  ((select auth.uid()) = owner_id)
  OR
  -- Anyone can see public paid events
  (
    slug IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM payments
      WHERE payments.event_id = events.id
      AND payments.status = 'succeeded'
    )
  )
);

CREATE POLICY "Owners can insert their events"
ON events FOR INSERT TO authenticated
WITH CHECK ((select auth.uid()) = owner_id);

CREATE POLICY "Owners can update their events"
ON events FOR UPDATE TO authenticated
USING ((select auth.uid()) = owner_id)
WITH CHECK ((select auth.uid()) = owner_id);

CREATE POLICY "Owners can delete their events"
ON events FOR DELETE TO authenticated
USING ((select auth.uid()) = owner_id);

-- 🎨 EVENT CUSTOMIZATIONS
-- Merge policies: authenticated users can see their own OR public paid events
-- Separate SELECT from other operations to avoid policy overlap
DROP POLICY IF EXISTS "Owners can manage their customizations" ON event_customizations;
DROP POLICY IF EXISTS "Public can view customization of paid events" ON event_customizations;

CREATE POLICY "Users can view accessible customizations"
ON event_customizations FOR SELECT
USING (
  -- Owner can see their own customizations
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = event_customizations.event_id 
    AND events.owner_id = (select auth.uid())
  )
  OR
  -- Anyone can see customizations of public paid events
  EXISTS (
    SELECT 1
    FROM events
    JOIN payments ON payments.event_id = events.id
    WHERE events.id = event_customizations.event_id
    AND events.slug IS NOT NULL
    AND payments.status = 'succeeded'
  )
);

CREATE POLICY "Owners can insert their customizations"
ON event_customizations FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM events WHERE events.id = event_customizations.event_id AND events.owner_id = (select auth.uid()))
);

CREATE POLICY "Owners can update their customizations"
ON event_customizations FOR UPDATE TO authenticated
USING (
  EXISTS (SELECT 1 FROM events WHERE events.id = event_customizations.event_id AND events.owner_id = (select auth.uid()))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM events WHERE events.id = event_customizations.event_id AND events.owner_id = (select auth.uid()))
);

CREATE POLICY "Owners can delete their customizations"
ON event_customizations FOR DELETE TO authenticated
USING (
  EXISTS (SELECT 1 FROM events WHERE events.id = event_customizations.event_id AND events.owner_id = (select auth.uid()))
);

-- 🪑 GUESTS
-- Merge policies: authenticated users can see their own guests OR public paid event guests
-- Separate SELECT from other operations to avoid policy overlap
DROP POLICY IF EXISTS "Owners can manage their guests" ON guests;
DROP POLICY IF EXISTS "Public can view guests of paid events" ON guests;

CREATE POLICY "Users can view accessible guests"
ON guests FOR SELECT
USING (
  -- Owner can see their own guests
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = guests.event_id 
    AND events.owner_id = (select auth.uid())
  )
  OR
  -- Anyone can see guests of public paid events
  EXISTS (
    SELECT 1
    FROM events
    JOIN payments ON payments.event_id = events.id
    WHERE events.id = guests.event_id
    AND events.slug IS NOT NULL
    AND payments.status = 'succeeded'
  )
);

CREATE POLICY "Owners can insert their guests"
ON guests FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM events WHERE events.id = guests.event_id AND events.owner_id = (select auth.uid()))
);

CREATE POLICY "Owners can update their guests"
ON guests FOR UPDATE TO authenticated
USING (
  EXISTS (SELECT 1 FROM events WHERE events.id = guests.event_id AND events.owner_id = (select auth.uid()))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM events WHERE events.id = guests.event_id AND events.owner_id = (select auth.uid()))
);

CREATE POLICY "Owners can delete their guests"
ON guests FOR DELETE TO authenticated
USING (
  EXISTS (SELECT 1 FROM events WHERE events.id = guests.event_id AND events.owner_id = (select auth.uid()))
);

-- 💳 PAYMENTS
-- Merge "Owners can view their payments" and "Public can view succeeded payments"
-- Single policy that handles both cases with OR
DROP POLICY IF EXISTS "Owners can view their payments" ON payments;
DROP POLICY IF EXISTS "Public can view succeeded payments" ON payments;

CREATE POLICY "Users can view accessible payments"
ON payments FOR SELECT
USING (
  -- Owner can see their own payments
  ((select auth.uid()) = owner_id)
  OR
  -- Anyone can see succeeded payments (for public event verification)
  (status = 'succeeded')
);

