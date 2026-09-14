import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { ColdStartSplash } from './ColdStartSplash'

// The boot splash escalates as a cold-start backend wakes. Each of its three time-driven stages is
// a moment on an injected `elapsedMs` clock, so no fake timers are needed — the story just picks a
// moment on the clock and asserts what the user would see then.
//
// One gallery story (ADR-0031 §2): every stage stacked in one frame, one picture, each stage's
// assertions scoped to its labelled region.
const meta = {
  title: 'shared/ColdStartSplash',
  component: ColdStartSplash,
} satisfies Meta<typeof ColdStartSplash>

export default meta

type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  render: () => (
    <Stack
      items={{
        // Warm load: just the brand mark, no "waking" copy.
        Brand: <ColdStartSplash elapsedMs={0} />,
        // ~3s in: the warm "rounding up the team" line has appeared.
        Waking: <ColdStartSplash elapsedMs={3_000} />,
        // ~6s in: the stage-2 line has rotated to keep the wait feeling like motion.
        WakingLater: <ColdStartSplash elapsedMs={7_000} />,
        // ~12s in: past the cold-start threshold, the step indicator has replaced the looped motion.
        Warming: <ColdStartSplash elapsedMs={12_000} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Brand').getByText('Team')).toBeInTheDocument()
    await expect(region('Brand').queryByText(/rounding up the team/i)).not.toBeInTheDocument()
    await expect(region('Brand').queryByText(/waking the server/i)).not.toBeInTheDocument()

    await expect(region('Waking').getByText(/rounding up the team/i)).toBeInTheDocument()

    await expect(region('WakingLater').getByText(/almost there/i)).toBeInTheDocument()

    await expect(region('Warming').getByText('Waking the server')).toBeInTheDocument()
    await expect(region('Warming').getByText(/connecting/i)).toBeInTheDocument()
    await expect(region('Warming').getByText('Loading your team')).toBeInTheDocument()
    await expect(region('Warming').getByText(/warming up the court/i)).toBeInTheDocument()
  },
}
