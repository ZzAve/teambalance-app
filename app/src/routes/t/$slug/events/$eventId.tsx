import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useEvent, useEvents } from '@shared/api/events'
import { useSetAttendance } from '@shared/api/attendances'
import { useUserStore } from '@shared/stores/user-store'
import { attributionName } from '@entities/event/lib/attribution'
import { crossMemberToast } from '@entities/event/lib/cross-member-toast'
import { buildSeriesPeek } from '@entities/event/lib/series-peek'
import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import { EditEventDialog } from '@features/edit-event/ui/EditEventDialog'
import { DeleteEventDialog } from '@features/edit-event/ui/DeleteEventDialog'
import { useTeamRoutes } from '@shared/lib/team-routes'
import { EventDetailView } from '@pages/event-detail/ui/EventDetailView'

export const Route = createFileRoute('/t/$slug/events/$eventId')({
  component: EventDetailPage,
})

function EventDetailPage() {
  const { eventId } = Route.useParams()
  const routes = useTeamRoutes()
  const { data: event, isLoading, isError, refetch } = useEvent(eventId)
  const currentUserId = useUserStore((s) => s.userId)
  const isAdmin = useUserStore((s) => s.role) === 'ADMIN'
  const { mutate, isPending } = useSetAttendance()
  // Only load the full list to find series siblings when this event actually belongs to a group.
  const { data: allEvents } = useEvents(true, !!event?.recurringGroup)

  const myAttendance = event?.attendances.find((a) => a.userId === currentUserId)
  const myState: AttendanceState = (myAttendance?.state as AttendanceState) ?? 'NOT_RESPONDED'
  const myAttribution = myAttendance && event ? attributionName(myAttendance, event.attendances) : null

  // Setting an answer. For a teammate (trust-based, ADR-0003) it raises an Undo toast — the awareness
  // and the safety net for a cross-member change; your own answer just writes.
  const setAttendance = (userId: string, state: AttendanceState) => {
    const target = event?.attendances.find((a) => a.userId === userId)
    const prior = (target?.state as AttendanceState) ?? 'NOT_RESPONDED'
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
    <EventDetailView
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      backTo={routes.events}
      event={event ?? null}
      currentUserId={currentUserId}
      myState={myState}
      myAttribution={myAttribution}
      isPending={isPending}
      onToggleMine={(state) => {
        if (currentUserId) mutate({ eventId, userId: currentUserId, state })
      }}
      onRespond={setAttendance}
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
  )
}
