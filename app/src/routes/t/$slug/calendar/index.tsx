import { createFileRoute } from '@tanstack/react-router'
import { teamRoutes } from '@shared/lib/team-routes'
import { PageHeader } from '@widgets/page-header/ui/PageHeader'
import { CalendarLinks } from '@features/calendar-links/ui/CalendarLinks'

export const Route = createFileRoute('/t/$slug/calendar/')({
  component: CalendarPage,
})

/**
 * The member's calendar links for this Team (ADR-0032). Reached from the events overview, not the
 * bottom nav, so the header leads back there.
 */
function CalendarPage() {
  const { slug } = Route.useParams()
  return (
    <div>
      <PageHeader title="Calendar" backTo={teamRoutes(slug).events} backLabel="Back to events" />
      <div className="mt-4">
        <CalendarLinks />
      </div>
    </div>
  )
}
