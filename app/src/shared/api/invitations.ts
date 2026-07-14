import { useMutation } from '@tanstack/react-query'
import { api } from './wirespec-client'

export type { Invitation } from './generated/model/Invitation'
export type { AcceptedInvitation } from './generated/model/AcceptedInvitation'

export function useCreateInvitation() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.CreateInvitation()
      return res.body
    },
  })
}

export function useAcceptInvitation() {
  return useMutation({
    mutationFn: async (token: string) => {
      const res = await api.AcceptInvitation({ token })
      if (res.status === 404) throw new Error('This invite link is invalid or has expired')
      return res.body
    },
  })
}

// Carries the invite token across the magic-link round trip: the joiner requests a link from
// /invite/:token (unauthenticated), then clicks it later on /auth/verify — a different page load,
// so the token can't be passed as component state. Persisted client-side (same pattern as the
// `teamId` shim in wirespec-client.ts), not sent to the server until accept.
const PENDING_INVITE_TOKEN_KEY = 'tb-pending-invite-token'

export function savePendingInviteToken(token: string): void {
  localStorage.setItem(PENDING_INVITE_TOKEN_KEY, token)
}

export function takePendingInviteToken(): string | null {
  const token = localStorage.getItem(PENDING_INVITE_TOKEN_KEY)
  if (token) localStorage.removeItem(PENDING_INVITE_TOKEN_KEY)
  return token
}
