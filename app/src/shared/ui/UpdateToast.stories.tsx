import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { UpdateToast } from './UpdateToast'

// The update-available prompt (Phase 3), shown only when a deploy lands while the user is mid-session
// with unsaved / in-flight state. Prop-only: hidden vs shown and the reload callback are props, so it
// renders with no service worker.
const meta = {
  title: 'shared/ui/UpdateToast',
  component: UpdateToast,
  args: { show: true, onReload: fn() },
} satisfies Meta<typeof UpdateToast>

export default meta

type Story = StoryObj<typeof meta>

export const Hidden: Story = {
  args: { show: false },
  play: async ({ canvasElement }) => {
    // Nothing to nudge yet — the toast renders nothing rather than an empty bar.
    await expect(within(canvasElement).queryByRole('alert')).not.toBeInTheDocument()
  },
}

export const Shown: Story = {
  // Prop-contract spy: proves Reload actually reaches onReload, not merely that the bar renders.
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText(/new version is available/i)).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: /reload/i }))
    await expect(args.onReload).toHaveBeenCalled()
  },
}
