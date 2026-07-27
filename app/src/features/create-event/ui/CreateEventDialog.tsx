import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Button } from '@shared/ui/button'
import { useCreateEvent, type EventInput } from '@shared/api/events'
import { useEventTypes } from '@shared/api/event-types'
import { CreateEventForm } from './CreateEventForm'

/**
 * Container for creating an event: owns the dialog open/close state and wires the event-types query
 * and the create-event mutation to the presentational CreateEventForm. Closing the dialog unmounts
 * the form, so its local state resets for the next open.
 */
export function CreateEventDialog() {
  const [open, setOpen] = useState(false)
  const { data: eventTypes } = useEventTypes()
  const createEvent = useCreateEvent()

  const handleSubmit = (values: EventInput) => {
    createEvent.mutate(values, { onSuccess: () => setOpen(false) })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>
        <CreateEventForm
          eventTypes={eventTypes ?? []}
          isPending={createEvent.isPending}
          onSubmit={handleSubmit}
          error={createEvent.isError ? 'Could not create the event. Please try again.' : null}
        />
      </DialogContent>
    </Dialog>
  )
}
