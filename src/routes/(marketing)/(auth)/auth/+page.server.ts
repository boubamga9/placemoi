export const ssr = false;

import { fail, redirect, type Actions } from '@sveltejs/kit';

import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types.js';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ url }) => {
    const next = url.searchParams.get('next');
    const isCheckout = Boolean(
        typeof next === 'string' &&
        decodeURIComponent(next).match(/^\/checkout\/.+$/),
    );

    return {
        isCheckout,
        form: await superValidate(zod(formSchema)),
    };
};

export const actions: Actions = {
    default: async (event) => {
        // Vérifier si c'est une erreur de rate limiting
        const rateLimitExceeded = event.request.headers.get('x-rate-limit-exceeded');
        if (rateLimitExceeded === 'true') {
            const rateLimitMessage = event.request.headers.get('x-rate-limit-message') || 'Trop de tentatives. Veuillez patienter.';

            // Utiliser setError au lieu de fail pour une meilleure gestion
            const form = await superValidate(zod(formSchema));
            setError(form, '', rateLimitMessage);
            return { form };
        }

        const supabase = event.locals.supabase;
        const form = await superValidate(event, zod(formSchema));
        if (!form.valid) {
            return fail(400, {
                form,
            });
        }

        const { email } = form.data;

        // Utiliser signInWithOtp avec shouldCreateUser: true pour gérer à la fois l'inscription et la connexion
        const {
            error,
            data,
        } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true, // Créer l'utilisateur s'il n'existe pas, sinon se connecter
                emailRedirectTo: undefined
            }
        });

        if (error) {

            // Check to see if sign-ups are disabled in Supabase
            if (
                error.code === 'signup_disabled' ||
                error.message?.includes('Signups not allowed')
            ) {
                return {
                    form,
                    signupDisabled: true,
                };
            }

            // Détecter l'erreur "User already registered"
            if (
                error.code === 'user_already_exists'
            ) {
                return setError(form, '', 'Cet email est déjà utilisé. Veuillez utiliser un autre email.');
            }

            // Détecter d'autres erreurs courantes
            if (error.message?.includes('Invalid email')) {
                return setError(form, 'email', 'Format d\'email invalide. Veuillez vérifier votre adresse email.');
            }

            // Erreur générique pour les autres cas
            console.log(error)
            return setError(form, '', 'Impossible d\'envoyer le code. Veuillez réessayer.');
        }

        // Si l'OTP a été envoyé avec succès, rediriger vers la confirmation
        if (data && email) {
            throw redirect(303, `/confirmation?email=${encodeURIComponent(email)}&type=signup`);
        }


        // Fallback (normalement on ne devrait jamais arriver ici)
        throw redirect(303, '/');
    },
};
