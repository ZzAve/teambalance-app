import { useEffect, useRef, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useVerifyMagicLink } from '@shared/api/auth'
import { takePendingInviteToken, useAcceptInvitation } from '@shared/api/invitations'

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
  const acceptInvitation = useAcceptInvitation()
  const [error, setError] = useState<string | null>(null)
  const attempted = useRef(false)

  useEffect(() => {
    if (attempted.current || !token) return
    attempted.current = true

    verifyMagicLink
      .mutateAsync(token)
      .then(async (user) => {
        queryClient.setQueryData(['auth', 'me'], user)

        const inviteToken = takePendingInviteToken()
        if (inviteToken) {
          try {
            await acceptInvitation.mutateAsync(inviteToken)
            // Role/team membership changed by accepting — refetch so the guard's /me and the
            // user store both reflect the newly-joined team, not the pre-join session snapshot.
            await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
          } catch {
            setError('This invite link is invalid or has expired.')
            return
          }
        }

        navigate({ to: '/', replace: true })
      })
      .catch(() => setError('This link has expired or already been used. Request a new one.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (!token || error) {
    return (
      <div className="mx-auto mt-16 max-w-sm text-center">
        <h1 className="font-display text-2xl font-bold">Link expired</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {error ?? 'This link is missing a token. Request a new one.'}
        </p>
        <Link to="/login" className="mt-6 inline-block text-sm font-medium text-blue">
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-16 max-w-sm text-center">
      <p className="text-sm text-muted-foreground">Signing you in...</p>
    </div>
  )
}
