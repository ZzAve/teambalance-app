import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@shared/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@shared/ui/sheet'
import { useEventTypes } from '@shared/api/event-types'
import { usePositions } from '@shared/api/positions'
import { useSeason } from '@shared/api/season'
import { useCreateEvent, type EventInput } from '@shared/api/events'
import {
  RecurringCreateError,
  useCreateRecurringEvents,
  type CreateRecurringEventsRequest,
} from '@shared/api/recurring-events'
import { CreateEventSheetView, type CreateEventMode } from './CreateEventSheetView'

type Mode = 'closed' | CreateEventMode

/**
 * The admin's single entry point for adding events, presented as a bottom sheet (prototype A):
 * "New Event" opens a Single / Recurring chooser, and the chosen flow renders in the same sheet with
 * a back step. A widget, since it composes two feature slices; data + both mutations live here and
 * are wired to the presentational CreateEventSheetView. Pure wiring — the mode-dependent body and
 * its states live in the View (props-driven), so this seam is covered by e2e, not a story. The sheet
 * chrome (trigger + open/close) stays here. See ADR-0017.
 */
export function CreateEventSheet() {
  const [mode, setMode] = useState<Mode>('closed')
  const { data: eventTypes } = useEventTypes()
  const { data: positions } = usePositions()
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

  return (
    <Sheet open={mode !== 'closed'} onOpenChange={(open) => (open ? setMode('chooser') : close())}>
      <SheetTrigger asChild>
        <Button onClick={() => setMode('chooser')}>
          <Plus size={16} />
          New Event
        </Button>
      </SheetTrigger>
      <SheetContent>
        {mode !== 'closed' && (
          <CreateEventSheetView
            mode={mode}
            eventTypes={eventTypes}
            positions={positions}
            season={season}
            today={today}
            isCreatingSingle={createEvent.isPending}
            isCreatingRecurring={createSeries.isPending}
            singleError={createEvent.isError ? 'Could not create the event. Please try again.' : null}
            recurringError={seriesError}
            onBack={() => setMode('chooser')}
            onChooseSingle={() => setMode('single')}
            onChooseRecurring={() => setMode('recurring')}
            onSubmitSingle={handleSingle}
            onSubmitRecurring={handleRecurring}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
