import type { EventDetail } from '@shared/api/events'

/** How many members have responded to the event. Substitutes are not in the summary, so they are not counted. */
export function respondedCount(event: Pick<EventDetail, 'attendanceSummary'>): number {
  const { attending, maybe, absent } = event.attendanceSummary
  return attending + maybe + absent
}
