import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@shared/ui/sheet'
import { STATE_WORD, type LineupState } from '@entities/event/lib/lineup'
import { AttendanceToggle } from './AttendanceToggle'

/** Who the sheet is about. A caller passes null to close it. */
export interface AnswerTarget {
  userId: string
  displayName: string
  state: LineupState
  /** The viewer's own row, which skips the "you are answering for them" line. */
  isSelf: boolean
  /** The position they play, shown for context. Omitted where the list has no positions. */
  position?: string
}

/**
 * The one way to change anyone's answer.
 *
 * Both surfaces that list people — the event card's lineup panel and the detail page's attendee
 * list — open this same sheet, so the gesture is one thing app-wide rather than a bottom sheet in
 * one place and an inline expander in the other. It lives in the attendance-toggle feature because
 * that is what it is: the answer control plus the context that says whose answer it is.
 *
 * Anchored to the thumb rather than to the row, which is what makes it work on a long list: tapping
 * someone 2000px down does not push the page around, and the sheet names the person so the row it
 * came from need not stay in view.
 *
 * A member may set a teammate's answer (ADR-0003), so when the target is someone else the sheet
 * says so plainly — the awareness is the safeguard, not a confirmation step.
 */
export function AnswerSheet({
  target,
  onRespond,
  onClose,
  pending,
}: {
  target: AnswerTarget | null
  /** Fires with the *target* member's id, never the viewer's. */
  onRespond: (userId: string, state: LineupState) => void
  onClose: () => void
  pending?: boolean
}) {
  return (
    <Sheet open={target !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        {target && (
          <>
            <SheetHeader>
              <SheetTitle>{target.displayName}</SheetTitle>
              <SheetDescription>
                {target.position ? `${target.position} · ` : ''}currently {STATE_WORD[target.state].toLowerCase()}
                {!target.isSelf && ' · you are answering for them'}
              </SheetDescription>
            </SheetHeader>
            <AttendanceToggle
              value={target.state}
              disabled={pending}
              onToggle={(state) => {
                onRespond(target.userId, state)
                onClose()
              }}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
