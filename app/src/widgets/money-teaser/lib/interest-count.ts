/**
 * A deliberately FAKE "interest" counter for the Money teaser — theatre, not analytics.
 *
 * There is no backend for the money feature yet, so this invents a number instead of reporting one.
 * It is a pure function of the wall clock that:
 *   · equals a small base at deploy time and only ever climbs (never decreases on a later read),
 *   · looks pseudo-random hour to hour rather than a straight ramp,
 *   · is fully deterministic — every device shows the same figure at the same instant, with no
 *     network and no shared state.
 *
 * When the real feature ships, delete this and read a genuine count from the API. Anything that
 * wants to treat this as real data is a bug: it is a placeholder that happens to move.
 */

// Deploy anchor: Mon 24 Aug 2026, 19:30 in Amsterdam (CEST = UTC+2) → 17:30 UTC. The count is `BASE`
// at this instant and grows from here. Exported so tests and callers can reason about "at deploy".
export const INTEREST_ANCHOR_MS = Date.UTC(2026, 7, 24, 17, 30, 0)

const BASE = 4
const HOUR_MS = 3_600_000
// Every whole hour adds somewhere in [MIN, MAX]. MIN is 2, not 1, so the gradual within-hour reveal
// (floor(frac × increment)) always reaches at least 1 before the hour is out — the number moves in
// every hour rather than freezing whenever an hour happened to draw a 1. Averages ~4/hour ≈ ~96/day.
const MIN_PER_HOUR = 2
const MAX_PER_HOUR = 6

/**
 * A small deterministic hash of the hour index → the increment for that hour. Uses only `Math.imul`
 * and unsigned shifts, so the result is identical across JS engines (unlike anything float-based).
 */
function hourIncrement(hour: number): number {
  let x = (hour + 0x9e3779b9) >>> 0
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b)
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35)
  x = (x ^ (x >>> 16)) >>> 0
  return MIN_PER_HOUR + (x % (MAX_PER_HOUR - MIN_PER_HOUR + 1))
}

/**
 * The teaser's fake interest count at `now`. Non-decreasing in `now`, `BASE` at (or before) the
 * anchor. `anchorMs` is injectable so stories and tests can pin "deploy" wherever they need it.
 */
export function interestCount(now: Date, anchorMs: number = INTEREST_ANCHOR_MS): number {
  const elapsed = now.getTime() - anchorMs
  if (elapsed <= 0) return BASE // before deploy, or a clock skewed backwards: sit on the floor

  const wholeHours = Math.floor(elapsed / HOUR_MS)
  let total = BASE
  // O(hours since deploy): a few thousand even after a year, run once per minute-tick — negligible.
  for (let h = 1; h <= wholeHours; h++) total += hourIncrement(h)

  // Reveal the current hour's increment gradually across its minutes, so an open page visibly ticks
  // up instead of jumping once an hour. Stays non-decreasing: the partial reveal only ever grows
  // toward the full increment, which then folds into the sum at the next hour boundary.
  const frac = (elapsed % HOUR_MS) / HOUR_MS
  total += Math.floor(frac * hourIncrement(wholeHours + 1))
  return total
}
