import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './wirespec-client'
import type { CreateEventRequest } from './generated/model/CreateEventRequest'
import type { UpdateEventRequest } from './generated/model/UpdateEventRequest'

// Re-export the generated contract types so the app has a single source of truth.
export type { Event } from './generated/model/Event'
export type { EventDetail } from './generated/model/EventDetail'
export type { AttendanceEntry } from './generated/model/AttendanceEntry'
export type { AttendanceSummary } from './generated/model/AttendanceSummary'
export type { RoleCount } from './generated/model/RoleCount'
export type { EventTypeSummary } from './generated/model/EventTypeSummary'
export type { EventReference } from './generated/model/EventReference'
export type { EventSeriesScope } from './generated/model/EventSeriesScope'

import type { EventReference } from './generated/model/EventReference'
import type { EventSeriesScope } from './generated/model/EventSeriesScope'

export interface EventInput {
  eventTypeId: string
  title: string
  description?: string
  startTime: string
  endTime?: string
  location?: string
  references?: EventReference[]
}

export function useEvents(includePast = false, enabled = true) {
  return useQuery({
    queryKey: ['events', { includePast }],
    queryFn: async () => {
      const res = await api.ListEvents({ 'include-past': includePast })
      return res.body
    },
    select: (data) => data.events,
    enabled,
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const res = await api.GetEvent({ id })
      // A missing event is a resolved-but-empty result, not a query error, so the detail page can
      // tell "not found" apart from a real load failure (500/network) and render each distinctly.
      if (res.status === 404) return null
      return res.body
    },
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (event: EventInput) => {
      const res = await api.CreateEvent({ body: event as CreateEventRequest })
      return res.body
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  })
}

// A scoped edit touches many rows (ADR-0014 Phase 3), so the response is an EventList of the
// affected occurrences. `scope` defaults to THIS — a standalone event or a single-occurrence edit.
export function useUpdateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, scope = 'THIS', ...event }: EventInput & { id: string; scope?: EventSeriesScope }) => {
      const res = await api.UpdateEvent({ id, scope, body: event as UpdateEventRequest })
      return res.body
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, scope = 'THIS' }: { id: string; scope?: EventSeriesScope }) =>
      api.DeleteEvent({ id, scope }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  })
}
