import { createFileRoute, redirect } from '@tanstack/react-router'
import { authMeQueryOptions } from '@shared/api/auth'
import { queryClient } from '@shared/api/query-client'
import { teamRoutes } from '@shared/lib/team-routes'
import { MemberRoster } from '@features/manage-members/ui/MemberRoster'
import { TeamSettings } from '@features/team-settings/ui/TeamSettings'
import { ManagePositions } from '@features/manage-positions/ui/ManagePositions'
import { HandoverAdmin } from '@features/handover-admin/ui/HandoverAdmin'
import { ActAsRecords } from '@features/act-as/ui/ActAsRecords'

export const Route = createFileRoute('/t/$slug/team/settings')({
  // Admin-only. Read the same /me query the root guard primed (from cache) and bounce non-admins
  // home before the settings mount — race-free, mirroring the /members admin gate.
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
  component: TeamSettingsPage,
})

function TeamSettingsPage() {
  // Admin manage surface: member management (the editable roster), then positions, then team
  // settings, then platform access. The read-only view of the same roster lives on /team.
  return (
    <div className="flex flex-col gap-10">
      <MemberRoster canManage />
      <ManagePositions />
      <TeamSettings />
      {/* Handing over admin (ADR-0024 §5): how a prepared, memberless team gets its first real Admin.
          Below the day-to-day settings — it is a one-off, not a routine control. */}
      <HandoverAdmin />
      {/* Admin-only, and last: platform access is rare and, to someone who has never heard of it,
          alarming out of context. It sits below the settings an Admin actually came here for. */}
      <ActAsRecords />
    </div>
  )
}
