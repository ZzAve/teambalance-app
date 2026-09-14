import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { RoleBreakdown } from './RoleBreakdown'

// Presentational breakdown of attending members grouped by role, rendered as chips. Renders nothing
// when no role has attendees.
//
// One gallery story (ADR-0031 §2): every variant side by side, one picture, every branch asserted.
const VARIANTS = {
  populated: {
    breakdown: [
      { role: 'Setter', attending: 2 },
      { role: 'Outside Hitter', attending: 3 },
      { role: 'Libero', attending: 1 },
    ],
  },
  empty: { breakdown: [] },
  // The backend groups the attending summary by position and includes an "Unassigned" bucket for
  // members with no position; the component renders whatever the API returns, verbatim.
  withUnassigned: {
    breakdown: [
      { role: 'Setter', attending: 2 },
      { role: 'Libero', attending: 1 },
      { role: 'Unassigned', attending: 3 },
    ],
  },
}

const meta = {
  title: 'entities/event/RoleBreakdown',
  component: RoleBreakdown,
} satisfies Meta<typeof RoleBreakdown>

export default meta

type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  args: VARIANTS.populated,
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {Object.entries(VARIANTS).map(([name, props]) => (
        <div key={name} data-testid={`variant-${name}`}>
          <RoleBreakdown {...props} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const variant = (name: keyof typeof VARIANTS) => within(canvas.getByTestId(`variant-${name}`))

    await expect(variant('populated').getByText('2 Setter')).toBeInTheDocument()
    await expect(variant('populated').getByText('3 Outside Hitter')).toBeInTheDocument()
    await expect(variant('populated').getByText('1 Libero')).toBeInTheDocument()

    // Nothing to break down -> the component renders nothing at all.
    await expect(canvas.getByTestId('variant-empty')).toBeEmptyDOMElement()

    await expect(variant('withUnassigned').getByText('2 Setter')).toBeInTheDocument()
    await expect(variant('withUnassigned').getByText('3 Unassigned')).toBeInTheDocument()
  },
}
