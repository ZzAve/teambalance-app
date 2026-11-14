import type { QueryClient } from '@tanstack/react-query'

/**
 * Patches every cached events read — the list in each of its keys and each event's detail — so a
 * write shows at once wherever the event is on screen. Cancels in-flight fetches first, so a stale
 * response cannot land over the patch. Returns the snapshots for the rollback in `onError`.
 */
export async function patchCachedEvents<T>(queryClient: QueryClient, patch: (cached: T) => T) {
  await queryClient.cancelQueries({ queryKey: ['events'] })
  const previous = queryClient.getQueriesData<T>({ queryKey: ['events'] })
  queryClient.setQueriesData<T>({ queryKey: ['events'] }, (cached) => cached && patch(cached))
  return { previous }
}

export const rollBack = (queryClient: QueryClient, context: { previous: [readonly unknown[], unknown][] } | undefined) =>
  context?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data))
