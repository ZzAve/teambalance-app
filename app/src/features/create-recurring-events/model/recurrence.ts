import type { RecurrenceFrequency, Weekday } from '@shared/api/recurring-events'
import type { Season } from '@shared/api/season'

// A single batch materializes at most this many occurrences (ADR-0014). The backend enforces the
// same cap and hard-rejects over it; the wizard mirrors it so the user sees the wall before submit.
export const MAX_OCCURRENCES = 200

// Weekday pills, Monday-first (European convention). Value is the contract enum; short is the label.
export const WEEKDAYS: { value: Weekday; short: string }[] = [
  { value: 'MONDAY', short: 'Mo' },
  { value: 'TUESDAY', short: 'Tu' },
  { value: 'WEDNESDAY', short: 'We' },
  { value: 'THURSDAY', short: 'Th' },
  { value: 'FRIDAY', short: 'Fr' },
  { value: 'SATURDAY', short: 'Sa' },
  { value: 'SUNDAY', short: 'Su' },
]

// Contract weekday → JS getUTCDay() index (Sun=0..Sat=6).
const WEEKDAY_TO_JS: Record<Weekday, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
}

export interface RecurrenceInput {
  frequency: RecurrenceFrequency
  weekdays: Weekday[]
  startDate: string // 'YYYY-MM-DD'
  endDate: string // 'YYYY-MM-DD'
}

