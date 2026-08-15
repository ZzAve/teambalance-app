/**
 * How far ahead a relative-time label is worth showing, in calendar days.
 *
 * Past this, the card's date chit already says everything ("in 9 days" is just the chit in weaker
 * words), so no label is rendered. The same constant gates the Next Up hero — the hero and the
 * label share one idea of "near". Kept as a single named constant so the window can be re-tuned
 * (7 vs 10) in one edit; we ship 7 because a volleyball team thinks in weeks.
 */
export const RELATIVE_WINDOW_DAYS = 7

export type RelativeLabelEmphasis = 'solid' | 'quiet'

export interface RelativeLabel {
  text: string
  /** `solid` renders a hue-neutral ink pill; `quiet` is muted grey text with no pill. */
  emphasis: RelativeLabelEmphasis
}

const MS_PER_DAY = 24 * 60 * 60 * 1000
const SATURDAY = 6
const SUNDAY = 0

const toDate = (value: string | Date) => (value instanceof Date ? value : new Date(value))

/** Local midnight of the day `value` falls on. */
const startOfDay = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate())

/**
 * Calendar days from `now` to `startTime`, counted in the viewer's local zone: how many midnights
 * sit between them, not how many 24-hour blocks. An event 45 minutes away is "1" when those 45
 * minutes cross midnight, which is what "Tomorrow" means to the person reading the card.
 *
 * Rounding absorbs the 23- and 25-hour days a DST transition produces.
 */
export function calendarDaysUntil(startTime: string | Date, now: Date): number {
  const diff = startOfDay(toDate(startTime)).getTime() - startOfDay(now).getTime()
  return Math.round(diff / MS_PER_DAY)
}

/**
 * Days from `now` until the Saturday and Sunday that close the current week (Mon–Sun). On a Sunday
 * both are behind us, so nothing is "this weekend" — the Saturday six days out belongs to the
 * following week and gets a plain "in 6 days" instead.
 */
function daysToComingWeekend(now: Date): number[] {
  const weekday = now.getDay()
  const daysToSaturday = SATURDAY - weekday
  return weekday === SUNDAY ? [] : [daysToSaturday, daysToSaturday + 1]
}

/**
 * The graduated relative-time label for an event, or `null` when the date alone should carry it.
 *
 * Rules are evaluated top-down, first match wins:
 *
 * | Condition                                            | Text            | Emphasis         |
 * |------------------------------------------------------|-----------------|------------------|
 * | Same calendar day                                     | `Today`         | solid            |
 * | Next calendar day                                     | `Tomorrow`      | solid            |
 * | Coming Sat/Sun, ≥2 days away, within the window       | `This weekend`  | quiet (solid ≤2) |
 * | Within the window, ≤2 days away                       | `in N days`     | solid            |
 * | Within the window, 3–7 days away                      | `in N days`     | quiet            |
 * | Beyond the window (or in the past)                    | —               | —                |
 *
 * Pure: `now` is a parameter, never `Date.now()`, so the label is a function of its inputs and
 * every branch above is unit-testable.
 */
export function relativeEventLabel(startTime: string | Date, now: Date): RelativeLabel | null {
  const days = calendarDaysUntil(startTime, now)

  if (days < 0) return null
  if (days === 0) return { text: 'Today', emphasis: 'solid' }
  if (days === 1) return { text: 'Tomorrow', emphasis: 'solid' }
  if (days > RELATIVE_WINDOW_DAYS) return null

  const emphasis: RelativeLabelEmphasis = days <= 2 ? 'solid' : 'quiet'

  if (daysToComingWeekend(now).includes(days)) return { text: 'This weekend', emphasis }

  return { text: `in ${days} days`, emphasis }
}
