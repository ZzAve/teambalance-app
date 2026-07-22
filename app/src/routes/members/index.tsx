import { createFileRoute, redirect } from '@tanstack/react-router'
import { authMeQueryOptions } from '@shared/api/auth'
import { queryClient } from '@shared/api/query-client'
import { MemberRoster } from '@features/manage-members/ui/MemberRoster'

export const Route = createFileRoute('/members/')({
  // Admin-only. Read the same /me query the root guard primed (from cache) and bounce non-admins
  // home before the roster mounts — race-free, unlike reading the zustand store during render.
  beforeLoad: async () => {
    let user = null
    try {
      user = await queryClient.ensureQueryData(authMeQueryOptions)
    } catch {
      // Session unconfirmed — treat as not authorized.
    }
    if (user?.role !== 'ADMIN') throw redirect({ to: '/' })
  },
  component: MemberRoster,
})
