import { useEvent, type Event } from '@shared/api/events'
import { useSetAttendance } from '@shared/api/attendances'
import { useUserStore } from '@shared/stores/user-store'
import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import { NextEventHeroView } from './NextEventHeroView'

/**
 * Container for the Next Up hero. Thin wiring: the route decides *whether* there is a hero
 * (`selectHeroEvent`) and hands the event down; this only resolves the viewer's own response and
 * the RSVP mutation. Per ADR-0017 the View owns every rendered state, so this seam is covered by
 * the existing attendance e2e rather than a story.
 *
 * The viewer's response is not on the list payload, so it comes from the event detail read — the
 * same query the detail page already uses and the same one `useSetAttendance` updates optimistically,
 * so a tap here reflects instantly and stays consistent with the detail page. Until it resolves the
 * hero renders from the list row as not-yet-replied, which is the state that invites the tap anyway.
 *
 * Once the detail is in hand it also supplies the event itself (an EventDetail is an Event plus
 * attendances): the response and the headcount then come from one payload, so the status line can't
 * say "10 going · you're in" with a count that predates the tap.
 */
export function NextEventHero({ event, now }: { event: Event; now?: Date }) {
  const { data: detail } = useEvent(event.id)
  const currentUserId = useUserStore((s) => s.userId)
  const { mutate, isPending } = useSetAttendance()

  const myState: AttendanceState =
    (detail?.attendances.find((a) => a.userId === currentUserId)?.state as AttendanceState) ??
    'NOT_RESPONDED'

  return (
    <NextEventHeroView
      event={detail ?? event}
      myState={myState}
      isSaving={isPending}
      now={now}
      onRespond={(state) => {
        if (currentUserId) mutate({ eventId: event.id, userId: currentUserId, state })
      }}
    />
  )
}
