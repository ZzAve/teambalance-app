import { useTranslation } from 'react-i18next'
import { Button } from '@shared/ui/button'

interface DemoBannerViewProps {
  /** Where "Start your own team" leads: how a visitor asks for a real team. */
  startTeamHref: string
  /** Absent on the picker itself, where there is no role to switch away from: the button is not rendered. */
  onSwitchRole?: () => void
  isSwitching?: boolean
}

/** The permanent banner of the demo build (ADR-0043): says the data is temporary, offers a real team and a role switch. */
export function DemoBannerView({ startTeamHref, onSwitchRole, isSwitching = false }: DemoBannerViewProps) {
  const { t } = useTranslation()
  return (
    <aside
      aria-label={t('demo.banner.label')}
      className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-gold/40 bg-gold/15 px-5 py-2"
    >
      <p className="text-small">
        {t('demo.banner.notice')}{' '}
        <a href={startTeamHref} className="text-blue underline">
          {t('demo.banner.startTeam')}
        </a>
      </p>
      {onSwitchRole && (
        <Button size="sm" variant="outline" disabled={isSwitching} onClick={onSwitchRole}>
          {t('demo.banner.switchRole')}
        </Button>
      )}
    </aside>
  )
}
