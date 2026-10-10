import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './wirespec-client'
import type { CalendarLink } from './generated/model/CalendarLink'
import type { CalendarLinkRequest } from './generated/model/CalendarLinkRequest'

// Re-export the generated contract types so the app has a single source of truth.
export type { CalendarLink } from './generated/model/CalendarLink'
export type { CalendarLinkRequest } from './generated/model/CalendarLinkRequest'
export type { AttendanceState } from './generated/model/AttendanceState'

// The caller's own links in the Active Team, newest first (ADR-0039). Keyed ['calendar-links'] so
// a create, edit or delete invalidating that key refreshes the list.
export function useCalendarLinks() {
  return useQuery({
    queryKey: ['calendar-links'],
    queryFn: async () => {
      const res = await api.ListCalendarLinks()
      // 403 (no team, or acting as this team — ADR-0024) has no list to show: surface it as an error.
      if (res.status !== 200) throw new Error(`Couldn't load calendar links (${res.status})`)
      return res.body.links
    },
  })
}

export function useCreateCalendarLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (request: CalendarLinkRequest) => {
      const res = await api.CreateCalendarLink({ body: request })
      // 409 is the cap of three; the View already disables Generate at three, so this only fires
      // when the list was stale. The refetch below shows the member why.
      if (res.status !== 201) throw new Error(`Couldn't create calendar link (${res.status})`)
      return res.body
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['calendar-links'] }),
  })
}

// Replaces a link's label and options; the URL stays, so subscribed calendars follow (ADR-0040).
export function useUpdateCalendarLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, request }: { id: string; request: CalendarLinkRequest }) => {
      const res = await api.UpdateCalendarLink({ id, body: request })
      if (res.status !== 200) throw new Error(`Couldn't update calendar link (${res.status})`)
      return res.body
    },
    // Written into the list straight away, so the row that closes on success already shows the new
    // label and summary rather than the old ones until the refetch lands.
    onSuccess: (updated) =>
      queryClient.setQueryData<CalendarLink[]>(['calendar-links'], (links) =>
        links?.map((link) => (link.id === updated.id ? updated : link)),
      ),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['calendar-links'] }),
  })
}

export function useDeleteCalendarLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await api.DeleteCalendarLink({ id })
      if (res.status !== 204) throw new Error(`Couldn't delete calendar link (${res.status})`)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['calendar-links'] }),
  })
}
