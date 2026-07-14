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
      if (res.status === 404 || res.status === 401) throw new Error('invite link invalid or expired')
      return res.body
    },
  })
}

// Carries the invite token across the magic-link round trip: the joiner requests a link from
// /invite/:token (unauthenticated), then clicks it later on /auth/verify — a different page load,
// so the token can't be passed as component state. Persisted client-side (same pattern as the
// `teamId` shim in wirespec-client.ts), not sent to the server until accept.
// The email is stored alongside the token so we only hand it back if the verified user's email
// matches — preventing a plain /login from silently accepting someone else's invite.
const PENDING_INVITE_TOKEN_KEY = 'tb-pending-invite-token'
const PENDING_INVITE_EMAIL_KEY = 'tb-pending-invite-email'

export function savePendingInviteToken(token: string, email: string): void {
  localStorage.setItem(PENDING_INVITE_TOKEN_KEY, token)
  localStorage.setItem(PENDING_INVITE_EMAIL_KEY, email)
}

export function takePendingInviteTokenForEmail(email: string): string | null {
  const token = localStorage.getItem(PENDING_INVITE_TOKEN_KEY)
  const savedEmail = localStorage.getItem(PENDING_INVITE_EMAIL_KEY)
  // Always clean up, regardless of whether the email matches.
  localStorage.removeItem(PENDING_INVITE_TOKEN_KEY)
  localStorage.removeItem(PENDING_INVITE_EMAIL_KEY)
  return token && savedEmail === email ? token : null
}
