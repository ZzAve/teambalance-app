import { useState } from 'react'
import { Repeat } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Button } from '@shared/ui/button'
import { useEventTypes } from '@shared/api/event-types'
import { useSeason } from '@shared/api/season'
import {
  OutsideSeasonError,
  useCreateRecurringEvents,
  type CreateRecurringEventsRequest,
} from '@shared/api/recurring-events'
import { RecurringEventsWizard } from './RecurringEventsWizard'

/**
 * Container for creating a recurring series: owns the dialog open/close state and wires the
 * event-types + season queries and the create mutation to the presentational RecurringEventsWizard.
 * Closing the dialog unmounts the wizard (Radix), so its step + form state resets for the next open.
 */
export function CreateRecurringEventsDialog() {
  const [open, setOpen] = useState(false)
  const { data: eventTypes } = useEventTypes()
  const { data: season } = useSeason()
  const createSeries = useCreateRecurringEvents()

  const today = new Date().toLocaleDateString('en-CA') // 'YYYY-MM-DD' in the local zone

  const handleSubmit = (body: CreateRecurringEventsRequest) => {
    createSeries.mutate(body, { onSuccess: () => setOpen(false) })
  }

  const errorMessage = !createSeries.error
    ? undefined
    : createSeries.error instanceof OutsideSeasonError
      ? 'Some dates fall outside the season window — adjust the range.'
      : 'Could not create the series. Please try again.'

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) createSeries.reset()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Repeat size={16} />
          New Series
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New recurring series</DialogTitle>
        </DialogHeader>
        <RecurringEventsWizard
          eventTypes={eventTypes ?? []}
          season={season}
          isPending={createSeries.isPending}
          errorMessage={errorMessage}
          today={today}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
