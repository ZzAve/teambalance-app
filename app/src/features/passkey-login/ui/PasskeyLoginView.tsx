import { useTranslation } from 'react-i18next'
import { Button } from '@shared/ui/button'

interface PasskeyLoginViewProps {
  onSignIn: () => void
  isPending?: boolean
  errorMessage?: string
}

/** "Sign in with a passkey" under the magic-link form (ADR-0045), after an "or" divider. */
export function PasskeyLoginView({ onSignIn, isPending = false, errorMessage }: PasskeyLoginViewProps) {
  const { t } = useTranslation()
  return (
    <div className="mt-6">
      <p className="text-center text-small text-muted-foreground">{t('auth.login.or')}</p>
      <Button variant="outline" className="mt-3 w-full" disabled={isPending} onClick={onSignIn}>
        {t('auth.login.passkey')}
      </Button>
      {errorMessage && (
        <p role="alert" className="mt-3 text-center text-small text-red-ink">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
