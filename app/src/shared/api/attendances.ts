import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './wirespec-client'

export function useSetAttendance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ eventId, userId, state }: { eventId: string; userId: string; state: string }) => {
      const res = await api.SetAttendance({ eventId, userId, body: { state } })
      if (res.status === 404) throw new Error('Attendance not found')
      return res.body
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['events', variables.eventId] })
    },
  })
}
