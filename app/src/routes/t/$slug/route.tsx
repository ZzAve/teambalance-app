import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { authMeQueryOptions } from '@shared/api/auth'
import { currentMemberQueryOptions } from '@shared/api/members'
import { queryClient } from '@shared/api/query-client'
import { teamRoutes } from '@shared/lib/team-routes'
import { enterTeam } from '@shared/session/session'
import { decideTeamEntry } from '@shared/session/team-entry'

/**
 * The layout every team-scoped screen hangs off, and the one place the Active Team changes: opening
 * a `/t/:slug/…` URL performs an authorized switch (ADR-0023 §2), so a teammate's link opens for
 * anyone entitled to it.
 *
 * The session, not this URL, is the authority on the tenant — two tabs therefore share one Active
 * Team, which ADR-0023 §2 accepted as the price of team-less PWA navigation.
 */
export const Route = createFileRoute('/t/$slug')({
  beforeLoad: async ({ params, location }) => {
    let user = await queryClient.ensureQueryData(authMeQueryOptions).catch(() => null)
    let decision = decideTeamEntry(user, params.slug, location.pathname)

    if (decision === 'activate') {
      const entered = await enterTeam(params.slug)
      if (!entered) throw redirect({ to: '/' })
      user = entered.user
      decision = decideTeamEntry(user, params.slug, location.pathname)
    }
    if (decision === 'login') throw redirect({ to: '/login' })

    // Onboarding is per-Team, so it can only be asked once the Active Team is settled — hence here
    // rather than in the root guard. Fails open: a status blip must not trap a confirmed caller.
    if (decision === 'check-onboarding') {
      const member = await queryClient.ensureQueryData(currentMemberQueryOptions).catch(() => null)
      decision = decideTeamEntry(user, params.slug, location.pathname, member ?? null)
    }
    if (decision === 'get-started') throw redirect({ to: teamRoutes(params.slug).getStarted })
  },
  component: () => <Outlet />,
})
