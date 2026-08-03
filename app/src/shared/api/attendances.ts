import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from './wirespec-client'
import { applyOptimisticAttendance } from './attendance-cache'
import type { AttendanceEntry, EventDetail } from './events'

type AttendanceState = AttendanceEntry['state']

interface SetAttendanceVars {
  eventId: string
  userId: string
  state: AttendanceState
}

export function useSetAttendance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ eventId, userId, state }: SetAttendanceVars) => {
      const res = await api.SetAttendance({ eventId, userId, body: { state } })
      if (res.status === 404) throw new Error('Attendance not found')
      return res.body
    },
    // Optimistic update: the toggle reflects the tap instantly. Snapshot the cached event so a
    // failure can roll it back, then reconcile with the server on settle.
    onMutate: async ({ eventId, userId, state }) => {
      const eventKey = ['events', eventId]
      await queryClient.cancelQueries({ queryKey: eventKey })
      const previousEvent = queryClient.getQueryData<EventDetail>(eventKey)
      queryClient.setQueryData<EventDetail | undefined>(eventKey, (current) =>
        applyOptimisticAttendance(current, userId, state),
      )
      return { eventKey, previousEvent }
    },
    onError: (_error, _variables, context) => {
      // Restore the pre-tap snapshot so the toggle returns to its real state, then surface the
      // failure. The re-enabled toggle is the recovery path — tapping again retries.
      if (context) queryClient.setQueryData(context.eventKey, context.previousEvent)
      toast.error("Couldn't save your response — tap to try again.")
    },
    onSettled: (_data, _error, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['events', eventId] })
    },
  })
}
