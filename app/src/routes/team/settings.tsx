import { createFileRoute, redirect } from '@tanstack/react-router'
import { authMeQueryOptions } from '@shared/api/auth'
import { queryClient } from '@shared/api/query-client'
import { TeamSettings } from '@features/team-settings/ui/TeamSettings'

export const Route = createFileRoute('/team/settings')({
  // Admin-only. Read the same /me query the root guard primed (from cache) and bounce non-admins
  // home before the settings mount — race-free, mirroring the /members admin gate.
  beforeLoad: async () => {
    let user = null
    try {
      user = await queryClient.ensureQueryData(authMeQueryOptions)
    } catch {
      // Session unconfirmed — treat as not authorized.
    }
    if (user?.role !== 'ADMIN') throw redirect({ to: '/' })
  },
  component: TeamSettingsPage,
})

function TeamSettingsPage() {
  return (
    <div className="flex flex-col gap-10">
      <TeamSettings />
    </div>
  )
}
