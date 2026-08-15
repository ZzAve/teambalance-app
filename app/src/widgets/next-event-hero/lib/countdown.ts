const MS_PER_MINUTE = 60 * 1000
const MS_PER_HOUR = 60 * MS_PER_MINUTE
const MS_PER_DAY = 24 * MS_PER_HOUR

export interface HeroCountdown {
  /** The big line: `2d`, `11h`, `45m`, or `Now`. */
  value: string
  /** The small line under it — `away`, or `on` once the event has started. */
  unit: string
}

/**
 * The hero's countdown to kick-off, in the largest unit that still says something useful.
 *
 * Deliberately elapsed-time, not calendar days: the card's chit and relative label already speak in
 * calendar days, so the hero earns its place by being the one thing on the page that says "eleven
 * hours". Rounding is always down, so "1d away" never promises time you do not have.
 *
 * Pure: `now` is a parameter, so the countdown is deterministic in stories and unit-testable.
 */
export function heroCountdown(startTime: string | Date, now: Date): HeroCountdown {
  const start = startTime instanceof Date ? startTime : new Date(startTime)
  const remaining = start.getTime() - now.getTime()

  if (remaining <= 0) return { value: 'Now', unit: 'on' }
  if (remaining >= MS_PER_DAY) return { value: `${Math.floor(remaining / MS_PER_DAY)}d`, unit: 'away' }
  if (remaining >= MS_PER_HOUR) return { value: `${Math.floor(remaining / MS_PER_HOUR)}h`, unit: 'away' }
  return { value: `${Math.max(1, Math.floor(remaining / MS_PER_MINUTE))}m`, unit: 'away' }
}
