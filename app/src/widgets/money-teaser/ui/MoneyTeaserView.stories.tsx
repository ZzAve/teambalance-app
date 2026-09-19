import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { darkMode } from '../../../../.storybook/modes'
import { MoneyTeaserView } from './MoneyTeaserView'

// MoneyTeaserView is the prop-only teaser behind the MoneyTeaser container: the vote's on/off state
// and the tap handler come in as props, so both states render with no network (ADR-0017). There is
// no loading/error shell — the page shows no server data (the money feature has no backend yet), so
// its only states are "haven't voted" and "voted". There is deliberately no interest count: this view
// never fabricates one.
//
// Not yet shown by any page composite (there is no money page composite), so unlike this file's
// widget siblings its Data story keeps both its snapshot and its dark mode — the money surface and
// its gradients are token-sensitive (ADR-0027 §3) and nothing else currently covers them in dark.
//
// Three-story shape (ADR-0032 §1):
//   1. Data — the default not-voted state, the coming-soon teaser with its three pillars.
//   2. Shells — the voted state, stacked — this stays a separate frame rather than joining Data,
//      since the two are the whole of this View's states and each is its own primary picture.
//   3. Interactions — no picture; the vote firing onVote, and the held button not double-firing.
const meta = {
  title: 'widgets/money-teaser/MoneyTeaserView',
  component: MoneyTeaserView,
  args: { hasVoted: false, onVote: fn() },
  parameters: { chromatic: { modes: darkMode } },
} satisfies Meta<typeof MoneyTeaserView>

export default meta

type Story = StoryObj<typeof meta>

// The default state: a coming-soon teaser with the three pillars and the invitation to vote.
export const Data: Story = {
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
export const Shells: Story = {
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

// Prop-contract spies: the vote is the whole interaction, so prove the button actually calls onVote —
// and that once voted, the button is held, so a second tap can't double-fire. Two instances because
// the held state needs a picture Data never renders.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        'Not voted': <MoneyTeaserView {...args} />,
        Voted: <MoneyTeaserView {...args} hasVoted />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    // The other half of the contract, checked first while onVote is still untouched: the held
    // button doesn't fire, and nothing visible changes.
    await userEvent.click(region('Voted').getByRole('button', { name: 'You want this' }))
    await expect(args.onVote).not.toHaveBeenCalled()

    await userEvent.click(region('Not voted').getByRole('button', { name: 'I want this' }))
    await expect(args.onVote).toHaveBeenCalledTimes(1)
  },
}
