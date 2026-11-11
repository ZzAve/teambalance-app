import { useTranslation } from 'react-i18next'
import { useCreateEvent } from '@shared/api/events'
import { useEventTypes } from '@shared/api/event-types'
import type { FeedMatch } from '@shared/api/match-feed'
import { usePositions } from '@shared/api/positions'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/dialog'
import { CreateEventForm } from '@features/create-event/ui/CreateEventForm'
import { eventValuesFor, matchEventTypeId } from '../lib/match-feed'

interface CreateEventFromMatchDialogProps {
  /** The missing match to create an event for; null keeps the dialog closed. */
  match: FeedMatch | null
  onClose: () => void
}

/** Container: the normal create-event form, started from a match in the team's Nevobo feed. */
export function CreateEventFromMatchDialog({ match, onClose }: CreateEventFromMatchDialogProps) {
  const { t } = useTranslation()
  const { data: eventTypes = [] } = useEventTypes()
  const { data: positions } = usePositions()
  const createEvent = useCreateEvent()
  const close = () => {
    createEvent.reset()
    onClose()
  }

  return (
    <Dialog open={match !== null} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('matchFeed.create.title')}</DialogTitle>
        </DialogHeader>
        {match && (
          <CreateEventForm
            key={`${match.code}-${eventTypes.length}`}
            eventTypes={eventTypes}
            positions={positions}
            initial={{ ...eventValuesFor(match), eventTypeId: matchEventTypeId(eventTypes) }}
            isPending={createEvent.isPending}
            error={createEvent.isError ? t('matchFeed.create.failed') : null}
            onSubmit={(values) => createEvent.mutate(values, { onSuccess: close })}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
