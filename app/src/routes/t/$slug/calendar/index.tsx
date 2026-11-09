import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { teamRoutes } from '@shared/lib/team-routes'
import { PageHeader } from '@widgets/page-header/ui/PageHeader'
import { CalendarLinks } from '@features/calendar-links/ui/CalendarLinks'

export const Route = createFileRoute('/t/$slug/calendar/')({
  component: CalendarPage,
})

/**
 * The member's calendar links for this Team (ADR-0039). Reached from the events overview, not the
 * bottom nav, so the header leads back there.
 */
function CalendarPage() {
  const { t } = useTranslation()
  const { slug } = Route.useParams()
  return (
    <div>
      <PageHeader title={t('calendarLinks.page')} backTo={teamRoutes(slug).events} backLabel={t('calendarLinks.backToEvents')} />
      <CalendarLinks />
    </div>
  )
}
