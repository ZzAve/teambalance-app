import { describe, expect, it } from 'vitest'
import { ACCOUNT_PATH, teamRoutes, teamSlugFromPath } from './team-routes'

describe('teamSlugFromPath', () => {
  it('reads the slug from a team-scoped path', () => {
    expect(teamSlugFromPath('/t/setpoint-vt')).toBe('setpoint-vt')
    expect(teamSlugFromPath('/t/setpoint-vt/')).toBe('setpoint-vt')
    expect(teamSlugFromPath('/t/setpoint-vt/team/settings')).toBe('setpoint-vt')
  })

  it('is null for paths that are not team-scoped', () => {
    expect(teamSlugFromPath('/')).toBeNull()
    expect(teamSlugFromPath('/login')).toBeNull()
    expect(teamSlugFromPath('/onboarding/join')).toBeNull()
    expect(teamSlugFromPath('/create-team')).toBeNull()
  })

  // A near-miss must not be read as a Team: `/team` is a legacy path and `/t/` names no Team at all.
  // Getting this wrong would send the route gate off to switch to a Team called "eam".
  it('is null for near-misses', () => {
    expect(teamSlugFromPath('/team')).toBeNull()
    expect(teamSlugFromPath('/team/settings')).toBeNull()
    expect(teamSlugFromPath('/t/')).toBeNull()
    expect(teamSlugFromPath('/things')).toBeNull()
  })

  it('decodes a percent-encoded slug', () => {
    expect(teamSlugFromPath('/t/tovo%20heren/team')).toBe('tovo heren')
  })
})

describe('teamRoutes', () => {
  it('builds every team-scoped destination under the slug', () => {
    const routes = teamRoutes('setpoint-vt')
    expect(routes.events).toBe('/t/setpoint-vt')
    expect(routes.event('abc-123')).toBe('/t/setpoint-vt/events/abc-123')
    expect(routes.team).toBe('/t/setpoint-vt/team')
    expect(routes.teamSettings).toBe('/t/setpoint-vt/team/settings')
    expect(routes.money).toBe('/t/setpoint-vt/money')
    expect(routes.getStarted).toBe('/t/setpoint-vt/get-started')
  })

  // Without a Team in the URL there is no team-scoped destination to name; `/` is the dispatcher
  // that resolves the Active Team and redirects into it.
  it('collapses to the dispatcher when no Team is in scope', () => {
    const routes = teamRoutes(null)
    expect(routes.events).toBe('/')
    expect(routes.event('abc-123')).toBe('/')
    expect(routes.teamSettings).toBe('/')
    expect(routes.money).toBe('/')
  })

  it('round-trips through teamSlugFromPath', () => {
    expect(teamSlugFromPath(teamRoutes('setpoint-vt').teamSettings)).toBe('setpoint-vt')
  })

  // Profile is no longer a team-scoped destination — it moved to the team-independent /account
  // (ADR-0027 §1), so teamRoutes must not name it any more.
  it('no longer names a team-scoped profile destination', () => {
    expect('profile' in teamRoutes('setpoint-vt')).toBe(false)
  })
})

describe('ACCOUNT_PATH', () => {
  // The Account tab is a constant, team-independent route (ADR-0027 §1) — never built from a slug —
  // so the BottomNav Profile tab and the /account route can both reference the same literal.
  it('is the team-independent /account route', () => {
    expect(ACCOUNT_PATH).toBe('/account')
    expect(teamSlugFromPath(ACCOUNT_PATH)).toBeNull()
  })
})
