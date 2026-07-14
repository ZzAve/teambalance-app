import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { EventTypeBadge } from './EventTypeBadge'

// Leaf presentational badge: renders the type name tinted by its colour, falling back to a neutral
// grey when the type has no colour. Two args cover both branches.
const meta = {
  title: 'entities/event/EventTypeBadge',
  component: EventTypeBadge,
} satisfies Meta<typeof EventTypeBadge>

export default meta

type Story = StoryObj<typeof meta>

export const WithColor: Story = {
  args: { type: { id: 'et-1', name: 'Match', color: '#3b82f6' } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Match')).toBeInTheDocument()
  },
}

export const WithoutColor: Story = {
  args: { type: { id: 'et-2', name: 'Social', color: undefined } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Social')).toBeInTheDocument()
  },
}
