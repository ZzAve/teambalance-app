import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { makeEvent, makeRoster } from '@shared/testing/event-fixtures'
import { Stack } from '@shared/testing/stack'
import { darkMode } from '../../../../.storybook/modes'
import { EventCard } from './EventCard'

// EventCard renders a TanStack Router <Link to="/events/$eventId">, which needs a router in context.
// The shared withRouter decorator supplies a minimal in-memory router so the link target resolves.
//
// Prop-only (ADR-0017): the answer + the mutation are the events route's job; here `myState` and
// `onRespond` are plain props. `now` is a prop too, so every relative-label state is a fixed render
// rather than a function of when the story runs — which also keeps the Chromatic snapshots stable.
//
// Two stories (ADR-0031 §2): `Gallery` stacks every visually distinct card — populated, answered,
// the three relative-label bands, a social (headcount fallback), the roster verdict open onto its
// pips (via `defaultRosterOpen`, no click needed for a static picture), staff attending, references
// and location — one snapshot, no clicks (a click's end state would become *that* frame's baseline).
// `Interactions` is `disableSnapshot` and walks every click this file used to spend a whole story on:
// opening a disclosure, the hit-area geometry (#324), and the thumb-size floor, plus the `onRespond`
// prop-contract check.
const NOW = new Date(2026, 7, 10, 9, 0) // Monday 10 August 2026, 09:00 local
const on = (day: number, hour = 20, minute = 0) => new Date(2026, 7, day, hour, minute).toISOString()

// Token-sensitive component (ADR-0027 §3): the event-type colour chits on the card surface, so
// modes at the meta level give every state a light *and* a dark baseline.
const meta = {
  title: 'entities/event/EventCard',
  component: EventCard,
  decorators: [withRouter],
  args: { now: NOW, myState: 'NOT_RESPONDED', onRespond: fn() },
  parameters: { chromatic: { modes: darkMode } },
} satisfies Meta<typeof EventCard>

export default meta

