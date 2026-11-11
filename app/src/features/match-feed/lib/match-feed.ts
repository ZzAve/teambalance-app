import type { FeedMatch } from '@shared/api/match-feed'

const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

/** True when the team plays this match at home. */
export function isHome(match: FeedMatch, teamName: string): boolean {
  return sameName(match.homeTeam, teamName)
}

/** The other team in the match. */
export function opponentOf(match: FeedMatch, teamName: string): string {
  return isHome(match, teamName) ? match.awayTeam : match.homeTeam
}
