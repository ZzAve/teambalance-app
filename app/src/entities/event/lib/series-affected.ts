import type { Event, EventSeriesScope } from '@shared/api/events'

export interface AffectedNode {
  id: string
  startTime: string
  /** True when a scoped edit/delete reaches this occurrence. */
  affected: boolean
  /** True for the occurrence the action was opened on. */
  isCurrent: boolean
}

export interface AffectedPreview {
  scope: EventSeriesScope
  /** The whole series in chronological order, each flagged affected / current. */
  nodes: AffectedNode[]
  affectedCount: number
  total: number
}

// The inclusive [lo, hi] index range a scope reaches, mirroring the backend split matrix
// (ADR-0014): THIS is the single occurrence, THIS_AND_FOLLOWING runs to the end, ALL is everything.
function affectedRange(scope: EventSeriesScope, currentIndex: number, total: number): [number, number] {
  switch (scope) {
    case 'THIS':
      return [currentIndex, currentIndex]
    case 'THIS_AND_FOLLOWING':
      return [currentIndex, total - 1]
    case 'ALL':
      return [0, total - 1]
  }
}

/**
 * Builds the before│this│after affected-preview for a scoped series edit/delete (ADR-0014,
 * prototype B). Pure: sorts [siblings] chronologically, marks which occurrences a [scope] reaches
 * relative to [currentId], and counts them ("Affects N of M"). Returns null when the current
 * occurrence is not among the siblings (nothing to preview).
 */
export function buildAffectedPreview(
  siblings: Event[],
  currentId: string,
  scope: EventSeriesScope,
): AffectedPreview | null {
  const sorted = [...siblings].sort((a, b) => a.startTime.localeCompare(b.startTime))
  const currentIndex = sorted.findIndex((e) => e.id === currentId)
  if (currentIndex === -1) return null

  const [lo, hi] = affectedRange(scope, currentIndex, sorted.length)
  const nodes: AffectedNode[] = sorted.map((e, i) => ({
    id: e.id,
    startTime: e.startTime,
    affected: i >= lo && i <= hi,
    isCurrent: i === currentIndex,
  }))

  return { scope, nodes, affectedCount: hi - lo + 1, total: sorted.length }
}
