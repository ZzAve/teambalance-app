import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './wirespec-client'

export type { Invitation } from './generated/model/Invitation'
export type { AcceptedInvitation } from './generated/model/AcceptedInvitation'

// The key every invite mutation invalidates, so the dialog re-reads the team's link rather than
// trusting whatever it happened to be holding.
const ACTIVE_INVITATION_KEY = ['invitations', 'active']

/**
 * The team's current invite link, or null if it has none (ADR-0025).
 *
 * This is what makes the link survive a page refresh: before it existed the dialog had only its own
 * in-memory state, so a reload lost the link with no way to read it back — and the dialog covered
 * that by minting a new one on open, quietly leaving another live link behind each time.
 *
 * Admin-only; `enabled` keeps it from firing for members who will only ever get a 403.
 */
export function useActiveInvitation({ enabled }: { enabled: boolean }) {
  return useQuery({
    queryKey: ACTIVE_INVITATION_KEY,
    enabled,
    queryFn: async () => {
      const res = await api.GetActiveInvitation()
      if (res.status === 403) throw new Error('You are not allowed to manage the invite link.')
      // 204: the team has no link yet. An ordinary state, not an error — the UI offers to make one.
      return res.status === 200 ? res.body : null
    },
  })
}

// Invalidating on success is what keeps the cached link honest after a mint, a rotate or an expire.
function useInvitationMutation<T>(mutationFn: () => Promise<T>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ACTIVE_INVITATION_KEY }),
  })
}

/**
 * Mints the team's invite link — idempotent server-side, so calling it when a link already exists
 * returns that one rather than adding a second (ADR-0025).
 */
export function useCreateInvitation() {
  return useInvitationMutation(async () => {
    const res = await api.CreateInvitation()
    return res.body
  })
}

export function useRotateInvitation() {
  return useInvitationMutation(async () => {
    const res = await api.RotateInvitation()
    return res.body
  })
}

export function useExpireInvitations() {
  return useInvitationMutation(async () => {
    await api.ExpireInvitations()
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
