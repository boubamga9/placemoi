-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================
-- These indexes optimize the most common queries in the application

-- Index for guest search queries (most frequent operation)
-- Searches by event_id + guest_name with ILIKE
CREATE INDEX IF NOT EXISTS idx_guests_event_name 
ON guests(event_id, guest_name);

-- Index for event accessibility checks
-- Frequently checks event_date for expiry logic
CREATE INDEX IF NOT EXISTS idx_events_date 
ON events(event_date);

-- Index for slug lookups (public event access)
-- All public guest pages query by slug
CREATE INDEX IF NOT EXISTS idx_events_slug 
ON events(slug) 
WHERE slug IS NOT NULL;

-- Index for payment lookups
-- Frequently queried to check if event is paid
CREATE INDEX IF NOT EXISTS idx_payments_event_status 
ON payments(event_id, status);

-- Index for owner lookups
-- Used in many authenticated queries
CREATE INDEX IF NOT EXISTS idx_events_owner 
ON events(owner_id);

-- Composite index for guest queries by event
-- Used when loading guest lists for organizers
CREATE INDEX IF NOT EXISTS idx_guests_event 
ON guests(event_id);

-- Index for payments by owner
-- Used to check payment history
CREATE INDEX IF NOT EXISTS idx_payments_owner 
ON payments(owner_id);

