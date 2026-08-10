import { createFileRoute } from '@tanstack/react-router'
import { MemberRoster } from '@features/manage-members/ui/MemberRoster'
import { TeamHeader } from '@widgets/team-header/ui/TeamHeader'
import { useUserStore } from '@shared/stores/user-store'

// The team roster for every authenticated member — no admin gate (the root route already guarantees
// authenticated + onboarded). Read-only for everyone, admins included: this is the view surface.
// Member management lives on the admin-gated /team/settings, reached via the gear in the header
// (below, admin-only) — the entry point under the new tab-bar nav.
export const Route = createFileRoute('/team/')({
  component: TeamPage,
})

function TeamPage() {
  const isAdmin = useUserStore((s) => s.role) === 'ADMIN'

  return (
    <div className="flex flex-col gap-6">
      <TeamHeader isAdmin={isAdmin} />
      <MemberRoster canManage={false} />
    </div>
  )
}
