import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import type { RosterPosition } from '@shared/api/events'
import { makeRoster } from '@shared/testing/event-fixtures'
import { RosterPips } from './RosterPips'

// The per-position body of the card's answer panel. Prop-only (ADR-0017) — every number arrives
// already computed by the server, so each roster state is just a different prop value. These stories
// replace the panel half of the old RosterDisclosure.
const pos = (
  label: string,
  required: number | undefined,
  attending: number,
  kind: RosterPosition['kind'] = 'PLAYING',
): RosterPosition => ({
  id: `pos-${label.toLowerCase()}`,
  label,
  required,
  attending,
  kind,
})

const meta = {
  title: 'entities/event/RosterPips',
  component: RosterPips,
  decorators: [
    (Story) => (
      <div className="max-w-xs rounded-xl border border-border bg-card p-3.5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RosterPips>

export default meta

type Story = StoryObj<typeof meta>

export const LineupSet: Story = {
  args: {
    roster: makeRoster({
      state: 'LINEUP_SET',
      openSlots: 0,
      totalAttending: 5,
      positions: [pos('Setter', 2, 2), pos('Libero', 1, 1), pos('Middle', 2, 2)],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('3 of 3 covered')).toBeInTheDocument()
    await expect(canvas.getAllByText('2/2')).toHaveLength(2)
    await expect(canvas.getByText('1/1')).toBeInTheDocument()
    await expect(canvas.queryByText(/the one to chase/)).not.toBeInTheDocument()
  },
}

export const SpotsOpen: Story = {
  args: {
    roster: makeRoster({
      state: 'SPOTS_OPEN',
      totalAttending: 3,
      positions: [pos('Setter', 2, 1), pos('Libero', 1, 1), pos('Middle', 2, 1)],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('1 of 3 covered')).toBeInTheDocument()
    // Short, but nobody is missing entirely — so no callout.
    await expect(canvas.queryByText(/the one to chase/)).not.toBeInTheDocument()
  },
}

// The red case: a position with nobody at all earns the "one to chase" callout.
export const Critical: Story = {
  args: {
    roster: makeRoster({
      state: 'CRITICAL',
      totalAttending: 3,
      positions: [pos('Setter', 2, 2), pos('Libero', 1, 0), pos('Middle', 2, 1)],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/still has no one/)).toBeInTheDocument()
    await expect(canvas.getByText('Libero', { selector: 'b' })).toBeInTheDocument()
    await expect(canvas.getByText('0/1')).toBeInTheDocument()
  },
}

// Two empty positions are still worth naming, but "the one to chase" must not survive: a definite
// article claiming uniqueness tells you the other one is covered.
export const TwoEmptyPositions: Story = {
  args: {
    roster: makeRoster({
      state: 'CRITICAL',
      totalAttending: 2,
      positions: [pos('Setter', 2, 2), pos('Libero', 1, 0), pos('Middle', 2, 0)],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Libero and Middle', { selector: 'b' })).toBeInTheDocument()
    await expect(canvas.getByText(/still have no one/)).toBeInTheDocument()
    await expect(canvas.queryByText(/the one to chase/)).not.toBeInTheDocument()
  },
}

// The reported case: nobody has answered, so every targeted position is empty. Naming the first one
// claimed the other five were fine — from three up the count is the news, and the rows above already
// list which ones.
export const NothingAnsweredYet: Story = {
  args: {
    roster: makeRoster({
      state: 'CRITICAL',
      totalAttending: 0,
      positions: [
        pos('Diagonaal', 2, 0),
        pos('Libero', 1, 0),
        pos('Midden', 3, 0),
        pos('Passer/Loper', 2, 0),
        pos('Spelverdeler', 2, 0),
        pos('Trainer/Coach', 1, 0),
      ],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('6 positions', { selector: 'b' })).toBeInTheDocument()
    await expect(canvas.getByText(/still have no one/)).toBeInTheDocument()
    // No position is singled out, and none is called "the one".
    await expect(canvas.queryByText(/the one to chase/)).not.toBeInTheDocument()
    await expect(canvas.queryByText('Diagonaal', { selector: 'b' })).not.toBeInTheDocument()
    await expect(canvas.getByText('0 of 6 covered')).toBeInTheDocument()
  },
}

// No position carries a target, so there is no covered fraction and no pips — the header carries the
// absolute headcount instead.
export const HeadcountOnly: Story = {
  args: {
    roster: makeRoster({
      state: 'HEADCOUNT_SHORT',
      openSlots: 4,
      totalTarget: 10,
      totalAttending: 6,
      positions: [pos('Setter', undefined, 4), pos('Middle', undefined, 2)],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText(/covered/)).not.toBeInTheDocument()
    await expect(canvas.getByText('4')).toBeInTheDocument()
    await expect(canvas.getByText('6/10 going')).toBeInTheDocument()
  },
}

// Over-fill reads as covered and shows the surplus, but never pays for a gap elsewhere.
export const WithSurplus: Story = {
  args: {
    roster: makeRoster({
      state: 'CRITICAL',
      openSlots: 1,
      totalAttending: 5,
      positions: [pos('Setter', 2, 5), pos('Libero', 1, 0)],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('+3')).toBeInTheDocument()
    await expect(canvas.getByText('5/2')).toBeInTheDocument()
    await expect(canvas.getByText(/still has no one/)).toBeInTheDocument()
  },
}

// Nobody has a position yet, so the server sends no rows — but people ARE coming. "Nobody has
// answered yet" would be a flat contradiction of the nudge right below it.
export const AllAttendeesUnassigned: Story = {
  args: {
    roster: makeRoster({
      state: 'HEADCOUNT_SHORT',
      openSlots: 4,
      totalTarget: 10,
      totalAttending: 6,
      unassignedAttending: 6,
      positions: [],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText('Nobody has answered yet.')).not.toBeInTheDocument()
    await expect(canvas.getByText("6 going haven't set a position")).toBeInTheDocument()
    await expect(canvas.getByText('6/10 going')).toBeInTheDocument()
  },
}

// The genuinely empty event, where the copy is true.
export const NobodyAttending: Story = {
  args: {
    roster: makeRoster({
      state: 'TALLY_ONLY',
      openSlots: 0,
      totalTarget: undefined,
      totalAttending: 0,
      positions: [],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Nobody has answered yet.')).toBeInTheDocument()
  },
}

// A position can require up to 99 (PositionSlots.MAX). The pips wrap rather than push the count off
// the row.
export const WithManySlots: Story = {
  args: {
    roster: makeRoster({
      state: 'SPOTS_OPEN',
      openSlots: 5,
      totalAttending: 7,
      positions: [pos('Squad', 12, 7)],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('7/12')).toBeInTheDocument()
  },
}

export const WithUnassigned: Story = {
  args: {
    roster: makeRoster({
      state: 'SPOTS_OPEN',
      totalAttending: 6,
      unassignedAttending: 3,
      positions: [pos('Setter', 2, 1), pos('Libero', 1, 1), pos('Middle', 2, 1)],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("3 going haven't set a position")).toBeInTheDocument()
    await expect(canvas.getByText('1 of 3 covered')).toBeInTheDocument()
  },
}

// A headcount set alongside position targets is secondary: the header stays the covered fraction and
// the total appears as a line beneath the rows.
export const BothAxes: Story = {
  args: {
    roster: makeRoster({
      state: 'SPOTS_OPEN',
      openSlots: 1,
      totalTarget: 12,
      totalAttending: 7,
      positions: [pos('Setter', 2, 1), pos('Libero', 1, 1)],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('1 of 2 covered')).toBeInTheDocument()
    await expect(canvas.getByText('7/12 going')).toBeInTheDocument()
  },
}

// The reported case (#281): a training wanting 12, attended by 11 players and a coach. The fraction
// counts the eleven, the Trainer keeps a row of their own, and the note underneath accounts for the
// twelfth person so the two numbers do not read as an arithmetic slip.
export const WithStaffAttending: Story = {
  args: {
    roster: makeRoster({
      state: 'HEADCOUNT_SHORT',
      openSlots: 1,
      totalTarget: 12,
      totalAttending: 12,
      positions: [pos('Setter', undefined, 11), pos('Trainer', undefined, 1, 'STAFF')],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('11/12 going')).toBeInTheDocument()
    await expect(canvas.getByText('1 staff also going, not counted toward the target')).toBeInTheDocument()
    // Excluded from the target, not hidden.
    await expect(canvas.getByText('Trainer')).toBeInTheDocument()
  },
}

// Staff alongside targeted positions — the panel's densest honest state, and the one where all three
// numbers appear at once: the covered fraction owns the header (2 of 2), the headcount drops to a
// secondary line counting players only (3/6), and the staff line explains why four people are listed
// under a fraction that says three. WithStaffAttending above is the tally-shaped training; this is
// the same distinction on an event that also names a lineup.
export const WithStaffAndPositionTargets: Story = {
  args: {
    roster: makeRoster({
      state: 'LINEUP_SET',
      totalTarget: 6,
      totalAttending: 4,
      positions: [pos('Setter', 2, 2), pos('Libero', 1, 1), pos('Trainer', undefined, 1, 'STAFF')],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('2 of 2 covered')).toBeInTheDocument()
    await expect(canvas.getByText('3/6 going')).toBeInTheDocument()
    await expect(canvas.getByText('1 staff also going, not counted toward the target')).toBeInTheDocument()
  },
}
