import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { ColdStartSplash } from './ColdStartSplash'

// The boot splash escalates as a cold-start backend wakes. Each of its three time-driven stages is
// a story: elapsed time is an injected prop, so no fake timers are needed — the story just picks a
// moment on the clock and asserts what the user would see then.
const meta = {
  title: 'shared/ColdStartSplash',
  component: ColdStartSplash,
} satisfies Meta<typeof ColdStartSplash>

export default meta

type Story = StoryObj<typeof meta>

// Warm load: just the brand mark, no "waking" copy.
export const Brand: Story = {
  args: { elapsedMs: 0 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Team')).toBeInTheDocument()
    await expect(canvas.queryByText(/rounding up the team/i)).not.toBeInTheDocument()
    await expect(canvas.queryByText(/waking the server/i)).not.toBeInTheDocument()
  },
}

// ~3s in: the warm "rounding up the team" line has appeared.
export const Waking: Story = {
  args: { elapsedMs: 3_000 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/rounding up the team/i)).toBeInTheDocument()
  },
}

// ~6s in: the stage-2 line has rotated to keep the wait feeling like motion.
export const WakingLater: Story = {
  args: { elapsedMs: 7_000 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/almost there/i)).toBeInTheDocument()
  },
}

// ~12s in: past the cold-start threshold, the step indicator has replaced the looped motion.
export const Warming: Story = {
  args: { elapsedMs: 12_000 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Waking the server')).toBeInTheDocument()
    await expect(canvas.getByText(/connecting/i)).toBeInTheDocument()
    await expect(canvas.getByText('Loading your team')).toBeInTheDocument()
    await expect(canvas.getByText(/warming up the court/i)).toBeInTheDocument()
  },
}
