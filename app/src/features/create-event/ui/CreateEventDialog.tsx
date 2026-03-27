import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'
import { useCreateEvent } from '@shared/api/events'
import { useEventTypes } from '@shared/api/event-types'

export function CreateEventDialog() {
  const [open, setOpen] = useState(false)
  const { data: eventTypes } = useEventTypes()
  const createEvent = useCreateEvent()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    createEvent.mutate(
      {
        eventTypeId: form.get('eventTypeId') as string,
        title: form.get('title') as string,
        description: (form.get('description') as string) || undefined,
        startTime: new Date(form.get('startTime') as string).toISOString(),
        endTime: form.get('endTime') ? new Date(form.get('endTime') as string).toISOString() : undefined,
        location: (form.get('location') as string) || undefined,
      },
      { onSuccess: () => setOpen(false) },
    )
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="eventTypeId">Type</Label>
            <Select name="eventTypeId" required>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {eventTypes?.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input name="title" required />
          </div>
          <div>
            <Label htmlFor="startTime">Start time</Label>
            <Input name="startTime" type="datetime-local" required />
          </div>
          <div>
            <Label htmlFor="endTime">End time (optional)</Label>
            <Input name="endTime" type="datetime-local" />
          </div>
          <div>
            <Label htmlFor="location">Location (optional)</Label>
            <Input name="location" />
          </div>
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Input name="description" />
          </div>
          <Button type="submit" disabled={createEvent.isPending}>
            {createEvent.isPending ? 'Creating...' : 'Create'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
