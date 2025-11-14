-- ============================================================================
-- FIX RLS POLICIES: Ajouter TO public et support événements gratuits
-- ============================================================================
-- Ce script corrige le problème où les utilisateurs anonymes ne peuvent pas
-- accéder à /[slug] car les politiques optimisées n'ont pas TO public
-- 
-- Ajoute également le support pour les événements gratuits via can_generate_qr_free

-- ============================================================================
-- 0) Créer la colonne can_generate_qr_free si elle n'existe pas
-- ============================================================================

DO $$ BEGIN
    ALTER TABLE public.owners
    ADD COLUMN IF NOT EXISTS can_generate_qr_free BOOLEAN NOT NULL DEFAULT FALSE;
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- ============================================================================
-- 1) Helper: fonction sécurisée pour checker le flag sur owners
-- ============================================================================

-- Supprime l'ancienne version si elle existe
DROP FUNCTION IF EXISTS public.owner_has_free(uuid);

-- Crée la fonction en SECURITY DEFINER (bypass RLS si le propriétaire de la fonction
-- est aussi propriétaire de la table owners ; par défaut, c'est "postgres" sur Supabase)
CREATE OR REPLACE FUNCTION public.owner_has_free(p_owner_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((
    SELECT o.can_generate_qr_free
    FROM owners o
    WHERE o.id = p_owner_id
  ), false);
$$;

-- Durcir les permissions : on ne donne l'exécution qu'aux rôles qui en ont besoin
REVOKE ALL ON FUNCTION public.owner_has_free(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.owner_has_free(uuid) TO anon, authenticated;

-- ============================================================================
-- 2) RLS Policies (utilisent owner_has_free() au lieu de SELECT direct sur owners)
-- Conditions:
--  - Le propriétaire voit toujours ses données
--  - Les invités voient un event public (slug IS NOT NULL) SI:
--      paiement réussi OU owner_has_free(owner_id) = true
-- ============================================================================

-- 📅 EVENTS
DROP POLICY IF EXISTS "Users can view accessible events" ON events;

CREATE POLICY "Users can view accessible events"
ON events FOR SELECT 
TO authenticated, anon, public
USING (
  (SELECT auth.uid()) = owner_id
  OR (
    slug IS NOT NULL
    AND (
      EXISTS (
        SELECT 1 FROM payments
        WHERE payments.event_id = events.id
          AND payments.status = 'succeeded'
      )
      OR owner_has_free(events.owner_id)
    )
  )
);

-- 🎨 EVENT CUSTOMIZATIONS
DROP POLICY IF EXISTS "Users can view accessible customizations" ON event_customizations;

CREATE POLICY "Users can view accessible customizations"
ON event_customizations FOR SELECT 
TO authenticated, anon, public
USING (
  EXISTS (
    SELECT 1
    FROM events
    WHERE events.id = event_customizations.event_id
      AND (
        events.owner_id = (SELECT auth.uid())
        OR (
          events.slug IS NOT NULL
          AND (
            EXISTS (
              SELECT 1 FROM payments
              WHERE payments.event_id = events.id
                AND payments.status = 'succeeded'
            )
            OR owner_has_free(events.owner_id)
          )
        )
      )
  )
);

-- 🪑 GUESTS
DROP POLICY IF EXISTS "Users can view accessible guests" ON guests;

CREATE POLICY "Users can view accessible guests"
ON guests FOR SELECT 
TO authenticated, anon, public
USING (
  EXISTS (
    SELECT 1
    FROM events
    WHERE events.id = guests.event_id
      AND (
        events.owner_id = (SELECT auth.uid())
        OR (
          events.slug IS NOT NULL
          AND (
            EXISTS (
              SELECT 1 FROM payments
              WHERE payments.event_id = events.id
                AND payments.status = 'succeeded'
            )
            OR owner_has_free(events.owner_id)
          )
        )
      )
  )
);

-- 💳 PAYMENTS
DROP POLICY IF EXISTS "Users can view accessible payments" ON payments;

CREATE POLICY "Users can view accessible payments"
ON payments FOR SELECT 
TO authenticated, anon, public
USING (
  (SELECT auth.uid()) = owner_id
  OR status = 'succeeded'
);

