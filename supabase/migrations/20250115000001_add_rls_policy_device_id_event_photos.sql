-- ============================================================================
-- ADD RLS POLICY FOR PUBLIC ACCESS TO PHOTOS
-- Permet aux invités de voir les photos des événements publics
-- Le filtrage par device_id est fait côté application dans l'API
-- ============================================================================

-- Les invités peuvent voir les photos des événements publics (avec slug)
-- Note: Le filtrage par device_id pour ne voir que ses propres photos
-- est fait côté application dans l'endpoint API
CREATE POLICY "Public can view photos of public events"
ON event_photos FOR SELECT TO public
USING (
    -- L'événement doit avoir un slug (événement public)
    EXISTS (
        SELECT 1 FROM events
        WHERE events.id = event_photos.event_id
        AND events.slug IS NOT NULL
    )
);

