import { useMutation, useMutationState, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from './wirespec-client'
import { applyOptimisticAttendanceToCache } from './attendance-cache'
import { patchCachedEvents, rollBack } from './event-cache'
import { useCurrentUser } from './auth'
import type { AttendanceEntry } from './events'
import { i18n } from '@shared/i18n/i18n'

type AttendanceState = AttendanceEntry['state']

interface SetAttendanceVars {
  eventId: string
  userId: string
  state: AttendanceState
}

type CachedEvents = Parameters<typeof applyOptimisticAttendanceToCache>[0]

const SET_ATTENDANCE = ['set-attendance']

/** The events with an attendance write in flight, so a card's readiness badge waits on its own event's writes. */
export function usePendingAttendanceEvents(): string[] {
  return useMutationState({
    filters: { mutationKey: SET_ATTENDANCE, status: 'pending' },
    select: (mutation) => (mutation.state.variables as { eventId: string }).eventId,
  })
}

export function useSetAttendance() {
  const queryClient = useQueryClient()
  // Who is writing, which is not always whose row is written (ADR-0003): the optimistic patch stamps
  // this as the row's `changedBy` so attribution does not lag the answer it belongs to.
  const actorId = useCurrentUser()?.id ?? null
  return useMutation({
    mutationKey: SET_ATTENDANCE,
    mutationFn: async ({ eventId, userId, state }: SetAttendanceVars) => {
      const res = await api.setAttendance({ eventId, userId, body: { state } })
      if (res.status === 404) throw new Error('Attendance not found')
      return res.body
    },
    // Optimistic update: every cached read of the event — the list cards, the hero and the detail —
    // shows the tap instantly; a failure rolls them all back from one snapshot.
    onMutate: ({ eventId, userId, state }) =>
      patchCachedEvents<CachedEvents>(queryClient, (cached) =>
        applyOptimisticAttendanceToCache(cached, eventId, userId, state, actorId),
      ),
    onError: (_error, _variables, context) => {
      // The re-enabled toggle is the recovery path — tapping again retries.
      rollBack(queryClient, context)
      toast.error(i18n.t('errors.attendance.saveFailed'))
    },
    // Returned, so the write stays pending until the refetch lands: the roster is not patched, and the
    // readiness badge dims (⑤) until the refetched list carries the server's verdict.
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
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
      const res = await api.bulkAttend({ body: { userId, eventIds, state: 'ATTENDING' } })
      return res.body.eventIds
    },
    onError: () => {
      toast.error(i18n.t('errors.attendance.setFailed'))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

/** Undo for [useBulkAttend]: deletes exactly the rows it created. */
export function useBulkUndo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId, eventIds }: BulkAttendVars) => {
      const res = await api.bulkUndoAttend({ body: { userId, eventIds } })
      return res.body.eventIds
    },
    onError: () => {
      toast.error(i18n.t('errors.attendance.undoFailed'))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

/** Admin-only: clears every member's answer on one event, so each member reads as not responded again. */
export function useResetAttendance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (eventId: string) => api.resetAttendance({ eventId }),
    onError: () => {
      toast.error(i18n.t('errors.attendance.resetFailed'))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
