import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { EventTypeIcon } from './EventTypeIcon'

// Leaf presentational icon: maps a known type name to a lucide icon (Training/Match/Tournament/
// Social) and falls back to a Calendar for anything unknown. lucide renders a per-icon class
// (e.g. `.lucide-dumbbell`), so each mapping branch is directly assertable. The `size` prop swaps
// the wrapper dimensions (h-9 for sm, h-11 for md).
//
// One gallery story (ADR-0031 §2): every variant side by side, one picture, every branch asserted.
const VARIANTS = {
  training: { type: { id: 'et-1', name: 'Training', color: '#22c55e' } },
  match: { type: { id: 'et-2', name: 'Match', color: '#3b82f6' } },
  tournament: { type: { id: 'et-3', name: 'Tournament', color: '#f59e0b' } },
  social: { type: { id: 'et-4', name: 'Social', color: '#ec4899' } },
  unknown: { type: { id: 'et-5', name: 'Beach Cleanup', color: undefined } },
  small: { type: { id: 'et-1', name: 'Training', color: '#22c55e' }, size: 'sm' as const },
}

const meta = {
  title: 'entities/event/EventTypeIcon',
  component: EventTypeIcon,
} satisfies Meta<typeof EventTypeIcon>

export default meta

type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  args: VARIANTS.training,
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {Object.entries(VARIANTS).map(([name, props]) => (
        <div key={name} data-testid={`variant-${name}`}>
          <EventTypeIcon {...props} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const variant = (name: keyof typeof VARIANTS) => canvas.getByTestId(`variant-${name}`)
    await expect(variant('training').querySelector('.lucide-dumbbell')).toBeInTheDocument()
    await expect(variant('match').querySelector('.lucide-swords')).toBeInTheDocument()
    await expect(variant('tournament').querySelector('.lucide-trophy')).toBeInTheDocument()
    await expect(variant('social').querySelector('.lucide-party-popper')).toBeInTheDocument()
    // Unmapped type → Calendar fallback.
    await expect(variant('unknown').querySelector('.lucide-calendar')).toBeInTheDocument()
    // The sm variant uses a 36px (h-9) wrapper rather than the default 44px (h-11).
    await expect(variant('small').querySelector('.h-9')).toBeInTheDocument()
    await expect(variant('small').querySelector('.h-11')).not.toBeInTheDocument()
  },
}
