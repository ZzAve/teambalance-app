import { useCallback, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { teamRoutes, type TeamSettingsSection } from '@shared/lib/team-routes'
import { TeamSettings } from '@features/team-settings/ui/TeamSettings'
import { MoneySettings } from '@features/money-settings/ui/MoneySettings'
import { ConnectBunq } from '@features/connect-bunq/ui/ConnectBunq'
import { parseBunqResult, type ConnectBunqResult } from '@features/connect-bunq/lib/bunq-result'
import { ManagePositions } from '@features/manage-positions/ui/ManagePositions'
import { ManageEventTypes } from '@features/manage-event-types/ui/ManageEventTypes'
import { MatchFeed } from '@features/match-feed/ui/MatchFeed'
import { HandoverAdmin } from '@features/handover-admin/ui/HandoverAdmin'
import { ActAsRecords } from '@features/act-as/ui/ActAsRecords'
import { PageHeader } from '@widgets/page-header/ui/PageHeader'

// The title key and the feature view behind each hub row. The heading is the page header's title, so
// the feature views carry none of their own.
const SECTIONS = {
  positions: { titleKey: 'positions.heading', render: () => <ManagePositions /> },
  'event-types': { titleKey: 'eventTypes.heading', render: () => <ManageEventTypes /> },
  season: { titleKey: 'teamSettings.heading', render: () => <TeamSettings /> },
  'match-feed': { titleKey: 'matchFeed.title', render: () => <MatchFeed /> },
  money: { titleKey: 'moneySettings.title', render: () => <MoneySettings /> },
  bunq: { titleKey: 'connectBunq.title', render: (bunq) => <ConnectBunq {...bunq} /> },
  // Handing over admin (ADR-0024 §5): how a prepared, memberless team gets its first real Admin.
  handover: { titleKey: 'handover.heading', render: () => <HandoverAdmin /> },
  access: { titleKey: 'actAs.records.title', render: () => <ActAsRecords /> },
} as const satisfies Record<TeamSettingsSection, { titleKey: string; render: (bunq: BunqProps) => ReactNode }>

interface BunqProps {
  result?: ConnectBunqResult
  onResultShown: () => void
}

const isSection = (value: string): value is TeamSettingsSection => Object.hasOwn(SECTIONS, value)

export const Route = createFileRoute('/t/$slug/team/settings/$section')({
  // `?bunq=` is how the API's Bunq callback reports the end of a connection attempt (forwarded by the
  // hub); anything else is dropped.
  validateSearch: (search: Record<string, unknown>): { bunq?: ConnectBunqResult } => ({
    bunq: parseBunqResult(search.bunq),
  }),
  beforeLoad: ({ params }) => {
    if (!isSection(params.section)) throw redirect({ to: teamRoutes(params.slug).teamSettings, replace: true })
  },
  component: TeamSettingPage,
})

function TeamSettingPage() {
  const { t } = useTranslation()
  const { slug, section } = Route.useParams()
  const { bunq } = Route.useSearch()
  const navigate = Route.useNavigate()
  // Bunq's result is for the first load only; it leaves the URL (and the history entry) once shown.
  const consumeBunqResult = useCallback(
    () => navigate({ search: (previous) => ({ ...previous, bunq: undefined }), replace: true }),
    [navigate],
  )
  if (!isSection(section)) return null
  const { titleKey, render } = SECTIONS[section]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t(titleKey)}
        backTo={teamRoutes(slug).teamSettings}
        backLabel={t('teamSettingsHub.back')}
      />
      {render({ result: bunq, onResultShown: consumeBunqResult })}
    </div>
  )
}
