import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './wirespec-client'

// Re-export the generated contract type so the app has a single source of truth.
export type { Member } from './generated/model/Member'

// A member update can fail in ways the form needs to distinguish (a taken name is recoverable and
// shown inline; a 403/404 is not). Carry the backend's discriminator code so the UI can branch.
export class MemberUpdateError extends Error {
  constructor(public readonly code: 'NAME_TAKEN' | 'FORBIDDEN' | 'NOT_FOUND', message: string) {
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

export interface UpdateMemberInput {
  userId: string
  displayName: string
  role: string
}

export function useUpdateMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId, displayName, role }: UpdateMemberInput) => {
      const res = await api.UpdateMember({ userId, body: { displayName, role } })
      if (res.status === 409) throw new MemberUpdateError('NAME_TAKEN', 'That display name is already taken.')
      if (res.status === 403) throw new MemberUpdateError('FORBIDDEN', 'You are not allowed to make this change.')
      if (res.status === 404) throw new MemberUpdateError('NOT_FOUND', 'Member not found.')
      return res.body
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['members', 'me'] }),
  })
}
