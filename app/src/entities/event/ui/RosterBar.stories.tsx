import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { makeRoster } from '@shared/testing/event-fixtures'
import { RosterBar } from './RosterBar'

// The pinned roster overview: spots filled, a progress track, and a chip per targeted position
// coloured by tone. Prop-only; every number arrives already computed by the server (#219).
const meta = {
  title: 'entities/event/RosterBar',
  component: RosterBar,
  args: { roster: makeRoster() },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RosterBar>

export default meta

type Story = StoryObj<typeof meta>

// makeRoster() default: Setter 2/2, Libero 1/1, Middle 1/2 → 4 of 5 spots, one open.
export const OneSpotOpen: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/4\/5 spots/)).toBeInTheDocument()
    await expect(canvas.getByText(/1 spot open/)).toBeInTheDocument()
    await expect(canvas.getByText(/Middle 1\/2/)).toBeInTheDocument()
  },
}

// A position with nobody at all is critical, not merely short — chase now, not later.
export const Critical: Story = {
  args: {
    roster: makeRoster({
      positions: [
        { id: 'pos-setter', label: 'Setter', required: 2, attending: 2 },
        { id: 'pos-middle', label: 'Middle', required: 2, attending: 0 },
      ],
      state: 'CRITICAL',
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/2 spots open/)).toBeInTheDocument()
    await expect(canvas.getByText(/Middle 0\/2/)).toBeInTheDocument()
  },
}

// Every targeted position met: the lineup is set.
export const LineupSet: Story = {
  args: {
    roster: makeRoster({
      positions: [
        { id: 'pos-setter', label: 'Setter', required: 2, attending: 2 },
        { id: 'pos-libero', label: 'Libero', required: 1, attending: 1 },
      ],
      state: 'LINEUP_SET',
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/3\/3 spots/)).toBeInTheDocument()
    await expect(canvas.getByText(/Lineup set/)).toBeInTheDocument()
  },
}
