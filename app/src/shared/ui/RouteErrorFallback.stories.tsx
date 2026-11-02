import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { RouteErrorFallback } from './RouteErrorFallback'

// The fallback the router shows when a route load still fails after the chunk-reload guard (Phase 1).
// Prop-only: the retry/logout callbacks come in as props, so it stories with no router or network.
// The escape hatch (ADR-0027 §3) renders only when `onLogout` is passed — the container passes it iff
// a session exists (or might); LoggedOut proves the hatch is absent once the probe says "no user".
//
// One gallery story (ADR-0032 §2) stacks both variants; the Retry/Log out click-throughs are
// behavioural only and live in Interactions.
const meta = {
  title: 'shared/ui/RouteErrorFallback',
  component: RouteErrorFallback,
  args: { onRetry: fn(), onLogout: fn() },
} satisfies Meta<typeof RouteErrorFallback>

export default meta

type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  render: (args) => (
    <Stack
      items={{
        Default: <RouteErrorFallback {...args} />,
        // No session (the auth probe resolved to no user): Retry stands alone, no escape hatch.
        LoggedOut: <RouteErrorFallback {...args} onLogout={undefined} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Default').getByText("Couldn't load this page")).toBeInTheDocument()

    await expect(region('LoggedOut').getByRole('button', { name: /retry/i })).toBeInTheDocument()
    await expect(region('LoggedOut').queryByRole('button', { name: 'Log out' })).not.toBeInTheDocument()
  },
}

// Picture owned by Gallery — behavioural only (ADR-0032 §1).
export const Interactions: Story = {
  // Prop-contract spies: prove Retry and Log out actually reach their callbacks, not merely render.
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /retry/i }))
    await expect(args.onRetry).toHaveBeenCalled()
    await userEvent.click(canvas.getByRole('button', { name: 'Log out' }))
    await expect(args.onLogout).toHaveBeenCalled()
  },
}
