import { useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@shared/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@shared/ui/sheet'
import { useEventTypes } from '@shared/api/event-types'
import { useSeason } from '@shared/api/season'
import { useCreateEvent, type EventInput } from '@shared/api/events'
import {
  RecurringCreateError,
  useCreateRecurringEvents,
  type CreateRecurringEventsRequest,
} from '@shared/api/recurring-events'
import { CreateEventForm } from '@features/create-event/ui/CreateEventForm'
import { RecurringEventsWizard } from '@features/create-recurring-events/ui/RecurringEventsWizard'
import { CreateEntryChooser } from './CreateEntryChooser'

type Mode = 'closed' | 'chooser' | 'single' | 'recurring'

const TITLES: Record<Exclude<Mode, 'closed'>, string> = {
  chooser: 'Create event',
  single: 'New event',
  recurring: 'New recurring series',
}
const DESCRIPTIONS: Record<Exclude<Mode, 'closed'>, string> = {
  chooser: 'Choose how you want to add events',
  single: 'A one-off training, match, or other event',
  recurring: 'A weekly or bi-weekly series across the season',
}

/**
 * The admin's single entry point for adding events, presented as a bottom sheet (prototype A):
 * "New Event" opens a Single / Recurring chooser, and the chosen flow (the presentational
 * CreateEventForm or RecurringEventsWizard) renders in the same sheet with a back step. A widget,
 * since it composes two feature slices; data + both mutations live here.
 */
export function CreateEventSheet() {
  const [mode, setMode] = useState<Mode>('closed')
  const { data: eventTypes } = useEventTypes()
  const { data: season } = useSeason()
  const createEvent = useCreateEvent()
  const createSeries = useCreateRecurringEvents()

  const today = new Date().toLocaleDateString('en-CA') // 'YYYY-MM-DD' in the local zone

  const close = () => {
    setMode('closed')
    createEvent.reset()
    createSeries.reset()
  }

  const handleSingle = (values: EventInput) => createEvent.mutate(values, { onSuccess: close })
  const handleRecurring = (body: CreateRecurringEventsRequest) => createSeries.mutate(body, { onSuccess: close })

  const seriesError = !createSeries.error
    ? undefined
    : createSeries.error instanceof RecurringCreateError
      ? {
          'outside-season': 'Some dates fall outside the season window — adjust the range.',
          'over-cap': 'That series is over the 200-event cap — shorten the range or thin the schedule.',
          empty: 'No dates match — pick at least one weekday inside the range.',
          unknown: 'Could not create the series. Please try again.',
        }[createSeries.error.reason]
      : 'Could not create the series. Please try again.'

  const isForm = mode === 'single' || mode === 'recurring'

  return (
    <Sheet open={mode !== 'closed'} onOpenChange={(open) => (open ? setMode('chooser') : close())}>
      <SheetTrigger asChild>
        <Button onClick={() => setMode('chooser')}>
          <Plus size={16} />
          New Event
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="relative mb-1 flex items-center justify-center">
          {isForm && (
            <button
              type="button"
              onClick={() => setMode('chooser')}
              aria-label="Back to event type"
              className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          {mode !== 'closed' && <SheetTitle>{TITLES[mode]}</SheetTitle>}
        </div>
        {mode !== 'closed' && <SheetDescription className="mb-4">{DESCRIPTIONS[mode]}</SheetDescription>}

        {mode === 'chooser' && (
          <CreateEntryChooser onSingle={() => setMode('single')} onRecurring={() => setMode('recurring')} />
        )}
        {mode === 'single' && (
          <CreateEventForm
            eventTypes={eventTypes ?? []}
            isPending={createEvent.isPending}
            onSubmit={handleSingle}
            error={createEvent.isError ? 'Could not create the event. Please try again.' : null}
          />
        )}
        {mode === 'recurring' && (
          <RecurringEventsWizard
            eventTypes={eventTypes ?? []}
            season={season}
            isPending={createSeries.isPending}
            errorMessage={seriesError}
            today={today}
            onSubmit={handleRecurring}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
