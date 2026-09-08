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
    await expect(canvas.getByText(/Missing a position/)).toBeInTheDocument()
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

// ── No position targets (#271 ⑥, the half the detail page never got) ────────────────────────────
// `rosterChip` returns null for two states, and until now the bar refused to render for either, so
// the detail page stated no headcount at all whenever no position carried a target: the card
// advertised "4 more needed", you tapped through, and the number was gone.

// A total target, no position targets. The fraction is against the target, and the verdict stands.
export const HeadcountTarget: Story = {
  args: {
    roster: makeRoster({
      positions: [],
      totalTarget: 12,
      totalAttending: 8,
      openSlots: 4,
      state: 'HEADCOUNT_SHORT',
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/8\/12 going/)).toBeInTheDocument()
    await expect(canvas.getByText(/4 more needed/)).toBeInTheDocument()
  },
}

// The headcount target met.
export const HeadcountFull: Story = {
  args: {
    roster: makeRoster({
      positions: [],
      totalTarget: 12,
      totalAttending: 12,
      openSlots: 0,
      state: 'HEADCOUNT_FULL',
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/12\/12 going/)).toBeInTheDocument()
    await expect(canvas.getByText(/Full/)).toBeInTheDocument()
  },
}

// A tally: tracking on, nothing targeted. There is no verdict and nothing to be a fraction of, so
// the bar states the plain count and draws NO progress track — a bar with no denominator would
// invent the judgement `rosterChip` deliberately withholds for this state.
export const TallyOnly: Story = {
  args: {
    roster: makeRoster({
      positions: [],
      totalTarget: undefined,
      totalAttending: 8,
      openSlots: 0,
      state: 'TALLY_ONLY',
    }),
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText(/8 going/)).toBeInTheDocument()
    await expect(canvas.queryByText(/\//)).not.toBeInTheDocument()
    await expect(canvasElement.querySelector('[data-slot="roster-track"]')).toBeNull()
  },
}

// Tracking off entirely — a social. Still nothing: this is not a roster event, and the route falls
// back to the role breakdown.
export const TrackingOff: Story = {
  args: {
    roster: makeRoster({
      trackRoster: false,
      positions: [],
      totalTarget: undefined,
      totalAttending: 8,
      openSlots: 0,
      state: 'OFF',
    }),
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('div')?.textContent ?? '').toBe('')
  },
}
