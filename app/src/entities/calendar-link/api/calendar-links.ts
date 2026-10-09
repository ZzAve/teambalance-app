import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@shared/api/wirespec-client'
import { throwOnStatus } from '@shared/api/errors'
import { queryKeys } from '@shared/api/query-keys'

// Re-export the generated contract types so the app has a single source of truth.
export type { CalendarLink } from '@shared/api/generated/model/CalendarLink'

const failure = (action: string, status: number) => () => new Error(`Couldn't ${action} (${status})`)

// The caller's own links in the Active Team, newest first (ADR-0039). Keyed ['calendar-links'] so
// a create or delete invalidating that key refreshes the list. `enabled: false` skips the request
// when the caller can have no links here (acting as the team).
export function useCalendarLinks(options?: { enabled?: boolean }) {
  return useQuery({
    enabled: options?.enabled,
    queryKey: queryKeys.calendarLinks,
    queryFn: async () => {
      const res = await api.ListCalendarLinks()
      // 403 (no team, or acting as this team — ADR-0024) has no list to show: surface it as an error.
      throwOnStatus(res, { 401: failure('load calendar links', 401), 403: failure('load calendar links', 403) })
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
      throwOnStatus(res, {
        401: failure('create calendar link', 401),
        403: failure('create calendar link', 403),
        409: failure('create calendar link', 409),
      })
      return res.body
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.calendarLinks }),
  })
}

export function useDeleteCalendarLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await api.DeleteCalendarLink({ id })
      throwOnStatus(res, {
        401: failure('delete calendar link', 401),
        403: failure('delete calendar link', 403),
        404: failure('delete calendar link', 404),
      })
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.calendarLinks }),
  })
}
