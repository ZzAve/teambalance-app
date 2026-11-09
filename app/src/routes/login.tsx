import { useId, useState, type FormEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useRequestMagicLink } from '@shared/api/auth'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { readLastSignInMethod } from '@shared/api/last-sign-in-method'
import { browserPreferenceStorage } from '@shared/preferences/preferences'
import { LastUsedPill } from '@shared/ui/LastUsedPill'
import { PasskeyLogin } from '@features/passkey-login/ui/PasskeyLogin'
import { Trans, useTranslation } from 'react-i18next'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const requestMagicLink = useRequestMagicLink()
  const pillId = useId()
  const [lastMethod] = useState(() => readLastSignInMethod(browserPreferenceStorage()))
  const { t } = useTranslation()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    requestMagicLink.mutate({ email }, { onSuccess: () => setSent(true) })
  }

  if (sent) {
    return (
      <div className="mx-auto mt-16 max-w-sm text-center">
        <h1 className="font-display text-title font-bold">{t('auth.login.checkEmail')}</h1>
        <p className="mt-3 text-small text-muted-foreground">
          <Trans
            i18nKey="auth.login.sent"
            values={{ email }}
            components={{ b: <span className="font-medium text-foreground" /> }}
          />
        </p>
        <div className="mt-6 hidden [@media(hover:none)_and_(pointer:coarse)]:block">
          <Button asChild className="w-full">
            <a href="mailto:">{t('auth.login.openEmailApp')}</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-16 max-w-sm">
      <h1 className="font-display text-center text-title font-bold">
        Team<span className="text-green">Balance</span>
      </h1>
      <p className="mt-2 text-center text-small text-muted-foreground">{t('auth.login.intro')}</p>
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
        <div className="relative flex flex-col">
          <Button
            type="submit"
            disabled={requestMagicLink.isPending}
            aria-describedby={lastMethod === 'email' ? pillId : undefined}
          >
            {requestMagicLink.isPending ? t('auth.login.sending') : t('auth.login.send')}
          </Button>
          {lastMethod === 'email' && <LastUsedPill id={pillId} />}
        </div>
        {requestMagicLink.isError && (
          <p className="text-center text-small text-red-ink">{t('errors.generic')}</p>
        )}
      </form>
      <PasskeyLogin />
    </div>
  )
}
