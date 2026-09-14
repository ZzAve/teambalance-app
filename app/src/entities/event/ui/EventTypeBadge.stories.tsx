import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { EventTypeBadge } from './EventTypeBadge'

// Leaf presentational badge: renders the type name tinted by its colour, falling back to a neutral
// grey when the type has no colour.
//
// One gallery story (ADR-0031 §2): both branches side by side, one picture, both asserted.
const VARIANTS = {
  withColor: { type: { id: 'et-1', name: 'Match', color: '#3b82f6' } },
  withoutColor: { type: { id: 'et-2', name: 'Social', color: undefined } },
}

const meta = {
  title: 'entities/event/EventTypeBadge',
  component: EventTypeBadge,
} satisfies Meta<typeof EventTypeBadge>

export default meta

type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  args: VARIANTS.withColor,
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {Object.entries(VARIANTS).map(([name, props]) => (
        <div key={name} data-testid={`variant-${name}`}>
          <EventTypeBadge {...props} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const variant = (name: keyof typeof VARIANTS) => within(canvas.getByTestId(`variant-${name}`))
    await expect(variant('withColor').getByText('Match')).toBeInTheDocument()
    await expect(variant('withoutColor').getByText('Social')).toBeInTheDocument()
  },
}
