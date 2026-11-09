import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@shared/ui/button'
import { LastUsedPill } from '@shared/ui/LastUsedPill'

interface PasskeyLoginViewProps {
  onSignIn: () => void
  isPending?: boolean
  errorMessage?: string
  /** This is the way this device signed in last: marks the button with a "Last" pill. */
  isLast?: boolean
}

/** "Sign in with a passkey" under the magic-link form (ADR-0045), after an "or" divider. */
export function PasskeyLoginView({ onSignIn, isPending = false, errorMessage, isLast = false }: PasskeyLoginViewProps) {
  const { t } = useTranslation()
  const pillId = useId()
  return (
    <div className="mt-6">
      <p className="text-center text-small text-muted-foreground">{t('auth.login.or')}</p>
      <div className="relative mt-3">
        <Button
          variant="outline"
          className="w-full"
          disabled={isPending}
          aria-describedby={isLast ? pillId : undefined}
          onClick={onSignIn}
        >
          {t('auth.login.passkey')}
        </Button>
        {isLast && <LastUsedPill id={pillId} />}
      </div>
      {errorMessage && (
        <p role="alert" className="mt-3 text-center text-small text-red-ink">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
