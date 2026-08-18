/**
 * Which way the page-slide view transition should run.
 *
 * The router stamps a monotonically increasing index on every history entry (`__TSR_index` on
 * `window.history.state`): a push increments it, a pop (browser Back, swipe-back, `history.go(-n)`)
 * lands on a lower one, and a replace keeps it. So a *decreasing* index is the only honest signal
 * of a backward move. The previous heuristic compared path lengths, which mislabelled every lateral
 * move (`/team` -> `/profile`, same depth) and every shallow push (`/events/42` -> `/`) as "back".
 *
 * Anything we can't read as a pop slides forward — the neutral default: the first mount and a hard
 * refresh have no previous index to compare against, and a history entry written outside the router
 * carries no index at all.
 */
export type ViewTransitionDirection = 'back' | 'forward'

export function directionFromIndices(
  prevIndex: number | undefined,
  nextIndex: number | undefined,
): ViewTransitionDirection {
  if (typeof prevIndex !== 'number' || typeof nextIndex !== 'number') return 'forward'
  return nextIndex < prevIndex ? 'back' : 'forward'
}
