import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
	url,
	locals: { safeGetSession },
	request,
}) => {
	const { session } = await safeGetSession();

	const referer = request.headers.get('referer') || '';
	const refererPath = referer ? new URL(referer).pathname : '';


	// if the user is already logged in return them to the events page
	if (session && !refererPath.startsWith('/confirmation')) {
		console.log('redirecting to events');
		redirect(303, '/events');
	}

	return {
		session,
		url: url.origin,
	};
};
