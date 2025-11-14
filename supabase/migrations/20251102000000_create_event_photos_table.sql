-- ============================================================================
-- CREATE EVENT_PHOTOS TABLE
-- Table pour stocker les métadonnées des photos/vidéos uploadées par les invités
-- ============================================================================

CREATE TABLE IF NOT EXISTS event_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type TEXT NOT NULL,
    backblaze_file_id TEXT NOT NULL,
    backblaze_file_name TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances des requêtes par événement
CREATE INDEX IF NOT EXISTS event_photos_event_id_idx ON event_photos(event_id);
CREATE INDEX IF NOT EXISTS event_photos_uploaded_at_idx ON event_photos(uploaded_at DESC);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_event_photos_updated_at 
    BEFORE UPDATE ON event_photos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE event_photos ENABLE ROW LEVEL SECURITY;

-- Les organisateurs peuvent voir toutes les photos de leurs événements
CREATE POLICY "Owners can view photos of their events"
ON event_photos FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM events
        WHERE events.id = event_photos.event_id
        AND events.owner_id = auth.uid()
    )
);

-- Les invités peuvent uploader des photos (via API publique)
-- Note: L'upload sera géré via une API server-side qui vérifie l'accès
CREATE POLICY "Public can insert photos for accessible events"
ON event_photos FOR INSERT TO public
WITH CHECK (
    EXISTS (
        SELECT 1 FROM events
        WHERE events.id = event_photos.event_id
        AND events.slug IS NOT NULL
        -- L'API vérifiera que l'événement est accessible (pas plus de 5 jours après)
    )
);

-- Les organisateurs peuvent supprimer les photos de leurs événements
CREATE POLICY "Owners can delete photos of their events"
ON event_photos FOR DELETE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM events
        WHERE events.id = event_photos.event_id
        AND events.owner_id = auth.uid()
    )
);

