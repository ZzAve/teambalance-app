import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { INVITE_UNAVAILABLE, useAuthMe, useRequestMagicLink } from '@shared/api/auth'
import { useAcceptInvitation } from '@shared/api/invitations'
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
      // Accepting makes the joined Team Active (ADR-0023 §4), so a joiner who was already in
      // another Team has just changed tenant.
      .then(() => queryClient.resetQueries())
      .then(() => navigate({ to: '/', replace: true }))
      .catch(() => setError('This invite link is invalid or has expired.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token])

  if (isLoadingSession || (user && !error && !acceptInvitation.isError)) {
    return (
      <div className="mx-auto mt-16 max-w-sm text-center">
        <p className="text-small text-muted-foreground">{user ? 'Joining the team...' : 'Loading...'}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto mt-16 max-w-sm text-center">
        <h1 className="font-display text-title font-bold">Invite link invalid</h1>
        <p className="mt-3 text-small text-muted-foreground">{error}</p>
        <Link to="/login" className="mt-6 inline-block text-small font-medium text-blue">
          Back to login
        </Link>
      </div>
    )
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // The invite rides along with the request, so the server remembers it against the magic-link
    // record and applies it on verification (#342). It used to be stashed in this browser's
    // localStorage, which never reached the browser that opened the email.
    requestMagicLink.mutate(
      { email, inviteToken: token },
      {
        onSuccess: () => setSent(true),
        // A dead link is refused before any email goes out, so say so here rather than letting them
        // wait for mail that will not come. Anything else — a dropped connection, a 500 — is
        // retryable and falls through to the form's try-again message instead.
        onError: (err) => {
          if (err.message === INVITE_UNAVAILABLE) setError('This invite link is invalid or has expired.')
        },
      },
    )
  }

  if (sent) {
    return (
      <div className="mx-auto mt-16 max-w-sm text-center">
        <h1 className="font-display text-title font-bold">Check your email</h1>
        <p className="mt-3 text-small text-muted-foreground">
          If <span className="font-medium text-foreground">{email}</span> checks out, we've sent a magic link to sign
          in. Click it to join the team.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-16 max-w-sm">
      <h1 className="font-display text-center text-title font-bold">You're invited</h1>
      <p className="mt-2 text-center text-small text-muted-foreground">
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
          <p className="text-center text-small text-red">Something went wrong. Please try again.</p>
        )}
      </form>
    </div>
  )
}
