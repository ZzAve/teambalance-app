import { useQuery } from '@tanstack/react-query'
import { api } from './wirespec-client'

// Re-export the generated contract types so consumers have a single source of truth. The roster
// types live here rather than in events.ts because the event type is where a team *authors* them;
// an event only ever carries an override of one (see events.ts).
export type { EventTypeItem } from './generated/model/EventTypeItem'
export type { RosterRequirement } from './generated/model/RosterRequirement'
export type { PositionTarget } from './generated/model/PositionTarget'

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
