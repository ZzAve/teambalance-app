import { createFileRoute, redirect } from '@tanstack/react-router'
import { authMeQueryOptions } from '@shared/api/auth'
import { queryClient } from '@shared/api/query-client'
import { teamRoutes } from '@shared/lib/team-routes'

/**
 * The dispatcher: `/` names no Team, so it renders nothing and sends the caller to theirs. It exists
 * because the app's own entry points — the PWA start_url, a bookmark, the post-login redirect —
 * cannot know a slug.
 */
export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const user = await queryClient.ensureQueryData(authMeQueryOptions).catch(() => null)
    if (!user) throw redirect({ to: '/login' })
    // Act-as (ADR-0024) is the one case where the Active Team is not a membership, so "teamless"
    // has to be asked with the grant in hand — and a Platform Admin inside no Team belongs on the
    // console, not in onboarding. Mirrors the root gate's third branch.
    if (user.teams.length === 0 && !user.actAs) {
      throw redirect({ to: user.isPlatformAdmin ? '/admin/teams' : '/onboarding' })
    }
    if (!user.activeTeam) throw redirect({ to: '/select-team' })
    throw redirect({ to: teamRoutes(user.activeTeam.slug).events })
  },
})
