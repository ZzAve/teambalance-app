import { createFileRoute, redirect } from '@tanstack/react-router'
import { authMeQueryOptions } from '@shared/api/auth'
import { queryClient } from '@shared/api/query-client'
import { decideLanding } from '@shared/session/team-entry'

/**
 * The dispatcher: `/` names no Team, so it renders nothing and sends the caller to theirs. It exists
 * because the app's own entry points — the PWA start_url, a bookmark, the post-login redirect —
 * cannot know a slug.
 */
export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const user = await queryClient.ensureQueryData(authMeQueryOptions).catch(() => null)
    if (!user) throw redirect({ to: '/login' })
    throw redirect({ to: decideLanding(user) })
  },
})
