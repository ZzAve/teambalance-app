import type { AttendanceEntry, EventDetail } from '@shared/api/events'

// Derived from the contract rather than the feature-layer copy — keeps this entities-layer
// helper free of an upward (entities → features) FSD dependency.
type AttendanceState = AttendanceEntry['state']

export interface AttendeeGroup {
  /** Authoritative headcount for this state, taken from the event's attendance summary. */
  count: number
  /** The people known to be in this state (may be shorter than `count` for non-responders). */
  attendees: AttendanceEntry[]
}

export type AttendeePanel = Record<AttendanceState, AttendeeGroup>

/**
 * Derives the tabbed attendance panel (per-state count + attendee list) for an event.
 *
 * Counts come from `attendanceSummary` — the single source of truth, which includes the
 * current user and non-responders who have no entry in `attendances`. Attendee rows are the
 * people we can actually name, grouped by their own state. Everyone is shown, including the
 * current user, so a single attendee no longer renders as "Going 0 / No one".
 */
export function buildAttendeePanel(event: EventDetail): AttendeePanel {
  const { attendanceSummary: summary, attendances } = event
  const byState = (state: AttendanceState, count: number): AttendeeGroup => ({
    count,
    attendees: attendances.filter((a) => a.state === state),
  })

  return {
    ATTENDING: byState('ATTENDING', summary.attending),
    MAYBE: byState('MAYBE', summary.maybe),
    ABSENT: byState('ABSENT', summary.absent),
    NOT_RESPONDED: byState('NOT_RESPONDED', summary.notResponded),
  }
}
