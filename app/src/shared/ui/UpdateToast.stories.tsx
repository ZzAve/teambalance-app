import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { UpdateToast } from './UpdateToast'

// The update-available prompt (Phase 3), shown only when a deploy lands while the user is mid-session
// with unsaved / in-flight state. Prop-only: hidden vs shown and the reload callback are props, so it
// renders with no service worker.
//
// One gallery story (ADR-0032 §2) stacks both variants — the hidden assertion (renders nothing rather
// than an empty bar) folds into this play; the Reload click-through is behavioural only and lives in
// Interactions.
const meta = {
  title: 'shared/ui/UpdateToast',
  component: UpdateToast,
  args: { show: true, onReload: fn() },
} satisfies Meta<typeof UpdateToast>

export default meta

type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  render: () => (
    <Stack
      items={{
        Hidden: <UpdateToast show={false} onReload={fn()} />,
        Shown: <UpdateToast show onReload={fn()} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    // Nothing to nudge yet — the toast renders nothing rather than an empty bar.
    await expect(region('Hidden').queryByRole('alert')).not.toBeInTheDocument()

    await expect(region('Shown').getByText(/new version is available/i)).toBeInTheDocument()
  },
}

// Picture owned by Gallery — behavioural only (ADR-0032 §1).
export const Interactions: Story = {
  // Prop-contract spy: proves Reload actually reaches onReload, not merely that the bar renders.
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /reload/i }))
    await expect(args.onReload).toHaveBeenCalled()
  },
}
