import { toast } from 'sonner'
import type { Event } from '@shared/api/events'
import { useBulkAttend, useBulkUndo } from '@shared/api/attendances'
import { useUserStore } from '@shared/stores/user-store'
import { sharedTypeName } from '../lib/attend-label'
import { BulkAttendButtonView } from './BulkAttendButtonView'

interface BulkAttendButtonProps {
  /** The shown, unanswered, future events — computed by the page from its filtered list. */
  events: Event[]
}

/**
 * Container for the "Attend N" button (ADR-0020): thin wiring from the View to the batch mutation
 * and the Undo toast, per the container/view split in ADR-0017.
 *
 * Undo is handed the ids the *server* reported creating, never the ids we sent — a race may have
 * filled one since the list loaded, and undoing an id we did not create would delete someone's real
 * answer. That is the whole reason the endpoint returns them.
 */
export function BulkAttendButton({ events }: BulkAttendButtonProps) {
  const userId = useUserStore((s) => s.userId)
  const bulkAttend = useBulkAttend()
  const bulkUndo = useBulkUndo()

  if (!userId) return null

  const handleAttend = () => {
    bulkAttend.mutate(
      { userId, eventIds: events.map((event) => event.id) },
      {
        onSuccess: (createdEventIds) => {
          if (createdEventIds.length === 0) {
            // Everything was filled in between the list loading and the tap — nothing to undo.
            toast('Those events were already answered.')
            return
          }
          toast(`${createdEventIds.length} ${createdEventIds.length === 1 ? 'event' : 'events'} set to Attending`, {
            action: {
              label: 'Undo',
              onClick: () => bulkUndo.mutate({ userId, eventIds: createdEventIds }),
            },
          })
        },
      },
    )
  }

  return (
    <BulkAttendButtonView
      count={events.length}
      typeName={sharedTypeName(events)}
      onAttend={handleAttend}
      isPending={bulkAttend.isPending}
    />
  )
}
