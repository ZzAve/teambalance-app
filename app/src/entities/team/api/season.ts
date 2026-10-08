import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@shared/api/wirespec-client'
import { throwOnStatus } from '@shared/api/errors'
import { queryKeys } from '@shared/api/query-keys'

// Re-export the generated contract type so the app has a single source of truth.
export type { Season } from '@shared/api/generated/model/Season'

// A season bound is an ISO date string ("2026-09-01") or undefined (unbounded on that side).
export interface SeasonInput {
  start?: string
  end?: string
}

// The current team's season window. Readable by any member (GET has no 403). Keyed queryKeys.season so a
// SetSeason mutation invalidating that prefix refreshes every reader.
export function useSeason() {
  return useQuery({
    queryKey: queryKeys.season,
    queryFn: async () => {
      const res = await api.GetSeason()
      return res.body
    },
  })
}

export function useSetSeason() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ start, end }: SeasonInput) => {
      const res = await api.SetSeason({ body: { start: start || undefined, end: end || undefined } })
      throwOnStatus(res, { 403: () => new Error('You are not allowed to change the season.') })
      return res.body
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.season }),
  })
}
