-- ============================================================================
-- ADD RLS POLICY FOR PUBLIC ACCESS TO PHOTOS
-- Permet aux invités de voir les photos des événements publics
-- Le filtrage par device_id est fait au niveau RLS ET côté application
-- ============================================================================

-- Supprimer l'ancienne politique si elle existe
DROP POLICY IF EXISTS "Public can view photos of public events" ON event_photos;

-- Les invités peuvent voir les photos des événements publics (avec slug)
-- Note: Le filtrage par device_id est fait côté application dans l'API
-- pour des raisons de performance et de simplicité. La politique RLS
-- s'assure que seules les photos des événements publics sont accessibles.
-- Le filtrage par device_id dans l'API garantit que chaque utilisateur
-- ne voit que ses propres photos.
CREATE POLICY "Public can view photos of public events"
ON event_photos FOR SELECT TO public
USING (
    -- L'événement doit avoir un slug (événement public)
    EXISTS (
        SELECT 1 FROM events
        WHERE events.id = event_photos.event_id
        AND events.slug IS NOT NULL
    )
    -- Le device_id doit être présent (pas NULL)
    -- Le filtrage exact par device_id est fait côté application dans l'API
    AND device_id IS NOT NULL
);

