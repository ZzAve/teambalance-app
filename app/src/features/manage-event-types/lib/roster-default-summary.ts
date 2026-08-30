import type { RosterRequirement } from '@shared/api/event-types'
import type { Position } from '@shared/api/positions'

/**
 * A one-line description of a roster requirement, for the admin list row — so an admin can read what
 * each type needs without opening its editor.
 *
 * Deliberately not the card's status: that is what the *event* currently looks like, this is what the
 * *type* asks for. Nothing is computed against attendance here.
 */
export function rosterDefaultSummary(requirement: RosterRequirement, positions: Position[]): string {
  if (!requirement.trackRoster) return 'No roster'

  const labelById = new Map(positions.map((p) => [p.id, p.label]))
  // Unknown ids are skipped rather than rendered as a raw uuid: a target can outlive its position
  // for the instant between a delete's two writes, and the summary is not the place to expose that.
  const perPosition = requirement.positionTargets
    .map((t) => {
      const label = labelById.get(t.positionId)
      return label ? `${t.count} ${label}` : null
    })
    .filter((s): s is string => s !== null)

  const total = requirement.totalTarget != null ? `${requirement.totalTarget} total` : null
  const parts = [...perPosition, total].filter((s): s is string => s !== null)

  // Tracking on with nothing required is a real state, and the one most easily mistaken for a bug —
  // so it says what it is rather than rendering an empty string.
  return parts.length === 0 ? 'Tracked, nothing required' : parts.join(' · ')
}
