import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { INVITE_UNAVAILABLE, useAuthMe, useRequestMagicLink } from '@shared/api/auth'
import { useAcceptInvitation } from '@shared/api/invitations'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Trans, useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  useEffect(() => {
    if (attempted.current || !user) return
    attempted.current = true

    acceptInvitation
      .mutateAsync(token)
      // Accepting makes the joined Team Active (ADR-0023 §4), so a joiner who was already in
      // another Team has just changed tenant.
      .then(() => queryClient.resetQueries())
      .then(() => navigate({ to: '/', replace: true }))
      .catch(() => setError(t('invite.invalid')))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token])

  if (isLoadingSession || (user && !error && !acceptInvitation.isError)) {
    return (
      <div className="mx-auto mt-16 max-w-sm text-center">
        <p className="text-small text-muted-foreground">{user ? t('invite.joining') : t('invite.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto mt-16 max-w-sm text-center">
        <h1 className="font-display text-title font-bold">{t('invite.invalidTitle')}</h1>
        <p className="mt-3 text-small text-muted-foreground">{error}</p>
        <Link to="/login" className="mt-6 inline-block text-small font-medium text-blue">
          {t('auth.verify.backToLogin')}
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
          if (err.message === INVITE_UNAVAILABLE) setError(t('invite.invalid'))
        },
      },
    )
  }

  if (sent) {
    return (
      <div className="mx-auto mt-16 max-w-sm text-center">
        <h1 className="font-display text-title font-bold">{t('auth.login.checkEmail')}</h1>
        <p className="mt-3 text-small text-muted-foreground">
          <Trans
            i18nKey="invite.sent"
            values={{ email }}
            components={{ b: <span className="font-medium text-foreground" /> }}
          />
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-16 max-w-sm">
      <h1 className="font-display text-center text-title font-bold">{t('invite.title')}</h1>
      <p className="mt-2 text-center text-small text-muted-foreground">
        {t('invite.intro')}
      </p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <Label htmlFor="email">{t('account.email')}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.login.emailPlaceholder')}
          />
        </div>
        <Button type="submit" disabled={requestMagicLink.isPending}>
          {requestMagicLink.isPending ? t('auth.login.sending') : t('auth.login.send')}
        </Button>
        {requestMagicLink.isError && (
          <p className="text-center text-small text-red-ink">{t('errors.generic')}</p>
        )}
      </form>
    </div>
  )
}
