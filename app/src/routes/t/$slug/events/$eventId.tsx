import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useEvent, useEvents } from '@entities/event/api/events'
import { useSetAttendance } from '@entities/attendance/api/attendances'
import { useSession } from '@shared/session/session'
import { attributionName } from '@entities/event/lib/attribution'
import { crossMemberToast } from '@entities/event/lib/cross-member-toast'
import { buildSeriesPeek } from '@entities/event/lib/series-peek'
import { myAnswerOf, type AttendanceState } from '@entities/attendance/model/attendance-state'
import { EditEventDialog } from '@features/edit-event/ui/EditEventDialog'
import { DeleteEventDialog } from '@features/edit-event/ui/DeleteEventDialog'
import { SubstitutePicker } from '@features/call-in-substitutes/ui/SubstitutePicker'
import { useEventLineup } from '@widgets/event-panel/model/use-event-lineup'
import { useTeamRoutes } from '@shared/lib/team-routes'
import { EventDetailView } from '@pages/event-detail/ui/EventDetailView'

export const Route = createFileRoute('/t/$slug/events/$eventId')({
  component: EventDetailPage,
})

function EventDetailPage() {
  const { eventId } = Route.useParams()
  const routes = useTeamRoutes()
  const { data: event, isLoading, isError, refetch } = useEvent(eventId)
  const { user, isAdmin, isActingAs } = useSession()
  const currentUserId = user?.id ?? null
  const { mutate, isPending } = useSetAttendance()
  // Only load the full list to find series siblings when this event actually belongs to a group.
  const { data: allEvents } = useEvents(true, !!event?.recurringGroup)
  const { picker, lineupHandlers } = useEventLineup(event ? [event] : undefined)
  const { substitutePending, ...substituteHandlers } = lineupHandlers(eventId)

  const myAttendance = event?.attendances.find((a) => a.userId === currentUserId)
  const myState = myAnswerOf(event?.attendances ?? [], currentUserId)
  const myAttribution = myAttendance && event ? attributionName(myAttendance, event.attendances) : null

  // Setting an answer. For a teammate (trust-based, ADR-0003) it raises an Undo toast — the awareness
  // and the safety net for a cross-member change; your own answer just writes.
  const setAttendance = (userId: string, state: AttendanceState) => {
    const target = event?.attendances.find((a) => a.userId === userId)
    const prior = myAnswerOf(event?.attendances ?? [], userId)
    mutate({ eventId, userId, state })
    if (userId !== currentUserId) {
      const { message, undoState } = crossMemberToast(target?.displayName ?? 'teammate', state, prior)
      toast(
        message,
        undoState
          ? { action: { label: 'Undo', onClick: () => mutate({ eventId, userId, state: undoState }) } }
          : undefined,
      )
    }
  }

  // "Part of a series" peek: siblings are every event sharing this occurrence's recurring group.
  const siblings = event?.recurringGroup
    ? (allEvents ?? []).filter((e) => e.recurringGroup === event.recurringGroup)
    : []
  const seriesPeek = event?.recurringGroup ? buildSeriesPeek(siblings, event.id) : null

  return (
    <>
      <EventDetailView
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        backTo={routes.events}
        calendarHref={isActingAs ? undefined : routes.calendar}
        event={event ?? null}
        currentUserId={currentUserId}
        myState={myState}
        myAttribution={myAttribution}
        isPending={isPending}
        isSubstitutePending={substitutePending}
        onToggleMine={(state) => {
          if (currentUserId) mutate({ eventId, userId: currentUserId, state })
        }}
        onRespond={setAttendance}
        {...substituteHandlers}
        seriesPeek={seriesPeek}
        adminActions={
          isAdmin &&
          event && (
            <>
              <EditEventDialog event={event} siblings={siblings} />
              <DeleteEventDialog eventId={event.id} title={event.title} siblings={siblings} />
            </>
          )
        }
      />
      <SubstitutePicker {...picker} />
    </>
  )
}
