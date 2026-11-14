import { queryClient } from './query-client'

/**
 * The Active Team or the session changed, so everything cached belongs to another tenant or another
 * user. Tenant-scoped query keys carry no team (ADR-0023 §2), which makes this the only thing that
 * keeps them honest. resetQueries, not clear(): a switch keeps the same components mounted, and
 * clear() empties the cache without telling those observers to refetch.
 */
export function resetCacheForNewTenant(): Promise<void> {
  return queryClient.resetQueries()
}
