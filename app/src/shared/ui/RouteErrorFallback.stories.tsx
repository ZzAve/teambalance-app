import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { RouteErrorFallback } from './RouteErrorFallback'

// The fallback the router shows when a route load still fails after the chunk-reload guard (Phase 1).
// Prop-only: the retry callback comes in as a prop, so it stories with no router or network.
const meta = {
  title: 'shared/ui/RouteErrorFallback',
  component: RouteErrorFallback,
  args: { onRetry: fn() },
} satisfies Meta<typeof RouteErrorFallback>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  // Prop-contract spy: proves Retry actually reaches onRetry, not merely that the shell renders.
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText("Couldn't load this page")).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: /retry/i }))
    await expect(args.onRetry).toHaveBeenCalled()
  },
}
