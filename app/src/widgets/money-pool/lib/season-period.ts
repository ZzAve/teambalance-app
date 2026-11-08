/**
 * Whether the payments run from the season start. The API does that only while the start is set and not
 * in the future (otherwise it falls back to the last 90 days). Both arguments are ISO calendar dates.
 */
export function paymentsFollowSeason(seasonStart: string | null | undefined, today: string): boolean {
  return !!seasonStart && seasonStart <= today
}
