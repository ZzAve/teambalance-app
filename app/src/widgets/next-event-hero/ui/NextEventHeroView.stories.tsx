import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { makeEvent } from '@shared/testing/event-fixtures'
import { allModes } from '../../../../.storybook/modes'
import { NextEventHeroView } from './NextEventHeroView'

// NextEventHeroView is the prop-only Next Up hero behind the NextEventHero container: the event,
// the viewer's own response and the RSVP callback all come in as props, so every state renders with
// no network (ADR-0017). `now` is a prop too, which pins the countdown for the snapshot.
//
// There is deliberately no "nothing coming up" story: when no event qualifies the page renders no
// hero at all. That boundary is proven by the selectHeroEvent unit test and the list's Empty story.
const NOW = new Date(2026, 7, 10, 9, 0) // Monday 10 August 2026, 09:00 local

const EVENT = makeEvent({
  id: 'evt-hero',
  eventType: { id: 'et-2', name: 'Training', color: '#249E6C' },
  title: 'Training — Court 2',
  startTime: new Date(2026, 7, 12, 20, 0).toISOString(),
  location: 'Sporthal De Toekomst',
  attendanceSummary: { attending: 10, maybe: 1, absent: 0, notResponded: 4, roleBreakdown: [] },
})

// Token-sensitive component (ADR-0027 §3): the largest themed surface plus the RSVP colouring, so
// modes at the meta level give every state a light *and* a dark baseline.
const meta = {
  title: 'widgets/next-event-hero/NextEventHeroView',
  component: NextEventHeroView,
  decorators: [withRouter],
  args: { event: EVENT, now: NOW, myState: 'NOT_RESPONDED', onRespond: fn() },
  parameters: { chromatic: { modes: { light: allModes.light, dark: allModes.dark } } },
} satisfies Meta<typeof NextEventHeroView>

/**
 * What is actually on top at the centre of `el` — a real hit-test, not a DOM-tree lookup.
 *
 * These stories run in headless Chromium (Vitest browser mode), so `elementFromPoint` resolves the
 * stretched-link overlay, `z-index` and `pointer-events` exactly as a thumb would. That is the only
 * honest way to prove "this area is clickable": the overlay is a pseudo-element, so it is invisible
 * to queries and to `userEvent`'s own targeting.
 */
function topmostAtCentreOf(el: Element): Element | null {
  const { left, top, width, height } = el.getBoundingClientRect()
  return document.elementFromPoint(left + width / 2, top + height / 2)
}

export default meta

type Story = StoryObj<typeof meta>

export const HasNext: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Next up')).toBeInTheDocument()
    await expect(canvas.getByText('Training — Court 2')).toBeInTheDocument()
    await expect(canvas.getByText('Sporthal De Toekomst')).toBeInTheDocument()
    // Two days and eleven hours out, floored to the largest useful unit.
    await expect(canvas.getByText('2d')).toBeInTheDocument()
  },
}

export const HaventReplied: Story = {
  // Behavioural twin of HasNext — default args render the identical picture (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/10 going · you haven't replied/)).toBeInTheDocument()
    // Neither answer is pressed yet — "I'm in" is solid because it is the invitation.
    await expect(canvas.getByRole('button', { name: /I'm in/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    await expect(canvas.getByRole('button', { name: /Can't make it/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  },
}

export const Going: Story = {
  args: { myState: 'ATTENDING' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/10 going · you're in/)).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /I'm in/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  },
}

export const NotGoing: Story = {
  args: { myState: 'ABSENT' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/10 going · you're out/)).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /Can't make it/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  },
}

// "Maybe" can only be set from the detail page — the hero offers the two answers it offers. So it
// shows neither button as chosen and lets the status line carry what was actually said.
export const Maybe: Story = {
  args: { myState: 'MAYBE' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/10 going · you said maybe/)).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /I'm in/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    await expect(canvas.getByRole('button', { name: /Can't make it/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  },
}

