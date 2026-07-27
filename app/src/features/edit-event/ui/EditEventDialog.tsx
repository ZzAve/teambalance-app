import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'
import { useUpdateEvent, type EventDetail } from '@shared/api/events'
import { useEventTypes } from '@shared/api/event-types'
import { ReferenceRowsEditor } from '@entities/event/ui/ReferenceRowsEditor'
import { cleanReferences, toReferenceRows, type ReferenceRow } from '@entities/event/lib/references'

interface EditEventDialogProps {
  event: EventDetail
}

// ISO instant → the value a <input type="datetime-local"> expects ('YYYY-MM-DDTHH:mm' in local time).
function toLocalInput(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/**
 * Single-event edit (ADR-0014 Phase 2, "This event" scope only — bulk/split scopes are Phase 3).
 * A recurring occurrence is edited exactly like any standalone event; the group is untouched.
 */
export function EditEventDialog({ event }: EditEventDialogProps) {
  const [open, setOpen] = useState(false)
  const { data: eventTypes } = useEventTypes()
  const updateEvent = useUpdateEvent()

  const [typeId, setTypeId] = useState(event.eventType.id)
  const [title, setTitle] = useState(event.title)
  // Seed the editor from the event's existing links — updateEvent has replace-semantics, so the
  // full set must be sent back on every save or the links would be wiped.
  const [references, setReferences] = useState<ReferenceRow[]>(toReferenceRows(event.references))

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    updateEvent.mutate(
      {
        id: event.id,
        eventTypeId: typeId,
        title,
        description: (form.get('description') as string) || undefined,
        startTime: new Date(form.get('startTime') as string).toISOString(),
        endTime: new Date(form.get('endTime') as string).toISOString(),
        location: (form.get('location') as string) || undefined,
        references: cleanReferences(references),
      },
      { onSuccess: () => setOpen(false) },
    )
  }

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="edit-type">Type</Label>
            <Select value={typeId} onValueChange={setTypeId}>
              <SelectTrigger id="edit-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {(eventTypes ?? []).map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: t.color ?? '#888' }} />
                      {t.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-title">Title</Label>
            <Input id="edit-title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="edit-start">Start time</Label>
            <Input id="edit-start" name="startTime" type="datetime-local" required defaultValue={toLocalInput(event.startTime)} />
          </div>
          <div>
            <Label htmlFor="edit-end">End time</Label>
            <Input id="edit-end" name="endTime" type="datetime-local" required defaultValue={toLocalInput(event.endTime)} />
          </div>
          <div>
            <Label htmlFor="edit-location">Location (optional)</Label>
            <Input id="edit-location" name="location" defaultValue={event.location ?? ''} />
          </div>
          <div>
            <Label htmlFor="edit-description">Description (optional)</Label>
            <Input id="edit-description" name="description" defaultValue={event.description ?? ''} />
          </div>
          <ReferenceRowsEditor rows={references} onChange={setReferences} />
          {updateEvent.isError && (
            <p className="rounded-lg border border-red-300 bg-red-500/10 px-3 py-2 text-sm text-red-500">
              Could not save changes. Please try again.
            </p>
          )}
          <Button type="submit" disabled={updateEvent.isPending}>
            {updateEvent.isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
