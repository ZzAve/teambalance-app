import type { Event } from '@shared/api/events'
import { RELATIVE_WINDOW_DAYS, calendarDaysUntil } from './relative-event-label'

/**
 * The event the Next Up hero should render, or `null` when there should be no hero at all.
 *
 * Two rules, in order:
 *  1. The hero is the *most imminent* upcoming event — it is never "the next event that happens to
 *     qualify". If the nearest one is too far out, the page simply has no hero.
 *  2. It renders only within `RELATIVE_WINDOW_DAYS` calendar days, measured the same way the card
 *     label measures it, so hero visibility and "Today / in N days" never disagree.
 *
 * There is deliberately no "nothing this week" placeholder: when this returns `null` the page goes
 * straight to the list (or the list's empty state). Callers pass the *filtered* list, so the hero
 * follows what the user has chosen to look at, and must drop the returned event from the list below
 * so it is not rendered twice.
 *
 * The input may be unsorted and may contain past events (it does when "Show past events" is on).
 */
export function selectHeroEvent(events: Event[], now: Date): Event | null {
  const next = events
    .filter((event) => new Date(event.startTime).getTime() >= now.getTime())
    .reduce<Event | null>(
      (nearest, event) =>
        nearest === null || new Date(event.startTime) < new Date(nearest.startTime) ? event : nearest,
      null,
    )

  if (next === null) return null
  return calendarDaysUntil(next.startTime, now) <= RELATIVE_WINDOW_DAYS ? next : null
}
