import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, CalendarClock, Check, Repeat } from 'lucide-react'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'
import type { EventTypeItem } from '@shared/api/event-types'
import type { Season } from '@shared/api/season'
import type { CreateRecurringEventsRequest, RecurrenceFrequency, Weekday } from '@shared/api/recurring-events'
import {
  buildCalendarPreview,
  defaultDateRange,
  WEEKDAYS,
  type RecurrenceInput,
} from '../model/recurrence'
import { MonthCalendarPreview } from './MonthCalendarPreview'

interface RecurringEventsWizardProps {
  eventTypes: EventTypeItem[]
  season: Season | undefined
  isPending: boolean
  errorMessage?: string
  /** Today as 'YYYY-MM-DD', injected so the default date range stays deterministic/testable. */
  today: string
  onSubmit: (body: CreateRecurringEventsRequest) => void
}

const STEPS = ['Details', 'Repeat', 'Confirm'] as const

const FALLBACK_ACCENT = '#225C9C' // brand blue when a type has no colour

/**
 * Guided 3-step wizard for creating a recurring series (prototype A + B): ① type & details →
 * ② recurrence with a live month-calendar preview → ③ confirm. A persistent context block carries
 * the chosen summary + running count across steps. Purely presentational — data, the mutation, and
 * the dialog open/close state live in the CreateRecurringEventsDialog container, so each step state
 * is renderable in isolation (see RecurringEventsWizard.stories.tsx).
 */
