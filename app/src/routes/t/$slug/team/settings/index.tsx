import { createFileRoute, redirect } from '@tanstack/react-router'
import { parseBunqResult } from '@features/connect-bunq/lib/bunq-result'
import { useActAsRecords } from '@shared/api/act-as'
import { useBunqConnection } from '@shared/api/bunq-connection'
import { useEventTypes } from '@shared/api/event-types'
import { useMatchFeed } from '@shared/api/match-feed'
import { useMoneyPoolSettings } from '@shared/api/money-pool'
import { usePositions } from '@shared/api/positions'
import { useSeason } from '@shared/api/season'
import { TeamSettingsHubView } from '@pages/team-settings/ui/TeamSettingsHubView'
import { actAsHint, bunqHint, matchFeedHint, moneyPoolHint, seasonHint } from '@pages/team-settings/lib/hub-hints'

export const Route = createFileRoute('/t/$slug/team/settings/')({
  // The API's Bunq callback still lands here with `?bunq=` (BunqOAuthCallbackController); pass the
  // result on to the Bunq page, which shows it. Replace, so Back does not return to the callback URL.
  beforeLoad: ({ params, search }) => {
    const bunq = parseBunqResult((search as Record<string, unknown>).bunq)
    if (bunq)
      throw redirect({
        to: '/t/$slug/team/settings/$section',
        params: { slug: params.slug, section: 'bunq' },
        search: { bunq },
        replace: true,
      })
  },
  component: TeamSettingsHubPage,
})

/** Container for the hub: reads each row's query for its value line. Pure wiring (ADR-0017). */
function TeamSettingsHubPage() {
  const { data: positions } = usePositions()
  const { data: eventTypes } = useEventTypes()
  const { data: season } = useSeason()
  const { data: matchFeed } = useMatchFeed()
  const { data: moneyPool } = useMoneyPoolSettings()
  const { data: bunq } = useBunqConnection()
  const { data: actAs } = useActAsRecords()

  return (
    <TeamSettingsHubView
      hints={{
        positions: positions?.length.toString(),
        eventTypes: eventTypes?.length.toString(),
        season: seasonHint(season),
        matchFeed: matchFeedHint(matchFeed),
        moneyPool: moneyPoolHint(moneyPool),
        bunq: bunqHint(bunq),
        platformAccess: actAsHint(actAs?.length),
      }}
    />
  )
}
