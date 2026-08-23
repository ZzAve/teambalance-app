import { createFileRoute } from '@tanstack/react-router'
import { MemberRoster } from '@features/manage-members/ui/MemberRoster'
import { GenerateInviteDialog } from '@features/generate-invite/ui/GenerateInviteDialog'
import { ActAsRecords } from '@features/act-as/ui/ActAsRecords'
import { TeamHeader } from '@widgets/team-header/ui/TeamHeader'
import { useUserStore } from '@shared/stores/user-store'

// The team roster for every authenticated member — no admin gate (the root route already guarantees
// authenticated + onboarded). Read-only for everyone, admins included: this is the view surface.
// Admins additionally get the invite link + the gear in the header (below) linking into
// /team/settings, where member management lives — the team actions on the team screen, under the
// new tab-bar nav.
export const Route = createFileRoute('/t/$slug/team/')({
  component: TeamPage,
})

function TeamPage() {
  const isAdmin = useUserStore((s) => s.role) === 'ADMIN'

  return (
    <div className="flex flex-col gap-6">
      <TeamHeader isAdmin={isAdmin} actions={<GenerateInviteDialog />} />
      <MemberRoster canManage={false} />
      {/* Visible to every member, not gated behind /team/settings: the point of the Act-as Record is
          that the TEAM can read it, not that its admin can (ADR-0024 §4). */}
      <ActAsRecords />
    </div>
  )
}
