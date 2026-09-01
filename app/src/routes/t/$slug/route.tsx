import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { authMeQueryOptions } from '@shared/api/auth'
import { currentMemberQueryOptions } from '@shared/api/members'
import { queryClient } from '@shared/api/query-client'
import { activateTeam } from '@shared/api/teams'
import { teamRoutes } from '@shared/lib/team-routes'

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
    if (!user) throw redirect({ to: '/login' })

    if (user.activeTeam?.slug !== params.slug) {
      const activated = await activateTeam(params.slug).catch(() => null)
      if (!activated) throw redirect({ to: '/' })
      // Tenant-scoped queries are keyed without the Team in them, so they belong to the Team just
      // left. resetQueries, not clear(): a switch keeps the same components mounted, and clear()
      // empties the cache without telling those observers to refetch.
      await queryClient.resetQueries()
      user = await queryClient.ensureQueryData(authMeQueryOptions).catch(() => null)
      if (!user) throw redirect({ to: '/login' })
    }

    // A Platform Admin acting-as is structurally not a member of this team (ADR-0024 §3), so
    // /members/me 404s for them — a query that can never cache, which the onboarding gate below would
    // therefore re-fetch on every team-route navigation, flashing the pending splash each time. It is
    // also meaningless for them: an operator preparing a team is not onboarding into it. Skip the gate.
    if (user.actAs) return

    // Onboarding is per-Team, so it can only be asked once the Active Team is settled — hence here
    // rather than in the root guard. Fails open: a status blip must not trap a confirmed caller.
    const routes = teamRoutes(params.slug)
    if (location.pathname.replace(/\/$/, '') === routes.getStarted) return
    const member = await queryClient.ensureQueryData(currentMemberQueryOptions).catch(() => null)
    if (member && !member.onboarded) throw redirect({ to: routes.getStarted })
  },
  component: () => <Outlet />,
})
