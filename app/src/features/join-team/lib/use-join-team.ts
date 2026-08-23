import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useAcceptInvitation } from '@shared/api/invitations'

const INVALID_OR_EXPIRED =
  "That invite link didn't work — it may be invalid or expired. Ask your team admin for a fresh one."
const GENERIC = 'Something went wrong, try again.'

/**
 * Thin wiring over useAcceptInvitation for the /onboarding/join route: on success, drops the cache
 * and navigates to `/` — the dispatcher, which resolves the Active Team the server just set to the
 * team they joined (ADR-0023 §4) and lands them in it, where the team route's gate carries them on
 * to get-started.
 *
 * The cache is reset rather than merely invalidating /auth/me (as /invite/\$token.tsx also does):
 * a joiner may already have been in another Team, and every cached tenant-scoped query belongs to
 * the one they were in. This is the same obligation `/t/\$slug`'s gate carries on a switch.
 *
 * useAcceptInvitation throws a single generic Error for both an invalid and an expired token (the
 * accept endpoint returns 404 for both, deliberately, so there's no oracle); anything else (network
 * failure, unexpected status) is treated as the generic failure.
 */
export function useJoinTeam() {
  const client = useQueryClient()
  const navigate = useNavigate()
  const acceptInvitation = useAcceptInvitation()

  const join = (token: string) => {
    acceptInvitation.mutate(token, {
      onSuccess: async () => {
        await client.resetQueries()
        navigate({ to: '/' })
      },
    })
  }

  const errorMessage = acceptInvitation.isError
    ? acceptInvitation.error instanceof Error && acceptInvitation.error.message === 'invite link invalid or expired'
      ? INVALID_OR_EXPIRED
      : GENERIC
    : null

  return { join, isPending: acceptInvitation.isPending, errorMessage }
}
