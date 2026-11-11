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

const SEEDED_MATCH_TYPE_ID = 'c0000000-0000-0000-0000-000000000002'

/** The event type a new match event starts with: the seeded Match type, else one named like a match. */
export function matchEventTypeId(types: { id: string; name: string; archived: boolean }[]): string | undefined {
  const active = types.filter((type) => !type.archived)
  return (
    active.find((type) => type.id === SEEDED_MATCH_TYPE_ID) ?? active.find((type) => /match|wedstrijd/i.test(type.name))
  )?.id
}

/** The start values of an event for a match: the feed's title, start, address and a link to the match. */
export function eventValuesFor(match: FeedMatch) {
  return {
    title: `${match.homeTeam} - ${match.awayTeam}`,
    startTime: match.startTime,
    location: match.address ?? match.venue,
    references: [{ title: 'Nevobo', url: match.link }],
  }
}
