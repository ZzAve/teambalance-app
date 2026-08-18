import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/dialog'
import { Button } from '@shared/ui/button'
import { useDeleteEvent, type Event } from '@shared/api/events'
import { DeleteEventDialogView } from './DeleteEventDialogView'

interface DeleteEventDialogProps {
  eventId: string
  title: string
  /** Every occurrence sharing this event's recurring group. A single-element (or empty) list is standalone. */
  siblings?: Event[]
}

/**
 * Container for deleting an event: wires the DeleteEvent mutation and the post-delete navigation to
 * the presentational DeleteEventDialogView, and owns the dialog open/close state. Pure wiring — the
 * scope state and the pending/error shells live in the View (props-driven), so this seam is covered
 * by e2e, not a story. On success it navigates back to the event list, since the detail route may be
 * gone. The dialog chrome (title + description) stays here, so the View is Radix-free. See ADR-0017.
 */
export function DeleteEventDialog({ eventId, title, siblings = [] }: DeleteEventDialogProps) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const deleteEvent = useDeleteEvent()

  const isSeries = siblings.length > 1

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        className="flex-1 border-red/30 text-red hover:bg-red/5 hover:text-red"
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
        <DeleteEventDialogView
          eventId={eventId}
          siblings={siblings}
          isPending={deleteEvent.isPending}
          isError={deleteEvent.isError}
          onDelete={(scope) => deleteEvent.mutate({ id: eventId, scope }, { onSuccess: () => navigate({ to: '/' }) })}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
