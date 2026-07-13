import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { EventTypeIcon } from './EventTypeIcon'

// Leaf presentational icon: maps a known type name to a lucide icon (Training/Match/Tournament/
// Social) and falls back to a Calendar for anything unknown. lucide renders a per-icon class
// (e.g. `.lucide-dumbbell`), so each mapping branch is directly assertable. The `size` prop swaps
// the wrapper dimensions (h-9 for sm, h-11 for md).
const meta = {
  title: 'entities/event/EventTypeIcon',
  component: EventTypeIcon,
} satisfies Meta<typeof EventTypeIcon>

export default meta

type Story = StoryObj<typeof meta>

export const Training: Story = {
  args: { type: { id: 'et-1', name: 'Training', color: '#22c55e' } },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.lucide-dumbbell')).toBeInTheDocument()
  },
}

export const Match: Story = {
  args: { type: { id: 'et-2', name: 'Match', color: '#3b82f6' } },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.lucide-swords')).toBeInTheDocument()
  },
}

export const Tournament: Story = {
  args: { type: { id: 'et-3', name: 'Tournament', color: '#f59e0b' } },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.lucide-trophy')).toBeInTheDocument()
  },
}

export const Social: Story = {
  args: { type: { id: 'et-4', name: 'Social', color: '#ec4899' } },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.lucide-party-popper')).toBeInTheDocument()
  },
}

export const UnknownFallback: Story = {
  args: { type: { id: 'et-5', name: 'Beach Cleanup', color: undefined } },
  play: async ({ canvasElement }) => {
    // Unmapped type → Calendar fallback.
    await expect(canvasElement.querySelector('.lucide-calendar')).toBeInTheDocument()
  },
}

export const Small: Story = {
  args: { type: { id: 'et-1', name: 'Training', color: '#22c55e' }, size: 'sm' },
  play: async ({ canvasElement }) => {
    // The sm variant uses a 36px (h-9) wrapper rather than the default 44px (h-11).
    await expect(canvasElement.querySelector('.h-9')).toBeInTheDocument()
    await expect(canvasElement.querySelector('.h-11')).not.toBeInTheDocument()
  },
}
