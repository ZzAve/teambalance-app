import type { ComponentProps, ReactNode } from 'react'
import { EventListView } from '@entities/event/ui/EventListView'
import { EventFiltersView } from '@features/filter-event-types/ui/EventFiltersView'
import { PanelViewMenu } from '@features/event-panel-view/ui/PanelViewMenu'
import { WIDE_COLUMN } from '@shared/ui/AppShellFrame'

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
 *
 * From `lg` up it splits in two (ADR-0033): everything a member scans *before* acting — the header
 * with its two popovers, the hero, the bulk-attend bar — moves into a left rail, and the
 * chronological list takes the right. The cards do not widen; the list column is 40rem, the width a
 * card already has on a laptop, so the extra room pays for the rail and nothing else. This is the
 * one page that opts out of the shell's centred column, hence WIDE_COLUMN on the root.
 */
export function EventsPageView({ createAction, filters, panelMenu, hero, bulkBar, list }: EventsPageViewProps) {
  return (
    <div {...WIDE_COLUMN} className="lg:grid lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-8">
      {/* The rail. `contents` below `lg`: it is not a box at all on a phone, so the single column
          stays the box tree it was before the rail existed — margins and all — and becomes a grid
          item only where the grid does. The list needs no such wrapper: EventListView's own root
          is the second column, in every one of its states. */}
      <div className="contents lg:block">
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

        {/* Only the hero and the bar stick, never the header row above them: a sticky box forms a
            stacking context, and both popovers up there position themselves inside it — their
            overlay and panel would then paint under the cards beside them. The rail column itself
            stretches to the row's height, which is the travel this sticky has. */}
        <div className="contents lg:block lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
          {/* No hero when nothing is within RELATIVE_WINDOW_DAYS — and no placeholder in its
              place. The list carries the page. */}
          {hero}

          {/* One button per event type with blanks left (ADR-0021); renders nothing at all when
              there are none, so a fully-answered page reserves no empty row. */}
          {bulkBar}
        </div>
      </div>

      <EventListView {...list} />
    </div>
  )
}
