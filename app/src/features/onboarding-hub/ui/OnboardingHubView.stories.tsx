import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { OnboardingHubView } from './OnboardingHubView'

// OnboardingHubView is the presentational fork behind /onboarding: a teamless, authenticated user
// chooses to join an existing team (the common path) or create one (rare, code-gated). Pure prop-only
// view — the route container owns navigation.
const meta = {
  title: 'features/onboarding-hub/OnboardingHubView',
  component: OnboardingHubView,
  args: { onChooseJoin: fn(), onChooseCreate: fn() },
} satisfies Meta<typeof OnboardingHubView>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: /Welcome to TeamBalance/ })).toBeInTheDocument()
    await expect(canvas.getByText(/You're signed in, but not on a team yet/)).toBeInTheDocument()
  },
}

// The state a joiner lands in when the Invite Link they signed in from expired or was rotated before
// they clicked the email (#342). Its own picture, because the difference from Default is the whole
// point: the sign-in worked, and only the invite half failed.
export const InviteUnavailable: Story = {
  args: { inviteUnavailable: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/invite link you used has expired or been replaced/)).toBeInTheDocument()
    // The recovery route stays reachable — this is a detour, not a dead end.
    await expect(canvas.getByRole('button', { name: /^I have an invite/ })).toBeInTheDocument()
  },
}

export const ChooseJoin: Story = {
  // Behavioural twin of Default — onChooseJoin fires; the fork picture is unchanged (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    // The accessible name includes the helper text, so match by substring rather than exact.
    await userEvent.click(canvas.getByRole('button', { name: /^I have an invite/ }))
    await expect(args.onChooseJoin).toHaveBeenCalled()
  },
}

export const ChooseCreate: Story = {
  // Behavioural twin of Default — onChooseCreate fires; the fork picture is unchanged (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /^Create a team/ }))
    await expect(args.onChooseCreate).toHaveBeenCalled()
  },
}
