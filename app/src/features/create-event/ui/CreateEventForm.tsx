import { useState } from 'react'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'
import type { EventInput } from '@shared/api/events'
import type { EventTypeItem } from '@shared/api/event-types'
import { ReferenceRowsEditor } from '@entities/event/ui/ReferenceRowsEditor'
import { cleanReferences, type ReferenceRow } from '@entities/event/lib/references'

interface CreateEventFormProps {
  eventTypes: EventTypeItem[]
  isPending: boolean
  onSubmit: (values: EventInput) => void
  /** Message to surface when the last create attempt failed; null/undefined hides the alert. */
  error?: string | null
}

// Events have a known length rather than an arbitrary end moment, so the form captures a duration
// and derives endTime = startTime + duration on submit. endTime is required by the API contract, so
// this guarantees one is always sent (default 2h — the common training/match length).
const DURATION_OPTIONS = [
  { minutes: 60, label: '1 hour' },
  { minutes: 90, label: '1.5 hours' },
  { minutes: 120, label: '2 hours' },
  { minutes: 180, label: '3 hours' },
] as const

const DEFAULT_DURATION_MINUTES = '120'

/**
 * Presentational create-event form. Owns local form state (type selection + title auto-suggest)
 * and hands a fully-assembled EventInput up via onSubmit. Data fetching, the mutation, and the
 * sheet open/close state live in the CreateEventSheet widget — so every form state (idle,
 * type-selected, submitting, no-types) is renderable in isolation (see CreateEventForm.stories.tsx).
 */
export function CreateEventForm({ eventTypes, isPending, onSubmit, error }: CreateEventFormProps) {
  const [selectedTypeId, setSelectedTypeId] = useState<string>('')
  const [title, setTitle] = useState('')
  const [titleTouched, setTitleTouched] = useState(false)
  const [durationMinutes, setDurationMinutes] = useState(DEFAULT_DURATION_MINUTES)
  const [references, setReferences] = useState<ReferenceRow[]>([])

  const selectedType = eventTypes.find((t) => t.id === selectedTypeId)

  const handleTypeChange = (typeId: string) => {
    setSelectedTypeId(typeId)
    // Auto-suggest title based on type name — only if user hasn't typed their own title
    if (!titleTouched) {
      const type = eventTypes.find((t) => t.id === typeId)
      if (type) {
        setTitle(type.name)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const start = new Date(form.get('startTime') as string)
    const end = new Date(start.getTime() + Number(durationMinutes) * 60_000)
    onSubmit({
      eventTypeId: selectedTypeId,
      title: title,
      description: (form.get('description') as string) || undefined,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      location: (form.get('location') as string) || undefined,
      references: cleanReferences(references),
    })
  }

  return (
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
          <Select name="eventTypeId" required value={selectedTypeId} onValueChange={handleTypeChange}>
            <SelectTrigger id="eventTypeId" className="flex-1">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((t) => (
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
        <Input id="startTime" name="startTime" type="datetime-local" required />
      </div>
      <div>
        <Label htmlFor="duration">Duration</Label>
        <Select name="durationMinutes" value={durationMinutes} onValueChange={setDurationMinutes}>
          <SelectTrigger id="duration">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DURATION_OPTIONS.map((d) => (
              <SelectItem key={d.minutes} value={String(d.minutes)}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="location">Location (optional)</Label>
        <Input id="location" name="location" />
      </div>
      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Input id="description" name="description" />
      </div>

      {/* Links (References) — repeatable label + url rows. Label optional; blank rows are dropped. */}
      <ReferenceRowsEditor rows={references} onChange={setReferences} />

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button
        type="submit"
        disabled={isPending}
        style={selectedType?.color ? { backgroundColor: selectedType.color, borderColor: selectedType.color } : undefined}
      >
        {isPending ? 'Creating...' : 'Create Event'}
      </Button>
    </form>
  )
}