// Parse a 'YYYY-MM-DD' as UTC midnight. Iterating in UTC makes generation independent of the
// machine timezone and immune to DST jumps (a naive local +1 day can skip or repeat a date across
// a transition) — the dates are calendar dates, matching the backend's LocalDate generation.
function parseUtc(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`)
}

function toIso(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/**
 * The concrete occurrence dates this rule generates, ascending, as 'YYYY-MM-DD'. Every in-range date
 * whose weekday is selected; for BIWEEKLY, every *other* occurrence per weekday is kept (the 1st,
 * 3rd, … hit of each selected weekday). Pure and DST-safe. Empty when nothing matches.
 */
export function generateOccurrences(rule: RecurrenceInput): string[] {
  if (!rule.startDate || !rule.endDate || rule.weekdays.length === 0) return []
  const start = parseUtc(rule.startDate)
  const end = parseUtc(rule.endDate)
  if (start.getTime() > end.getTime()) return []

  const wanted = new Set(rule.weekdays.map((w) => WEEKDAY_TO_JS[w]))
  const perWeekdayCount: Record<number, number> = {}
  const out: string[] = []

  const cursor = new Date(start)
  // Bounded by the date range; a guard keeps a pathological input from spinning forever.
  let guard = 0
  while (cursor.getTime() <= end.getTime() && guard < 4000) {
    guard++
    const dow = cursor.getUTCDay()
    if (wanted.has(dow)) {
      const index = perWeekdayCount[dow] ?? 0
      const keep = rule.frequency === 'WEEKLY' || index % 2 === 0
      perWeekdayCount[dow] = index + 1
      if (keep) out.push(toIso(cursor))
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return out
}

function monthKey(iso: string): number {
  const d = parseUtc(iso)
  return d.getUTCFullYear() * 12 + d.getUTCMonth()
}

function inSeason(iso: string, season: Season | undefined): boolean {
  if (!season) return true
  if (season.start && iso < season.start) return false
  if (season.end && iso > season.end) return false
  return true
}

export interface DayCell {
  /** 'YYYY-MM-DD' for a real day, or null for a leading/trailing pad cell. */
  date: string | null
  day: number
  inSeason: boolean
  isOccurrence: boolean
  /** An occurrence that falls outside the season window (the backend would reject the batch). */
  outOfSeason: boolean
}

export interface MonthGrid {
  year: number
  month: number // 0-11
  label: string // 'September 2026'
  weeks: DayCell[][] // Monday-first rows of 7
}

export interface CalendarPreview {
  months: MonthGrid[]
  count: number
  overCap: boolean
  outOfSeasonCount: number
  firstDate: string | null
  lastDate: string | null
  /** True when the rendered months don't cover the whole span (so the grid isn't silently cut). */
  truncated: boolean
}

// The calendar renders at most this many months; a longer span is truncated with a visible note
// rather than silently cut, and kept bounded so a pathological range can't render hundreds of grids.
const MAX_PREVIEW_MONTHS = 18

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// Monday-first weekday index (Mon=0..Sun=6) for laying out the calendar grid.
function mondayIndex(d: Date): number {
  return (d.getUTCDay() + 6) % 7
}

function buildMonth(year: number, month: number, occ: Set<string>, season: Season | undefined): MonthGrid {
  const first = new Date(Date.UTC(year, month, 1))
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const lead = mondayIndex(first)

  const cells: DayCell[] = []
  for (let i = 0; i < lead; i++) cells.push({ date: null, day: 0, inSeason: false, isOccurrence: false, outOfSeason: false })
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = toIso(new Date(Date.UTC(year, month, day)))
    const isOccurrence = occ.has(iso)
    const within = inSeason(iso, season)
    cells.push({
      date: iso,
      day,
      inSeason: within,
      isOccurrence,
      outOfSeason: isOccurrence && !within,
    })
  }
  while (cells.length % 7 !== 0) cells.push({ date: null, day: 0, inSeason: false, isOccurrence: false, outOfSeason: false })

  const weeks: DayCell[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  return { year, month, label: `${MONTH_NAMES[month]} ${year}`, weeks }
}

/**
 * Maps a rule + the team's season into a month-by-month calendar model for the live preview: the
 * span covers the season and any chosen occurrences, each day flagged in/out of season and whether
 * it is an occurrence. Also returns the running count and cap / out-of-season signals. Pure.
 */
export function buildCalendarPreview(rule: RecurrenceInput, season: Season | undefined): CalendarPreview {
  const occurrences = generateOccurrences(rule)
  const occ = new Set(occurrences)

  // Span from the earliest to the latest of the season bounds and the actual occurrences — NOT the
  // raw rule dates, so a stray far-future endDate with no occurrences beyond it can't inflate the
  // grid. With no occurrences yet, fall back to the rule/season dates so the empty calendar still
  // shows the intended window.
  const anchors: string[] = []
  if (season?.start) anchors.push(season.start)
  if (season?.end) anchors.push(season.end)
  if (occurrences.length > 0) {
    anchors.push(occurrences[0], occurrences[occurrences.length - 1])
  } else {
    if (rule.startDate) anchors.push(rule.startDate)
    if (rule.endDate) anchors.push(rule.endDate)
  }

  const months: MonthGrid[] = []
  let truncated = false
  if (anchors.length > 0) {
    let minMk = Infinity
    let maxMk = -Infinity
    anchors.forEach((a) => {
      const mk = monthKey(a)
      if (mk < minMk) minMk = mk
      if (mk > maxMk) maxMk = mk
    })
    const renderMax = Math.min(maxMk, minMk + MAX_PREVIEW_MONTHS - 1)
    truncated = maxMk > renderMax
    for (let mk = minMk; mk <= renderMax; mk++) {
      months.push(buildMonth(Math.floor(mk / 12), mk % 12, occ, season))
    }
  }

  const outOfSeasonCount = occurrences.filter((d) => !inSeason(d, season)).length

  return {
    months,
    count: occurrences.length,
    overCap: occurrences.length > MAX_OCCURRENCES,
    outOfSeasonCount,
    firstDate: occurrences[0] ?? null,
    lastDate: occurrences[occurrences.length - 1] ?? null,
    truncated,
  }
}

/**
 * The form's default date window from the team's season (ADR-0014): start at max(today, seasonStart),
 * end at seasonEnd. `today` is injected as 'YYYY-MM-DD' so this stays pure and testable.
 */
export function defaultDateRange(season: Season | undefined, today: string): { startDate: string; endDate: string } {
  const start = season?.start && season.start > today ? season.start : today
  const end = season?.end ?? ''
  return { startDate: start, endDate: end }
}
