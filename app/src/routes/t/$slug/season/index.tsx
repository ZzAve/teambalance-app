import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useEvents } from '@shared/api/events'
import { useSeason } from '@shared/api/season'
import { usePositions } from '@shared/api/positions'
import { useSetAttendance } from '@shared/api/attendances'
import { useNow } from '@shared/lib/use-now'
import { inSeason, seasonGrid } from '@pages/season/lib/season-grid'
import { SeasonPageView } from '@pages/season/ui/SeasonPageView'

export const Route = createFileRoute('/t/$slug/season/')({
  component: SeasonPage,
})

/** The season grid (sidebar only). Past events included, narrowed to the team's Season window. */
function SeasonPage() {
  const events = useEvents(true)
  const season = useSeason()
  const { data: positions } = usePositions()
  const { mutate: setAttendance } = useSetAttendance()
  const now = useNow()

  const grid = useMemo(
    () =>
      events.data && season.data
        ? seasonGrid(inSeason(events.data, season.data), positions?.map((p) => p.label) ?? [], now)
        : undefined,
    [events.data, season.data, positions, now],
  )

  return (
    <SeasonPageView
      grid={grid}
      isLoading={events.isLoading || season.isLoading}
      isError={events.isError || season.isError}
      onRetry={() => {
        void events.refetch()
        void season.refetch()
      }}
      onSetAnswer={(eventId, userId, state) => setAttendance({ eventId, userId, state })}
    />
  )
}
