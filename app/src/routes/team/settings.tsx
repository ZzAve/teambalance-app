import { createFileRoute, redirect } from '@tanstack/react-router'
import { authMeQueryOptions } from '@shared/api/auth'
import { queryClient } from '@shared/api/query-client'
import { MemberRoster } from '@features/manage-members/ui/MemberRoster'
import { TeamSettings } from '@features/team-settings/ui/TeamSettings'
import { ManagePositions } from '@features/manage-positions/ui/ManagePositions'

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
  // Admin manage surface: member management (the editable roster), then positions, then team
  // settings. The read-only view of the same roster lives on /team.
  return (
    <div className="flex flex-col gap-10">
      <MemberRoster canManage />
      <ManagePositions />
      <TeamSettings />
    </div>
  )
}
