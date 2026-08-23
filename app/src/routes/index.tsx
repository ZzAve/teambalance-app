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
    if (user.teams.length === 0) throw redirect({ to: '/onboarding' })
    if (!user.activeTeam) throw redirect({ to: '/select-team' })
    throw redirect({ to: teamRoutes(user.activeTeam.slug).events })
  },
})
