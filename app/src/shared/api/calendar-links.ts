import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './wirespec-client'

// Re-export the generated contract types so the app has a single source of truth.
export type { CalendarLink } from './generated/model/CalendarLink'

// The caller's own links in the Active Team, newest first (ADR-0039). Keyed ['calendar-links'] so
// a create or delete invalidating that key refreshes the list.
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
    mutationFn: async ({ label }: { label?: string }) => {
      const res = await api.CreateCalendarLink({ body: { label } })
      // 409 is the cap of three; the View already disables Generate at three, so this only fires
      // when the list was stale. The refetch below shows the member why.
      if (res.status !== 201) throw new Error(`Couldn't create calendar link (${res.status})`)
      return res.body
    },
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
