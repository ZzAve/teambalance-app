import { useQuery } from '@tanstack/react-query'
import { apiFetch } from './client'

interface EventTypeItem {
  id: string
  name: string
  color: string | null
}

interface EventTypeList {
  eventTypes: EventTypeItem[]
}

export function useEventTypes() {
  return useQuery({
    queryKey: ['event-types'],
    queryFn: () => apiFetch<EventTypeList>('/event-types'),
    select: (data) => data.eventTypes,
    staleTime: Infinity,
  })
}
