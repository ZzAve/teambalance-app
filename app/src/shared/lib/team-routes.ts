import { useRouterState } from '@tanstack/react-router'

/**
 * Team-scoped routes live under `/t/:slug/…` (ADR-0023 §2). The slug is read back out of the URL
 * rather than threaded through props or a store, which keeps every linking component a pure function
 * of the current location — and lets Storybook drive them by starting the router at a path.
 */
const TEAM_PREFIX = '/t/'

/** Null for a path that is not team-scoped. Strict: the segment right after `/t/` and nothing else. */
export function teamSlugFromPath(pathname: string): string | null {
  if (!pathname.startsWith(TEAM_PREFIX)) return null
  const slug = pathname.slice(TEAM_PREFIX.length).split('/')[0]
  return slug === '' ? null : decodeURIComponent(slug)
}

export interface TeamRoutes {
  /** The Team's home — the events list. */
  events: string
  event: (eventId: string) => string
  team: string
  teamSettings: string
  profile: string
  getStarted: string
}

/**
 * With no slug every destination collapses to `/`, the dispatcher that resolves the Active Team:
 * outside a Team route there is no team-scoped destination to name.
 */
export function teamRoutes(slug: string | null): TeamRoutes {
  if (slug === null) {
    return { events: '/', event: () => '/', team: '/', teamSettings: '/', profile: '/', getStarted: '/' }
  }
  const base = `${TEAM_PREFIX}${encodeURIComponent(slug)}`
  return {
    events: base,
    event: (eventId) => `${base}/events/${encodeURIComponent(eventId)}`,
    team: `${base}/team`,
    teamSettings: `${base}/team/settings`,
    profile: `${base}/profile`,
    getStarted: `${base}/get-started`,
  }
}

/** [teamRoutes] for the Team the caller is currently in. */
export function useTeamRoutes(): TeamRoutes {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  return teamRoutes(teamSlugFromPath(pathname))
}

/** The Active Team's slug as the URL states it, or null outside a team-scoped route. */
export function useTeamSlug(): string | null {
  return useRouterState({ select: (s) => teamSlugFromPath(s.location.pathname) })
}
