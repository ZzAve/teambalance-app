import { useEffect, useRef, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useVerifyMagicLink } from '@shared/api/auth'
import { clearSession, hasClearableSession } from '@shared/api/clear-session'
import { VerifyErrorView } from '@shared/ui/VerifyErrorView'

export const Route = createFileRoute('/auth/verify')({
  component: VerifyPage,
  validateSearch: (search: Record<string, unknown>): { token?: string } => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
})

function VerifyPage() {
  const { token } = Route.useSearch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const verifyMagicLink = useVerifyMagicLink()
  const [error, setError] = useState<string | null>(null)
  const attempted = useRef(false)

  useEffect(() => {
    if (attempted.current || !token) return
    attempted.current = true

    verifyMagicLink
      .mutateAsync(token)
      .then((session) => {
        // The server already joined the team and rebuilt the payload around it, so this user is the
        // post-join one — nothing here has to accept anything or refetch to catch up (#342).
        queryClient.setQueryData(['auth', 'me'], session.user)

        // A dead invite no longer withholds the session: refusing a valid proof of identity would
        // strand them for good, since re-clicking an expired invite cannot help. Land them on the
        // onboarding hub, which says so and offers the paste-a-link route (amends ADR-0008).
        if (session.inviteOutcome === 'UNAVAILABLE') {
          navigate({ to: '/onboarding', search: { invite: 'unavailable' }, replace: true })
          return
        }

        navigate({ to: '/', replace: true })
      })
      .catch(() => setError('This link has expired or already been used. Request a new one.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (!token || error) {
    return (
      <VerifyErrorView
        message={error ?? 'This link is missing a token. Request a new one.'}
        // Escape hatch (ADR-0027 §3): show a client-only Log out whenever a session exists — or might.
        // Landing here with a stale session and a spent or missing token is the case: the error view
        // is outside the app shell, so without this there is no in-app way out.
        onLogout={hasClearableSession() ? () => clearSession() : undefined}
      />
    )
  }

  return (
    <div className="mx-auto mt-16 max-w-sm text-center">
      <p className="text-small text-muted-foreground">Signing you in...</p>
    </div>
  )
}
