import type { APIRoute } from 'astro';
import { addNetworkJitter } from '~/lib/util.ts';

export const POST: APIRoute = async ({}) => {
	const fail = await addNetworkJitter();
	if (fail) {
		return new Response(null, {
			status: 500,
		});
	}

	return new Response(null, {
		status: 201,
		headers: {
			'Set-Cookie': 'tracking-id=1234567890; path=/; SameSite=None; Secure;',
		},
	});
};
