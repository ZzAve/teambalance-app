import { Check } from 'lucide-react'
import { Button } from '@shared/ui/button'

interface BulkAttendButtonViewProps {
  /** How many shown, unanswered, future events the tap would fill. */
  count: number
  onAttend: () => void
  isPending?: boolean
}

/**
 * The "Attend N" button (ADR-0020). Presentational: the count and the callback come in as props, the
 * mutation and the Undo toast live in the container.
 *
 * The count *is* the confirmation — there is no modal, so the number must be visible before the tap.
 * At zero there is nothing to fill, so the button renders nothing at all rather than a disabled
 * control: a greyed-out "Attend 0" is noise on a list where every event is already answered.
 */
export function BulkAttendButtonView({ count, onAttend, isPending = false }: BulkAttendButtonViewProps) {
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
      Attend {count}
    </Button>
  )
}
