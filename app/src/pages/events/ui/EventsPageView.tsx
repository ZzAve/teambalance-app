import { useState, type ComponentProps, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { CalendarDays } from 'lucide-react'
import { useTeamRoutes } from '@shared/lib/team-routes'
import { EventListView } from '@entities/event/ui/EventListView'
import { EventFiltersView } from '@features/filter-event-types/ui/EventFiltersView'
import { KeepPanelsOpenRow } from '@features/event-panel-view/ui/KeepPanelsOpenRow'

interface EventsPageViewProps {
  /** The admin's "New Event" trigger; absent for members. */
  createAction?: ReactNode
  /** The page places the open filters itself and adds the view switch as their last row. */
  filters: Omit<ComponentProps<typeof EventFiltersView>, 'inlineSlot' | 'viewRow'>
  panelMenu: ComponentProps<typeof KeepPanelsOpenRow>
  /** The Next Up hero, when (and only when) one is due — no placeholder in its place. */
  hero?: ReactNode
  /** One button per event type with blanks left; renders nothing when there are none. */
  bulkBar?: ReactNode
  list: ComponentProps<typeof EventListView>
  /** A Platform Admin acting as this team has no calendar links of their own (ADR-0024). */
  hideCalendarLink?: boolean
}

/**
 * The events page laid out (ADR-0032 §3): a compact header with the filter trigger (the open
 * filters end with the view switch), the Next Up hero when one is due, the bulk-attend bar, then one
 * flat chronological list. Prop-only — the route decides what goes in each slot (the live hero, bar
 * and create sheet are containers with their own queries), and the story fills the same slots with
 * their prop-only Views, so the whole page renders with zero network.
 */
export function EventsPageView({
  createAction,
  filters,
  panelMenu,
  hero,
  bulkBar,
  list,
  hideCalendarLink,
}: EventsPageViewProps) {
  const routes = useTeamRoutes()
  // Filters open inline below the header, with the view switch as their last row.
  const [filtersSlot, setFiltersSlot] = useState<HTMLElement | null>(null)

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-title font-bold">Events</h2>
        <div className="flex items-center gap-2">
          {/* The invite link moved to the Team page (team-management action); Events keeps
              only event creation for admins. */}
          {createAction}
          {/* Always mounted: the filters now own the only route to past events, so they
              must not disappear with the event types they also happen to host. */}
          <EventFiltersView {...filters} inlineSlot={filtersSlot} viewRow={<KeepPanelsOpenRow {...panelMenu} />} />
          {/* Every member's way to their calendar links; not in the bottom nav (ADR-0039). */}
          {!hideCalendarLink && (
            <Link
              to={routes.calendar}
              aria-label="Calendar links"
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border/60 bg-card text-muted-foreground transition-colors hover:text-foreground"
            >
              <CalendarDays size={16} />
            </Link>
          )}
        </div>
      </div>

      <div ref={setFiltersSlot} />

      {/* No hero when nothing is within RELATIVE_WINDOW_DAYS — and no placeholder in its
          place. The list carries the page. */}
      {hero}

      {/* One button per event type with blanks left (ADR-0021); renders nothing at all when
          there are none, so a fully-answered page reserves no empty row. */}
      {bulkBar}

      <EventListView {...list} />
    </div>
  )
}
