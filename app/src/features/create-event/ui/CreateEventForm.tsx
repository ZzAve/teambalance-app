import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'
import type { EventInput } from '@shared/api/events'
import type { EventTypeItem } from '@shared/api/event-types'
import { normalizeUrl } from '../lib/normalize-url'

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
 * dialog open/close state live in the CreateEventDialog container — so every form state (idle,
 * type-selected, submitting, no-types) is renderable in isolation (see CreateEventForm.stories.tsx).
 */
export function CreateEventForm({ eventTypes, isPending, onSubmit, error }: CreateEventFormProps) {
  const [selectedTypeId, setSelectedTypeId] = useState<string>('')
  const [title, setTitle] = useState('')
  const [titleTouched, setTitleTouched] = useState(false)
  const [durationMinutes, setDurationMinutes] = useState(DEFAULT_DURATION_MINUTES)
  const [references, setReferences] = useState<{ title: string; url: string }[]>([])

  const selectedType = eventTypes.find((t) => t.id === selectedTypeId)

  const updateReference = (index: number, field: 'title' | 'url', value: string) =>
    setReferences((rows) => rows.map((r, i) => (i === index ? { ...r, [field]: value } : r)))
  const addReference = () => setReferences((rows) => [...rows, { title: '', url: '' }])
  const removeReference = (index: number) => setReferences((rows) => rows.filter((_, i) => i !== index))

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
    // Drop blank rows, normalize each URL, and treat a blank label as absent (host fallback on render).
    const cleanedReferences = references
      .map((r) => ({ title: r.title.trim(), url: normalizeUrl(r.url) }))
      .filter((r) => r.url !== '')
      .map((r) => ({ title: r.title || undefined, url: r.url }))
    onSubmit({
      eventTypeId: selectedTypeId,
      title: title,
      description: (form.get('description') as string) || undefined,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      location: (form.get('location') as string) || undefined,
      references: cleanedReferences,
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
      <div>
        <Label>Links (optional)</Label>
        <p className="mb-1 text-xs text-muted-foreground">Add the Nevobo page, match form, and more.</p>
        <div className="flex flex-col gap-2">
          {references.map((ref, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                aria-label={`Link ${i + 1} label`}
                placeholder="Label (optional)"
                value={ref.title}
                onChange={(e) => updateReference(i, 'title', e.target.value)}
                className="w-2/5"
              />
              <Input
                aria-label={`Link ${i + 1} URL`}
                placeholder="https://…"
                value={ref.url}
                onChange={(e) => updateReference(i, 'url', e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove link ${i + 1}`}
                onClick={() => removeReference(i)}
              >
                <X size={16} />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="ghost" size="sm" className="mt-2 gap-1.5" onClick={addReference}>
          <Plus size={15} />
          Add link
        </Button>
      </div>

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
