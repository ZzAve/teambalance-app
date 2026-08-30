import { ArrowLeft } from 'lucide-react'
import { SheetDescription, SheetTitle } from '@shared/ui/sheet'
import type { EventInput } from '@shared/api/events'
import type { Position } from '@shared/api/positions'
import type { EventTypeItem } from '@shared/api/event-types'
import type { Season } from '@shared/api/season'
import type { CreateRecurringEventsRequest } from '@shared/api/recurring-events'
import { CreateEventForm } from '@features/create-event/ui/CreateEventForm'
import { RecurringEventsWizard } from '@features/create-recurring-events/ui/RecurringEventsWizard'
import { CreateEntryChooser } from './CreateEntryChooser'

// The sheet is only mounted while open, so its body is always in one of these three modes.
export type CreateEventMode = 'chooser' | 'single' | 'recurring'

const TITLES: Record<CreateEventMode, string> = {
  chooser: 'Create event',
  single: 'New event',
  recurring: 'New recurring series',
}
const DESCRIPTIONS: Record<CreateEventMode, string> = {
  chooser: 'Choose how you want to add events',
  single: 'A one-off training, match, or other event',
  recurring: 'A weekly or bi-weekly series across the season',
}

interface CreateEventSheetViewProps {
  mode: CreateEventMode
  /** Event types for the pickers; defaults to an empty list while the container's query is in flight. */
  eventTypes?: EventTypeItem[]
  /** The team's position vocabulary, for authoring a per-event roster override. */
  positions?: Position[]
  season?: Season
  today: string
  isCreatingSingle?: boolean
  isCreatingRecurring?: boolean
  /** Message when the last single-create attempt failed; null hides the alert. */
  singleError?: string | null
  /** Message when the last recurring-create attempt failed; undefined hides the alert. */
  recurringError?: string
  onBack: () => void
  onChooseSingle: () => void
  onChooseRecurring: () => void
  onSubmitSingle: (values: EventInput) => void
  onSubmitRecurring: (body: CreateRecurringEventsRequest) => void
}

/**
 * Presentational body of the create-event sheet: the mode-dependent header (back step + title +
 * description) and the chooser / single-form / recurring-wizard switch. The mode navigation state,
 * the data queries, and both mutations live in the CreateEventSheet widget — so each mode renders
 * purely from props as a story, with no network. Composes already-presentational child features
 * (CreateEntryChooser, CreateEventForm, RecurringEventsWizard), each of which owns its own states;
 * this View covers only the sheet's own navigation + wiring seam. See ADR-0017.
 */
export function CreateEventSheetView({
  mode,
  eventTypes = [],
  positions = [],
  season,
  today,
  isCreatingSingle,
  isCreatingRecurring,
  singleError,
  recurringError,
  onBack,
  onChooseSingle,
  onChooseRecurring,
  onSubmitSingle,
  onSubmitRecurring,
}: CreateEventSheetViewProps) {
  const isForm = mode === 'single' || mode === 'recurring'

  return (
    <>
      <div className="relative mb-1 flex items-center justify-center">
        {isForm && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to event type"
            className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <SheetTitle>{TITLES[mode]}</SheetTitle>
      </div>
      <SheetDescription className="mb-4">{DESCRIPTIONS[mode]}</SheetDescription>

      {mode === 'chooser' && <CreateEntryChooser onSingle={onChooseSingle} onRecurring={onChooseRecurring} />}
      {mode === 'single' && (
        <CreateEventForm
          eventTypes={eventTypes}
          positions={positions}
          isPending={!!isCreatingSingle}
          onSubmit={onSubmitSingle}
          error={singleError}
        />
      )}
      {mode === 'recurring' && (
        <RecurringEventsWizard
          eventTypes={eventTypes}
          season={season}
          isPending={!!isCreatingRecurring}
          errorMessage={recurringError}
          today={today}
          onSubmit={onSubmitRecurring}
        />
      )}
    </>
  )
}
