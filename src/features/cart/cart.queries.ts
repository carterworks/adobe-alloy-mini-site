import { actions } from 'astro:actions';
// Share options objects instead of making wrapper hooks
// // https://tkdodo.eu/blog/the-query-options-api
import { queryOptions } from '@tanstack/solid-query';

export function cartQueryOptions() {
	return queryOptions({
		queryKey: ['cart'],
		queryFn: () => actions.cart.get.orThrow(),
		initialData: { items: [] },
	});
}
