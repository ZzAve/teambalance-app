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
        { id: 'pos-setter', label: 'Setter', required: 2, attending: 2, kind: 'PLAYING' },
        { id: 'pos-middle', label: 'Middle', required: 2, attending: 0, kind: 'PLAYING' },
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
        { id: 'pos-setter', label: 'Setter', required: 2, attending: 2, kind: 'PLAYING' },
        { id: 'pos-libero', label: 'Libero', required: 1, attending: 1, kind: 'PLAYING' },
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

// The same event on the detail page's pinned bar (#281). The progress track measures the eleven
// players against the twelve wanted; the coach is named beside the fraction rather than advancing it,
// which is what used to fill the bar and turn the headline green.
export const WithStaffAttending: Story = {
  args: {
    roster: makeRoster({
      state: 'HEADCOUNT_SHORT',
      openSlots: 1,
      totalTarget: 12,
      totalAttending: 12,
      positions: [
        { id: 'pos-setter', label: 'Setter', required: undefined, attending: 11, kind: 'PLAYING' },
        { id: 'pos-trainer', label: 'Trainer', required: undefined, attending: 1, kind: 'STAFF' },
      ],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/11\/12 going \+1 staff/)).toBeInTheDocument()
    await expect(canvas.getByText(/1 more needed/)).toBeInTheDocument()
  },
}

// The same eleven players and one coach, on a team that has NOT ticked Staff on Trainer — which is
// every team on the day this ships, because the migration defaults to PLAYING. It reads "12/12 going
// · Full" with a filled track.
//
// Its whole job is to sit next to WithStaffAttending above, where the identical attendance reads
// "11/12 going +1 staff · 1 more needed". Same people, same answers; the only difference is one
// checkbox in the position editor. That contrast is the change, and a reviewer should be able to see
// it as two pictures rather than reconstruct it from a diff.
export const WithStaffNotYetMarked: Story = {
  args: {
    roster: makeRoster({
      state: 'HEADCOUNT_FULL',
      openSlots: 0,
      totalTarget: 12,
      totalAttending: 12,
      positions: [
        { id: 'pos-setter', label: 'Setter', required: undefined, attending: 11, kind: 'PLAYING' },
        { id: 'pos-trainer', label: 'Trainer', required: undefined, attending: 1, kind: 'PLAYING' },
      ],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/12\/12 going/)).toBeInTheDocument()
    await expect(canvas.getByText(/Full/)).toBeInTheDocument()
    // No staff suffix: nobody attending holds a staff position.
    await expect(canvas.queryByText(/staff/)).not.toBeInTheDocument()
  },
}
