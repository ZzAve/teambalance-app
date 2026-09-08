import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { makeEvent, makeRoster } from '@shared/testing/event-fixtures'
import { allModes } from '../../../../.storybook/modes'
import { EventCard } from './EventCard'

// EventCard renders a TanStack Router <Link to="/events/$eventId">, which needs a router in context.
// The shared withRouter decorator supplies a minimal in-memory router so the link target resolves.
//
// Prop-only (ADR-0017): the answer + the mutation are the events route's job; here `myState` and
// `onRespond` are plain props. `now` is a prop too, so every relative-label state is a fixed render
// rather than a function of when the story runs — which also keeps the Chromatic snapshots stable.
const NOW = new Date(2026, 7, 10, 9, 0) // Monday 10 August 2026, 09:00 local
const on = (day: number, hour = 20, minute = 0) => new Date(2026, 7, day, hour, minute).toISOString()

// Token-sensitive component (ADR-0027 §3): the event-type colour chits on the card surface, so
// modes at the meta level give every state a light *and* a dark baseline.
const meta = {
  title: 'entities/event/EventCard',
  component: EventCard,
  decorators: [withRouter],
  args: { now: NOW, myState: 'NOT_RESPONDED', onRespond: fn() },
  parameters: { chromatic: { modes: { light: allModes.light, dark: allModes.dark } } },
} satisfies Meta<typeof EventCard>

export default meta

type Story = StoryObj<typeof meta>

export const Populated: Story = {
  args: {
    event: makeEvent({ startTime: on(13, 14, 30), location: 'Sportcentrum Noord' }),
  },
  play: async ({ canvas }) => {
    // The date chit leads with weekday / day number / month, so the meta line needs no date.
    await expect(canvas.getByText('13')).toBeInTheDocument()
    await expect(canvas.getByText('14:30')).toBeInTheDocument()
    // The type text label stays alongside the chit's colour.
    await expect(canvas.getByText('Match')).toBeInTheDocument()
    // The bottom row answers "what did I say?" — unanswered here, so it asks.
    await expect(canvas.getByText('Respond')).toBeInTheDocument()
    // The old "✓ 5 going · of 8 · 3 pending" counts are gone from the card.
    await expect(canvas.queryByText(/of 8/)).not.toBeInTheDocument()
    await expect(canvas.queryByText(/pending/)).not.toBeInTheDocument()
  },
}

// The viewer's own answer, shown in words on the left.
export const AnswerAttending: Story = {
  args: { event: makeEvent({ startTime: on(13) }), myState: 'ATTENDING' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("You're in")).toBeInTheDocument()
  },
}

// Three days out: inside the window, past the imminent band — a quiet grey label, no pill.
export const WithQuietRelativeLabel: Story = {
  args: { event: makeEvent({ startTime: on(13) }) },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('in 3 days')).toBeInTheDocument()
  },
}

// Tomorrow: the imminent band, so the label is the solid ink pill.
export const WithSolidRelativeLabel: Story = {
  args: { event: makeEvent({ startTime: on(11) }) },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Tomorrow')).toBeInTheDocument()
  },
}

// Beyond RELATIVE_WINDOW_DAYS the chit's date says it better than "in 21 days" would.
export const WithoutRelativeLabel: Story = {
  args: { event: makeEvent({ startTime: on(31) }) },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('31')).toBeInTheDocument()
    await expect(canvas.queryByText(/^in \d+ days$/)).not.toBeInTheDocument()
    await expect(canvas.queryByText(/^(Today|Tomorrow|This weekend)$/)).not.toBeInTheDocument()
  },
}

// A social event: tracking is off, so the right slot falls back to a headcount (⑥). The row is still
// one tap target — every event can be answered from the card.
export const SocialEvent: Story = {
  args: {
    event: makeEvent({
      eventType: { id: 'et-4', name: 'Social', color: '#F4B400' },
      title: 'Season kick-off drinks',
      startTime: on(15, 21, 0),
      location: 'Café De Hoek',
      roster: {
        trackRoster: false,
        totalTarget: undefined,
        totalAttending: 11,
        positions: [],
        unassignedAttending: 0,
        openSlots: 0,
        state: 'OFF',
      },
    }),
  },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('Social')).toBeInTheDocument()
    await expect(canvas.getByText('Season kick-off drinks')).toBeInTheDocument()
    // No roster verdict, so the headcount fallback carries the team information.
    await expect(canvas.getByText('11 going')).toBeInTheDocument()
    // The 15th is the Saturday of the current week.
    await expect(canvas.getByText('This weekend')).toBeInTheDocument()
    // Tapping the row opens the answer control even for a social.
    await userEvent.click(canvas.getByRole('button', { name: /Change your answer/ }))
    await expect(canvas.getByRole('button', { name: 'Going' })).toBeInTheDocument()
  },
}

// The roster verdict in place on a real card (#219): the badge sits at the end of the answer row,
// collapsed, and the panel drops beneath it. RosterPips / ReadinessBadge stories cover every roster
// state; this proves the composition — that the card gives the row room and that tapping it does not
// follow the card's stretched link.
export const WithRosterVerdict: Story = {
  args: {
    event: makeEvent({
      startTime: on(13, 14, 30),
      location: 'Sportcentrum Noord',
      roster: makeRoster({
        state: 'CRITICAL',
        openSlots: 2,
        totalAttending: 5,
        positions: [
          { id: 'pos-setter', label: 'Setter', required: 2, attending: 2 },
          { id: 'pos-libero', label: 'Libero', required: 1, attending: 0 },
          { id: 'pos-middle', label: 'Middle', required: 2, attending: 1 },
        ],
      }),
    }),
  },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('Missing a position')).toBeInTheDocument()
    // Collapsed on a list card until asked.
    await expect(canvas.queryByText(/the one to chase/)).not.toBeInTheDocument()

    // The verdict is its own disclosure now — opening it reveals the pips, not the answer control.
    await userEvent.click(canvas.getByRole('button', { name: /Show lineup/ }))

    await expect(canvas.getByText('1 of 3 covered')).toBeInTheDocument()
    await expect(canvas.getByText(/still has no one/)).toBeInTheDocument()
  },
}

