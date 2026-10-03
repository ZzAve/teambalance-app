import { useMutation, useMutationState, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from './wirespec-client'
import type { SubstituteEntry } from './generated/model/SubstituteEntry'

// Re-export the generated contract types so the app has a single source of truth.
export type { Substitute } from './generated/model/Substitute'

/** The Team's list of Substitutes, for the picker. Keyed ['substitutes'] so a create refreshes it. */
export function useSubstitutes(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['substitutes'],
    queryFn: async () => {
      const res = await api.ListSubstitutes()
      return res.body.substitutes
    },
    enabled: options?.enabled,
  })
}

interface CreateSubstituteVars {
  name: string
  positionId: string | null
}

/** Any Member may add someone to the Team's list of Substitutes (ADR-0033). */
export function useCreateSubstitute() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ name, positionId }: CreateSubstituteVars) => {
      const res = await api.CreateSubstitute({ body: { name, positionId: positionId ?? undefined } })
      if (res.status === 404) throw new Error('Position not found')
      return res.body
    },
    onError: () => {
      toast.error("Couldn't add the substitute — please try again.")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['substitutes'] })
    },
  })
}

interface SetSubstituteAttendanceVars {
  eventId: string
  substituteId: string
  state: SubstituteEntry['state']
}

// Shared by both Substitute attendance writes, so a page can see every one in flight.
const SUBSTITUTE_ATTENDANCE = ['substitute-attendance']

/**
 * The events with a Substitute attendance write in flight, whichever component started it, so an
 * event's Substitute controls wait on its own writes and not on another event's.
 */
export function usePendingSubstituteEvents(): string[] {
  return useMutationState({
    filters: { mutationKey: SUBSTITUTE_ATTENDANCE, status: 'pending' },
    select: (mutation) => (mutation.state.variables as { eventId: string }).eventId,
  })
}

/** Adds a Substitute to an event, or changes their state there (ADR-0033). */
export function useSetSubstituteAttendance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: SUBSTITUTE_ATTENDANCE,
    mutationFn: async ({ eventId, substituteId, state }: SetSubstituteAttendanceVars) => {
      const res = await api.SetSubstituteAttendance({ eventId, substituteId, body: { state } })
      if (res.status !== 200) throw new Error(`Couldn't set substitute (${res.status})`)
      return res.body
    },
    onError: () => {
      toast.error("Couldn't save the substitute — please try again.")
    },
    onSettled: (_data, _error, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['events', eventId] })
    },
  })
}

interface RemoveSubstituteAttendanceVars {
  eventId: string
  substituteId: string
}

/** Takes a Substitute off an event. They stay on the Team's list. */
export function useRemoveSubstituteAttendance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: SUBSTITUTE_ATTENDANCE,
    mutationFn: async ({ eventId, substituteId }: RemoveSubstituteAttendanceVars) => {
      const res = await api.RemoveSubstituteAttendance({ eventId, substituteId })
      if (res.status !== 204) throw new Error(`Couldn't take the substitute off (${res.status})`)
    },
    onError: () => {
      toast.error("Couldn't take the substitute off — please try again.")
    },
    onSettled: (_data, _error, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['events', eventId] })
    },
  })
}
