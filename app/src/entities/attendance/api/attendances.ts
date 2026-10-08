import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@shared/api/wirespec-client'
import { useSession } from '@shared/session/session'
import type { EventDetail } from '@entities/event/api/events'
import { queryKeys } from '@shared/api/query-keys'
import { applyOptimisticAttendance } from '../lib/optimistic-attendance'
import type { AttendanceState } from '../model/attendance-state'

interface SetAttendanceVars {
  eventId: string
  userId: string
  state: AttendanceState
}

export function useSetAttendance() {
  const queryClient = useQueryClient()
  // Who is writing, which is not always whose row is written (ADR-0003): the optimistic patch stamps
  // this as the row's `changedBy` so attribution does not lag the answer it belongs to.
  const actorId = useSession().user?.id ?? null
  return useMutation({
    mutationFn: async ({ eventId, userId, state }: SetAttendanceVars) => {
      const res = await api.SetAttendance({ eventId, userId, body: { state } })
      if (res.status === 404) throw new Error('Attendance not found')
      return res.body
    },
    // Optimistic update: the toggle reflects the tap instantly. Snapshot the cached event so a
    // failure can roll it back, then reconcile with the server on settle.
    onMutate: async ({ eventId, userId, state }) => {
      const eventKey = queryKeys.events.detail(eventId)
      await queryClient.cancelQueries({ queryKey: eventKey })
      const previousEvent = queryClient.getQueryData<EventDetail>(eventKey)
      queryClient.setQueryData<EventDetail | undefined>(eventKey, (current) =>
        applyOptimisticAttendance(current, userId, state, actorId),
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
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(eventId) })
    },
  })
}

interface BulkAttendVars {
  userId: string
  eventIds: string[]
}

/**
 * Bulk Attend (ADR-0020) — fills every shown, unanswered, future event in one call. No optimistic
 * update here, unlike the single toggle: the tap changes many cards at once and the server may
 * legitimately create fewer rows than were asked for (a race, a just-past event), so the honest
 * refresh is to invalidate and let the list re-render from the response.
 *
 * Resolves to the ids the server actually created — that list, not the ids we sent, is what Undo
 * must be handed.
 */
export function useBulkAttend() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId, eventIds }: BulkAttendVars) => {
      const res = await api.BulkAttend({ body: { userId, eventIds, state: 'ATTENDING' } })
      return res.body.eventIds
    },
    onError: () => {
      toast.error("Couldn't set your attendance — please try again.")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all })
    },
  })
}

/** Undo for [useBulkAttend]: deletes exactly the rows it created. */
export function useBulkUndo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId, eventIds }: BulkAttendVars) => {
      const res = await api.BulkUndoAttend({ body: { userId, eventIds } })
      return res.body.eventIds
    },
    onError: () => {
      toast.error("Couldn't undo — please try again.")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all })
    },
  })
}
