import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useAcceptInvitation } from '@shared/api/invitations'

const INVALID_OR_EXPIRED =
  "That invite link didn't work — it may be invalid or expired. Ask your team admin for a fresh one."
const GENERIC = 'Something went wrong, try again.'

/**
 * Thin wiring over useAcceptInvitation for /onboarding/join. Accepting sets the Active Team server
 * side (ADR-0023 §4), so `/` lands them in the Team they joined; the cache is reset because a joiner
 * may have come from another tenant.
 *
 * useAcceptInvitation throws one generic Error for invalid and expired alike — the accept endpoint
 * returns 404 for both deliberately, so there is no oracle.
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
