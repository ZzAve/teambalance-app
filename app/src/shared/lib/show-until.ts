/**
 * A Post's show-until as the date field shows it and as the API stores it (ADR-0050): the admin picks
 * a day, and the Post is shown to the end of that day in the admin's own time zone.
 */
export function showUntilFromDate(date: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day, 23, 59, 59).toISOString()
}

/** The local day of a stored show-until, for the date field; '' when there is none. */
export function dateFromShowUntil(iso: string | null | undefined): string {
  if (!iso) return ''
  const value = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`
}

/**
 * True once a Post's show-until has passed: Members no longer see it. Takes null too: the API sends
 * null for "no show-until", although the generated type says undefined.
 */
export function hasEnded(showUntil: string | null | undefined, now: Date): boolean {
  return showUntil != null && new Date(showUntil).getTime() <= now.getTime()
}
