import { createFileRoute } from '@tanstack/react-router'
import { MemberRoster } from '@features/manage-members/ui/MemberRoster'

// The team roster for every authenticated member — no admin gate (the root route already guarantees
// authenticated + onboarded). MemberRoster reads the user's role and renders read-only rows for
// non-admins. The heading stays a literal "Team"; showing the real team name is deferred (F14).
export const Route = createFileRoute('/team/')({
  component: TeamPage,
})

function TeamPage() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-2xl font-bold">Team</h2>
      <MemberRoster />
    </div>
  )
}
