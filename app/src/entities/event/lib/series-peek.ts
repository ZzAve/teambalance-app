import type { Event } from '@shared/api/events'

export interface SeriesPeekEntry {
  id: string
  startTime: string
  isCurrent: boolean
}

export interface SeriesPeek {
  total: number
  /** 1-based position of the current occurrence within the chronological series. */
  currentPosition: number
  head: SeriesPeekEntry[]
  tail: SeriesPeekEntry[]
  /** Occurrences collapsed between head and tail (the "+N more" gap); 0 when the series is short. */
  hiddenCount: number
}

// Show at most this many occurrences inline before collapsing the middle into "+N more".
const HEAD = 2
const TAIL = 2

/**
 * Builds a compact "part of a series" peek from an occurrence's siblings (ADR-0014): the series is
 * every event sharing its recurring_group. Shows the first two and last two occurrences with a
 * "+N more" gap between, marking the current one. Pure; returns null when the event is not part of a
 * usable series (no group, or fewer than two occurrences).
 */
export function buildSeriesPeek(siblings: Event[], currentId: string): SeriesPeek | null {
  if (siblings.length < 2) return null

  const sorted = [...siblings].sort((a, b) => a.startTime.localeCompare(b.startTime))
  const currentIndex = sorted.findIndex((e) => e.id === currentId)
  if (currentIndex === -1) return null

  const entry = (e: Event): SeriesPeekEntry => ({ id: e.id, startTime: e.startTime, isCurrent: e.id === currentId })

  // Short series: show every occurrence inline, no gap.
  if (sorted.length <= HEAD + TAIL) {
    return {
      total: sorted.length,
      currentPosition: currentIndex + 1,
      head: sorted.map(entry),
      tail: [],
      hiddenCount: 0,
    }
  }

  return {
    total: sorted.length,
    currentPosition: currentIndex + 1,
    head: sorted.slice(0, HEAD).map(entry),
    tail: sorted.slice(sorted.length - TAIL).map(entry),
    hiddenCount: sorted.length - HEAD - TAIL,
  }
}
