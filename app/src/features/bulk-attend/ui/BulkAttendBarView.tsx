import type { EligibleTypeGroup } from '../lib/group-by-type'
import { BulkAttendButtonView } from './BulkAttendButtonView'

interface BulkAttendBarViewProps {
  groups: EligibleTypeGroup[]
  onAttend: (typeId: string) => void
  /** The type whose batch is in flight, if any. */
  pendingTypeId?: string | null
}

/**
 * One "Attend N <type>" button per event type with blanks left (ADR-0021).
 *
 * Presentational: the groups and the callback come in as props, the mutation and the Undo toast
 * live in the container. Renders nothing when there are no groups, so a fully-answered list reserves
 * no empty row.
 *
 * Wraps rather than scrolls: a team with several event types gets a second line instead of buttons
 * sliding out of reach off the edge, which on a phone is the difference between an action you can
 * see and one you cannot.
 */
export function BulkAttendBarView({ groups, onAttend, pendingTypeId = null }: BulkAttendBarViewProps) {
  if (groups.length === 0) return null

  return (
    <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
      {groups.map((group) => (
        <BulkAttendButtonView
          key={group.typeId}
          count={group.events.length}
          typeName={group.typeName}
          isPending={pendingTypeId === group.typeId}
          onAttend={() => onAttend(group.typeId)}
        />
      ))}
    </div>
  )
}
