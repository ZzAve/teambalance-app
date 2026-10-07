import type { SubstituteEntry } from '@shared/api/events'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@shared/ui/sheet'
import { AttendanceToggle } from '@features/attendance-toggle/ui/AttendanceToggle'
import type { SubstituteState } from './SubstitutesBlock'

/**
 * One Substitute on one event (ADR-0033): change their state, or take them off the event. Taking
 * them off keeps them on the Team's list for next time. Opened from their row in the Position group
 * and from the Substitutes block, so the gesture is the same in both places.
 */
export function SubstituteSheet({
  substitute,
  setBy,
  onSetState,
  onTakeOff,
  onClose,
  pending,
}: {
  /** Who the sheet is about. A caller passes null to close it. */
  substitute: SubstituteEntry | null
  /** The Member who last set their state. */
  setBy: string | null
  onSetState: (substituteId: string, state: SubstituteState) => void
  onTakeOff: (substituteId: string) => void
  onClose: () => void
  pending?: boolean
}) {
  return (
    <Sheet open={substitute !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        {substitute && (
          <>
            <SheetHeader>
              <SheetTitle>{substitute.name}</SheetTitle>
              <SheetDescription>
                Substitute · {substitute.position?.label ?? 'Unassigned'}
                {setBy && ` · set by ${setBy}`}
              </SheetDescription>
            </SheetHeader>
            <AttendanceToggle
              value={substitute.state}
              disabled={pending}
              onToggle={(state) => {
                // The toggle offers only the three answers, never Not Responded.
                if (state === 'NOT_RESPONDED') return
                onSetState(substitute.substituteId, state)
                onClose()
              }}
            />
            <p className="mt-3 text-caption text-muted-foreground">
              Maybe means asked and waiting for an answer. Can't keeps a record that they were asked and said no.
            </p>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                onTakeOff(substitute.substituteId)
                onClose()
              }}
              className="mt-4 w-full rounded-md border-[1.5px] border-red/30 py-2.5 text-small font-semibold text-red hover:bg-red/5 disabled:opacity-60"
            >
              Take off this event
            </button>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
