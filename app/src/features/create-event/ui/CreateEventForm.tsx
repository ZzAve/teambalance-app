import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { FormError } from '@shared/ui/FormError'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'
import { EventTypeSelect } from '@entities/event/ui/EventTypeSelect'
import type { EventInput } from '@shared/api/events'
import type { RosterRequirement } from '@shared/api/event-types'
import type { Position } from '@shared/api/positions'
import { RosterOverrideField } from '@features/manage-event-types/ui/RosterOverrideField'
import type { EventTypeItem } from '@shared/api/event-types'
import { ReferenceRowsEditor } from '@entities/event/ui/ReferenceRowsEditor'
import { cleanReferences, toReferenceRows, type ReferenceRow } from '@entities/event/lib/references'
import { eventTypeName } from '@entities/event/lib/event-type-name'

interface CreateEventFormProps {
  eventTypes: EventTypeItem[]
  /** The team's position vocabulary, so a customised roster can be authored per position. */
  positions?: Position[]
  isPending: boolean
  onSubmit: (values: EventInput) => void
  /** Message to surface when the last create attempt failed; null/undefined hides the alert. */
  error?: string | null
  /** Values to start from, such as a match from the team's Nevobo feed. The admin can change each. */
  initial?: Partial<Pick<EventInput, 'eventTypeId' | 'title' | 'startTime' | 'location' | 'references'>>
}

// ISO instant → the value a <input type="datetime-local"> expects ('YYYY-MM-DDTHH:mm' in local time).
function toLocalInput(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Events have a known length rather than an arbitrary end moment, so the form captures a duration
// and derives endTime = startTime + duration on submit. endTime is required by the API contract, so
// this guarantees one is always sent (default 2h — the common training/match length).
const DURATION_OPTIONS = [60, 90, 120, 180] as const

const DEFAULT_DURATION_MINUTES = '120'

/**
 * Presentational create-event form. Owns local form state (type selection + title auto-suggest)
 * and hands a fully-assembled EventInput up via onSubmit. Data fetching, the mutation, and the
 * sheet open/close state live in the CreateEventSheet widget — so every form state (idle,
 * type-selected, submitting, no-types) is renderable in isolation (see CreateEventForm.stories.tsx).
 */
export function CreateEventForm({
  eventTypes,
  positions = [],
  isPending,
  onSubmit,
  error,
  initial,
}: CreateEventFormProps) {
  const { t } = useTranslation()
  const [selectedTypeId, setSelectedTypeId] = useState<string>(initial?.eventTypeId ?? '')
  const [title, setTitle] = useState(initial?.title ?? '')
  const [titleTouched, setTitleTouched] = useState(initial?.title !== undefined)
  const [durationMinutes, setDurationMinutes] = useState(DEFAULT_DURATION_MINUTES)
  const [references, setReferences] = useState<ReferenceRow[]>(toReferenceRows(initial?.references))
  // undefined = inherit the selected type's default, which is the common case and the default here.
  const [rosterOverride, setRosterOverride] = useState<RosterRequirement | undefined>(undefined)

  const selectedType = eventTypes.find((t) => t.id === selectedTypeId)

  const handleTypeChange = (typeId: string) => {
    setSelectedTypeId(typeId)
    // A customised roster was seeded from the OLD type's default and is meaningless against the new
    // one, so changing type drops back to inheriting rather than submitting the wrong shape.
    setRosterOverride(undefined)
    // Auto-suggest title based on type name — only if user hasn't typed their own title
    if (!titleTouched) {
      const type = eventTypes.find((t) => t.id === typeId)
      if (type) {
        setTitle(eventTypeName(type))
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
      rosterOverride,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Event type selector with color preview swatch */}
      <div>
        <Label htmlFor="eventTypeId">{t('eventForm.type')}</Label>
        <div className="flex items-center gap-2">
          {/* Color preview dot */}
          <div
            className="h-6 w-6 shrink-0 rounded-full border border-border transition-colors"
            style={{ backgroundColor: selectedType?.color ?? 'transparent' }}
            aria-hidden="true"
          />
          <EventTypeSelect
            id="eventTypeId"
            name="eventTypeId"
            required
            eventTypes={eventTypes}
            value={selectedTypeId}
            onValueChange={handleTypeChange}
            className="flex-1"
          />
        </div>
      </div>

      {/* Title with auto-suggest */}
      <div>
        <Label htmlFor="title">{t('eventForm.title')}</Label>
        <Input
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            setTitleTouched(true)
          }}
          placeholder={selectedType ? t('eventForm.titleExample', { name: eventTypeName(selectedType) }) : t('eventForm.titlePlaceholder')}
        />
      </div>

      <div>
        <Label htmlFor="startTime">{t('eventForm.startTime')}</Label>
        <Input
          id="startTime"
          name="startTime"
          type="datetime-local"
          required
          defaultValue={initial?.startTime ? toLocalInput(initial.startTime) : undefined}
        />
      </div>
      <div>
        <Label htmlFor="duration">{t('eventForm.duration')}</Label>
        <Select name="durationMinutes" value={durationMinutes} onValueChange={setDurationMinutes}>
          <SelectTrigger id="duration">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DURATION_OPTIONS.map((minutes) => (
              <SelectItem key={minutes} value={String(minutes)}>
                {t(`eventForm.durationOption.${minutes}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="location">{t('eventForm.locationOptional')}</Label>
        <Input id="location" name="location" defaultValue={initial?.location} />
      </div>
      <div>
        <Label htmlFor="description">{t('eventForm.descriptionOptional')}</Label>
        <Input id="description" name="description" />
      </div>

      {/* Links (References) — repeatable label + url rows. Label optional; blank rows are dropped. */}
      <ReferenceRowsEditor rows={references} onChange={setReferences} />

      <RosterOverrideField
        value={rosterOverride}
        eventType={selectedType}
        positions={positions}
        disabled={isPending}
        onChange={setRosterOverride}
      />

      {error && <FormError>{error}</FormError>}
      <Button
        type="submit"
        disabled={isPending}
        style={selectedType?.color ? { backgroundColor: selectedType.color, borderColor: selectedType.color } : undefined}
      >
        {isPending ? t('eventForm.creating') : t('eventForm.create')}
      </Button>
    </form>
  )
}
