import type { DemoPersona } from '@shared/api/demo'
import { useTranslation } from 'react-i18next'
import { Button } from '@shared/ui/button'

interface DemoLoginViewProps {
  onPlay: (persona: DemoPersona) => void
  isPending?: boolean
  isError?: boolean
}

/** The demo entry page (ADR-0043): two buttons that sign the visitor in as the demo team's player or its coach (admin). */
export function DemoLoginView({ onPlay, isPending = false, isError = false }: DemoLoginViewProps) {
  const { t } = useTranslation()
  return (
    <div className="mx-auto mt-16 max-w-sm text-center">
      <h1 className="font-display text-title font-bold">
        Team<span className="text-green">Balance</span>
      </h1>
      <p className="mt-2 text-small text-muted-foreground">{t('demo.intro')}</p>
      <Button className="mt-6 w-full" disabled={isPending} onClick={() => onPlay('MEMBER')}>
        {t('demo.playMember')}
      </Button>
      <Button className="mt-3 w-full" variant="outline" disabled={isPending} onClick={() => onPlay('ADMIN')}>
        {t('demo.playAdmin')}
      </Button>
      {isError && (
        <p role="alert" className="mt-4 text-small text-red-ink">
          {t('demo.error')}
        </p>
      )}
    </div>
  )
}
