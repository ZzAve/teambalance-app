import type { Event } from '@shared/api/events'
import { RELATIVE_WINDOW_DAYS, calendarDaysUntil } from './relative-event-label'

/**
 * The event the Next Up hero should render, or `null` when there should be no hero at all.
 *
 * The hero is the first event of the upcoming list, so the API's upcoming query is the only place
 * that decides which events are upcoming and how long a started event stays. It is never "the next
 * event that happens to qualify": it renders only within `RELATIVE_WINDOW_DAYS` calendar days,
 * measured the same way the card label measures it, so hero visibility and "Today / in N days" never
 * disagree. If the first event is too far out, the page simply has no hero.
 *
 * There is deliberately no "nothing this week" placeholder: when this returns `null` the page goes
 * straight to the list (or the list's empty state). Callers pass the *filtered* list in chronological
 * order, so the hero follows what the user has chosen to look at, and must drop the returned event
 * from the list below so it is not rendered twice.
 *
 * The list must hold no history: with "Show past events" on, its first event is the oldest one, so
 * the page shows no hero then.
 */
export function selectHeroEvent(upcomingEvents: Event[], now: Date): Event | null {
  const first = upcomingEvents.at(0)
  if (first === undefined) return null
  return calendarDaysUntil(first.startTime, now) <= RELATIVE_WINDOW_DAYS ? first : null
}
