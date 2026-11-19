import { createFileRoute, redirect } from '@tanstack/react-router'
import { authMeQueryOptions } from '@shared/api/auth'
import { queryClient } from '@shared/api/query-client'
import { teamRoutes } from '@shared/lib/team-routes'

// The admin-only /team/settings tree: the hub (index) and one page per setting ($section). No
// component of its own, so it renders the matched child.
export const Route = createFileRoute('/t/$slug/team/settings')({
  // Read the same /me query the root guard primed (from cache) and bounce non-admins home before
  // the settings mount — race-free, mirroring the /members admin gate.
  beforeLoad: async ({ params }) => {
    let user = null
    try {
      user = await queryClient.ensureQueryData(authMeQueryOptions)
    } catch {
      // Session unconfirmed — treat as not authorized.
    }
    // `role` is the caller's Role in the ACTIVE Team (ADR-0023 §4) — and /t/$slug's gate has
    // already switched to this slug, so it is the Role here. Someone who is an Admin of their other
    // Team is a plain member on this screen.
    if (user?.role !== 'ADMIN') throw redirect({ to: teamRoutes(params.slug).events })
  },
})
