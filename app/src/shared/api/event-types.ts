import { useQuery } from '@tanstack/react-query'
import { api } from './wirespec-client'

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
