import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { makeRoster } from '@shared/testing/event-fixtures'
import { Stack } from '@shared/testing/stack'
import { appColumn } from '@shared/testing/app-column-decorator'
import { RosterBar } from './RosterBar'

// The roster overview: spots filled, a progress track, and a chip per targeted position coloured
// by tone. Prop-only; every number arrives already computed by the server (#219). The card chrome
// is the caller's, so each instance below gets the same wrapper the detail page does.
//
// One Gallery story (ADR-0031 §2): every roster shape stacked via `Stack`, one snapshot, and every
// old assertion scoped to its own labelled region.
// The wrapper the detail page puts around it. No width of its own: the app column decorator on the
// meta gives it the width the product gives it at each breakpoint (ADR-0031 §4).
const CARD = 'overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm'

const meta = {
  title: 'entities/event/RosterBar',
  component: RosterBar,
  ...appColumn,
} satisfies Meta<typeof RosterBar>

export default meta

type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  args: { roster: makeRoster() },
  render: () => (
    <Stack
      items={{
        // makeRoster() default: Setter 2/2, Libero 1/1, Middle 1/2 → 4 of 5 spots, one open.
        'One spot open': (
          <div className={CARD}>
            <RosterBar roster={makeRoster()} />
          </div>
        ),
        // A position with nobody at all is critical, not merely short — chase now, not later.
        Critical: (
          <div className={CARD}>
            <RosterBar
              roster={makeRoster({
                positions: [
                  { id: 'pos-setter', label: 'Setter', required: 2, attending: 2, kind: 'PLAYING' },
                  { id: 'pos-middle', label: 'Middle', required: 2, attending: 0, kind: 'PLAYING' },
                ],
                state: 'CRITICAL',
              })}
            />
          </div>
        ),
        // Every targeted position met: the lineup is set.
        'Lineup fully set': (
          <div className={CARD}>
            <RosterBar
              roster={makeRoster({
                positions: [
                  { id: 'pos-setter', label: 'Setter', required: 2, attending: 2, kind: 'PLAYING' },
                  { id: 'pos-libero', label: 'Libero', required: 1, attending: 1, kind: 'PLAYING' },
                ],
                state: 'LINEUP_SET',
              })}
            />
          </div>
        ),
        // No position targets (#271 ⑥, the half the detail page never got): `rosterChip` returns null
        // for two states, and until now the bar refused to render for either, so the detail page
        // stated no headcount at all whenever no position carried a target — the card advertised "4
        // more needed", you tapped through, and the number was gone. A total target, no position
        // targets: the fraction is against the target, and the verdict stands.
        'Headcount target': (
          <div className={CARD}>
            <RosterBar
              roster={makeRoster({
                positions: [],
                totalTarget: 12,
                totalAttending: 8,
                openSlots: 4,
                state: 'HEADCOUNT_SHORT',
              })}
            />
          </div>
        ),
        // The headcount target met.
        'Headcount full': (
          <div className={CARD}>
            <RosterBar
              roster={makeRoster({
                positions: [],
                totalTarget: 12,
                totalAttending: 12,
                openSlots: 0,
                state: 'HEADCOUNT_FULL',
              })}
            />
          </div>
        ),
        // A tally: tracking on, nothing targeted. There is no verdict and nothing to be a fraction of,
        // so the bar states the plain count and draws NO progress track — a bar with no denominator
        // would invent the judgement `rosterChip` deliberately withholds for this state.
        'Tally only': (
          <div className={CARD}>
            <RosterBar
              roster={makeRoster({
                positions: [],
                totalTarget: undefined,
                totalAttending: 8,
                openSlots: 0,
                state: 'TALLY_ONLY',
              })}
            />
          </div>
        ),
        // Tracking off entirely — a social. Still nothing: this is not a roster event, and the route
        // falls back to the role breakdown.
        'Tracking off': (
          <div className={CARD}>
            <RosterBar
              roster={makeRoster({
                trackRoster: false,
                positions: [],
                totalTarget: undefined,
                totalAttending: 8,
                openSlots: 0,
                state: 'OFF',
              })}
            />
          </div>
        ),
        // The same event on the detail page's pinned bar (#281). The progress track measures the
        // eleven players against the twelve wanted; the coach is named beside the fraction rather than
        // advancing it, which is what used to fill the bar and turn the headline green.
        'With staff attending': (
          <div className={CARD}>
            <RosterBar
              roster={makeRoster({
                state: 'HEADCOUNT_SHORT',
                openSlots: 1,
                totalTarget: 12,
                totalAttending: 12,
                positions: [
                  { id: 'pos-setter', label: 'Setter', required: undefined, attending: 11, kind: 'PLAYING' },
                  { id: 'pos-trainer', label: 'Trainer', required: undefined, attending: 1, kind: 'STAFF' },
                ],
              })}
            />
          </div>
        ),
        // The same eleven players and one coach, on a team that has NOT ticked Staff on Trainer —
        // which is every team on the day this ships, because the migration defaults to PLAYING. Its
        // whole job is to sit next to "With staff attending" above: same people, same answers, and
        // the only difference is one checkbox in the position editor — a contrast a reviewer should
        // see as two pictures rather than reconstruct from a diff.
        'Trainer not marked': (
          <div className={CARD}>
            <RosterBar
              roster={makeRoster({
                state: 'HEADCOUNT_FULL',
                openSlots: 0,
                totalTarget: 12,
                totalAttending: 12,
                positions: [
                  { id: 'pos-setter', label: 'Setter', required: undefined, attending: 11, kind: 'PLAYING' },
                  { id: 'pos-trainer', label: 'Trainer', required: undefined, attending: 1, kind: 'PLAYING' },
                ],
              })}
            />
          </div>
        ),
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('One spot open').getByText(/4\/5 spots/)).toBeInTheDocument()
    await expect(region('One spot open').getByText(/1 spot open/)).toBeInTheDocument()
    await expect(region('One spot open').getByText(/Middle 1\/2/)).toBeInTheDocument()

    await expect(region('Critical').getByText(/Missing a position/)).toBeInTheDocument()
    await expect(region('Critical').getByText(/Middle 0\/2/)).toBeInTheDocument()

    await expect(region('Lineup fully set').getByText(/3\/3 spots/)).toBeInTheDocument()
    await expect(region('Lineup fully set').getByText(/Lineup set/)).toBeInTheDocument()

    await expect(region('Headcount target').getByText(/8\/12 going/)).toBeInTheDocument()
    await expect(region('Headcount target').getByText(/4 more needed/)).toBeInTheDocument()

    await expect(region('Headcount full').getByText(/12\/12 going/)).toBeInTheDocument()
    await expect(region('Headcount full').getByText(/Full/)).toBeInTheDocument()

    await expect(region('Tally only').getByText(/8 going/)).toBeInTheDocument()
    await expect(region('Tally only').queryByText(/\//)).not.toBeInTheDocument()
    const tallyOnly = canvas.getByRole('region', { name: 'Tally only' })
    await expect(tallyOnly.querySelector('[data-slot="roster-track"]')).toBeNull()

    const trackingOff = canvas.getByRole('region', { name: 'Tracking off' })
    await expect(trackingOff.querySelector('div')?.textContent ?? '').toBe('')

    await expect(
      region('With staff attending').getByText(/11\/12 going \+1 staff/),
    ).toBeInTheDocument()
    await expect(region('With staff attending').getByText(/1 more needed/)).toBeInTheDocument()

    await expect(region('Trainer not marked').getByText(/12\/12 going/)).toBeInTheDocument()
    await expect(region('Trainer not marked').getByText(/Full/)).toBeInTheDocument()
    // No staff suffix: nobody attending holds a staff position.
    await expect(region('Trainer not marked').queryByText(/staff/)).not.toBeInTheDocument()
  },
}
