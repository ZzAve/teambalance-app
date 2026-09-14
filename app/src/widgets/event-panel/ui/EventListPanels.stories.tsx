import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { AttendanceEntry, Event } from '@shared/api/events'
import { withRouter } from '@shared/testing/router-decorator'
import { makeAttendee, makeEvent, makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { EventListView } from '@entities/event/ui/EventListView'
import { PanelViewMenu } from '@features/event-panel-view/ui/PanelViewMenu'
import { Stack } from '@shared/testing/stack'
import { EventRosterPanel, MEMBER_CAP } from './EventRosterPanel'
import type { PanelView } from '@features/event-panel-view/model/panel-preferences'

/**
 * The panel **as the events page actually assembles it** — a whole list of cards, each opening onto
 * its own lineup (ADR-0030 §6–§8).
 *
 * The per-card stories next door prove the panel in isolation; what only shows here is the part that
 * is a property of the *list*: that `Keep open` reaches cards the member never touched, that a chip
 * on one card answers for the member on *that* card, and — the reason either is affordable — that a
 * list of every roster state renders its whole variety of panels with no fetch beyond the one that
 * loaded the list (ADR-0030 §8).
 *
 * The harness renders `PanelViewMenu` above the list because the page does: `Keep open` is a live
 * default, so "flipping it moves every card" is only demonstrable with both halves on screen.
 *
 * It lives in `widgets/` rather than beside `EventListView` because the panel is a widget and the
 * list is an entity: a story file in `entities/` may not import one (eslint-plugin-boundaries).
 *
 * `component` is the harness (`ListWithPanels`): the two preferences it drives are the events page's
 * own, which is the seam this file exists to cover.
 *
 * Rendered inside the events page composite (EventsPageView), so per the ownership rule
 * (ADR-0031 §3) its Data story is behavioural only — the composite's own picture already shows this
 * list, with its panels, in context.
 *
 * Three-story shape (ADR-0031 §1):
 *   1. Data — the list at rest, five events, five roster states, nothing expanded, disableSnapshot
 *      (picture owned by the page).
 *   2. Shells — every panel open on pips / on members, and the big-squad cap, stacked in one frame —
 *      this picture stays, since the composite's default frame cannot show a card already open.
 *   3. Interactions — no picture; what only the list can prove: the one header control moves every
 *      open card at once, and `Keep open` reaches cards the member never touched.
 */

// ── The team ─────────────────────────────────────────────────────────────────────────────────────
// Eight members across four positions plus one who never set his, so every group heading, every row
// tint and the Unassigned bucket all appear. Each event below answers for them differently, which is
// what makes its roster state what it is.
const [SANNE, SOFIA, LARS, MILAN, MEES, TESS, BRAM, UWE] = [
  ['u-1', 'Sanne Bakker', 'Setter'],
  ['u-2', 'Sofia de Wit', 'Setter'],
  ['u-3', 'Lars Peters', 'Libero'],
  ['u-4', 'Milan Visser', 'Middle'],
  ['u-5', 'Mees Jansen', 'Middle'],
  ['u-6', 'Tess de Groot', 'Outside'],
  ['u-7', 'Bram Willems', 'Outside'],
  ['u-8', 'Uwe Hofman', 'Unassigned'],
] as const

type Answer = AttendanceEntry['state']

/** The whole team, answering this event. Order is the roster's, which is the order rows keep. */
const team = (answers: [readonly [string, string, string], Answer][]): AttendanceEntry[] =>
  answers.map(([[id, name, role], state]) => makeAttendee(id, name, role, { state }))

const pos = (label: string, required: number | undefined, attending: number) => ({
  id: `p-${label.toLowerCase()}`,
  label,
  required,
  attending,
  kind: 'PLAYING' as const,
})

const TYPES = {
  match: { id: 'et-match', name: 'Match', color: '#3b82f6' },
  training: { id: 'et-training', name: 'Training', color: '#249E6C' },
  social: { id: 'et-social', name: 'Social', color: '#E0A526' },
}

const NOW = new Date(2026, 7, 10, 9, 0) // Monday 10 August 2026, 09:00 local
const on = (day: number, hour = 20) => new Date(2026, 7, day, hour, 0).toISOString()

// ── The list: one card per roster state, so every panel variant is on screen at once ─────────────

// CRITICAL — Middle has a target and nobody at all, which is a different problem from being short
// and gets different words, red pips and the "one to chase" callout.
const MISSING_A_POSITION = makeEvent({
  id: 'evt-critical',
  eventType: TYPES.match,
  title: 'League Match vs Smash United',
  startTime: on(11, 14),
  location: 'Sportcentrum Noord',
  myState: 'NOT_RESPONDED',
  roster: makeRoster({
    state: 'CRITICAL',
    totalAttending: 4,
    positions: [pos('Setter', 2, 2), pos('Libero', 1, 1), pos('Middle', 2, 0), pos('Outside', 2, 1)],
  }),
  attendances: team([
    [SANNE, 'ATTENDING'], [SOFIA, 'ATTENDING'], [LARS, 'ATTENDING'], [MILAN, 'ABSENT'],
    [MEES, 'NOT_RESPONDED'], [TESS, 'ATTENDING'], [BRAM, 'MAYBE'], [UWE, 'NOT_RESPONDED'],
  ]),
})

// SPOTS_OPEN — every position has someone, two slots still unfilled.
const SPOTS_OPEN = makeEvent({
  id: 'evt-spots',
  eventType: TYPES.training,
  title: 'Tuesday Training',
  startTime: on(13),
  location: 'Sporthal De Toekomst',
  myState: 'ATTENDING',
  roster: makeRoster({
    state: 'SPOTS_OPEN',
    totalAttending: 5,
    positions: [pos('Setter', 2, 1), pos('Libero', 1, 1), pos('Middle', 2, 2), pos('Outside', 2, 1)],
  }),
  attendances: team([
    [SANNE, 'ATTENDING'], [SOFIA, 'MAYBE'], [LARS, 'ATTENDING'], [MILAN, 'ATTENDING'],
    [MEES, 'ATTENDING'], [TESS, 'ATTENDING'], [BRAM, 'ABSENT'], [UWE, 'NOT_RESPONDED'],
  ]),
})

// LINEUP_SET — every slot filled. The calm end of the scale, and the one a green chip is for.
const LINEUP_SET = makeEvent({
  id: 'evt-set',
  eventType: TYPES.training,
  title: 'Friday Training',
  startTime: on(14),
  location: 'Sporthal De Toekomst',
  myState: 'ATTENDING',
  roster: makeRoster({
    state: 'LINEUP_SET',
    totalAttending: 7,
    positions: [pos('Setter', 2, 2), pos('Libero', 1, 1), pos('Middle', 2, 2), pos('Outside', 2, 2)],
  }),
  attendances: team([
    [SANNE, 'ATTENDING'], [SOFIA, 'ATTENDING'], [LARS, 'ATTENDING'], [MILAN, 'ATTENDING'],
    [MEES, 'ATTENDING'], [TESS, 'ATTENDING'], [BRAM, 'ATTENDING'], [UWE, 'NOT_RESPONDED'],
  ]),
})

// HEADCOUNT_SHORT — tracked, but by a headcount rather than positions. No rows to draw pips for, so
// the panel is the fraction and the nudge; and with no positions the member list goes flat, each row
// carrying its own position as a subtitle instead of a heading above it.
const HEADCOUNT_SHORT = makeEvent({
  id: 'evt-headcount',
  eventType: TYPES.match,
  title: 'Regio-toernooi',
  startTime: on(20, 10),
  location: 'Topsportcentrum',
  myState: 'MAYBE',
  roster: makeRoster({
    state: 'HEADCOUNT_SHORT',
    totalTarget: 8,
    totalAttending: 5,
    openSlots: 3,
    positions: [],
    unassignedAttending: 5,
  }),
  attendances: team([
    [SANNE, 'ATTENDING'], [SOFIA, 'ATTENDING'], [LARS, 'ATTENDING'], [MILAN, 'ATTENDING'],
    [MEES, 'ATTENDING'], [TESS, 'MAYBE'], [BRAM, 'ABSENT'], [UWE, 'NOT_RESPONDED'],
  ]),
})

// OFF — a social. No pips exist to draw, so this card is the one that ignores the preference and
// always opens onto its people (#324 cause 3).
const SOCIAL = makeEvent({
  id: 'evt-social',
  eventType: TYPES.social,
  title: 'Season Drinks',
  startTime: on(22, 21),
  location: 'Café De Zwaluw',
  myState: 'MAYBE',
  roster: makeRoster({ ...NO_ROSTER, totalAttending: 4 }),
  attendances: team([
    [SANNE, 'ATTENDING'], [SOFIA, 'MAYBE'], [LARS, 'ATTENDING'], [MILAN, 'ATTENDING'],
    [MEES, 'ATTENDING'], [TESS, 'MAYBE'], [BRAM, 'ABSENT'], [UWE, 'NOT_RESPONDED'],
  ]),
})

const EVERY_ROSTER_STATE = [MISSING_A_POSITION, SPOTS_OPEN, LINEUP_SET, HEADCOUNT_SHORT, SOCIAL]

/**
 * An open card's roster trigger. Matched unanchored and by both wordings on purpose: the accessible
 * name is the readiness badge *plus* the sr-only verb ("Missing a position Hide lineup"), so it
 * never starts with `Hide`, and a social says `who's coming` where a tracked event says `lineup`.
 */
const OPEN_PANEL = /Hide (lineup|who's coming)/

/**
 * The events route's wiring, in the smallest honest form: the preference in state, one panel factory
 * handing every card its own lineup. Exactly what the route does, so a story that drives the switch
 * drives the real composition rather than a story-only stand-in.
 */
interface ListWithPanelsProps {
  events: Event[]
  /** `Keep open`, as the store would have restored it. */
  defaultExpanded?: boolean
  /** Spies, so a story can prove the preference and the answer were reported, not merely rendered. */
  onDefaultExpandedChange?: (defaultExpanded: boolean) => void
  onRespond?: (eventId: string, userId: string, state: Event['myState']) => void
}

function ListWithPanels({
  events,
  defaultExpanded: initialExpanded = false,
  onDefaultExpandedChange,
  onRespond,
}: ListWithPanelsProps) {
  const [defaultExpanded, setDefaultExpanded] = useState(initialExpanded)

  return (
    <div>
      {/* The page header, in miniature: the one control that drives every card below. */}
      <div className="mb-2 flex justify-end">
        <PanelViewMenu
          defaultExpanded={defaultExpanded}
          onDefaultExpandedChange={(next) => {
            onDefaultExpandedChange?.(next)
            setDefaultExpanded(next)
          }}
        />
      </div>
      <EventListView
        events={events}
        now={NOW}
        currentUserId={LARS[0]}
        defaultRosterOpen={defaultExpanded}
        rosterPanel={(event) => (
          <EventLineupPanel
            attendances={event.attendances}
            roster={event.roster}
            currentUserId={LARS[0]}
            onRespond={(userId, state) => onRespond?.(event.id, userId, state)}
          />
        )}
      />
    </div>
  )
}

const meta = {
  title: 'widgets/event-panel/EventListPanels',
  component: ListWithPanels,
  decorators: [withRouter],
  args: { events: EVERY_ROSTER_STATE },
} satisfies Meta<typeof ListWithPanels>

export default meta

type Story = StoryObj<typeof meta>

// Picture owned by the page composite (pages/EventsPageView) — behavioural only (ADR-0031 §3).
// Five events, five roster states, nothing expanded — the card's resting state is unchanged by any
// of this, which is what the cap and the collapsed default are there to protect.
export const Data: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Missing a position')).toBeInTheDocument()
    await expect(canvas.getByText('2 spots open')).toBeInTheDocument()
    await expect(canvas.getByText('Lineup set')).toBeInTheDocument()
    await expect(canvas.getByText('3 more needed')).toBeInTheDocument()
    await expect(canvas.getByText('4 going')).toBeInTheDocument() // the social's headcount
    // Nothing is open, so no panel content is on screen at all.
    await expect(canvas.queryByText('Sanne Bakker')).not.toBeInTheDocument()
    await expect(canvas.queryByText('Lineup')).not.toBeInTheDocument()
  },
}

