import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'
import { CalendarRange, Handshake, Landmark, ListChecks, PiggyBank, Radio, ShieldCheck, Shirt } from 'lucide-react'
import { useTeamRoutes } from '@shared/lib/team-routes'
import { SectionLabel } from '@shared/ui/SectionLabel'
import { CARD, NavRow } from '@shared/ui/settings-list'
import { PageHeader } from '@widgets/page-header/ui/PageHeader'

/** Each row's current value, from `hub-hints`; undefined while its query loads (the row shows none). */
export interface TeamSettingsHints {
  positions?: string
  eventTypes?: string
  matchFeed?: string
  season?: string
  moneyPool?: string
  bunq?: string
  platformAccess?: string
}

const icon = (Icon: typeof Shirt) => <Icon size={18} strokeWidth={1.9} />

/**
 * The Team settings hub, the Account tab's row pattern (ADR-0027 §2): one short row per setting with
 * its current value, grouped by what it changes. Each row opens that setting on its own page under
 * /team/settings/. People are not here: an Admin edits a person on their page from /team.
 * Prop-only; the route reads the queries behind the hints (ADR-0017).
 */
export function TeamSettingsHubView({ hints }: { hints: TeamSettingsHints }) {
  const { t } = useTranslation()
  const routes = useTeamRoutes()

  const group = (label: string, rows: ReactNode) => (
    <section>
      <SectionLabel as="h3" className="mb-2 px-1 text-small">{label}</SectionLabel>
      <div className={`${CARD} divide-y divide-border`}>{rows}</div>
    </section>
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('teamPage.settings')} backTo={routes.team} backLabel={t('teamPage.back')} />
      {group(
        t('teamSettingsHub.seasonSetup'),
        <>
          <NavRow to={routes.teamSetting('positions')} icon={icon(Shirt)} title={t('positions.heading')} hint={hints.positions} />
          <NavRow to={routes.teamSetting('event-types')} icon={icon(ListChecks)} title={t('eventTypes.heading')} hint={hints.eventTypes} />
          <NavRow to={routes.teamSetting('season')} icon={icon(CalendarRange)} title={t('teamSettings.heading')} hint={hints.season} />
          <NavRow to={routes.teamSetting('match-feed')} icon={icon(Radio)} title={t('teamSettingsHub.matchFeed')} hint={hints.matchFeed} />
        </>,
      )}
      {group(
        t('teamSettingsHub.money'),
        <>
          <NavRow to={routes.teamSetting('money')} icon={icon(PiggyBank)} title={t('moneySettings.title')} hint={hints.moneyPool} />
          <NavRow to={routes.teamSetting('bunq')} icon={icon(Landmark)} title={t('teamSettingsHub.bunq')} hint={hints.bunq} />
        </>,
      )}
      {group(
        t('teamSettingsHub.access'),
        <>
          <NavRow to={routes.teamSetting('handover')} icon={icon(Handshake)} title={t('handover.heading')} />
          <NavRow to={routes.teamSetting('access')} icon={icon(ShieldCheck)} title={t('actAs.records.title')} hint={hints.platformAccess} />
        </>,
      )}
    </div>
  )
}
