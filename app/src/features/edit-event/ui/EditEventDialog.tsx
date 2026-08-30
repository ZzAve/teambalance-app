import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Button } from '@shared/ui/button'
import { useUpdateEvent, type Event, type EventDetail } from '@shared/api/events'
import { useEventTypes } from '@shared/api/event-types'
import { usePositions } from '@shared/api/positions'
import { EditEventDialogView } from './EditEventDialogView'

interface EditEventDialogProps {
  event: EventDetail
  /** Every occurrence sharing this event's recurring group. A single-element (or empty) list is standalone. */
  siblings?: Event[]
}

/**
 * Container for editing an event: wires the event-types query and the UpdateEvent mutation to the
 * presentational EditEventDialogView, and owns the dialog open/close state. Pure wiring — the form
 * state and the pending/error shells live in the View (props-driven), so this seam is covered by
 * e2e, not a story. The dialog chrome (trigger + header) stays here, so the View is Radix-free.
 * See ADR-0017.
 */
export function EditEventDialog({ event, siblings = [] }: EditEventDialogProps) {
  const [open, setOpen] = useState(false)
  // Archived types included: an event may hold one that was archived without migration, and the
  // picker must still be able to show the type this event actually has. The View narrows the
  // choices back down to the active ones plus that.
  const { data: eventTypes } = useEventTypes(true)
  const { data: positions } = usePositions()
  const updateEvent = useUpdateEvent()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">
          <Pencil size={15} />
          Edit event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit event</DialogTitle>
        </DialogHeader>
        <EditEventDialogView
          event={event}
          siblings={siblings}
          eventTypes={eventTypes}
          positions={positions}
          isPending={updateEvent.isPending}
          isError={updateEvent.isError}
          onSubmit={(request) => updateEvent.mutate(request, { onSuccess: () => setOpen(false) })}
        />
      </DialogContent>
    </Dialog>
  )
}