type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  // Unused by render below — every Stack item supplies its own `event` — but required to satisfy
  // the story's prop contract (`event` is required on EventCard).
  args: { event: makeEvent() },
  render: (args) => (
    <Stack
      items={{
        Populated: (
          <EventCard {...args} event={makeEvent({ startTime: on(13, 14, 30), location: 'Sportcentrum Noord' })} />
        ),
        // The viewer's own answer, shown in words on the left.
        Answered: <EventCard {...args} event={makeEvent({ startTime: on(13) })} myState="ATTENDING" />,
        // Three days out: inside the window, past the imminent band — a quiet grey label, no pill.
        'Quiet relative label': <EventCard {...args} event={makeEvent({ startTime: on(13) })} />,
        // Tomorrow: the imminent band, so the label is the solid ink pill.
        'Solid relative label': <EventCard {...args} event={makeEvent({ startTime: on(11) })} />,
        // Beyond RELATIVE_WINDOW_DAYS the chit's date says it better than "in 21 days" would.
        'No relative label': <EventCard {...args} event={makeEvent({ startTime: on(31) })} />,
        // A social event: tracking is off, so the right slot falls back to a headcount (⑥). Labelled
        // "Social event" rather than "Social" — the card's own type badge reads "Social" too, and the
        // two would collide on the same text query within this region.
        'Social event': (
          <EventCard
            {...args}
            event={makeEvent({
              eventType: { id: 'et-4', name: 'Social', color: '#F4B400' },
              title: 'Season kick-off drinks',
              startTime: on(15, 21, 0),
              location: 'Café De Hoek',
              roster: {
                trackRoster: false,
                totalTarget: undefined,
                totalAttending: 11,
                playingAttending: 11,
                staffAttending: 0,
                positions: [],
                unassignedAttending: 0,
                openSlots: 0,
                state: 'OFF',
              },
            })}
          />
        ),
        // The roster verdict in place on a real card (#219): the badge sits at the end of the answer
        // row, collapsed by default, with the panel beneath it — opened here via `defaultRosterOpen`
        // rather than a click, so the composed picture (badge + pips) is a single static frame.
        'Roster verdict': (
          <EventCard
            {...args}
            defaultRosterOpen
            event={makeEvent({
              startTime: on(13, 14, 30),
              location: 'Sportcentrum Noord',
              roster: makeRoster({
                state: 'CRITICAL',
                openSlots: 2,
                totalAttending: 5,
                positions: [
                  { id: 'pos-setter', label: 'Setter', required: 2, attending: 2, kind: 'PLAYING' },
                  { id: 'pos-libero', label: 'Libero', required: 1, attending: 0, kind: 'PLAYING' },
                  { id: 'pos-middle', label: 'Middle', required: 2, attending: 1, kind: 'PLAYING' },
                ],
              }),
            })}
          />
        ),
        // The reported surface (#281). A training wanting 12, attended by 11 players and a coach:
        // the card used to carry a green "Full" here, because the coach filled the twelfth slot. It
        // now reads "1 more needed", and the opened lineup shows both why (the fraction counts 11)
        // and where the twelfth person went (the staff line).
        'Staff attending': (
          <EventCard
            {...args}
            defaultRosterOpen
            event={makeEvent({
              title: 'Training',
              startTime: on(13, 20, 0),
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
            })}
          />
        ),
        'With references': (
          <EventCard
            {...args}
            event={makeEvent({
              startTime: on(13),
              references: [
                { title: 'Nevobo', url: 'https://api.nevobo.nl/permalink/wedstrijd/2018133' },
                { title: 'Match form', url: 'https://dwf.volleybal.nl/match/42' },
                { title: 'Route', url: 'https://maps.example.com/hall' },
              ],
            })}
          />
        ),
        // The location is plain text on the card (ADR-0030 §9): a maps link is a destination
        // competing with the card's own, right beside the disclosures. It lives on the detail page.
        'With location': (
          <EventCard {...args} event={makeEvent({ startTime: on(13), location: 'Sporthal De Boog' })} />
        ),
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    // The date chit leads with weekday / day number / month, so the meta line needs no date.
    await expect(region('Populated').getByText('13')).toBeInTheDocument()
    await expect(region('Populated').getByText('14:30')).toBeInTheDocument()
    // The type text label stays alongside the chit's colour.
    await expect(region('Populated').getByText('Match')).toBeInTheDocument()
    // The bottom row answers "what did I say?" — unanswered here, so it asks.
    await expect(region('Populated').getByText('Respond')).toBeInTheDocument()
    // The old "✓ 5 going · of 8 · 3 pending" counts are gone from the card.
    await expect(region('Populated').queryByText(/of 8/)).not.toBeInTheDocument()
    await expect(region('Populated').queryByText(/pending/)).not.toBeInTheDocument()

    await expect(region('Answered').getByText("You're in")).toBeInTheDocument()

    await expect(region('Quiet relative label').getByText('in 3 days')).toBeInTheDocument()

    await expect(region('Solid relative label').getByText('Tomorrow')).toBeInTheDocument()

    await expect(region('No relative label').getByText('31')).toBeInTheDocument()
    await expect(region('No relative label').queryByText(/^in \d+ days$/)).not.toBeInTheDocument()
    await expect(
      region('No relative label').queryByText(/^(Today|Tomorrow|This weekend)$/),
    ).not.toBeInTheDocument()

    await expect(region('Social event').getByText('Social')).toBeInTheDocument()
    await expect(region('Social event').getByText('Season kick-off drinks')).toBeInTheDocument()
    // No roster verdict, so the headcount fallback carries the team information.
    await expect(region('Social event').getByText('11 going')).toBeInTheDocument()
    // The 15th is the Saturday of the current week.
    await expect(region('Social event').getByText('This weekend')).toBeInTheDocument()

    await expect(region('Roster verdict').getByText('Missing a position')).toBeInTheDocument()
    await expect(region('Roster verdict').getByText('1 of 3 covered')).toBeInTheDocument()
    await expect(region('Roster verdict').getByText(/still has no one/)).toBeInTheDocument()

    // Not "Full" — the coach no longer fills a player's slot.
    await expect(region('Staff attending').getByText('1 more needed')).toBeInTheDocument()
    await expect(region('Staff attending').getByText('11/12 going')).toBeInTheDocument()
    await expect(
      region('Staff attending').getByText('1 staff also going, not counted toward the target'),
    ).toBeInTheDocument()
    // Excluded from the target, not hidden.
    await expect(region('Staff attending').getByText('Trainer')).toBeInTheDocument()

    // Two chips visible on the card, the third collapsed into "+1".
    await expect(region('With references').getByRole('link', { name: /Nevobo/ })).toBeInTheDocument()
    await expect(region('With references').getByRole('link', { name: /Match form/ })).toBeInTheDocument()
    await expect(region('With references').getByText('+1')).toBeInTheDocument()
    // Chips are siblings of (not nested in) the card's own <Link> anchor — no invalid <a> in <a>.
    await expect(
      canvas.getByRole('region', { name: 'With references' }).querySelectorAll('a a'),
    ).toHaveLength(0)

    await expect(region('With location').getByText('Sporthal De Boog')).toBeInTheDocument()
    const locationRegion = canvas.getByRole('region', { name: 'With location' })
    await expect(locationRegion.querySelectorAll('a[href*="maps.google.com"]')).toHaveLength(0)
    // Reference chips are still sibling anchors of the card's own <Link>, never nested inside it
    // (invalid HTML — the "<a> cannot contain a nested <a>" warning, #273); the card stays clickable
    // via a stretched-link overlay.
    await expect(locationRegion.querySelectorAll('a a')).toHaveLength(0)
  },
}

// ── Hit areas (#324) ─────────────────────────────────────────────────────────────────────────────

/** What a tap at a viewport point actually lands on — the honest hit-area question. */
const hitAt = (el: HTMLElement, x: number, y: number) => el.ownerDocument.elementFromPoint(x, y)

// Picture owned by Gallery — behavioural only (ADR-0031 §1). Separate instances because some steps
// need a state Gallery's static picture is never in (a disclosure closed and then opened by a real
// click, not `defaultRosterOpen`) or a fixture built only for a geometry check.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  // Unused by render below — every Stack item supplies its own `event` — but required to satisfy
  // the story's prop contract (`event` is required on EventCard).
  args: { event: makeEvent() },
  render: (args) => (
    <Stack
      items={{
        'Social event': (
          <EventCard
            {...args}
            event={makeEvent({
              eventType: { id: 'et-4', name: 'Social', color: '#F4B400' },
              title: 'Season kick-off drinks',
              startTime: on(15, 21, 0),
              location: 'Café De Hoek',
              roster: {
                trackRoster: false,
                totalTarget: undefined,
                totalAttending: 11,
                playingAttending: 11,
                staffAttending: 0,
                positions: [],
                unassignedAttending: 0,
                openSlots: 0,
                state: 'OFF',
              },
            })}
          />
        ),
        'Roster verdict': (
          <EventCard
            {...args}
            event={makeEvent({
              startTime: on(13, 14, 30),
              location: 'Sportcentrum Noord',
              roster: makeRoster({
                state: 'CRITICAL',
                openSlots: 2,
                totalAttending: 5,
                positions: [
                  { id: 'pos-setter', label: 'Setter', required: 2, attending: 2, kind: 'PLAYING' },
                  { id: 'pos-libero', label: 'Libero', required: 1, attending: 0, kind: 'PLAYING' },
                  { id: 'pos-middle', label: 'Middle', required: 2, attending: 1, kind: 'PLAYING' },
                ],
              }),
            })}
          />
        ),
        'Staff attending': (
          <EventCard
            {...args}
            event={makeEvent({
              title: 'Training',
              startTime: on(13, 20, 0),
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
            })}
          />
        ),
        // Cause 1: the spacing band between the card's rule and the answer pill fell through to the
        // card's stretched-link overlay, so a thumb aiming slightly high navigated instead of opening
        // the answer control. That band is the trigger's own padding now.
        'Answer trigger band': (
          <EventCard {...args} event={makeEvent({ startTime: on(13), location: 'Sportcentrum Noord' })} />
        ),
        // Same band on the right-hand verdict trigger.
        'Roster trigger band': (
          <EventCard
            {...args}
            event={makeEvent({
              startTime: on(13),
              roster: makeRoster({
                state: 'CRITICAL',
                openSlots: 2,
                totalAttending: 5,
                positions: [{ id: 'pos-libero', label: 'Libero', required: 2, attending: 0, kind: 'PLAYING' }],
              }),
            })}
          />
        ),
        // Cause 2: both triggers are a real thumb target (≥44 CSS px). The height sits on the button
        // (`min-h-11`), so the pills inside keep the size they had.
        'Thumb sized': <EventCard {...args} event={makeEvent({ startTime: on(13), roster: makeRoster() })} />,
        // The stretched link is still the point of the card: everything outside the answer strip
        // navigates.
        'Card body still navigates': (
          <EventCard
            {...args}
            event={makeEvent({ startTime: on(13), title: 'Match vs Nova', location: 'Sportcentrum Noord' })}
          />
        ),
      }}
    />
  ),
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    // Tapping the row opens the answer control even for a social.
    await userEvent.click(region('Social event').getByRole('button', { name: /Change your answer/ }))
    await expect(region('Social event').getByRole('button', { name: 'Going' })).toBeInTheDocument()

    // The verdict is its own disclosure — collapsed until asked, opening it reveals the pips, not
    // the answer control.
    await expect(region('Roster verdict').queryByText(/the one to chase/)).not.toBeInTheDocument()
    await userEvent.click(region('Roster verdict').getByRole('button', { name: /Show lineup/ }))
    // Full pip detail on the opened panel is Gallery's assertion (rendered via `defaultRosterOpen`);
    // this click only needs to prove the affordance itself opens it.
    await expect(region('Roster verdict').getByText('1 of 3 covered')).toBeInTheDocument()

    await userEvent.click(region('Staff attending').getByRole('button', { name: /Show lineup/ }))
    await expect(region('Staff attending').getByText('11/12 going')).toBeInTheDocument()

    const answerTrigger = region('Answer trigger band').getByRole('button', { name: /Change your answer/ })
    const answerPillEl = region('Answer trigger band').getByText('Respond')
    // The Stack holds several cards, so the target may sit outside the current scroll position —
    // bring it into view before trusting its on-screen coordinates.
    answerPillEl.scrollIntoView({ block: 'center' })
    const pill = answerPillEl.getBoundingClientRect()
    // 6px above the pill: inside the strip's top spacing, where a high thumb lands.
    const answerHit = hitAt(canvasElement, pill.left + pill.width / 2, pill.top - 6)
    await expect(answerTrigger.contains(answerHit)).toBe(true)
    // …and it is not the card's stretched link.
    await expect(answerHit?.closest('a')).toBeNull()
    await userEvent.click(answerHit as HTMLElement)
    // The disclosure fired: the three-way answer control is open, and nothing was answered for us.
    await expect(region('Answer trigger band').getByRole('button', { name: /^Going$/ })).toBeInTheDocument()
    await expect(args.onRespond).not.toHaveBeenCalled()

    const rosterTrigger = region('Roster trigger band').getByRole('button', { name: /Show lineup/ })
    const badgeEl = region('Roster trigger band').getByText('Missing a position')
    badgeEl.scrollIntoView({ block: 'center' })
    const badge = badgeEl.getBoundingClientRect()
    const rosterHit = hitAt(canvasElement, badge.left + badge.width / 2, badge.top - 6)
    await expect(rosterTrigger.contains(rosterHit)).toBe(true)
    await expect(rosterHit?.closest('a')).toBeNull()
    await userEvent.click(rosterHit as HTMLElement)
    await expect(region('Roster trigger band').getByText('Positions')).toBeInTheDocument()

    for (const name of [/Change your answer/, /Show lineup/]) {
      const box = region('Thumb sized').getByRole('button', { name }).getBoundingClientRect()
      await expect(box.height).toBeGreaterThanOrEqual(44)
    }

    const link = region('Card body still navigates').getByRole('link', { name: 'Match vs Nova' })
    link.scrollIntoView({ block: 'center' })
    const title = link.getBoundingClientRect()
    // Blank card surface to the right of the title — covered by the link's stretched overlay.
    const bodyHit = hitAt(canvasElement, canvasElement.getBoundingClientRect().right - 6, title.top + title.height / 2)
    await expect(bodyHit).toBe(link)
  },
}
