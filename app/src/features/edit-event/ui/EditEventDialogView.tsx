import { useState } from 'react'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'
import type { Event, EventDetail, EventInput, EventSeriesScope } from '@shared/api/events'
import type { EventTypeItem } from '@shared/api/event-types'
import { ReferenceRowsEditor } from '@entities/event/ui/ReferenceRowsEditor'
import { cleanReferences, toReferenceRows, type ReferenceRow } from '@entities/event/lib/references'
import { SeriesScopeField } from './SeriesScopeField'

export type UpdateEventRequest = EventInput & { id: string; scope: EventSeriesScope }

interface EditEventDialogViewProps {
  event: EventDetail
  /** Every occurrence sharing this event's recurring group. A single-element (or empty) list is standalone. */
  siblings?: Event[]
  /** Event types for the picker; defaults to an empty list while the container's query is in flight. */
  eventTypes?: EventTypeItem[]
  /** The update mutation is in flight — the submit button shows "Saving…" and is disabled. */
  isPending?: boolean
  /** The update mutation failed — render the inline error shell. */
  isError?: boolean
  onSubmit: (request: UpdateEventRequest) => void
}

// ISO instant → the value a <input type="datetime-local"> expects ('YYYY-MM-DDTHH:mm' in local time).
function toLocalInput(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Swap the time-of-day into a 'YYYY-MM-DDTHH:mm' local string, keeping its date.
function withTime(local: string, time: string): string {
  return `${local.slice(0, 10)}T${time}`
}

/**
 * Presentational edit-event form. Owns all local form state (scope, type, title, times, links) and
 * hands a fully-assembled update request up via onSubmit; the query, the mutation, and the dialog
 * open/close state live in the EditEventDialog container.
 *
 * The pending/error shells are props-driven (isPending / isError) rather than lived in the container,
 * so every state — standalone / series / saving / error — renders purely from props as a story, with
 * no network. See ADR-0017.
 *
 * Edit one occurrence of a series with a scope (ADR-0014, Phase 3). A standalone event (no siblings)
 * edits itself with the default THIS scope and no prompt. For a series, the SeriesScopeField drives
 * the scope; bulk scopes lock the per-occurrence date (only the time-of-day propagates), so the date
 * input is swapped for a time-only input.
 */
export function EditEventDialogView({
  event,
  siblings = [],
  eventTypes = [],
  isPending,
  isError,
  onSubmit,
}: EditEventDialogViewProps) {
  const isSeries = siblings.length > 1
  const [scope, setScope] = useState<EventSeriesScope>('THIS')
  const dateLocked = isSeries && scope !== 'THIS'

  const [typeId, setTypeId] = useState(event.eventType.id)
  const [title, setTitle] = useState(event.title)
  const [start, setStart] = useState(toLocalInput(event.startTime))
  const [end, setEnd] = useState(toLocalInput(event.endTime))
  // Seed the editor from the event's existing links — the update has replace-semantics, so the full
  // set must be sent back on every save or the links would be wiped.
  const [references, setReferences] = useState<ReferenceRow[]>(toReferenceRows(event.references))

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    onSubmit({
      id: event.id,
      scope,
      eventTypeId: typeId,
      title,
      description: (form.get('description') as string) || undefined,
      // For a bulk scope the date is locked to the occurrence's own date; only the time-of-day
      // (and duration) matters — the backend re-anchors each occurrence to its own date.
      startTime: new Date(start).toISOString(),
      endTime: new Date(end).toISOString(),
      location: (form.get('location') as string) || undefined,
      references: cleanReferences(references),
      // Carried through untouched. This form does not edit the roster override (that is the admin
      // authoring surface), but the update is a whole replacement — omitting it would drop the event
      // back to inheriting its type's default as a side effect of renaming it.
      rosterOverride: event.rosterOverride,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {isSeries && (
        <SeriesScopeField
          siblings={siblings}
          currentId={event.id}
          scope={scope}
          onScopeChange={setScope}
          variant="edit"
        />
      )}
      <div>
        <Label htmlFor="edit-type">Type</Label>
        <Select value={typeId} onValueChange={setTypeId}>
          <SelectTrigger id="edit-type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {eventTypes.map((t) => (
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
      {dateLocked ? (
        <>
          <div>
            <Label htmlFor="edit-start-time">Start time</Label>
            <Input
              id="edit-start-time"
              type="time"
              required
              value={start.slice(11, 16)}
              onChange={(e) => setStart((s) => withTime(s, e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="edit-end-time">End time</Label>
            <Input
              id="edit-end-time"
              type="time"
              required
              value={end.slice(11, 16)}
              onChange={(e) => setEnd((s) => withTime(s, e.target.value))}
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <Label htmlFor="edit-start">Start time</Label>
            <Input
              id="edit-start"
              type="datetime-local"
              required
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="edit-end">End time</Label>
            <Input
              id="edit-end"
              type="datetime-local"
              required
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
        </>
      )}
      <div>
        <Label htmlFor="edit-location">Location (optional)</Label>
        <Input id="edit-location" name="location" defaultValue={event.location ?? ''} />
      </div>
      <div>
        <Label htmlFor="edit-description">Description (optional)</Label>
        <Input id="edit-description" name="description" defaultValue={event.description ?? ''} />
      </div>
      <ReferenceRowsEditor rows={references} onChange={setReferences} />
      {isError && (
        <p className="rounded-lg border border-red/40 bg-red/10 px-3 py-2 text-sm text-red">
          Could not save changes. Please try again.
        </p>
      )}
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  )
}
