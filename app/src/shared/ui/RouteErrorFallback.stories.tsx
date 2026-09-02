import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { RouteErrorFallback } from './RouteErrorFallback'

// The fallback the router shows when a route load still fails after the chunk-reload guard (Phase 1).
// Prop-only: the retry/logout callbacks come in as props, so it stories with no router or network.
// The escape hatch (ADR-0027 §3) renders only when `onLogout` is passed — the container passes it iff
// a session exists (or might); LoggedOut proves the hatch is absent once the probe says "no user".
const meta = {
  title: 'shared/ui/RouteErrorFallback',
  component: RouteErrorFallback,
  args: { onRetry: fn(), onLogout: fn() },
} satisfies Meta<typeof RouteErrorFallback>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  // Prop-contract spies: prove Retry and Log out actually reach their callbacks, not merely render.
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText("Couldn't load this page")).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: /retry/i }))
    await expect(args.onRetry).toHaveBeenCalled()
    await userEvent.click(canvas.getByRole('button', { name: 'Log out' }))
    await expect(args.onLogout).toHaveBeenCalled()
  },
}

// No session (the auth probe resolved to no user): Retry stands alone, no escape hatch.
export const LoggedOut: Story = {
  args: { onLogout: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Log out' })).not.toBeInTheDocument()
  },
}
