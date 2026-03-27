import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from './client'

interface Attendance {
  id: string
  eventId: string
  userId: string
  displayName: string
  state: string
}

export function useSetAttendance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ eventId, userId, state }: { eventId: string; userId: string; state: string }) =>
      apiFetch<Attendance>(`/events/${eventId}/attendances/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ state }),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['events', variables.eventId] })
    },
  })
}
