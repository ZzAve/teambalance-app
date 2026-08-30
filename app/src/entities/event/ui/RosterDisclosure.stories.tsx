import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import type { EventRoster, RosterPosition } from '@shared/api/events'
import { makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { RosterDisclosure } from './RosterDisclosure'

// The roster panel on an event card: a collapsed status chip that expands to per-position slot pips.
// Prop-only (ADR-0017) — every number arrives already computed by the server, so each of the seven
// roster states is just a different prop value and renders with no network.
//
// The states are the ones the backend can emit (RosterState), plus the two display cases that cut
// across them: surplus and unassigned attendees.
const pos = (label: string, required: number | undefined, attending: number): RosterPosition => ({
  id: `pos-${label.toLowerCase()}`,
  label,
  required,
  attending,
})

const LINEUP: EventRoster = makeRoster({
  state: 'LINEUP_SET',
  openSlots: 0,
  totalAttending: 5,
  positions: [pos('Setter', 2, 2), pos('Libero', 1, 1), pos('Middle', 2, 2)],
})

const meta = {
  title: 'entities/event/RosterDisclosure',
  component: RosterDisclosure,
  args: { roster: LINEUP, defaultOpen: true },
  // The card's attendance row is a flex line; the trigger sits at its end and the panel drops below.
  decorators: [
    (Story) => (
      <div className="flex max-w-md flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3.5">
        <span className="rounded-full bg-green/10 px-2.5 py-1 text-xs font-medium text-green">✓ 5 going</span>
        <span className="text-xs text-muted-foreground">of 12</span>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RosterDisclosure>

export default meta

type Story = StoryObj<typeof meta>

export const LineupSet: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Lineup set')).toBeInTheDocument()
    await expect(canvas.getByText('3 of 3 covered')).toBeInTheDocument()
    // Setter and Middle both read 2/2; Libero is the 1/1.
    await expect(canvas.getAllByText('2/2')).toHaveLength(2)
    await expect(canvas.getByText('1/1')).toBeInTheDocument()
    // Everyone is covered, so nobody is the one to chase.
    await expect(canvas.queryByText(/the one to chase/)).not.toBeInTheDocument()
  },
}

export const SpotsOpen: Story = {
  args: {
    roster: makeRoster({
      state: 'SPOTS_OPEN',
      openSlots: 2,
      totalAttending: 3,
      positions: [pos('Setter', 2, 1), pos('Libero', 1, 1), pos('Middle', 2, 1)],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('2 spots open')).toBeInTheDocument()
    await expect(canvas.getByText('1 of 3 covered')).toBeInTheDocument()
    // Short, but nobody is missing entirely — so no callout.
    await expect(canvas.queryByText(/the one to chase/)).not.toBeInTheDocument()
  },
}

// The red case. Same wording as SpotsOpen — the count is the news, the tone is the difference —
// plus the callout naming who to chase.
export const Critical: Story = {
  args: {
    roster: makeRoster({
      state: 'CRITICAL',
      openSlots: 2,
      totalAttending: 3,
      positions: [pos('Setter', 2, 2), pos('Libero', 1, 0), pos('Middle', 2, 1)],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('2 spots open')).toBeInTheDocument()
    await expect(canvas.getByText(/still has no one/)).toBeInTheDocument()
    await expect(canvas.getByText('Libero', { selector: 'b' })).toBeInTheDocument()
    await expect(canvas.getByText('0/1')).toBeInTheDocument()
  },
}

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
    await expect(canvas.getByText('4 more needed')).toBeInTheDocument()
    // No position carries a target, so there is no covered fraction and no pips — plain counts only.
    await expect(canvas.queryByText(/covered/)).not.toBeInTheDocument()
    await expect(canvas.getByText('4')).toBeInTheDocument()
    // With no fraction to show, the header carries the absolute headcount instead.
    await expect(canvas.getByText('6/10 going')).toBeInTheDocument()
  },
}

export const HeadcountFull: Story = {
  args: {
    roster: makeRoster({
      state: 'HEADCOUNT_FULL',
      openSlots: 0,
      totalTarget: 6,
      totalAttending: 6,
      positions: [pos('Setter', undefined, 6)],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Full')).toBeInTheDocument()
  },
}

// Tracking on, nothing required: the panel tallies who is coming and reports no judgement, so the
// trigger reads "Positions" rather than a status chip.
export const TallyOnly: Story = {
  args: {
    roster: makeRoster({
      state: 'TALLY_ONLY',
      openSlots: 0,
      totalTarget: undefined,
      totalAttending: 5,
      positions: [pos('Setter', undefined, 2), pos('Middle', undefined, 3)],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Positions', { selector: 'span.text-xs' })).toBeInTheDocument()
    await expect(canvas.queryByText(/spots open/)).not.toBeInTheDocument()
    await expect(canvas.queryByText(/covered/)).not.toBeInTheDocument()
    await expect(canvas.getByText('3')).toBeInTheDocument()
  },
}

// A social. Not a roster event at all — no chip, no panel, and no affordance suggesting there is one.
export const Off: Story = {
  args: { roster: NO_ROSTER },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
    await expect(canvas.queryByText('Positions')).not.toBeInTheDocument()
  },
}

// Over-fill reads as covered and shows the surplus, but never pays for a gap elsewhere: five setters
// for two slots, and the empty libero still drives the status.
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
    await expect(canvas.getByText('1 spot open')).toBeInTheDocument()
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
// the row — a training that wants 12 attendees must not break the card on a phone.
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
    await expect(canvas.getByText('5 spots open')).toBeInTheDocument()
  },
}

export const WithUnassigned: Story = {
  args: {
    roster: makeRoster({
      state: 'SPOTS_OPEN',
      openSlots: 1,
      totalAttending: 6,
      unassignedAttending: 3,
      positions: [pos('Setter', 2, 1), pos('Libero', 1, 1), pos('Middle', 2, 1)],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("3 going haven't set a position")).toBeInTheDocument()
  },
}

// A headcount set alongside position targets is secondary: the chip stays the lineup's, and the
// total appears only inside the panel.
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
    await expect(canvas.getByText('1 spot open')).toBeInTheDocument()
    await expect(canvas.getByText('1 of 2 covered')).toBeInTheDocument()
    await expect(canvas.getByText('7/12 going')).toBeInTheDocument()
  },
}

// Collapsed is the default in the list: a roster panel per card would be a wall. The chip alone
// carries the one-glance status, and the toggle is what reveals the rest.
export const CollapsedByDefault: Story = {
  args: { defaultOpen: false },
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('button', { name: /Show positions/ })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.getByText('Lineup set')).toBeInTheDocument()
    await expect(canvas.queryByText('3 of 3 covered')).not.toBeInTheDocument()

    await userEvent.click(toggle)

    await expect(canvas.getByRole('button', { name: /Hide positions/ })).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByText('3 of 3 covered')).toBeInTheDocument()

    // …and back, so the affordance is a real toggle rather than a one-way reveal.
    await userEvent.click(canvas.getByRole('button', { name: /Hide positions/ }))
    await expect(canvas.queryByText('3 of 3 covered')).not.toBeInTheDocument()
  },
}
