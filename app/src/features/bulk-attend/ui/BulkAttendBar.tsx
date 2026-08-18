import { useState } from 'react'
import { toast } from 'sonner'
import type { Event } from '@shared/api/events'
import { useBulkAttend, useBulkUndo } from '@shared/api/attendances'
import { useUserStore } from '@shared/stores/user-store'
import { groupByType } from '../lib/group-by-type'
import { batchToastMessage } from '../lib/batch-toast-message'
import { BulkAttendBarView } from './BulkAttendBarView'

interface BulkAttendBarProps {
  /** The shown, unanswered, future events — computed by the page from its filtered list. */
  events: Event[]
}

/**
 * Container for the per-type Bulk Attend buttons (ADR-0021): thin wiring from the View to the batch
 * mutation and the Undo toast, per the container/view split in ADR-0017.
 *
 * One mutation serves every button, so the toast policy lives in one place; `pendingTypeId` tracks
 * which button fired so only that one goes disabled while its batch is in flight.
 *
 * Undo is handed the ids the *server* reported creating, never the ids sent — a race may have filled
 * one since the list loaded, and undoing an id we did not create would delete a real answer. That is
 * the whole reason the endpoint returns them.
 */
export function BulkAttendBar({ events }: BulkAttendBarProps) {
  const userId = useUserStore((s) => s.userId)
  const [pendingTypeId, setPendingTypeId] = useState<string | null>(null)
  const bulkAttend = useBulkAttend()
  const bulkUndo = useBulkUndo()

  if (!userId) return null

  const groups = groupByType(events)

  const handleAttend = (typeId: string) => {
    const group = groups.find((candidate) => candidate.typeId === typeId)
    if (!group) return

    setPendingTypeId(typeId)
    bulkAttend.mutate(
      { userId, eventIds: group.events.map((event) => event.id) },
      {
        onSettled: () => setPendingTypeId(null),
        onSuccess: (createdEventIds) => {
          // Reports the shortfall when the server created fewer rows than were asked for, so a
          // silent skip cannot read as "that's all you wanted".
          const message = batchToastMessage(createdEventIds.length, group.events.length, group.typeName)
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

  return <BulkAttendBarView groups={groups} onAttend={handleAttend} pendingTypeId={pendingTypeId} />
}
