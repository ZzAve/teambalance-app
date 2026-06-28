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
  const [selectedTypeId, setSelectedTypeId] = useState<string>('')
  const [title, setTitle] = useState('')
  const [titleTouched, setTitleTouched] = useState(false)
  const { data: eventTypes } = useEventTypes()
  const createEvent = useCreateEvent()

  const selectedType = eventTypes?.find((t) => t.id === selectedTypeId)

  const handleTypeChange = (typeId: string) => {
    setSelectedTypeId(typeId)
    // Auto-suggest title based on type name — only if user hasn't typed their own title
    if (!titleTouched) {
      const type = eventTypes?.find((t) => t.id === typeId)
      if (type) {
        setTitle(type.name)
      }
    }
  }

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      // Reset state on close
      setSelectedTypeId('')
      setTitle('')
      setTitleTouched(false)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    createEvent.mutate(
      {
        eventTypeId: selectedTypeId,
        title: title,
        description: (form.get('description') as string) || undefined,
        startTime: new Date(form.get('startTime') as string).toISOString(),
        endTime: form.get('endTime') ? new Date(form.get('endTime') as string).toISOString() : undefined,
        location: (form.get('location') as string) || undefined,
      },
      { onSuccess: () => handleOpenChange(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>New Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Event type selector with color preview swatch */}
          <div>
            <Label htmlFor="eventTypeId">Type</Label>
            <div className="flex items-center gap-2">
              {/* Color preview dot */}
              <div
                className="h-6 w-6 shrink-0 rounded-full border border-border transition-colors"
                style={{ backgroundColor: selectedType?.color ?? 'transparent' }}
                aria-hidden="true"
              />
              <Select
                name="eventTypeId"
                required
                value={selectedTypeId}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes?.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-3 w-3 rounded-full"
                          style={{ backgroundColor: t.color ?? '#888' }}
                        />
                        {t.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title with auto-suggest */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setTitleTouched(true)
              }}
              placeholder={selectedType ? `e.g. ${selectedType.name}` : 'Event title'}
            />
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
          <Button
            type="submit"
            disabled={createEvent.isPending}
            style={selectedType?.color ? { backgroundColor: selectedType.color, borderColor: selectedType.color } : undefined}
          >
            {createEvent.isPending ? 'Creating...' : 'Create Event'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
