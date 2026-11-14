import { queryClient } from './query-client'

/**
 * Called by every request that changes the Active Team. Tenant-scoped query keys carry no team
 * (ADR-0023 §2), so after a switch the cache still holds the previous team's data under the same
 * keys. This discards all of it. resetQueries, not clear(): a switch keeps the same components
 * mounted, and clear() empties the cache without telling those observers to refetch.
 */
export function resetCacheForNewTenant(): Promise<void> {
  return queryClient.resetQueries()
}
