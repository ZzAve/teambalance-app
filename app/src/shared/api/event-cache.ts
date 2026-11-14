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

/** One event's detail, a list of events, or the list query's raw `{ events }` response. */
export type CachedEvents<E extends { id: string }> = E | E[] | { events: E[] }

/** Applies [patch] to the event with [eventId], whichever of the cached shapes holds it. */
export function patchCachedEvent<E extends { id: string }, C extends CachedEvents<E>>(
  cached: C,
  eventId: string,
  patch: (event: E) => E,
): C {
  const one = (e: E) => (e.id === eventId ? patch(e) : e)
  if (Array.isArray(cached)) return cached.map(one) as C
  if ('events' in cached) return { ...cached, events: cached.events.map(one) } as C
  return one(cached as E) as C
}