// Prop-contract spies: the inline RSVP is the whole point of the hero, so prove both buttons
// actually call onRespond with the right state — not merely that they render.
export const RsvpIn: Story = {
  // Behavioural twin of HasNext — the View is controlled, so a click reports to onRespond without
  // re-rendering; the post-play picture is HasNext's (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /I'm in/ }))
    await expect(args.onRespond).toHaveBeenCalledWith('ATTENDING')
  },
}

export const RsvpOut: Story = {
  // Behavioural twin of HasNext — controlled click, picture unchanged from HasNext (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Can't make it/ }))
    await expect(args.onRespond).toHaveBeenCalledWith('ABSENT')
  },
}

export const Saving: Story = {
  args: { isSaving: true },
  play: async ({ canvas, userEvent, args }) => {
    // Both answers are held while an RSVP is in flight, so a double-tap can't race the mutation.
    await expect(canvas.getByRole('button', { name: /I'm in/ })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: /Can't make it/ })).toBeDisabled()
    await userEvent.click(canvas.getByRole('button', { name: /I'm in/ }))
    await expect(args.onRespond).not.toHaveBeenCalled()
  },
}

// The hero is one big target: everything that isn't its own control opens the event. The title
// carries a stretched-link overlay, so the passive rows (countdown, date, headcount, padding) all
// hit that link instead of dead text — the same pattern EventCard already uses in the list below.
export const WholeCardIsClickable: Story = {
  // Behavioural twin of HasNext — a hit-test that changes nothing visible; picture = HasNext
  // (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, canvasElement }) => {
    const cardLink = canvas.getByRole('link', { name: EVENT.title })
    const hero = canvasElement.querySelector('section')!

    // Passive rows: each one hits the card link, not the text node under the cursor.
    for (const passive of [
      canvas.getByText('Next up'),
      canvas.getByText('2d'), // the countdown block sits above the overlay but lets taps through
      canvas.getByText(/20:00/), // the date · time row
      canvas.getByText(/10 going/),
    ]) {
      await expect(topmostAtCentreOf(passive)).toBe(cardLink)
    }

    // Bare padding — the strip below the buttons — is part of the target too.
    const { left, bottom, width } = hero.getBoundingClientRect()
    await expect(document.elementFromPoint(left + width / 2, bottom - 4)).toBe(cardLink)
  },
}

// The other half of the bargain: widening the target must not swallow the controls inside it.
// A stretched overlay covering the RSVP buttons would make the hero's whole point unreachable, and
// `userEvent` alone would not notice — it dispatches at the button either way.
export const ControlsStayAboveTheOverlay: Story = {
  // Behavioural twin of HasNext — a hit-test that changes nothing visible; picture = HasNext
  // (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, canvasElement }) => {
    for (const name of [/I'm in/, /Can't make it/]) {
      const button = canvas.getByRole('button', { name })
      await expect(topmostAtCentreOf(button)?.closest('button')).toBe(button)
    }

    // (The matching hover affordance — the card washes and the title underlines over the passive
    // rows, but stays quiet over these buttons — hangs off the link's own :hover, since the overlay
    // is the link's hit area. It is not asserted here: `userEvent` is synthetic and never moves a
    // real cursor, so CSS :hover cannot be driven at this layer.)

    // The location opens maps, so it stays its own target — and stays a *sibling* of the card link
    // rather than a nested <a>, which is invalid HTML.
    const maps = canvas.getByRole('link', { name: EVENT.location })
    await expect(topmostAtCentreOf(maps)?.closest('a')).toBe(maps)
    await expect(maps).toHaveAttribute('href', expect.stringContaining('maps.google.com'))
    await expect(maps).toHaveAttribute('target', '_blank')
    await expect(canvasElement.querySelectorAll('a a')).toHaveLength(0)
  },
}

// A same-day hero drops to hours, which is the one thing the card's date chit cannot say.
export const StartingToday: Story = {
  args: {
    event: makeEvent({
      ...EVENT,
      startTime: new Date(2026, 7, 10, 20, 0).toISOString(),
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('11h')).toBeInTheDocument()
  },
}
