import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { AttendanceEntry, Event } from '@shared/api/events'
import { withRouter } from '@shared/testing/router-decorator'
import { makeAttendee, makeEvent, makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { EventListView } from '@entities/event/ui/EventListView'
import { PanelViewMenu } from '@features/event-panel-view/ui/PanelViewMenu'
import { Stack } from '@shared/testing/stack'
import { EventLineupPanel } from './EventLineupPanel'

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
 * `component` is the harness (`ListWithPanels`): the events page's own wiring is the seam this file
 * exists to cover.
 *
 * Rendered inside the events page composite (pages/EventsPageView), so per the ownership rule
 * (ADR-0032 §3) its `Data` story is behavioural only — the composite's own picture already shows this
 * list, with its panels, in context.
 *
 * Three-story shape (ADR-0032 §1):
 *   1. `Data` — the list at rest, five events, five roster states, nothing expanded, disableSnapshot
 *      (picture owned by the page).
 *   2. `Shells` — every panel open at once, and a big squad capped, stacked in one frame — this
 *      picture stays, since the composite's default frame cannot show a card already open.
 *   3. `Interactions` — no picture; what only the list can prove: a chip on one card answers for the
 *      member on *that* card, `Keep open` reaches cards the member never touched, and expanding a
 *      crowded cluster inside a big squad leaves the neighbouring card untouched.
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

// `component` is the harness, not EventListView: the args a story drives here are the events page's
// own wiring, which is the seam this file exists to cover. The list's own four states
// (loading / error / empty / data) stay where they were, in EventListView.stories.tsx.
const meta = {
  title: 'widgets/event-panel/EventListPanels',
  component: ListWithPanels,
  decorators: [withRouter],
  args: { events: EVERY_ROSTER_STATE },
} satisfies Meta<typeof ListWithPanels>

export default meta

type Story = StoryObj<typeof meta>

// Picture owned by the page composite (pages/EventsPageView) — behavioural only (ADR-0032 §3).
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

// Zero-padded, because the panel sorts members by name and "Member 10" sorts before "Member 2" —
// which would make the assertions below read backwards for a reason that has nothing to do with the
// cap they are about.
const BIG_SQUAD = Array.from({ length: 17 }, (_, i) =>
  makeAttendee(`u-big-${i}`, `Member ${String(i + 1).padStart(2, '0')}`, 'Unassigned', {
    state: i % 4 === 0 ? 'NOT_RESPONDED' : 'ATTENDING',
  }),
)

// A club side of 17 beside a normal card. The panel caps each cluster and hands the rest to a
// counter, so one card cannot swallow the screen and stop the list being a list.
const bigSquadEvents = (): Event[] => [
  makeEvent({
    id: 'evt-big',
    eventType: TYPES.training,
    title: 'Club Night',
    startTime: on(12),
    roster: makeRoster({ state: 'TALLY_ONLY', openSlots: 0, totalAttending: 13, positions: [] }),
    attendances: BIG_SQUAD,
  }),
  SOCIAL,
]

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        // The whole variety in one frame: a position with nobody, a mixed row, a covered row, a
        // headcount-only panel, and a social. One panel does all five now — before the lineup panel
        // this took two stories, because the card opened onto pips OR names and neither could show
        // both.
        'Every panel open': <ListWithPanels {...args} defaultExpanded />,
        // Capped and collapsed — the picture the counter exists to protect.
        'A big squad is capped': <ListWithPanels {...args} defaultExpanded events={bigSquadEvents()} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    const everyPanelOpen = region('Every panel open')

    // One open panel per card, and no preference chrome on any of them.
    await expect(everyPanelOpen.getAllByRole('button', { name: OPEN_PANEL })).toHaveLength(5)
    await expect(everyPanelOpen.queryByRole('switch', { name: 'Keep panels open' })).not.toBeInTheDocument()

    // Targets and people at once, which is the merge: the verdict words come from the roster, the
    // names beside them from the attendances, on the same rows.
    await expect(everyPanelOpen.getAllByText('nobody yet').length).toBeGreaterThan(0)
    await expect(everyPanelOpen.getByText('4 of 4 covered')).toBeInTheDocument()
    await expect(everyPanelOpen.getByText('5/8 going')).toBeInTheDocument() // the headcount-only panel
    // Every card names the team, the social included — there is no view that hides them any more.
    await expect(everyPanelOpen.getAllByText(/Sanne/)).toHaveLength(5)
    // A non-responder is still on every card, whatever its roster state — named in the chip's
    // accessible name even though the chip itself prints only a first name.
    await expect(everyPanelOpen.getAllByRole('button', { name: /Uwe Hofman — Awaiting/ })).toHaveLength(5)

    const bigSquad = region('A big squad is capped')
    const card = within(bigSquad.getByText('Club Night').closest('.card-enter') as HTMLElement)
    // Twelve going, four shown plus a counter — the collapsed row is a handful of chips, not 17.
    await expect(card.getByRole('button', { name: /Member 02 —/ })).toBeInTheDocument()
    await expect(card.queryByRole('button', { name: /Member 16 —/ })).not.toBeInTheDocument()
    // The neighbouring card is untouched by the cap — it is a per-card limit, not a list-wide one.
    await expect(bigSquad.getByRole('button', { name: /Sanne Bakker/ })).toBeInTheDocument()
  },
}

