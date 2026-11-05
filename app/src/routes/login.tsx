import { useState, type FormEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Trans, useTranslation } from 'react-i18next'
import { useRequestMagicLink } from '@shared/api/auth'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const requestMagicLink = useRequestMagicLink()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    requestMagicLink.mutate({ email }, { onSuccess: () => setSent(true) })
  }

  if (sent) {
    return (
      <div className="mx-auto mt-16 max-w-sm text-center">
        <h1 className="font-display text-title font-bold">{t('routes.checkEmail')}</h1>
        <p className="mt-3 text-small text-muted-foreground">
          <Trans
            i18nKey="routes.login.sent"
            values={{ email }}
            components={{ email: <span className="font-medium text-foreground" /> }}
          />
        </p>
        <div className="mt-6 hidden [@media(hover:none)_and_(pointer:coarse)]:block">
          <Button asChild className="w-full">
            <a href="mailto:">{t('routes.login.openEmailApp')}</a>
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
      <p className="mt-2 text-center text-small text-muted-foreground">{t('routes.login.intro')}</p>
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
            placeholder="you@example.com"
          />
        </div>
        <Button type="submit" disabled={requestMagicLink.isPending}>
          {requestMagicLink.isPending ? t('routes.sending') : t('routes.sendMagicLink')}
        </Button>
        {requestMagicLink.isError && (
          <p className="text-center text-small text-red-ink">{t('routes.somethingWrong')}</p>
        )}
      </form>
    </div>
  )
}
