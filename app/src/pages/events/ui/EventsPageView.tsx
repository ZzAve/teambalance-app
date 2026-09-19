import type { ComponentProps, ReactNode } from 'react'
import { EventListView } from '@entities/event/ui/EventListView'
import { EventFiltersView } from '@features/filter-event-types/ui/EventFiltersView'
import { PanelViewMenu } from '@features/event-panel-view/ui/PanelViewMenu'

interface EventsPageViewProps {
  /** The admin's "New Event" trigger; absent for members. */
  createAction?: ReactNode
  filters: ComponentProps<typeof EventFiltersView>
  panelMenu: ComponentProps<typeof PanelViewMenu>
  /** The Next Up hero, when (and only when) one is due — no placeholder in its place. */
  hero?: ReactNode
  /** One button per event type with blanks left; renders nothing when there are none. */
  bulkBar?: ReactNode
  list: ComponentProps<typeof EventListView>
}

/**
 * The events page laid out (ADR-0032 §3): a compact header with the filter trigger and the view
 * menu, the Next Up hero when one is due, the bulk-attend bar, then one flat chronological list.
 * Prop-only — the route decides what goes in each slot (the live hero, bar and create sheet are
 * containers with their own queries), and the story fills the same slots with their prop-only Views,
 * so the whole page renders with zero network.
 */
export function EventsPageView({ createAction, filters, panelMenu, hero, bulkBar, list }: EventsPageViewProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-title font-bold">Events</h2>
        <div className="flex items-center gap-2">
          {/* The invite link moved to the Team page (team-management action); Events keeps
              only event creation for admins. */}
          {createAction}
          {/* Always mounted: the popover now owns the only route to past events, so it
              must not disappear with the event types it also happens to host. */}
          <EventFiltersView {...filters} />
          {/* How the list is drawn, beside what it contains but deliberately not inside it
              (ADR-0030 §3): a filter is "where was I", this is "how do I like this". */}
          <PanelViewMenu {...panelMenu} />
        </div>
      </div>

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