export const WithReferences: Story = {
  args: {
    event: makeEvent({
      startTime: on(13),
      references: [
        { title: 'Nevobo', url: 'https://api.nevobo.nl/permalink/wedstrijd/2018133' },
        { title: 'Match form', url: 'https://dwf.volleybal.nl/match/42' },
        { title: 'Route', url: 'https://maps.example.com/hall' },
      ],
    }),
  },
  play: async ({ canvas, canvasElement }) => {
    // Two chips visible on the card, the third collapsed into "+1".
    await expect(canvas.getByRole('link', { name: /Nevobo/ })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: /Match form/ })).toBeInTheDocument()
    await expect(canvas.getByText('+1')).toBeInTheDocument()
    // Chips are siblings of (not nested in) the card's own <Link> anchor — no invalid <a> in <a>.
    await expect(canvasElement.querySelectorAll('a a')).toHaveLength(0)
  },
}

export const WithLocation: Story = {
  args: { event: makeEvent({ startTime: on(13), location: 'Sporthal De Boog' }) },
  play: async ({ canvas, canvasElement }) => {
    // The location is plain text on the card (ADR-0030 §9): a maps link is a destination competing
    // with the card's own, right beside the disclosures. It lives on the detail page instead.
    await expect(canvas.getByText('Sporthal De Boog')).toBeInTheDocument()
    await expect(canvasElement.querySelectorAll('a[href*="maps.google.com"]')).toHaveLength(0)
    // The reference chips are still sibling anchors of the card's own <Link>, never nested inside
    // it (invalid HTML — the "<a> cannot contain a nested <a>" warning, #273); the card stays
    // clickable via a stretched-link overlay.
    await expect(canvasElement.querySelectorAll('a a')).toHaveLength(0)
  },
}

// ── Hit areas (#324) ─────────────────────────────────────────────────────────────────────────────

/** What a tap at a viewport point actually lands on — the honest hit-area question. */
const hitAt = (el: HTMLElement, x: number, y: number) => el.ownerDocument.elementFromPoint(x, y)

// Cause 1: the spacing band between the card's rule and the answer pill fell through to the card's
// stretched-link overlay, so a thumb aiming slightly high navigated instead of opening the answer
// control. That band is the trigger's own padding now, so a tap in it opens the disclosure.
export const AnswerTriggerBandIsTappable: Story = {
  args: { event: makeEvent({ startTime: on(13), location: 'Sportcentrum Noord' }) },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const trigger = canvas.getByRole('button', { name: /Change your answer/ })
    const pill = canvas.getByText('Respond').getBoundingClientRect()

    // 6px above the pill: inside the strip's top spacing, where a high thumb lands.
    const hit = hitAt(canvasElement, pill.left + pill.width / 2, pill.top - 6)
    await expect(trigger.contains(hit)).toBe(true)
    // …and it is not the card's stretched link.
    await expect(hit?.closest('a')).toBeNull()

    await userEvent.click(hit as HTMLElement)
    // The disclosure fired: the three-way answer control is open, and nothing was answered for us.
    await expect(canvas.getByRole('button', { name: /^Going$/ })).toBeInTheDocument()
    await expect(args.onRespond).not.toHaveBeenCalled()
  },
}

// Same band on the right-hand verdict trigger.
export const RosterTriggerBandIsTappable: Story = {
  args: {
    event: makeEvent({
      startTime: on(13),
      roster: makeRoster({
        state: 'CRITICAL',
        openSlots: 2,
        totalAttending: 5,
        positions: [{ id: 'pos-libero', label: 'Libero', required: 2, attending: 0 }],
      }),
    }),
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /Show lineup/ })
    const badge = canvas.getByText('Missing a position').getBoundingClientRect()

    const hit = hitAt(canvasElement, badge.left + badge.width / 2, badge.top - 6)
    await expect(trigger.contains(hit)).toBe(true)
    await expect(hit?.closest('a')).toBeNull()

    await userEvent.click(hit as HTMLElement)
    await expect(canvas.getByText('Positions')).toBeInTheDocument()
  },
}

// Cause 2: both triggers are a real thumb target (≥44 CSS px). The height sits on the button
// (`min-h-11`), so the pills inside keep the size they had.
export const TriggersAreThumbSized: Story = {
  args: { event: makeEvent({ startTime: on(13), roster: makeRoster() }) },
  play: async ({ canvas }) => {
    for (const name of [/Change your answer/, /Show lineup/]) {
      const box = canvas.getByRole('button', { name }).getBoundingClientRect()
      await expect(box.height).toBeGreaterThanOrEqual(44)
    }
  },
}

// The stretched link is still the point of the card: everything outside the answer strip navigates.
export const CardBodyStillNavigates: Story = {
  args: { event: makeEvent({ startTime: on(13), title: 'Match vs Nova', location: 'Sportcentrum Noord' }) },
  play: async ({ canvas, canvasElement }) => {
    const link = canvas.getByRole('link', { name: 'Match vs Nova' })
    const title = link.getBoundingClientRect()

    // Blank card surface to the right of the title — covered by the link's stretched overlay.
    const hit = hitAt(canvasElement, canvasElement.getBoundingClientRect().right - 6, title.top + title.height / 2)
    await expect(hit).toBe(link)
  },
}
