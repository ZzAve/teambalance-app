import { useState } from 'react'
import { DialogFooter } from '@shared/ui/dialog'
import { Button } from '@shared/ui/button'
import { type Event, type EventSeriesScope } from '@shared/api/events'
import { SeriesScopeField } from './SeriesScopeField'

interface DeleteEventDialogViewProps {
  eventId: string
  /** Every occurrence sharing this event's recurring group. A single-element (or empty) list is standalone. */
  siblings?: Event[]
  /** The delete mutation is in flight — the buttons disable and the confirm shows "Deleting…". */
  isPending?: boolean
  /** The delete mutation failed — render the inline error shell. */
  isError?: boolean
  onDelete: (scope: EventSeriesScope) => void
  onCancel: () => void
}

/**
 * Presentational body of the delete-event dialog. Owns the local scope state and hands the chosen
 * scope up via onDelete; the mutation, the post-delete navigation, and the dialog open/close state
 * live in the DeleteEventDialog container.
 *
 * The pending/error shells are props-driven (isPending / isError) rather than lived in the container,
 * so every state — standalone / series / deleting / error — renders purely from props as a story,
 * with no network. See ADR-0017.
 *
 * Delete one occurrence of a series with a scope (ADR-0014, Phase 3). A standalone event (no
 * siblings) deletes itself with the default THIS scope and no prompt. For a series, the
 * SeriesScopeField drives which occurrences go — and a delete never splits (survivors keep their
 * group). The dialog chrome (title + description) stays in the container, so this stays Radix-free.
 */
export function DeleteEventDialogView({
  eventId,
  siblings = [],
  isPending,
  isError,
  onDelete,
  onCancel,
}: DeleteEventDialogViewProps) {
  const isSeries = siblings.length > 1
  const [scope, setScope] = useState<EventSeriesScope>('THIS')

  const confirmLabel = isPending ? 'Deleting…' : isSeries && scope !== 'THIS' ? 'Delete events' : 'Delete event'

  return (
    <>
      {isSeries && (
        <SeriesScopeField
          siblings={siblings}
          currentId={eventId}
          scope={scope}
          onScopeChange={setScope}
          variant="delete"
        />
      )}
      {isError && (
        <p className="rounded-lg border border-red/40 bg-red/10 px-3 py-2 text-sm text-red">
          Could not delete the event. Please try again.
        </p>
      )}
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={() => onDelete(scope)} disabled={isPending}>
          {confirmLabel}
        </Button>
      </DialogFooter>
    </>
  )
}
