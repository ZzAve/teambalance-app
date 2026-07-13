import { useQuery } from '@tanstack/react-query'
import { api } from './wirespec-client'

// Re-export the generated contract type so consumers have a single source of truth.
export type { EventTypeItem } from './generated/model/EventTypeItem'

export function useEventTypes() {
  return useQuery({
    queryKey: ['event-types'],
    queryFn: async () => {
      const res = await api.ListEventTypes()
      return res.body
    },
    select: (data) => data.eventTypes,
    staleTime: Infinity,
  })
}
