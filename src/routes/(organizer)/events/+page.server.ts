import { redirect, fail } from '@sveltejs/kit';
import type { Database } from '$lib/database/database.types';
import type { Actions } from './$types';

type Event = Database['public']['Tables']['events']['Row'];

export const load = async ({ locals: { supabase, safeGetSession } }: any) => {
    const { session } = await safeGetSession();

    // Redirect to auth if not logged in
    if (!session) {
        throw redirect(303, '/auth');
    }

    // Get user's events
    const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .eq('owner_id', session.user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading events:', error);
    }

    return {
        events: (events as Event[]) || [],
    };
};

export const actions: Actions = {
    delete: async ({ request, locals: { supabase, safeGetSession } }) => {
        const { session } = await safeGetSession();

        if (!session) {
            return fail(401, { error: 'Non autorisé' });
        }

        const formData = await request.formData();
        const eventId = formData.get('eventId') as string;

        if (!eventId) {
            return fail(400, { error: 'ID d\'événement manquant' });
        }

        // Vérifier que l'événement appartient à l'utilisateur
        const { data: event, error: checkError } = await supabase
            .from('events')
            .select('id, owner_id')
            .eq('id', eventId)
            .eq('owner_id', session.user.id)
            .single();

        if (checkError || !event) {
            return fail(404, { error: 'Événement non trouvé' });
        }

        // Supprimer l'événement (cascade supprimera les invités et données liées)
        const { error: deleteError } = await supabase
            .from('events')
            .delete()
            .eq('id', eventId)
            .eq('owner_id', session.user.id);

        if (deleteError) {
            console.error('Error deleting event:', deleteError);
            return fail(500, { error: 'Erreur lors de la suppression de l\'événement' });
        }

        return { success: true };
    },
};
