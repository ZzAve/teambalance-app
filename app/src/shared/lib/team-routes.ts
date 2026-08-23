import { useRouterState } from '@tanstack/react-router'

/**
 * Team-scoped routes all live under `/t/:slug/…` (ADR-0021 §2), so a link a teammate shares opens
 * for anyone entitled to it and opening one performs an authorized switch of the Active Team.
 *
 * The slug is read back out of the URL rather than threaded through props or a store. Two reasons:
 * the URL is the authority on which Team the screen is showing (it is what the route gate switched
 * to), and reading it keeps every linking component a pure function of the current location — which
 * is what lets Storybook drive them by simply starting the router at a path.
 */
const TEAM_PREFIX = '/t/'

/**
 * The Team slug the given path is scoped to, or null for a path that is not team-scoped (`/login`,
 * `/onboarding`, `/create-team`, …).
 *
 * Deliberately strict: the segment right after `/t/` and nothing else. `/t/` with no slug, and a
 * `/team`-style path that merely starts with the same letters, are both "not team-scoped" — a
 * near-miss must not be read as a Team named after whatever followed.
 */
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
 * The team-scoped destinations for [slug].
 *
 * With no slug — a component rendered outside a Team route, which in the app happens only in
 * Storybook — every destination collapses to `/`, the dispatcher that resolves the caller's Active
 * Team and redirects into it. That is the honest answer: without a Team in the URL there is no
 * team-scoped destination to name, and `/` is where the app decides which one it should be.
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

/** [teamRoutes] for the Team the caller is currently in, derived from the location. */
export function useTeamRoutes(): TeamRoutes {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  return teamRoutes(teamSlugFromPath(pathname))
}

/** The Active Team's slug as the URL states it, or null outside a team-scoped route. */
export function useTeamSlug(): string | null {
  return useRouterState({ select: (s) => teamSlugFromPath(s.location.pathname) })
}
