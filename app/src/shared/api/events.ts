import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from './client'

export interface AttendanceSummary {
  attending: number
  maybe: number
  absent: number
  notResponded: number
}

export interface EventType {
  id: string
  name: string
  color: string | null
}

export interface Event {
  id: string
  type: EventType
  title: string
  description: string | null
  startTime: string
  endTime: string | null
  location: string | null
  attendanceSummary: AttendanceSummary
}

export interface AttendanceEntry {
  id: string
  userId: string
  displayName: string
  state: string
}

export interface EventDetail extends Event {
  attendances: AttendanceEntry[]
}

interface EventList {
  events: Event[]
}

export function useEvents(includePast = false) {
  return useQuery({
    queryKey: ['events', { includePast }],
    queryFn: () => apiFetch<EventList>(`/events?include-past=${includePast}`),
    select: (data) => data.events,
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => apiFetch<EventDetail>(`/events/${id}`),
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (event: {
      eventTypeId: string
      title: string
      description?: string
      startTime: string
      endTime?: string
      location?: string
    }) => apiFetch<Event>('/events', { method: 'POST', body: JSON.stringify(event) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...event }: {
      id: string
      eventTypeId: string
      title: string
      description?: string
      startTime: string
      endTime?: string
      location?: string
    }) => apiFetch<Event>(`/events/${id}`, { method: 'PUT', body: JSON.stringify(event) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiFetch<void>(`/events/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  })
}
