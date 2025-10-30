import { redirect, fail } from '@sveltejs/kit';
import { superValidate, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createEventSchema } from '$lib/validations';

export const load = async ({ locals: { safeGetSession } }: any) => {
    const { session } = await safeGetSession();

    if (!session) {
        throw redirect(303, '/auth');
    }

    const form = await superValidate(zod(createEventSchema));

    return {
        form
    };
};

export const actions = {
    default: async ({ request, locals: { supabase, safeGetSession } }: any) => {
        const { session } = await safeGetSession();

        if (!session) {
            throw redirect(303, '/auth');
        }

        const form = await superValidate(request, zod(createEventSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const { event_name, event_date, event_type } = form.data;

        // Get owner_id from owners table
        const { data: owner } = await supabase
            .from('owners')
            .select('id')
            .eq('id', session.user.id)
            .single();

        if (!owner) {
            return setError(form, '', 'Erreur lors de la récupération du propriétaire');
        }

        // Create the event
        const { data: event, error } = await supabase
            .from('events')
            .insert({
                owner_id: owner.id,
                event_name,
                event_date: event_date, // Already in YYYY-MM-DD format
                event_type
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating event:', error);
            return setError(form, '', 'Erreur lors de la création de l\'événement');
        }

        // Redirect to list page
        throw redirect(303, `/events/${event.id}/list`);
    }
};
