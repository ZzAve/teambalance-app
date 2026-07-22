import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './wirespec-client'

// Re-export the generated contract type so the app has a single source of truth.
export type { Member } from './generated/model/Member'

// A member update can fail in ways the form needs to distinguish (a taken name is recoverable and
// shown inline; a 403/404 is not). Carry the backend's discriminator code so the UI can branch.
// LAST_ADMIN is a 409 too — refusing a demote/remove that would leave the team without an admin.
export class MemberUpdateError extends Error {
  constructor(public readonly code: 'NAME_TAKEN' | 'FORBIDDEN' | 'NOT_FOUND' | 'LAST_ADMIN', message: string) {
    super(message)
    this.name = 'MemberUpdateError'
  }
}

export function useCurrentMember() {
  return useQuery({
    queryKey: ['members', 'me'],
    queryFn: async () => {
      const res = await api.GetCurrentMember()
      return res.body
    },
  })
}

// The admin roster. Keyed ['members'] so a member mutation invalidating that prefix refreshes both
// the list and ['members', 'me'].
export function useMembers() {
  return useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const res = await api.ListMembers()
      if (res.status === 403) throw new MemberUpdateError('FORBIDDEN', 'You are not allowed to view members.')
      return res.body.members
    },
  })
}

export interface UpdateMemberInput {
  userId: string
  displayName: string
  role: string
  /** The member's position, or null to leave them Unassigned. Callers pass the current value to
   *  preserve it on a name/role-only change. */
  positionId: string | null
}

export function useUpdateMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId, displayName, role, positionId }: UpdateMemberInput) => {
      const res = await api.UpdateMember({ userId, body: { displayName, role, positionId: positionId ?? undefined } })
      // A 409 is either a name collision (rename) or the last-admin guard (demote). The contract
      // types the body as undefined, but the handler still sends a { code } discriminator we can
      // read at runtime to tell them apart.
      if (res.status === 409) {
        const code = (res.body as { code?: string } | undefined)?.code
        if (code === 'LAST_ADMIN') throw new MemberUpdateError('LAST_ADMIN', 'A team must keep at least one admin.')
        throw new MemberUpdateError('NAME_TAKEN', 'That display name is already taken.')
      }
      if (res.status === 403) throw new MemberUpdateError('FORBIDDEN', 'You are not allowed to make this change.')
      if (res.status === 404) throw new MemberUpdateError('NOT_FOUND', 'Member not found.')
      return res.body
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['members'] }),
  })
}

export function useRemoveMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const res = await api.RemoveMember({ userId })
      if (res.status === 409) throw new MemberUpdateError('LAST_ADMIN', 'A team must keep at least one admin.')
      if (res.status === 403) throw new MemberUpdateError('FORBIDDEN', 'You are not allowed to remove this member.')
      if (res.status === 404) throw new MemberUpdateError('NOT_FOUND', 'Member not found.')
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['members'] }),
  })
}
