import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@shared/ui/button'

interface NotFoundViewProps {
  /**
   * Local escape hatch (ADR-0027 §3): a client-only `clearSession()`. Present only when a session
   * exists — or might; omitted once the auth probe has resolved to "no user".
   */
  onLogout?: () => void
}

/**
 * The router's `defaultNotFoundComponent` (ADR-0027 §3): a real not-found screen for an unknown URL.
 * It renders *instead of* RootLayout, so `/account`'s Log out can't reach it — hence a local escape
 * hatch beside "Go home". Prop-only; the container reads the session and passes `onLogout`.
 */
export function NotFoundView({ onLogout }: NotFoundViewProps) {
  const { t } = useTranslation()
  return (
    <div className="mx-auto mt-16 max-w-sm text-center">
      <h1 className="font-display text-title font-bold">{t('shell.notFound.title')}</h1>
      <p className="mt-3 text-small text-muted-foreground">
        {t('shell.notFound.description')}
      </p>
      <div className="mt-6 flex items-center justify-center gap-2">
        <Button asChild>
          <Link to="/">{t('shell.notFound.goHome')}</Link>
        </Button>
        {onLogout && (
          <Button variant="ghost" onClick={onLogout}>
            {t('account.logout')}
          </Button>
        )}
      </div>
    </div>
  )
}
