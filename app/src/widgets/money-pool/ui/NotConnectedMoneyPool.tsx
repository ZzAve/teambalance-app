import { Link } from '@tanstack/react-router'
import { Landmark } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { i18n } from '@shared/i18n/i18n'
import { useTeamRoutes } from '@shared/lib/team-routes'
import { Button } from '@shared/ui/button'

interface NotConnectedMoneyPoolProps {
  /**
   * Whether connecting Bunq is switched on for this deployment: true links to the Bunq settings, false says it
   * is coming. Undefined (not known yet, or the status could not be read) says neither.
   */
  connectAvailable?: boolean
  /**
   * The team connected Bunq but no account is picked yet: the admin is sent to the Bunq settings to pick one,
   * as long as connecting is switched on, since those settings show nothing about Bunq otherwise.
   */
  accountPending?: boolean
}

/**
 * The admin's card on a pool without Bunq: what connecting adds (the balance and top-ups) and where to do it
 * (ADR-0042). Members do not see it: for them a pool without Bunq is the out-of-pocket expenses (ADR-0048).
 */
export function NotConnectedMoneyPool({ connectAvailable, accountPending }: NotConnectedMoneyPoolProps) {
  const { t } = useTranslation()
  const routes = useTeamRoutes()
  return (
    <section aria-labelledby="no-bank-account" className="flex gap-3 rounded-lg bg-card p-4">
      <Landmark size={20} className="mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div>
        <h3 id="no-bank-account" className="text-small font-bold">
          {t('money.admin.title')}
        </h3>
        <p className="mt-1 text-small text-muted-foreground">{adminCopy(connectAvailable, accountPending)}</p>
        {connectAvailable && (
          <Button asChild variant="outline" size="sm" className="mt-3">
            <Link to={routes.teamSetting('bunq')}>{t('money.admin.toSettings')}</Link>
          </Button>
        )}
      </div>
    </section>
  )
}

function adminCopy(connectAvailable?: boolean, accountPending?: boolean) {
  if (accountPending && connectAvailable) return i18n.t('money.admin.pickAccount')
  if (connectAvailable === undefined) return i18n.t('money.admin.unknown')
  return connectAvailable ? i18n.t('money.admin.connect') : i18n.t('money.admin.comingSoon')
}
