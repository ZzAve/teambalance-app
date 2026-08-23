import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { authMeQueryOptions } from '@shared/api/auth'
import { currentMemberQueryOptions } from '@shared/api/members'
import { queryClient } from '@shared/api/query-client'
import { activateTeam } from '@shared/api/teams'
import { teamRoutes } from '@shared/lib/team-routes'

/**
 * The layout every team-scoped screen hangs off, and the one place the Active Team changes.
 *
 * **Opening a `/t/:slug/…` URL performs an authorized switch** (ADR-0021 §2) — that is the whole
 * point of putting the slug in the URL: a teammate's link opens for anyone entitled to it, and there
 * is exactly one kind of switch, so a link-induced one and a tap in the switcher are the same
 * request and are remembered the same way (§3). A slug the caller may not have, and one that does
 * not exist, both fail the same way here: back to `/`, which re-resolves and lands them somewhere
 * they are entitled to. No error screen names the Team, because the backend deliberately does not
 * say which of the two happened.
 *
 * The switch is skipped when the URL already names the Active Team — the common case, every
 * in-app navigation — so this costs one request per actual change of Team, not per page.
 *
 * **The cache is dropped on a real switch.** Every tenant-scoped query (events, members, positions,
 * the season) is keyed without the Team in it, because a request has exactly one Active Team; that
 * makes the cache the frontend's mirror of `TenantRoutingSession`'s memo, and it inherits the same
 * obligation. Keeping it across a switch would paint the previous Team's roster onto the new Team's
 * screens.
 */
export const Route = createFileRoute('/t/$slug')({
  beforeLoad: async ({ params, location }) => {
    let user = await queryClient.ensureQueryData(authMeQueryOptions).catch(() => null)
    if (!user) throw redirect({ to: '/login' })

    if (user.activeTeam?.slug !== params.slug) {
      const activated = await activateTeam(params.slug).catch(() => null)
      // Unknown slug, or not theirs — indistinguishable by design. `/` decides where they do belong.
      if (!activated) throw redirect({ to: '/' })
      queryClient.clear()
      user = await queryClient.ensureQueryData(authMeQueryOptions).catch(() => null)
      if (!user) throw redirect({ to: '/login' })
    }

    // Onboarding gate: a Member who hasn't completed onboarding is routed to /get-started before any
    // team screen mounts. It lives here rather than in the root guard because onboarding is
    // per-Team — joining a second Team means onboarding into it — so it can only be asked once the
    // Active Team is settled. /get-started itself is exempt so the flow can render. Fail OPEN if the
    // state can't be read: an onboarding-status blip shouldn't trap the user, and auth is confirmed.
    const routes = teamRoutes(params.slug)
    if (location.pathname.replace(/\/$/, '') === routes.getStarted) return
    const member = await queryClient.ensureQueryData(currentMemberQueryOptions).catch(() => null)
    if (member && !member.onboarded) throw redirect({ to: routes.getStarted })
  },
  component: () => <Outlet />,
})
