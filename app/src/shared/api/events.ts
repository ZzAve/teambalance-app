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

export interface EventInput {
  eventTypeId: string
  title: string
  description?: string
  startTime: string
  endTime?: string
  location?: string
}

export function useEvents(includePast = false) {
  return useQuery({
    queryKey: ['events', { includePast }],
    queryFn: async () => {
      const res = await api.ListEvents({ 'include-past': includePast })
      return res.body
    },
    select: (data) => data.events,
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const res = await api.GetEvent({ id })
      if (res.status === 404) throw new Error('Event not found')
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

export function useUpdateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...event }: EventInput & { id: string }) => {
      const res = await api.UpdateEvent({ id, body: event as UpdateEventRequest })
      return res.body
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.DeleteEvent({ id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  })
}
