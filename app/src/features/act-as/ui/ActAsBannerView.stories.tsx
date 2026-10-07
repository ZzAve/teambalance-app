import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { ActAsBannerView } from './ActAsBannerView'

// The persistent act-as banner (ADR-0024 §4). The team name is load-bearing, not decoration: twelve
// near-identically-named club squads is the exact condition under which a season gets prepped into
// the wrong one. Presentational — the grant and the exit mutation live in the container.
//
// Three-story shape (ADR-0032 §1):
//   1. Data — the one populated live instance, naming the team.
//   2. Shells — the exiting and not-acting-as states, stacked in one frame.
//   3. Interactions — no picture; the Exit click, keeping the onExit spy assertion.
const meta = {
  title: 'features/act-as/ActAsBannerView',
  component: ActAsBannerView,
  args: { teamName: 'Tovo Dames 5', onExit: fn() },
} satisfies Meta<typeof ActAsBannerView>

export default meta

type Story = StoryObj<typeof meta>

// The team name is load-bearing, not decoration (ADR-0024 §4): twelve near-identically-named club
// squads is the exact condition under which a season gets prepped into the wrong one.
export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status', { name: 'Acting as the platform' })).toHaveTextContent('Tovo Dames 5')
    await expect(canvas.getByRole('button', { name: 'Exit' })).toBeEnabled()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Exiting: <ActAsBannerView {...args} isExiting />,
        // Not acting as anyone: nothing at all, so an ordinary Member never sees a banner-shaped gap.
        'Not acting as': <ActAsBannerView {...args} teamName={null} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Exiting').getByRole('button', { name: 'Exit' })).toBeDisabled()

    await expect(region('Not acting as').queryByRole('status')).not.toBeInTheDocument()
    await expect(region('Not acting as').queryByRole('button', { name: 'Exit' })).not.toBeInTheDocument()
  },
}

// Picture owned by Data — behavioural only (ADR-0032 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Exit' }))
    await expect(args.onExit).toHaveBeenCalled()
  },
}
