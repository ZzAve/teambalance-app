import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { EventDetailSkeleton } from './EventDetailSkeleton'

// The loading placeholder for the event detail route. It renders a labelled status region (no
// network) so screen readers announce "Loading event" and Chromatic baselines the shimmer layout.
const meta = {
  title: 'entities/event/EventDetailSkeleton',
  component: EventDetailSkeleton,
} satisfies Meta<typeof EventDetailSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status', { name: /loading event/i })).toBeInTheDocument()
  },
}
