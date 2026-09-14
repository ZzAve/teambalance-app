import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { OnboardingHubView } from './OnboardingHubView'

// OnboardingHubView is the presentational fork behind /onboarding: a teamless, authenticated user
// chooses to join an existing team (the common path) or create one (rare, code-gated). Pure prop-only
// view — the route container owns navigation.
//
// Two-story shape (ADR-0031 §1): there is no non-data shell here (no loading/error/empty branch), so
// Data + Interactions is enough.
//   1. Data — the one instance, and the picture of this View.
//   2. Interactions — no picture; both forks, keeping the onChooseJoin/onChooseCreate spy assertions.
const meta = {
  title: 'features/onboarding-hub/OnboardingHubView',
  component: OnboardingHubView,
  args: { onChooseJoin: fn(), onChooseCreate: fn() },
} satisfies Meta<typeof OnboardingHubView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: /Welcome to TeamBalance/ })).toBeInTheDocument()
    await expect(canvas.getByText(/You're signed in, but not on a team yet/)).toBeInTheDocument()
  },
}

// Picture owned by Data — behavioural only (ADR-0031 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    // The accessible name includes the helper text, so match by substring rather than exact.
    await userEvent.click(canvas.getByRole('button', { name: /^I have an invite/ }))
    await expect(args.onChooseJoin).toHaveBeenCalled()

    await userEvent.click(canvas.getByRole('button', { name: /^Create a team/ }))
    await expect(args.onChooseCreate).toHaveBeenCalled()
  },
}
