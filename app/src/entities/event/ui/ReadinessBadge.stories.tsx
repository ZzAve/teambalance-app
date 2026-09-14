import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { ReadinessBadge } from './ReadinessBadge'

// The card row's right slot: the server-computed readiness verdict, or a headcount fallback where
// there is none. Prop-only (ADR-0017) — each roster state is a different prop value, no network.
//
// One gallery story (ADR-0031 §2): every roster state side by side, each in the card-row context it
// actually renders in, one picture, every branch asserted.
const VARIANTS = {
  covered: { roster: makeRoster({ state: 'LINEUP_SET', openSlots: 0, positions: [] }) },
  short: {
    roster: makeRoster({ state: 'SPOTS_OPEN', positions: [{ id: 'p', label: 'Setter', required: 2, attending: 1, kind: 'PLAYING' }] }),
  },
  // Not "1 spot open" — that is what `short` says, and red-vs-gold was the only thing telling the
  // two apart (#313).
  critical: {
    roster: makeRoster({ state: 'CRITICAL', positions: [{ id: 'p', label: 'Libero', required: 1, attending: 0, kind: 'PLAYING' }] }),
  },
  // A social — tracking off, so no verdict. The headcount fallback keeps the row from carrying no
  // team information at all (⑥).
  headcountFallbackOff: { roster: makeRoster({ ...NO_ROSTER, totalAttending: 8 }) },
  // Tracking on but no targets — the common case for a team that never sets positions. Still no
  // verdict, so it too falls back to the headcount rather than inventing a judgement.
  headcountFallbackTallyOnly: {
    roster: makeRoster({ state: 'TALLY_ONLY', openSlots: 0, totalAttending: 5, positions: [] }),
  },
  // The pending state (⑤): the last-known verdict, dimmed while the write settles rather than
  // asserted as current. It is a real state, not a transition artefact.
  pending: {
    roster: makeRoster({ state: 'LINEUP_SET', openSlots: 0, positions: [] }),
    pending: true,
  },
  // The headcount fallback (⑥, #271) with the players and staff counted apart (#281). It used to
  // read "12 going" on a training of eleven players and a coach, which was the reported complaint
  // in its most prominent form: no verdict beside it to correct the impression.
  headcountFallbackWithStaff: {
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
}

const meta = {
  title: 'entities/event/ReadinessBadge',
  component: ReadinessBadge,
} satisfies Meta<typeof ReadinessBadge>

export default meta

type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  args: VARIANTS.covered,
  render: () => (
    <div className="flex flex-wrap gap-4">
      {Object.entries(VARIANTS).map(([name, props]) => (
        <div
          key={name}
          data-testid={`variant-${name}`}
          className="flex max-w-xs items-center justify-end rounded-xl border border-border bg-card p-3.5"
        >
          <ReadinessBadge {...props} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const variant = (name: keyof typeof VARIANTS) => within(canvas.getByTestId(`variant-${name}`))

    await expect(variant('covered').getByText('Lineup set')).toBeInTheDocument()
    await expect(variant('short').getByText('1 spot open')).toBeInTheDocument()
    await expect(variant('critical').getByText('Missing a position')).toBeInTheDocument()
    await expect(variant('headcountFallbackOff').getByText('8 going')).toBeInTheDocument()
    await expect(variant('headcountFallbackTallyOnly').getByText('5 going')).toBeInTheDocument()

    const pendingBadge = variant('pending').getByText('Lineup set')
    await expect(pendingBadge).toBeInTheDocument()
    await expect(pendingBadge).toHaveAttribute('aria-busy', 'true')

    await expect(
      variant('headcountFallbackWithStaff').getByText(/11 going \+1 staff/),
    ).toBeInTheDocument()
  },
}
