import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { OnboardingHubView } from '@features/onboarding-hub/ui/OnboardingHubView'

export const Route = createFileRoute('/onboarding/')({
  component: OnboardingPage,
  // Set by /auth/verify when a sign-in carried an Invite Link that was no longer live (#342). A
  // search param rather than router state so it survives a reload and so the hub's state is
  // prop-driven — which is what lets it be a story instead of a whole-flow render (ADR-0017).
  validateSearch: (search: Record<string, unknown>): { invite?: 'unavailable' } => ({
    invite: search.invite === 'unavailable' ? 'unavailable' : undefined,
  }),
})

function OnboardingPage() {
  const navigate = useNavigate()
  const { invite } = Route.useSearch()

  return (
    <OnboardingHubView
      onChooseJoin={() => navigate({ to: '/onboarding/join' })}
      onChooseCreate={() => navigate({ to: '/create-team' })}
      inviteUnavailable={invite === 'unavailable'}
    />
  )
}
