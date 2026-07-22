import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './wirespec-client'

// Re-export the generated contract type so the app has a single source of truth.
export type { Position } from './generated/model/Position'

// A position mutation can fail in ways the UI must distinguish: a taken label is recoverable and
// shown inline; a 403/404 is not. Mirrors MemberUpdateError in members.ts.
export class PositionError extends Error {
  constructor(public readonly code: 'POSITION_LABEL_TAKEN' | 'FORBIDDEN' | 'NOT_FOUND', message: string) {
    super(message)
    this.name = 'PositionError'
  }
}

// The per-team position vocabulary. Readable by any member (GET has no 403). Keyed ['positions'] so
// a create/rename/delete mutation invalidating that prefix refreshes every picker.
export function usePositions() {
  return useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      const res = await api.ListPositions()
      // A 401 is handled globally (redirect to login) by the fetch handler; fall back to empty here.
      return res.body?.positions ?? []
    },
  })
}

export function useCreatePosition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ label }: { label: string }) => {
      const res = await api.CreatePosition({ body: { label } })
      if (res.status === 409) throw new PositionError('POSITION_LABEL_TAKEN', 'That position already exists.')
      if (res.status === 403) throw new PositionError('FORBIDDEN', 'You are not allowed to make this change.')
      return res.body
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['positions'] }),
  })
}

export function useRenamePosition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, label }: { id: string; label: string }) => {
      const res = await api.RenamePosition({ id, body: { label } })
      if (res.status === 409) throw new PositionError('POSITION_LABEL_TAKEN', 'That position already exists.')
      if (res.status === 403) throw new PositionError('FORBIDDEN', 'You are not allowed to make this change.')
      if (res.status === 404) throw new PositionError('NOT_FOUND', 'Position not found.')
      return res.body
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['positions'] }),
  })
}

export function useDeletePosition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await api.DeletePosition({ id })
      if (res.status === 403) throw new PositionError('FORBIDDEN', 'You are not allowed to remove this position.')
      if (res.status === 404) throw new PositionError('NOT_FOUND', 'Position not found.')
    },
    // Deleting a position reassigns its members to Unassigned, so refresh the roster too.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] })
      queryClient.invalidateQueries({ queryKey: ['members'] })
    },
  })
}
