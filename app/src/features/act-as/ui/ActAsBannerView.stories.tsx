import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { ActAsBannerView } from './ActAsBannerView'

const meta = {
  title: 'features/act-as/ActAsBannerView',
  component: ActAsBannerView,
  args: { teamName: 'Tovo Dames 5', onExit: fn() },
} satisfies Meta<typeof ActAsBannerView>

export default meta

type Story = StoryObj<typeof meta>

// The team name is load-bearing, not decoration (ADR-0024 §4): twelve near-identically-named club
// squads is the exact condition under which a season gets prepped into the wrong one.
export const NamesTheTeam: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Tovo Dames 5')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Exit' })).toBeEnabled()
  },
}

export const ExitIsOneClick: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Exit' }))
    await expect(args.onExit).toHaveBeenCalled()
  },
}

export const Exiting: Story = {
  args: { isExiting: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Exit' })).toBeDisabled()
  },
}

// Not acting as anyone: nothing at all, so an ordinary Member never sees a banner-shaped gap.
export const NotActingAs: Story = {
  args: { teamName: null },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Exit' })).not.toBeInTheDocument()
  },
}
