import { createFileRoute, redirect } from '@tanstack/react-router'
import { authMeQueryOptions } from '@shared/api/auth'
import { queryClient } from '@shared/api/query-client'
import { teamRoutes } from '@shared/lib/team-routes'
import { MemberRoster } from '@features/manage-members/ui/MemberRoster'
import { TeamSettings } from '@features/team-settings/ui/TeamSettings'
import { MoneySettings } from '@features/money-settings/ui/MoneySettings'
import { ConnectBunq } from '@features/connect-bunq/ui/ConnectBunq'
import { parseBunqResult, type ConnectBunqResult } from '@features/connect-bunq/lib/bunq-result'
import { ManagePositions } from '@features/manage-positions/ui/ManagePositions'
import { ManageSubstitutes } from '@features/manage-substitutes/ui/ManageSubstitutes'
import { ManageEventTypes } from '@features/manage-event-types/ui/ManageEventTypes'
import { HandoverAdmin } from '@features/handover-admin/ui/HandoverAdmin'
import { ActAsRecords } from '@features/act-as/ui/ActAsRecords'

export const Route = createFileRoute('/t/$slug/team/settings')({
  // `?bunq=` is how the API's Bunq callback reports the end of a connection attempt; anything else is dropped.
  validateSearch: (search: Record<string, unknown>): { bunq?: ConnectBunqResult } => ({
    bunq: parseBunqResult(search.bunq),
  }),
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
  const { bunq } = Route.useSearch()
  // Admin manage surface: member management (the editable roster), then positions, then the Team's
  // Substitutes (who hold those positions), then the event types whose roster defaults reference
  // those positions, then team settings, then the money pool, then platform access.
  // Event types come after positions deliberately — a roster default is authored in terms of the
  // vocabulary above it. The read-only view of the same roster lives on /team.
  return (
    <div className="flex flex-col gap-10">
      <MemberRoster canManage />
      <ManagePositions />
      <ManageSubstitutes canManage />
      <ManageEventTypes />
      <TeamSettings />
      <MoneySettings />
      <ConnectBunq result={bunq} />
      {/* Handing over admin (ADR-0024 §5): how a prepared, memberless team gets its first real Admin.
          Below the day-to-day settings — it is a one-off, not a routine control. */}
      <HandoverAdmin />
      {/* Admin-only, and last: platform access is rare and, to someone who has never heard of it,
          alarming out of context. It sits below the settings an Admin actually came here for. */}
      <ActAsRecords />
    </div>
  )
}
