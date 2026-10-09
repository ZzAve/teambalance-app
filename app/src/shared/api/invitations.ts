import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './wirespec-client'
import { throwOnStatus } from './errors'
import { queryKeys } from './query-keys'

export type { Invitation } from './generated/model/Invitation'
export type { AcceptedInvitation } from './generated/model/AcceptedInvitation'

const notAllowed = () => new Error('You are not allowed to manage the invite link.')
const linkInvalid = () => new Error('invite link invalid or expired')

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
    queryKey: queryKeys.activeInvitation,
    enabled,
    queryFn: async () => {
      const res = await api.GetActiveInvitation()
      throwOnStatus(res, { 403: notAllowed })
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.activeInvitation }),
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

/**
 * The team's current unspent ADMIN handover link, or null if it has none — the read that lets the
 * link survive a page refresh, exactly as {@link useActiveInvitation} does for the shareable link
 * (ADR-0025, extended to the handover link). Admin-only; `enabled` keeps it from firing for members.
 */
export function useActiveAdminInvitation({ enabled }: { enabled: boolean }) {
  return useQuery({
    queryKey: queryKeys.activeAdminInvitation,
    enabled,
    queryFn: async () => {
      const res = await api.GetActiveAdminInvitation()
      throwOnStatus(res, { 403: notAllowed })
      // 204: no admin link yet — an ordinary state the UI turns into a "create one" offer.
      return res.status === 200 ? res.body : null
    },
  })
}

function useAdminInvitationMutation<T>(mutationFn: () => Promise<T>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.activeAdminInvitation }),
  })
}

/**
 * Mints the single-use, ADMIN-granting handover link (ADR-0024 §5) — how a memberless team gets its
 * first Admin. Idempotent server-side while unspent, so calling it again returns the same live link
 * rather than adding a second Admin credential. Distinct from {@link useCreateInvitation}, whose link
 * grants User and stays reusable; this one is spent on first accept.
 */
export function useCreateAdminInvitation() {
  return useAdminInvitationMutation(async () => {
    const res = await api.CreateAdminInvitation()
    throwOnStatus(res, { 403: notAllowed })
    return res.body
  })
}

/** Revoke-and-reissue the admin handover link (in case it leaked before it reached the right person). */
export function useRotateAdminInvitation() {
  return useAdminInvitationMutation(async () => {
    const res = await api.RotateAdminInvitation()
    throwOnStatus(res, { 403: notAllowed })
    return res.body
  })
}

/** Revoke the admin handover link without a replacement. */
export function useExpireAdminInvitations() {
  return useAdminInvitationMutation(async () => {
    await api.ExpireAdminInvitations()
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
      throwOnStatus(res, { 404: linkInvalid, 401: linkInvalid })
      return res.body
    },
  })
}
