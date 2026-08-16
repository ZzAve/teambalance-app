import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthMe, useRequestMagicLink } from '@shared/api/auth'
import { savePendingInviteToken, useAcceptInvitation } from '@shared/api/invitations'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'

export const Route = createFileRoute('/invite/$token')({
  component: InvitePage,
})

function InvitePage() {
  const { token } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  // The root guard exempts /invite/*, so this route never goes through the beforeLoad session
  // probe — fetch it here instead. An already-authenticated visitor (re-clicking their own invite
  // link, or an existing member) accepts immediately rather than being asked to sign in again.
  const { data: user, isLoading: isLoadingSession } = useAuthMe()
  const requestMagicLink = useRequestMagicLink()
  const acceptInvitation = useAcceptInvitation()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const attempted = useRef(false)

  useEffect(() => {
    if (attempted.current || !user) return
    attempted.current = true

    acceptInvitation
      .mutateAsync(token)
      .then(() => queryClient.invalidateQueries({ queryKey: ['auth', 'me'] }))
      .then(() => navigate({ to: '/', replace: true }))
      .catch(() => setError('This invite link is invalid or has expired.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token])

  if (isLoadingSession || (user && !error && !acceptInvitation.isError)) {
    return (
      <div className="mx-auto mt-16 max-w-sm text-center">
        <p className="text-sm text-muted-foreground">{user ? 'Joining the team...' : 'Loading...'}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto mt-16 max-w-sm text-center">
        <h1 className="font-display text-2xl font-bold">Invite link invalid</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error}</p>
        <Link to="/login" className="mt-6 inline-block text-sm font-medium text-blue">
          Back to login
        </Link>
      </div>
    )
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    savePendingInviteToken(token, email)
    requestMagicLink.mutate(email, { onSuccess: () => setSent(true) })
  }

  if (sent) {
    return (
      <div className="mx-auto mt-16 max-w-sm text-center">
        <h1 className="font-display text-2xl font-bold">Check your email</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          If <span className="font-medium text-foreground">{email}</span> checks out, we've sent a magic link to sign
          in. Click it to join the team.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-16 max-w-sm">
      <h1 className="font-display text-center text-2xl font-bold">You're invited</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Enter your email to join the team — no password needed.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <Button type="submit" disabled={requestMagicLink.isPending}>
          {requestMagicLink.isPending ? 'Sending...' : 'Send magic link'}
        </Button>
        {requestMagicLink.isError && (
          <p className="text-center text-sm text-red">Something went wrong. Please try again.</p>
        )}
      </form>
    </div>
  )
}
