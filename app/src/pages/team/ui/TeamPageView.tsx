import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'
import { Settings, UserPlus } from 'lucide-react'
import { useTeamRoutes } from '@shared/lib/team-routes'
import { CARD, NavRow, NavRowContent, ROW_INTERACTIVE } from '@shared/ui/settings-list'
import { PageHeader } from '@widgets/page-header/ui/PageHeader'

interface TeamPageViewProps {
  /** Only admins get the "Invite people" and "Team settings" rows. */
  isAdmin: boolean
  /**
   * Wraps the "Invite people" row in whatever opens the invite link: the live dialog in the route,
   * a spy in a story. Called with the row as the trigger.
   */
  invite?: (trigger: ReactNode) => ReactNode
  /** The Team's Roster — the live container in the route, the prop-only View in a story. */
  roster: ReactNode
  /** The Team's Substitutes (ADR-0033) as faces under the Roster: they are not Members. */
  substitutes: ReactNode
  /** The Bulletin Board (ADR-0050), above the roster. */
  bulletin?: ReactNode
}

/**
 * The team page laid out (ADR-0032 §3): the title in the app bar, the Bulletin Board, for admins an
 * "Invite people" row, then the Roster and the Substitutes as faces, and for admins a "Team settings"
 * row last. The faces are the same for everyone: an admin edits a person on their page.
 */
export function TeamPageView({ isAdmin, invite, roster, substitutes, bulletin }: TeamPageViewProps) {
  const { t } = useTranslation()
  const routes = useTeamRoutes()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('nav.team')} />
      {bulletin}
      {isAdmin && invite && (
        <div className={CARD}>
          {invite(
            <button type="button" className={ROW_INTERACTIVE}>
              <NavRowContent icon={<UserPlus size={18} strokeWidth={1.9} />} title={t('teamPage.invite')} hint={t('teamPage.inviteHint')} />
            </button>,
          )}
        </div>
      )}
      {roster}
      {substitutes}
      {isAdmin && (
        <div className={CARD}>
          <NavRow
            to={routes.teamSettings}
            icon={<Settings size={18} strokeWidth={1.9} />}
            title={t('teamPage.settings')}
            hint={t('teamPage.settingsHint')}
          />
        </div>
      )}
    </div>
  )
}
