-- ============================================================================
-- ADD DEVICE_ID TO EVENT_PHOTOS TABLE
-- Permet de lier les photos à un appareil sans authentification
-- ============================================================================

-- Ajouter la colonne device_id (nullable, pour rétrocompatibilité)
ALTER TABLE event_photos 
ADD COLUMN IF NOT EXISTS device_id TEXT;

-- Index pour améliorer les performances des requêtes par appareil
CREATE INDEX IF NOT EXISTS event_photos_device_id_idx ON event_photos(device_id);

-- Index composite pour les requêtes par événement et appareil
CREATE INDEX IF NOT EXISTS event_photos_event_device_idx ON event_photos(event_id, device_id);