// Fresh per story-run spies (ADR-0032 §1 — a Stack instance a play clicks needs its own): sharing
// the meta-level `args` would mean the "Keep open" instance's clicks show up in the same spy as the
// "Answer from a card" instance's.
const onRespondSpy = fn()
const onDefaultExpandedChangeSpy = fn()

// Picture owned by the page composite (pages/EventsPageView) — behavioural only (ADR-0032 §3). Three
// instances, each needing a starting point the others do not: an open card to answer from, every
// panel closed for `Keep open` to reach, and a big squad already open to expand.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        'Answer from a card': <ListWithPanels {...args} defaultExpanded onRespond={onRespondSpy} />,
        'Keep open': <ListWithPanels {...args} onDefaultExpandedChange={onDefaultExpandedChangeSpy} />,
        'Big squad': <ListWithPanels {...args} defaultExpanded events={bigSquadEvents()} />,
      }}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    // Answering from the list, on the right card. A chip reaches its own member and its own event,
    // which a per-card story cannot prove: five cards carry the same squad, so a factory closing over
    // the wrong event would look identical.
    const answerFrom = region('Answer from a card')
    const criticalCard = within(
      answerFrom.getByText('League Match vs Smash United').closest('.card-enter') as HTMLElement,
    )
    await userEvent.click(criticalCard.getAllByRole('button', { name: /Sanne Bakker/ })[0])
    await userEvent.click(within(document.body).getByRole('button', { name: "Can't go" }))
    await expect(onRespondSpy).toHaveBeenCalledWith('evt-critical', SANNE[0], 'ABSENT')

    // `Keep open` is a *live* default (ADR-0030 §6): turning it on opens the cards the member never
    // touched, now — not on their next visit. The card holds its own open state, so this is the one
    // behaviour that only appears when the preference changes under a list that is already rendered.
    const keepOpen = region('Keep open')
    // An open card's own trigger reads `Hide …`, so counting those counts the open panels.
    const openPanels = () => keepOpen.queryAllByRole('button', { name: OPEN_PANEL })

    // Open one by hand; the other four are untouched and closed.
    await userEvent.click(keepOpen.getAllByRole('button', { name: /Show lineup/ })[0])
    await expect(openPanels()).toHaveLength(1)

    await userEvent.click(keepOpen.getByRole('button', { name: 'View options' }))
    await userEvent.click(keepOpen.getByRole('switch', { name: 'Keep panels open' }))
    await expect(onDefaultExpandedChangeSpy).toHaveBeenCalledWith(true)
    await expect(openPanels()).toHaveLength(5)

    // And off again, which has to close them just as promptly.
    await userEvent.click(keepOpen.getByRole('switch', { name: 'Keep panels open' }))
    await expect(onDefaultExpandedChangeSpy).toHaveBeenLastCalledWith(false)
    await expect(openPanels()).toHaveLength(0)

    // A club side of 17: expanding one card's crowded cluster leaves its neighbour untouched.
    const bigSquad = region('Big squad')
    const clubNight = within(bigSquad.getByText('Club Night').closest('.card-enter') as HTMLElement)
    await userEvent.click(clubNight.getByRole('button', { name: 'Show 8 more going' }))
    await expect(clubNight.getByRole('button', { name: /Member 16 —/ })).toBeInTheDocument()
    // The five awaiting sit in their own cluster, which is at the cap and so shows in full: the limit
    // is per run of chips, not per row — and certainly not per list.
    await expect(clubNight.getByRole('button', { name: /Member 17 — Awaiting/ })).toBeInTheDocument()
    await expect(bigSquad.getByRole('button', { name: /Sanne Bakker/ })).toBeInTheDocument()
  },
}
