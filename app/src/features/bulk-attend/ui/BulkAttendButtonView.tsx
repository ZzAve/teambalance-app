import { Check } from 'lucide-react'
import { Button } from '@shared/ui/button'
import { attendLabel } from '../lib/attend-label'

interface BulkAttendButtonViewProps {
  /** How many shown, unanswered, future events the tap would fill. */
  count: number
  /** The one event type the batch covers, or null when it spans several. */
  typeName?: string | null
  onAttend: () => void
  isPending?: boolean
}

/**
 * The "Attend N" button (ADR-0020). Presentational: the count and the callback come in as props, the
 * mutation and the Undo toast live in the container.
 *
 * The label *is* the confirmation — there is no modal, so both the number and, when the batch is all
 * one kind, the type must be visible before the tap. At zero there is nothing to fill, so the button
 * renders nothing at all rather than a disabled control: a greyed-out "Attend 0" is noise on a list
 * where every event is already answered.
 */
export function BulkAttendButtonView({
  count,
  typeName = null,
  onAttend,
  isPending = false,
}: BulkAttendButtonViewProps) {
  if (count === 0) return null

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onAttend}
      disabled={isPending}
      className="shrink-0 border-green/30 text-green hover:bg-green/10"
    >
      <Check size={16} />
      {attendLabel(count, typeName)}
    </Button>
  )
}
