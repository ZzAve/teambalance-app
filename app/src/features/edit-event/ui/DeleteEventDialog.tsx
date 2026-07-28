import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/dialog'
import { Button } from '@shared/ui/button'
import { useDeleteEvent, type Event, type EventSeriesScope } from '@shared/api/events'
import { SeriesScopeField } from './SeriesScopeField'

interface DeleteEventDialogProps {
  eventId: string
  title: string
  /** Every occurrence sharing this event's recurring group. A single-element (or empty) list is standalone. */
  siblings?: Event[]
}

/**
 * Delete one occurrence of a series with a scope (ADR-0014, Phase 3). A standalone event (no
 * siblings) deletes itself with the default THIS scope and no prompt. For a series, the
 * SeriesScopeField drives which occurrences go — and a delete **never splits** (survivors keep
 * their group). On success it navigates back to the event list, since the detail route may be gone.
 */
export function DeleteEventDialog({ eventId, title, siblings = [] }: DeleteEventDialogProps) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const deleteEvent = useDeleteEvent()

  const isSeries = siblings.length > 1
  const [scope, setScope] = useState<EventSeriesScope>('THIS')

  const handleDelete = () => {
    deleteEvent.mutate({ id: eventId, scope }, { onSuccess: () => navigate({ to: '/' }) })
  }

  const confirmLabel = deleteEvent.isPending ? 'Deleting…' : isSeries && scope !== 'THIS' ? 'Delete events' : 'Delete event'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        className="flex-1 border-red-200 text-red-500 hover:bg-red-500/5 hover:text-red-500"
        onClick={() => setOpen(true)}
      >
        <Trash2 size={15} />
        Delete
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isSeries ? 'Delete from series?' : 'Delete this event?'}</DialogTitle>
          <DialogDescription>
            {title} will be removed for everyone, along with its attendance.
          </DialogDescription>
        </DialogHeader>
        {isSeries && (
          <SeriesScopeField
            siblings={siblings}
            currentId={eventId}
            scope={scope}
            onScopeChange={setScope}
            variant="delete"
          />
        )}
        {deleteEvent.isError && (
          <p className="rounded-lg border border-red-300 bg-red-500/10 px-3 py-2 text-sm text-red-500">
            Could not delete the event. Please try again.
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={deleteEvent.isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteEvent.isPending}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
