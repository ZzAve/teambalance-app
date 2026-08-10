import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { OnboardingHubView } from '@features/onboarding-hub/ui/OnboardingHubView'

export const Route = createFileRoute('/onboarding/')({
  component: OnboardingPage,
})

function OnboardingPage() {
  const navigate = useNavigate()

  return (
    <OnboardingHubView
      onChooseJoin={() => navigate({ to: '/onboarding/join' })}
      onChooseCreate={() => navigate({ to: '/create-team' })}
    />
  )
}