export function RecurringEventsWizard({
  eventTypes,
  season,
  isPending,
  errorMessage,
  today,
  onSubmit,
}: RecurringEventsWizardProps) {
  const [step, setStep] = useState(0)

  const [selectedTypeId, setSelectedTypeId] = useState('')
  const [title, setTitle] = useState('')
  const [titleTouched, setTitleTouched] = useState(false)
  const [timeOfDay, setTimeOfDay] = useState('20:30')
  const [durationMinutes, setDurationMinutes] = useState(90)
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')

  const [frequency, setFrequency] = useState<RecurrenceFrequency>('WEEKLY')
  const [weekdays, setWeekdays] = useState<Set<Weekday>>(new Set(['TUESDAY', 'THURSDAY']))
  const defaults = useMemo(() => defaultDateRange(season, today), [season, today])
  const [startDate, setStartDate] = useState(defaults.startDate)
  const [endDate, setEndDate] = useState(defaults.endDate)

  const selectedType = eventTypes.find((t) => t.id === selectedTypeId)
  const accentColor = selectedType?.color ?? FALLBACK_ACCENT

  const preview = useMemo(() => {
    const rule: RecurrenceInput = { frequency, weekdays: orderWeekdays(weekdays), startDate, endDate }
    return buildCalendarPreview(rule, season)
  }, [frequency, weekdays, startDate, endDate, season])

  const detailsValid = !!selectedTypeId && title.trim().length > 0 && !!timeOfDay && durationMinutes > 0
  const scheduleValid = preview.count > 0 && !preview.overCap && preview.outOfSeasonCount === 0

  const handleTypeChange = (typeId: string) => {
    setSelectedTypeId(typeId)
    if (!titleTouched) {
      const type = eventTypes.find((t) => t.id === typeId)
      if (type) setTitle(type.name)
    }
  }

  const toggleWeekday = (day: Weekday) => {
    setWeekdays((prev) => {
      const next = new Set(prev)
      if (next.has(day)) {
        if (next.size > 1) next.delete(day) // keep at least one selected
      } else {
        next.add(day)
      }
      return next
    })
  }

  const handleCreate = () => {
    onSubmit({
      eventTypeId: selectedTypeId,
      title: title.trim(),
      description: description.trim() || undefined,
      location: location.trim() || undefined,
      timeOfDay,
      durationMinutes,
      recurrence: {
        frequency,
        weekdays: orderWeekdays(weekdays),
        startDate,
        endDate,
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <Stepper step={step} />

      {/* Persistent context block — the chosen summary + running count, carried across steps. */}
      {step > 0 && (
        <div className="rounded-xl border border-blue/15 bg-blue/5 p-3">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: accentColor }} />
            <span className="truncate text-sm font-semibold">{title || 'Untitled series'}</span>
            <span className="ml-auto shrink-0 rounded-full bg-blue/10 px-2 py-0.5 text-xs font-semibold text-blue">
              {preview.count} {preview.count === 1 ? 'event' : 'events'}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarClock size={12} className="shrink-0" />
            {timeOfDay} · {durationMinutes} min · {frequencyLabel(frequency)} · {summariseWeekdays(weekdays)}
          </p>
        </div>
      )}

      {/* ── Step 1: type & details ── */}
      {step === 0 && (
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="rec-type">Type</Label>
            <div className="flex items-center gap-2">
              <div
                className="h-6 w-6 shrink-0 rounded-full border border-border"
                style={{ backgroundColor: selectedType?.color ?? 'transparent' }}
                aria-hidden="true"
              />
              <Select value={selectedTypeId} onValueChange={handleTypeChange}>
                <SelectTrigger id="rec-type" className="flex-1">
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
          </div>

          <div>
            <Label htmlFor="rec-title">Title</Label>
            <Input
              id="rec-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setTitleTouched(true)
              }}
              placeholder={selectedType ? `e.g. ${selectedType.name}` : 'Series title'}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="rec-time">Time of day</Label>
              <Input id="rec-time" type="time" value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="rec-duration">Duration (min)</Label>
              <Input
                id="rec-duration"
                type="number"
                min={1}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="rec-location">Location (optional)</Label>
            <Input id="rec-location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="rec-description">Description (optional)</Label>
            <Input id="rec-description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
      )}

      {/* ── Step 2: recurrence ── */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div>
            <Label>Repeats</Label>
            <div className="mt-1 inline-flex rounded-full bg-muted p-1">
              {(['WEEKLY', 'BIWEEKLY'] as RecurrenceFrequency[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className={[
                    'rounded-full px-4 py-1 text-sm font-medium transition-all',
                    frequency === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                  ].join(' ')}
                >
                  {frequencyLabel(f)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>On</Label>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {WEEKDAYS.map(({ value, short }) => {
                const selected = weekdays.has(value)
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleWeekday(value)}
                    className={[
                      'rounded-full border px-3 py-1 text-xs font-medium transition-all',
                      selected ? 'border-blue bg-blue text-white' : 'border-border text-muted-foreground hover:border-blue hover:text-blue',
                    ].join(' ')}
                  >
                    {short}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="rec-start">From</Label>
              <Input id="rec-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="rec-end">Until</Label>
              <Input id="rec-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <MonthCalendarPreview preview={preview} accentColor={accentColor} />
        </div>
      )}

      {/* ── Step 3: confirm ── */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
            <p className="flex items-center gap-2 font-display text-lg font-semibold">
              <Repeat size={18} style={{ color: accentColor }} />
              {title || 'Untitled series'}
            </p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              <SummaryRow label="Type" value={selectedType?.name ?? '—'} />
              <SummaryRow label="When" value={`${timeOfDay} · ${durationMinutes} min`} />
              <SummaryRow label="Repeats" value={`${frequencyLabel(frequency)} · ${summariseWeekdays(weekdays)}`} />
              {preview.firstDate && preview.lastDate && (
                <SummaryRow label="Dates" value={`${formatDate(preview.firstDate)} → ${formatDate(preview.lastDate)}`} />
              )}
              {location && <SummaryRow label="Location" value={location} />}
              <SummaryRow
                label="Total"
                value={`${preview.count} ${preview.count === 1 ? 'event' : 'events'}`}
                emphasise
              />
            </dl>
          </div>

          <MonthCalendarPreview preview={preview} accentColor={accentColor} />

          {errorMessage && (
            <p className="rounded-lg border border-red-300 bg-red-500/10 px-3 py-2 text-sm text-red-500">{errorMessage}</p>
          )}
        </div>
      )}

      {/* ── Footer nav ── */}
      <div className="flex gap-2">
        {step > 0 && (
          <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)} className="flex-1">
            <ArrowLeft size={16} />
            Back
          </Button>
        )}
        {step < 2 && (
          <Button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 0 ? !detailsValid : !scheduleValid}
            className="flex-1"
          >
            Next
            <ArrowRight size={16} />
          </Button>
        )}
        {step === 2 && (
          <Button
            type="button"
            onClick={handleCreate}
            disabled={isPending || !scheduleValid || !detailsValid}
            className="flex-1"
            style={{ backgroundColor: accentColor, borderColor: accentColor }}
          >
            <Check size={16} />
            {isPending ? 'Creating…' : `Create ${preview.count} ${preview.count === 1 ? 'event' : 'events'}`}
          </Button>
        )}
      </div>
    </div>
  )
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-1">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-1">
          <div className="flex items-center gap-1.5">
            <span
              className={[
                'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all',
                i < step ? 'bg-green text-white' : i === step ? 'bg-blue text-white' : 'bg-muted text-muted-foreground',
              ].join(' ')}
            >
              {i < step ? <Check size={13} /> : i + 1}
            </span>
            <span className={`text-xs font-medium ${i === step ? 'text-foreground' : 'text-muted-foreground'}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && <span className="mx-1 h-px w-5 bg-border" />}
        </div>
      ))}
    </div>
  )
}

function SummaryRow({ label, value, emphasise = false }: { label: string; value: string; emphasise?: boolean }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={emphasise ? 'font-semibold text-foreground' : 'text-foreground'}>{value}</dd>
    </>
  )
}

function orderWeekdays(selected: Set<Weekday>): Weekday[] {
  return WEEKDAYS.map((w) => w.value).filter((w) => selected.has(w))
}

function frequencyLabel(f: RecurrenceFrequency): string {
  return f === 'WEEKLY' ? 'Weekly' : 'Bi-weekly'
}

function summariseWeekdays(selected: Set<Weekday>): string {
  const shorts = WEEKDAYS.filter((w) => selected.has(w.value)).map((w) => w.short)
  return shorts.length > 0 ? shorts.join(', ') : 'no days'
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
