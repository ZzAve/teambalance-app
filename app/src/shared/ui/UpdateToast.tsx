import { Button } from './button'
import { useTranslation } from 'react-i18next'

interface UpdateToastProps {
  /** Whether the update-available toast is shown. Hidden renders nothing. */
  show: boolean
  onReload: () => void
}

/**
 * The update-available prompt (caching plan Phase 3), shown only in the one case SwUpdateManager
 * won't auto-apply: a new version landed while the user is mid-session with unsaved / in-flight
 * state. Presentational — hidden vs shown and the reload callback come in as props, so it stories
 * with no service worker. Sits above the bottom nav, clear of the home-indicator inset.
 */
export function UpdateToast({ show, onReload }: UpdateToastProps) {
  const { t } = useTranslation()
  if (!show) return null
  return (
    <div
      role="alert"
      className="fixed inset-x-0 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-50 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-lg"
    >
      <span className="text-small">{t('sharedUi.update.available')}</span>
      <Button size="sm" onClick={onReload}>
        {t('sharedUi.update.reload')}
      </Button>
    </div>
  )
}
