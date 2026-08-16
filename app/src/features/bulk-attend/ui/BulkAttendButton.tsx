import { toast } from 'sonner'
import type { Event } from '@shared/api/events'
import { useBulkAttend, useBulkUndo } from '@shared/api/attendances'
import { useUserStore } from '@shared/stores/user-store'
import { sharedTypeName } from '../lib/attend-label'
import { batchToastMessage } from '../lib/batch-toast-message'
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
          // The message reports the shortfall when the server created fewer rows than were asked
          // for, so a silent skip can't read as "that's all you wanted".
          const message = batchToastMessage(createdEventIds.length, events.length)
          if (createdEventIds.length === 0) {
            // Nothing was created, so there is nothing for Undo to remove — offering it would be a
            // button that does nothing.
            toast(message)
            return
          }
          toast(message, {
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