const BIG_SQUAD = Array.from({ length: 17 }, (_, i) =>
  makeAttendee(`u-big-${i}`, `Member ${String(i + 1).padStart(2, '0')}`, 'Unassigned', {
    state: i % 4 === 0 ? 'NOT_RESPONDED' : 'ATTENDING',
  }),
)

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        // The pips variety in one frame: red rings for a position with nobody, a mixed row, a fully
        // covered row, and a headcount-only panel with no rows at all. The social ignores the
        // preference — it has no pips to show — which is the one card here that opens onto names.
        'Every panel open on pips': <ListWithPanels {...args} defaultExpanded />,
        // The same five events on the member view: grouped under their positions where the roster
        // has any, flat with a position subtitle where it does not, non-responders named throughout.
        'Every panel open on members': <ListWithPanels {...args} view="members" defaultExpanded />,
        // A club side of 17 beside a normal card: capped at 15 with the rest behind the event, so
        // one card on the member view cannot swallow the screen and stop the list being a list.
        'A big squad is capped': (
          <ListWithPanels
            {...args}
            view="members"
            defaultExpanded
            events={[
              makeEvent({
                id: 'evt-big',
                eventType: TYPES.training,
                title: 'Club Night',
                startTime: on(12),
                roster: makeRoster({ state: 'TALLY_ONLY', openSlots: 0, totalAttending: 13, positions: [] }),
                attendances: BIG_SQUAD,
              }),
              SOCIAL,
            ]}
          />
        ),
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    // One open panel per card, and no preference chrome on any of them.
    await expect(region('Every panel open on pips').getAllByRole('button', { name: OPEN_PANEL })).toHaveLength(5)
    await expect(
      region('Every panel open on pips').queryByRole('switch', { name: 'Keep panels open' }),
    ).not.toBeInTheDocument()
    await expect(region('Every panel open on pips').getByText(/still has no one/)).toBeInTheDocument() // CRITICAL's chase nudge
    await expect(region('Every panel open on pips').getByText('4 of 4 covered')).toBeInTheDocument() // LINEUP_SET's fraction
    await expect(region('Every panel open on pips').getByText('5/8 going')).toBeInTheDocument() // the headcount-only panel
    // The social has no pips to draw, so it opens onto its people whatever the preference says —
    // and it is the ONLY card naming anyone while the rest are on pips.
    await expect(region('Every panel open on pips').getAllByText('Sanne Bakker')).toHaveLength(1)

    await expect(
      region('Every panel open on members').getAllByRole('heading', { name: 'Setter' }),
    ).toHaveLength(3) // the 3 with positions
    await expect(region('Every panel open on members').getAllByText('Uwe Hofman')).toHaveLength(5) // a non-responder, on every card
    await expect(region('Every panel open on members').getAllByText('Awaiting').length).toBeGreaterThan(0)
    // Read-only on every card, not just the one the per-card story checks (#271 ⑫).
    await expect(
      region('Every panel open on members').queryByRole('button', { name: /Change .+'s answer/ }),
    ).not.toBeInTheDocument()

    const card = within(
      region('A big squad is capped').getByText('Club Night').closest('.card-enter') as HTMLElement,
    )
    await expect(card.getByText(`Member ${MEMBER_CAP}`)).toBeInTheDocument()
    await expect(card.queryByText(`Member ${MEMBER_CAP + 1}`)).not.toBeInTheDocument()
    await expect(card.getByRole('link', { name: /See all 17/ })).toHaveAttribute(
      'href',
      '/t/setpoint-vt/events/evt-big',
    )
    // The neighbouring card is untouched by the cap — it is a per-card limit, not a list-wide one.
    await expect(region('A big squad is capped').getByText('Sanne Bakker')).toBeInTheDocument()
  },
}

