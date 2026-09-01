import { createFileRoute, Link } from '@tanstack/react-router'
import { PlatformTeams } from '@features/act-as/ui/PlatformTeams'
import { CreateMemberlessTeam } from '@features/create-memberless-team/ui/CreateMemberlessTeam'

// The platform console (ADR-0024 §6), beside /admin/creation-codes under the same `/admin` group —
// same allowlist, same PlatformAdminGateway, no new auth surface. Authorization is enforced
// server-side: the endpoints 403 for non-Platform Admins and the container renders a no-access
// shell. This is also where the root gate sends a teamless Platform Admin, instead of /onboarding.
export const Route = createFileRoute('/admin/teams')({
  component: PlatformTeamsPage,
})

function PlatformTeamsPage() {
  return (
    <div className="flex flex-col gap-8">
      <CreateMemberlessTeam />
      <PlatformTeams />
      <Link to="/admin/creation-codes" className="text-sm font-semibold text-blue hover:underline">
        Creation codes
      </Link>
    </div>
  )
}
