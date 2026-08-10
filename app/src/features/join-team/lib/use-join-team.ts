import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useAcceptInvitation } from '@shared/api/invitations'

const INVALID_OR_EXPIRED =
  "That invite link didn't work — it may be invalid or expired. Ask your team admin for a fresh one."
const GENERIC = 'Something went wrong, try again.'

/**
 * Thin wiring over useAcceptInvitation for the /onboarding/join route: on success, invalidates
 * /auth/me (same pattern as /invite/$token.tsx) and navigates home — the root gate then carries the
 * now-teamed user on to /get-started. useAcceptInvitation throws a single generic Error for both an
 * invalid and an expired token (the accept endpoint returns 404 for both, deliberately, so there's no
 * oracle); anything else (network failure, unexpected status) is treated as the generic failure.
 */
export function useJoinTeam() {
  const client = useQueryClient()
  const navigate = useNavigate()
  const acceptInvitation = useAcceptInvitation()

  const join = (token: string) => {
    acceptInvitation.mutate(token, {
      onSuccess: async () => {
        await client.invalidateQueries({ queryKey: ['auth', 'me'] })
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
