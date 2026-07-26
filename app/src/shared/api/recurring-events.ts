import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './wirespec-client'
import type { CreateRecurringEventsRequest } from './generated/model/CreateRecurringEventsRequest'

// Re-export the generated contract types so the app has a single source of truth.
export type { CreateRecurringEventsRequest } from './generated/model/CreateRecurringEventsRequest'
export type { RecurrenceRule } from './generated/model/RecurrenceRule'
export type { RecurrenceFrequency } from './generated/model/RecurrenceFrequency'
export type { Weekday } from './generated/model/Weekday'
export type { RecurringEventSeries } from './generated/model/RecurringEventSeries'

// Distinct error the backend raises (422) when a generated start falls outside the team's season;
// surfaced to the caller so the wizard can point at the season rather than a generic failure.
export class OutsideSeasonError extends Error {
  constructor() {
    super('One or more dates fall outside the season window.')
    this.name = 'OutsideSeasonError'
  }
}

export function useCreateRecurringEvents() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: CreateRecurringEventsRequest) => {
      const res = await api.CreateRecurringEvents({ body })
      if (res.status === 422) throw new OutsideSeasonError()
      if (res.status !== 201) throw new Error('Could not create the recurring series.')
      return res.body
    },
    // A batch creates many events across upcoming + past buckets — refresh every events reader.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  })
}
