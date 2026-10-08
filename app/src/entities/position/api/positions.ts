import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@shared/api/wirespec-client'
import { throwOnStatus } from '@shared/api/errors'
import { queryKeys } from '@shared/api/query-keys'
import type { PositionKind } from '@shared/api/generated/model/PositionKind'

// Re-export the generated contract types so the app has a single source of truth.
export type { Position } from '@shared/api/generated/model/Position'
export type { PositionKind } from '@shared/api/generated/model/PositionKind'
export type { PositionUsage } from '@shared/api/generated/model/PositionUsage'

// A position mutation can fail in ways the UI must distinguish: a taken label is recoverable and
// shown inline; a 403/404 is not. Mirrors MemberUpdateError in members.ts.
export class PositionError extends Error {
  constructor(public readonly code: 'POSITION_LABEL_TAKEN' | 'FORBIDDEN' | 'NOT_FOUND', message: string) {
    super(message)
    this.name = 'PositionError'
  }
}

const labelTaken = () => new PositionError('POSITION_LABEL_TAKEN', 'That position already exists.')
const forbidden = () => new PositionError('FORBIDDEN', 'You are not allowed to make this change.')
const notFound = () => new PositionError('NOT_FOUND', 'Position not found.')

// The per-team position vocabulary. Readable by any member (GET has no 403). Keyed ['positions'] so
// a create/rename/delete mutation invalidating that prefix refreshes every picker.
// `enabled` lets a caller hold the fetch off when there is no tenant to resolve it against — the
// Account container passes `enabled: !!activeTeam`, since positions are a per-team vocabulary.
export function usePositions(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.positions.all,
    queryFn: async () => {
      const res = await api.ListPositions()
      // A 401 is handled globally (redirect to login) by the fetch handler; fall back to empty here.
      return res.body?.positions ?? []
    },
    enabled: options?.enabled,
  })
}

/**
 * What deleting a position would touch — the type defaults and event overrides naming it, and the
 * members holding it. Read only when the delete dialog opens (`enabled`), because it is admin-only
 * and every member can see the rest of this screen.
 */
export function usePositionUsage(id: string | null) {
  return useQuery({
    queryKey: queryKeys.positions.usage(id),
    queryFn: async () => {
      const res = await api.GetPositionUsage({ id: id as string })
      return res.body
    },
    enabled: id !== null,
  })
}

export function useCreatePosition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ label }: { label: string }) => {
      const res = await api.CreatePosition({ body: { label } })
      throwOnStatus(res, { 409: labelTaken, 403: forbidden })
      return res.body
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.positions.all }),
  })
}

export function useRenamePosition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, label }: { id: string; label: string }) => {
      const res = await api.RenamePosition({ id, body: { label } })
      throwOnStatus(res, { 409: labelTaken, 403: forbidden, 404: notFound })
      return res.body
    },
    // Substitutes carry their Position's label, so their list shows the new one too.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.positions.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.substitutes.all })
    },
  })
}

/**
 * Marks a position as played or staffed (#281) — whether the people holding it count toward an
 * event's headcount target. Its own mutation rather than a wider rename: the toggle applies at
 * once, while a label is typed and then saved.
 *
 * Invalidates events too, because the roster arithmetic every card renders is computed server-side
 * from these kinds: reclassifying a position changes the verdict on every event without any event
 * itself having changed.
 */
export function useSetPositionKind() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, kind }: { id: string; kind: PositionKind }) => {
      const res = await api.SetPositionKind({ id, body: { kind } })
      throwOnStatus(res, { 403: forbidden, 404: notFound })
      return res.body
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.positions.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all })
    },
  })
}

export function useDeletePosition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await api.DeletePosition({ id })
      throwOnStatus(res, {
        403: () => new PositionError('FORBIDDEN', 'You are not allowed to remove this position.'),
        404: notFound,
      })
    },
    // Deleting a position reassigns its members and Substitutes to Unassigned, so refresh both lists
    // too. A stale Substitute row would otherwise resend the deleted id on its next rename.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.positions.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.members.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.substitutes.all })
    },
  })
}
