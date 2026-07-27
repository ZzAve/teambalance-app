import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './wirespec-client'
import type { CreateRecurringEventsRequest } from './generated/model/CreateRecurringEventsRequest'

// Re-export the generated contract types so the app has a single source of truth.
export type { CreateRecurringEventsRequest } from './generated/model/CreateRecurringEventsRequest'
export type { RecurrenceRule } from './generated/model/RecurrenceRule'
export type { RecurrenceFrequency } from './generated/model/RecurrenceFrequency'
export type { Weekday } from './generated/model/Weekday'
export type { RecurringEventSeries } from './generated/model/RecurringEventSeries'

// The distinct business-rule rejections the backend returns as 422, discriminated by the response
// body's `code` so the wizard can show the right reason instead of a generic failure.
export type RecurringCreateReason = 'outside-season' | 'over-cap' | 'empty' | 'unknown'

export class RecurringCreateError extends Error {
  constructor(public readonly reason: RecurringCreateReason) {
    super(reason)
    this.name = 'RecurringCreateError'
  }
}

const REASON_BY_CODE: Record<string, RecurringCreateReason> = {
  EVENT_OUTSIDE_SEASON: 'outside-season',
  RECURRENCE_EXCEEDS_CAP: 'over-cap',
  EMPTY_RECURRENCE: 'empty',
}

export function useCreateRecurringEvents() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: CreateRecurringEventsRequest) => {
      const res = await api.CreateRecurringEvents({ body })
      if (res.status === 201) return res.body
      if (res.status === 422) {
        // The 422 body carries a machine-readable `code` (GlobalExceptionHandler); the three
        // recurrence rejections must not be conflated into one message.
        const code = (res.body as unknown as { code?: string } | undefined)?.code
        throw new RecurringCreateError((code && REASON_BY_CODE[code]) || 'unknown')
      }
      throw new RecurringCreateError('unknown')
    },
    // A batch creates many events across upcoming + past buckets — refresh every events reader.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  })
}
