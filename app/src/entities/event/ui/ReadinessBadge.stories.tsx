import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { ReadinessBadge } from './ReadinessBadge'

// The card row's right slot: the server-computed readiness verdict, or a headcount fallback where
// there is none. Prop-only (ADR-0017) — each roster state is a different prop value, no network.
const meta = {
  title: 'entities/event/ReadinessBadge',
  component: ReadinessBadge,
  decorators: [
    (Story) => (
      <div className="flex max-w-xs items-center justify-end rounded-xl border border-border bg-card p-3.5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReadinessBadge>

export default meta

type Story = StoryObj<typeof meta>

export const Covered: Story = {
  args: { roster: makeRoster({ state: 'LINEUP_SET', openSlots: 0, positions: [] }) },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Lineup set')).toBeInTheDocument()
  },
}

export const Short: Story = {
  args: {
    roster: makeRoster({ state: 'SPOTS_OPEN', positions: [{ id: 'p', label: 'Setter', required: 2, attending: 1, kind: 'PLAYING' }] }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('1 spot open')).toBeInTheDocument()
  },
}

export const Critical: Story = {
  args: {
    roster: makeRoster({ state: 'CRITICAL', positions: [{ id: 'p', label: 'Libero', required: 1, attending: 0, kind: 'PLAYING' }] }),
  },
  // Not "1 spot open" — that is what Short says, and red-vs-gold was the only thing telling the two
  // apart (#313).
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Missing a position')).toBeInTheDocument()
  },
}

// A social — tracking off, so no verdict. The headcount fallback keeps the row from carrying no
// team information at all (⑥).
export const HeadcountFallbackOff: Story = {
  args: { roster: makeRoster({ ...NO_ROSTER, totalAttending: 8 }) },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('8 going')).toBeInTheDocument()
  },
}

// Tracking on but no targets — the common case for a team that never sets positions. Still no
// verdict, so it too falls back to the headcount rather than inventing a judgement.
export const HeadcountFallbackTallyOnly: Story = {
  args: {
    roster: makeRoster({ state: 'TALLY_ONLY', openSlots: 0, totalAttending: 5, positions: [] }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('5 going')).toBeInTheDocument()
  },
}

// The pending state (⑤): the last-known verdict, dimmed while the write settles rather than asserted
// as current. It is a real state, not a transition artefact.
export const Pending: Story = {
  args: {
    roster: makeRoster({ state: 'LINEUP_SET', openSlots: 0, positions: [] }),
    pending: true,
  },
  play: async ({ canvas }) => {
    const badge = canvas.getByText('Lineup set')
    await expect(badge).toBeInTheDocument()
    await expect(badge).toHaveAttribute('aria-busy', 'true')
  },
}

// The headcount fallback (⑥, #271) with the players and staff counted apart (#281). It used to read
// "12 going" on a training of eleven players and a coach, which was the reported complaint in its
// most prominent form: no verdict beside it to correct the impression.
export const HeadcountFallbackWithStaff: Story = {
  args: {
    roster: makeRoster({
      state: 'TALLY_ONLY',
      totalTarget: undefined,
      totalAttending: 12,
      positions: [
        { id: 'pos-setter', label: 'Setter', required: undefined, attending: 11, kind: 'PLAYING' },
        { id: 'pos-trainer', label: 'Trainer', required: undefined, attending: 1, kind: 'STAFF' },
      ],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/11 going \+1 staff/)).toBeInTheDocument()
  },
}
