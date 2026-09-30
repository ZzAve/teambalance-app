import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from './wirespec-client'
import type { SubstituteEntry } from './generated/model/SubstituteEntry'

// Re-export the generated contract types so the app has a single source of truth.
export type { Substitute } from './generated/model/Substitute'

interface CreateSubstituteVars {
  name: string
  positionId: string | null
}

/** Any Member may add someone to the Team's list of Substitutes (ADR-0033). */
export function useCreateSubstitute() {
  return useMutation({
    mutationFn: async ({ name, positionId }: CreateSubstituteVars) => {
      const res = await api.CreateSubstitute({ body: { name, positionId: positionId ?? undefined } })
      if (res.status === 404) throw new Error('Position not found')
      return res.body
    },
    onError: () => {
      toast.error("Couldn't add the substitute — please try again.")
    },
  })
}

interface SetSubstituteAttendanceVars {
  eventId: string
  substituteId: string
  state: SubstituteEntry['state']
}

/** Adds a Substitute to an event, or changes their state there (ADR-0033). */
export function useSetSubstituteAttendance() {
  const queryClient = useQueryClient()
  return useMutation({
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
