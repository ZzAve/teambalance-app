import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { MoneyTeaserView } from './MoneyTeaserView'

// MoneyTeaserView is the prop-only teaser behind the MoneyTeaser container: the vote's on/off state
// and the tap handler come in as props, so both states render with no network (ADR-0017). There is
// no loading/error shell — the page shows no server data (the money feature has no backend yet), so
// its only states are "haven't voted" and "voted".
const meta = {
  title: 'widgets/money-teaser/MoneyTeaserView',
  component: MoneyTeaserView,
  args: { hasVoted: false, onVote: fn() },
} satisfies Meta<typeof MoneyTeaserView>

export default meta

type Story = StoryObj<typeof meta>

// The default state: a coming-soon teaser with the three pillars and the invitation to vote.
export const NotVoted: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: /shared team pot/i })).toBeInTheDocument()
    await expect(canvas.getByText('Coming soon')).toBeInTheDocument()
    // All three pillars are present, in order.
    await expect(canvas.getByText('One shared pot')).toBeInTheDocument()
    await expect(canvas.getByText('Chip in fast')).toBeInTheDocument()
    await expect(canvas.getByText('Every euro tracked')).toBeInTheDocument()
    // The vote is offered and not yet pressed.
    const vote = canvas.getByRole('button', { name: 'I want this' })
    await expect(vote).toBeEnabled()
    await expect(vote).toHaveAttribute('aria-pressed', 'false')
  },
}

// After voting the button flips to a confirmation and is held so the tap can't repeat.
export const Voted: Story = {
  args: { hasVoted: true },
  play: async ({ canvas }) => {
    const vote = canvas.getByRole('button', { name: "You're in!" })
    await expect(vote).toBeDisabled()
    await expect(vote).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByText(/we'll let you know the moment it goes live/i)).toBeInTheDocument()
    // The pre-vote prompt is gone.
    await expect(canvas.queryByRole('button', { name: 'I want this' })).not.toBeInTheDocument()
  },
}

// Prop-contract spy: the vote is the whole interaction, so prove the button actually calls onVote.
export const Voting: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'I want this' }))
    await expect(args.onVote).toHaveBeenCalledTimes(1)
  },
}

// The other half of the contract: once voted, the button is held, so a second tap can't double-fire.
export const AlreadyVotedIsHeld: Story = {
  args: { hasVoted: true },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: "You're in!" }))
    await expect(args.onVote).not.toHaveBeenCalled()
  },
}
