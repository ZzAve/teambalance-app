import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { allModes } from '../../../../.storybook/modes'
import { MoneyTeaserView } from './MoneyTeaserView'

// MoneyTeaserView is the prop-only teaser behind the MoneyTeaser container: the vote's on/off state
// and the tap handler come in as props, so both states render with no network (ADR-0017). There is
// no loading/error shell — the page shows no server data (the money feature has no backend yet), so
// its only states are "haven't voted" and "voted". There is deliberately no interest count: this view
// never fabricates one.
// Token-sensitive component (ADR-0027 §3): the money surface and its gradients, so modes at the
// meta level give every state a light *and* a dark baseline.
const meta = {
  title: 'widgets/money-teaser/MoneyTeaserView',
  component: MoneyTeaserView,
  args: { hasVoted: false, onVote: fn() },
  parameters: { chromatic: { modes: { light: allModes.light, dark: allModes.dark } } },
} satisfies Meta<typeof MoneyTeaserView>

export default meta

type Story = StoryObj<typeof meta>

// The default state: a coming-soon teaser with the three pillars and the invitation to vote.
export const NotVoted: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: /shared team pot/i })).toBeInTheDocument()
    // All three pillars are present, in order.
    await expect(canvas.getByText('One shared pot')).toBeInTheDocument()
    await expect(canvas.getByText('Chip in fast')).toBeInTheDocument()
    await expect(canvas.getByText('Every euro tracked')).toBeInTheDocument()
    // The vote is offered and not yet pressed.
    const vote = canvas.getByRole('button', { name: 'I want this' })
    await expect(vote).toBeEnabled()
    await expect(vote).toHaveAttribute('aria-pressed', 'false')
    await expect(canvas.getByText(/tap to let us know/i)).toBeInTheDocument()
  },
}

// After voting the button flips to a confirmation and is held so the tap can't repeat. No number is
// shown before or after — just the honest per-device toggle and a plain confirmation line.
export const Voted: Story = {
  args: { hasVoted: true },
  play: async ({ canvas }) => {
    const vote = canvas.getByRole('button', { name: 'You want this' })
    await expect(vote).toBeDisabled()
    await expect(vote).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByText(/noted — we'll let the team know when the pot is ready/i)).toBeInTheDocument()
    // The pre-vote prompt is gone.
    await expect(canvas.queryByRole('button', { name: 'I want this' })).not.toBeInTheDocument()
  },
}

// Prop-contract spy: the vote is the whole interaction, so prove the button actually calls onVote.
export const Voting: Story = {
  // Behavioural twin of NotVoted — controlled `hasVoted: false`, so the tap reports to onVote
  // without changing the picture (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'I want this' }))
    await expect(args.onVote).toHaveBeenCalledTimes(1)
  },
}

// The other half of the contract: once voted, the button is held, so a second tap can't double-fire.
export const AlreadyVotedIsHeld: Story = {
  // Behavioural twin of Voted — the held button doesn't fire, and nothing visible changes
  // (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  args: { hasVoted: true },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'You want this' }))
    await expect(args.onVote).not.toHaveBeenCalled()
  },
}
