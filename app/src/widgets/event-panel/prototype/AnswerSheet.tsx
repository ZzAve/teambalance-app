import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@shared/ui/sheet'
import { AttendanceToggle } from '@features/attendance-toggle/ui/AttendanceToggle'
import { STATE_WORD, type LineupMember, type LineupState } from './lineup-model'

/**
 * PROTOTYPE — throwaway. The one availability action, now shared by every variant.
 *
 * Round two gave each variant its own edit affordance (inline strip, in-place morph, bottom sheet)
 * on the theory that the affordance was part of what was being compared. The review came back the
 * other way — the sheet is the one worth keeping — so it is now the single answer control, which
 * also makes the variants an honest comparison of *layout* rather than of three different
 * interactions wearing different layouts.
 *
 * It is also the right shape for the job on a phone: a thumb-height target at the bottom of the
 * screen rather than a 26px circle halfway up it, and it has room to name whose answer is being
 * changed — which matters, because ADR-0003 lets you change a teammate's.
 */
export function AnswerSheet({
  member,
  position,
  onRespond,
  onClose,
  pending,
}: {
  /** The person being answered for, or null when the sheet is closed. */
  member: LineupMember | null
  /** Their position, for the subtitle — the sheet is reached from a row, so it should say which. */
  position?: string
  onRespond: (userId: string, state: LineupState) => void
  onClose: () => void
  pending?: boolean
}) {
  return (
    <Sheet open={member !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        {member && (
          <>
            <SheetHeader>
              <SheetTitle>{member.displayName}</SheetTitle>
              <SheetDescription>
                {position ? `${position} · ` : ''}currently {STATE_WORD[member.state].toLowerCase()}
                {!member.isSelf && ' · you are answering for them'}
              </SheetDescription>
            </SheetHeader>
            <AttendanceToggle
              value={member.state}
              disabled={pending}
              onToggle={(state) => {
                onRespond(member.userId, state)
                onClose()
              }}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
