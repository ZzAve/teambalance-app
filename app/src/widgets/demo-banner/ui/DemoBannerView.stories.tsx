import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { DemoBannerView } from './DemoBannerView'

// The permanent banner of the demo build (ADR-0043). Presentational: the logout and the redirect live in the container.
// Three-story shape (ADR-0032 §1): Data (the banner), Shells (switching, and the picker without the button),
// Interactions (the role switch reaches onSwitchRole).
const meta = {
  title: 'widgets/demo-banner/DemoBannerView',
  component: DemoBannerView,
  args: { startTeamHref: 'mailto:teams@teambalance.nl', onSwitchRole: fn() },
} satisfies Meta<typeof DemoBannerView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('complementary', { name: 'Demo' })).toHaveTextContent(
      'This is a demo — data is wiped every hour',
    )
    await expect(canvas.getByRole('link', { name: 'Start your own team' })).toHaveAttribute(
      'href',
      'mailto:teams@teambalance.nl',
    )
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Switching: <DemoBannerView {...args} isSwitching />,
        // On the picker there is no role to leave, so no button.
        'On the picker': <DemoBannerView {...args} onSwitchRole={undefined} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('button', { name: 'Switch role' })).toHaveLength(1)
    await expect(canvas.getByRole('button', { name: 'Switch role' })).toBeDisabled()
  },
}

export const Interactions: Story = {
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole('complementary', { name: 'Demo' })).toHaveTextContent(
      'This is a demo — data is wiped every hour',
    )
    await expect(canvas.getByRole('link', { name: 'Start your own team' })).toHaveAttribute(
      'href',
      args.startTeamHref,
    )
    await expect(args.onSwitchRole).not.toHaveBeenCalled()
    await userEvent.click(canvas.getByRole('button', { name: 'Switch role' }))
    await expect(args.onSwitchRole).toHaveBeenCalledWith()
  },
}
