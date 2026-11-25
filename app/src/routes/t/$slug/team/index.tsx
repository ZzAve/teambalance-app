import { createFileRoute } from '@tanstack/react-router'
import { MemberRoster } from '@features/manage-members/ui/MemberRoster'
import { SubstituteRoster } from '@features/manage-substitutes/ui/SubstituteRoster'
import { GenerateInviteDialog } from '@features/generate-invite/ui/GenerateInviteDialog'
import { TeamPageView } from '@pages/team/ui/TeamPageView'
import { BulletinBoard } from '@features/bulletin-board/ui/BulletinBoard'
import { useCurrentUser } from '@shared/api/auth'

// The team page for every authenticated member — no admin gate (the root route already guarantees
// authenticated + onboarded). The faces are the same for everyone; admins also get the invite row
// and the row into /team/settings, and edit a person on that person's page.
export const Route = createFileRoute('/t/$slug/team/')({
  component: TeamPage,
})

function TeamPage() {
  const isAdmin = useCurrentUser()?.role === 'ADMIN'

  return (
    <TeamPageView
      isAdmin={isAdmin}
      bulletin={<BulletinBoard isAdmin={isAdmin} />}
      invite={(trigger) => <GenerateInviteDialog trigger={trigger} />}
      roster={<MemberRoster />}
      substitutes={<SubstituteRoster />}
    />
  )
}
