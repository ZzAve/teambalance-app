import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { OnboardingHubView } from './OnboardingHubView'

// OnboardingHubView is the presentational fork behind /onboarding: a teamless, authenticated user
// chooses to join an existing team (the common path) or create one (rare, code-gated). Pure prop-only
// view — the route container owns navigation.
//
// Three-story shape (ADR-0032 §1): the invite-unavailable banner (#342) is the one static shell this
// View now has, so Data + Shells + Interactions.
//   1. Data — the one instance, and the picture of this View.
//   2. Shells — the invite-unavailable state, in its own frame: the sign-in worked and only the
//      invite half failed, which is the whole point of the banner, so it keeps its own picture rather
//      than sharing Data's.
//   3. Interactions — no picture; both forks, keeping the onChooseJoin/onChooseCreate spy assertions.
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

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        // The state a joiner lands in when the Invite Link they signed in from expired or was
        // rotated before they clicked the email (#342). Its own picture, because the difference from
        // Default is the whole point: the sign-in worked, and only the invite half failed.
        'Invite unavailable': <OnboardingHubView {...args} inviteUnavailable />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = within(canvas.getByRole('region', { name: 'Invite unavailable' }))
    await expect(
      region.getByText(/invite link you used has expired or been replaced/),
    ).toBeInTheDocument()
    // The recovery route stays reachable — this is a detour, not a dead end.
    await expect(region.getByRole('button', { name: /^I have an invite/ })).toBeInTheDocument()
  },
}

// Picture owned by Data — behavioural only (ADR-0032 §1).
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