// Picture owned by the page composite — behavioural only (ADR-0031 §1, §3). What only the list can
// prove: the view is ONE preference, not a per-card toggle (ADR-0030 §5), and `Keep open` is a *live*
// default (ADR-0030 §6) that reaches cards the member never touched, now. Two instances because each
// needs a starting point the other does not — every panel already open for the view switch, every
// panel closed for `Keep open` to reach.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  args: { onViewChange: fn(), onDefaultExpandedChange: fn() },
  render: (args) => (
    <Stack
      items={{
        'Switch view': <ListWithPanels {...args} defaultExpanded />,
        'Keep open': <ListWithPanels {...args} />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    // Every tracked card starts on pips; only the social names anyone.
    await expect(region('Switch view').getByText(/still has no one/)).toBeInTheDocument()
    await expect(region('Switch view').getAllByText('Sanne Bakker')).toHaveLength(1)

    // One control, in the header — not one per card, which is the whole point of the move.
    await userEvent.click(region('Switch view').getByRole('button', { name: 'View options' }))
    await userEvent.click(region('Switch view').getByRole('button', { name: 'People' }))
    await userEvent.keyboard('{Escape}')

    await expect(args.onViewChange).toHaveBeenCalledWith('members')
    // No card is left on the old view — the pips and their callouts are gone everywhere…
    await expect(region('Switch view').queryByText(/still has no one/)).not.toBeInTheDocument()
    await expect(region('Switch view').queryByText('4 of 4 covered')).not.toBeInTheDocument()
    // …and each of the five now names the team.
    await expect(region('Switch view').getAllByText('Sanne Bakker')).toHaveLength(5)

    // An open card's own trigger reads `Hide …`, so counting those counts the open panels — and it
    // counts them whichever view they are on, and whatever the header popover is doing.
    const openPanels = () => region('Keep open').queryAllByRole('button', { name: OPEN_PANEL })

    // Open one by hand; the other four are untouched and closed.
    await userEvent.click(region('Keep open').getAllByRole('button', { name: /Show lineup/ })[0])
    await expect(openPanels()).toHaveLength(1)

    await userEvent.click(region('Keep open').getByRole('button', { name: 'View options' }))
    await userEvent.click(region('Keep open').getByRole('switch', { name: 'Keep panels open' }))

    await expect(args.onDefaultExpandedChange).toHaveBeenCalledWith(true)
    await expect(openPanels()).toHaveLength(5)

    // And off again, which has to close them just as promptly.
    await userEvent.click(region('Keep open').getByRole('switch', { name: 'Keep panels open' }))
    await expect(args.onDefaultExpandedChange).toHaveBeenLastCalledWith(false)
    await expect(openPanels()).toHaveLength(0)
  },
}
