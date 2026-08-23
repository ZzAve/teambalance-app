import { createFileRoute, redirect } from '@tanstack/react-router'
import { authMeQueryOptions } from '@shared/api/auth'
import { queryClient } from '@shared/api/query-client'
import { teamRoutes } from '@shared/lib/team-routes'

/**
 * The dispatcher. `/` names no Team, so it renders nothing — it answers "which Team am I in?" and
 * sends the caller there.
 *
 * It exists because team-scoped screens live under `/t/:slug/…` (ADR-0023 §2) while the app's own
 * entry points — the installed PWA's start_url, a bookmark, the post-login redirect — cannot know a
 * slug. Resolving that here, from the Active Team the server already decided, keeps every one of
 * them a plain `/`.
 *
 * Three outcomes, matching the three states `/auth/me` can report (ADR-0023 §4): an Active Team, so
 * go there; no Teams at all, so onboarding; several Teams and none active, which is not an error but
 * a choice the caller has to make.
 */
export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    // The root guard already confirmed the session and primed this query; read it back from cache.
    const user = await queryClient.ensureQueryData(authMeQueryOptions).catch(() => null)
    if (!user) throw redirect({ to: '/login' })
    if (user.teams.length === 0) throw redirect({ to: '/onboarding' })
    if (!user.activeTeam) throw redirect({ to: '/select-team' })
    throw redirect({ to: teamRoutes(user.activeTeam.slug).events })
  },
})
