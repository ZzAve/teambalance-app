import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { makeEvent, makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { Stack } from '@shared/testing/stack'
import { NextEventHeroView } from './NextEventHeroView'

// NextEventHeroView is the prop-only Next Up hero behind the NextEventHero container: the event,
// the viewer's own response and the RSVP callback all come in as props, so every state renders with
// no network (ADR-0017). `now` is a prop too, which pins the countdown for the snapshot.
//
// There is deliberately no "nothing coming up" story: when no event qualifies the page renders no
// hero at all. That boundary is proven by the selectHeroEvent unit test and the list's Empty story.
//
// Rendered inside the events page composite (EventsPageView), so per the ownership rule
// (ADR-0031 §3) its Data story is behavioural only — the composite's own picture already shows this
// hero in context.
//
// Three-story shape (ADR-0031 §1):
//   1. Data — the default, unanswered instance, disableSnapshot (picture owned by the page).
//   2. Shells — every answer state, the saving hold, the same-day countdown and the readiness
//      variants, stacked in one frame — this picture stays, since the composite's default frame
//      cannot show any of them.
//   3. Interactions — no picture; the inline RSVP's prop-contract spies and the hit-area geometry
//      (#324) — both the whole-card link and the controls that must stay above its overlay.
const NOW = new Date(2026, 7, 10, 9, 0) // Monday 10 August 2026, 09:00 local

const EVENT = makeEvent({
  id: 'evt-hero',
  eventType: { id: 'et-2', name: 'Training', color: '#249E6C' },
  title: 'Training — Court 2',
  startTime: new Date(2026, 7, 12, 20, 0).toISOString(),
  location: 'Sporthal De Toekomst',
  attendanceSummary: { attending: 10, maybe: 1, absent: 0, notResponded: 4, roleBreakdown: [] },
})

const READY_EVENT = makeEvent({
  ...EVENT,
  roster: makeRoster({
    state: 'LINEUP_SET',
    positions: [
      { id: 'pos-setter', label: 'Setter', required: 2, attending: 2, kind: 'PLAYING' },
      { id: 'pos-libero', label: 'Libero', required: 1, attending: 1, kind: 'PLAYING' },
      { id: 'pos-middle', label: 'Middle', required: 2, attending: 2, kind: 'PLAYING' },
    ],
    totalAttending: 10,
  }),
})

const meta = {
  title: 'widgets/next-event-hero/NextEventHeroView',
  component: NextEventHeroView,
  decorators: [withRouter],
  args: { event: EVENT, now: NOW, myState: 'NOT_RESPONDED', onRespond: fn() },
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

// Picture owned by the page composite (pages/EventsPageView) — behavioural only (ADR-0031 §3).
export const Data: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Next up')).toBeInTheDocument()
    await expect(canvas.getByText('Training — Court 2')).toBeInTheDocument()
    await expect(canvas.getByText('Sporthal De Toekomst')).toBeInTheDocument()
    // Two days and eleven hours out, floored to the largest useful unit.
    await expect(canvas.getByText('2d')).toBeInTheDocument()
    await expect(canvas.getByText(/10 going · you haven't responded/)).toBeInTheDocument()
    // Neither answer is pressed yet — "I'm in" is solid because it is the invitation.
    await expect(canvas.getByRole('button', { name: /I'm in/ })).toHaveAttribute('aria-pressed', 'false')
    await expect(canvas.getByRole('button', { name: /Can't make it/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Going: <NextEventHeroView {...args} myState="ATTENDING" />,
        'Not going': <NextEventHeroView {...args} myState="ABSENT" />,
        // "Maybe" can only be set from the detail page — the hero offers the two answers it offers.
        // So it shows neither button as chosen and lets the status line carry what was actually said.
        Maybe: <NextEventHeroView {...args} myState="MAYBE" />,
        // Both answers are held while an RSVP is in flight, so a double-tap can't race the mutation.
        Saving: <NextEventHeroView {...args} isSaving />,
        // A same-day hero drops to hours, which is the one thing the card's date chit cannot say.
        'Starting today': (
          <NextEventHeroView
            {...args}
            event={makeEvent({ ...EVENT, startTime: new Date(2026, 7, 10, 20, 0).toISOString() })}
          />
        ),
        // ── Readiness (#275) ──────────────────────────────────────────────────────────────────────
        // The hero was the last surface in the app with no roster verdict. It carries the same
        // `ReadinessBadge` as the card row (#273) — same `rosterChip`, no second computation.
        'Readiness covered': <NextEventHeroView {...args} event={READY_EVENT} myState="ATTENDING" />,
        'Readiness short': (
          <NextEventHeroView
            {...args}
            event={makeEvent({ ...EVENT, roster: makeRoster({ totalAttending: 10 }) })}
            myState="ATTENDING"
          />
        ),
        // Nobody at all at two targeted positions. The headcount moves with it: a roster with no
        // one attending cannot sit on a summary claiming ten are.
        'Readiness critical': (
          <NextEventHeroView
            {...args}
            event={makeEvent({
              ...EVENT,
              attendanceSummary: { attending: 0, maybe: 0, absent: 2, notResponded: 13, roleBreakdown: [] },
              roster: makeRoster({
                state: 'CRITICAL',
                positions: [
                  { id: 'pos-setter', label: 'Setter', required: 2, attending: 0, kind: 'PLAYING' },
                  { id: 'pos-libero', label: 'Libero', required: 1, attending: 0, kind: 'PLAYING' },
                ],
                totalAttending: 0,
              }),
            })}
          />
        ),
        // Tracking is on but nothing is targeted, so there is no verdict to give. On the card that
        // falls back to a plain headcount — here it renders nothing, because the hero's own status
        // line is already a headcount and printing "10 going" twice on one card says nothing twice.
        'Readiness tally only': (
          <NextEventHeroView
            {...args}
            event={makeEvent({ ...EVENT, roster: makeRoster({ state: 'TALLY_ONLY', positions: [], totalAttending: 10, openSlots: 0 }) })}
            myState="ATTENDING"
          />
        ),
        // A social: tracking off entirely. No chip — and, because the chip shares the status line's
        // row rather than claiming one of its own, no reserved space either.
        'Readiness not tracked': (
          <NextEventHeroView {...args} event={makeEvent({ ...EVENT, roster: NO_ROSTER })} myState="ATTENDING" />
        ),
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Going').getByText(/10 going · you're in/)).toBeInTheDocument()
    await expect(region('Going').getByRole('button', { name: /I'm in/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    await expect(region('Not going').getByText(/10 going · you're out/)).toBeInTheDocument()
    await expect(region('Not going').getByRole('button', { name: /Can't make it/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    await expect(region('Maybe').getByText(/10 going · you said maybe/)).toBeInTheDocument()
    await expect(region('Maybe').getByRole('button', { name: /I'm in/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    await expect(region('Maybe').getByRole('button', { name: /Can't make it/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )

    await expect(region('Saving').getByRole('button', { name: /I'm in/ })).toBeDisabled()
    await expect(region('Saving').getByRole('button', { name: /Can't make it/ })).toBeDisabled()

    await expect(region('Starting today').getByText('11h')).toBeInTheDocument()

    await expect(region('Readiness covered').getByText('Lineup set')).toBeInTheDocument()
    // The verdict joins the headcount the hero already carried; it does not replace it.
    await expect(region('Readiness covered').getByText(/10 going · you're in/)).toBeInTheDocument()

    await expect(region('Readiness short').getByText('1 spot open')).toBeInTheDocument()

    await expect(region('Readiness critical').getByText('Missing 2 positions')).toBeInTheDocument()

    await expect(region('Readiness tally only').getAllByText(/\bgoing\b/)).toHaveLength(1)

    const notTrackedStatus = region('Readiness not tracked').getByText(/10 going · you're in/)
    await expect(
      region('Readiness not tracked').queryByText(/spot|spots|Lineup set|Full|more needed/),
    ).not.toBeInTheDocument()
    // The row the chip would have shared claims no more height than the status line inside it, so
    // an absent verdict leaves no gap above the RSVP buttons.
    const row = notTrackedStatus.parentElement!
    await expect(row.getBoundingClientRect().height).toBe(notTrackedStatus.getBoundingClientRect().height)
  },
}

// Picture owned by Data — behavioural only (ADR-0031 §1, §3). Two instances: the default hero for
// the RSVP spies and the hit-test geometry, and a saving one — held, so its tap must report nothing —
// checked first, before the default instance's own taps put a call on the shared spy.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        Default: <NextEventHeroView {...args} />,
        Saving: <NextEventHeroView {...args} isSaving />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    const defaultRegion = canvas.getByRole('region', { name: 'Default' })

    // ── The hero is one big target: everything that isn't its own control opens the event ──────
    const cardLink = within(defaultRegion).getByRole('link', { name: EVENT.title })
    const hero = defaultRegion.querySelector('section')!

    // Passive rows: each one hits the card link, not the text node under the cursor.
    for (const passive of [
      within(defaultRegion).getByText('Next up'),
      within(defaultRegion).getByText('2d'), // the countdown block sits above the overlay but lets taps through
      within(defaultRegion).getByText(/20:00/), // the date · time row
      within(defaultRegion).getByText(/10 going/),
    ]) {
      await expect(topmostAtCentreOf(passive)).toBe(cardLink)
    }

    // Bare padding — the strip below the buttons — is part of the target too.
    const { left, bottom, width } = hero.getBoundingClientRect()
    await expect(document.elementFromPoint(left + width / 2, bottom - 4)).toBe(cardLink)

    // ── The other half of the bargain: widening the target must not swallow the controls ───────
    for (const name of [/I'm in/, /Can't make it/]) {
      const button = within(defaultRegion).getByRole('button', { name })
      await expect(topmostAtCentreOf(button)?.closest('button')).toBe(button)
    }

    // The location opens maps, so it stays its own target — and stays a *sibling* of the card link
    // rather than a nested <a>, which is invalid HTML.
    const maps = within(defaultRegion).getByRole('link', { name: EVENT.location })
    await expect(topmostAtCentreOf(maps)?.closest('a')).toBe(maps)
    await expect(maps).toHaveAttribute('href', expect.stringContaining('maps.google.com'))
    await expect(maps).toHaveAttribute('target', '_blank')
    await expect(defaultRegion.querySelectorAll('a a')).toHaveLength(0)

    // ── Held: a saving hero's tap must not fire, checked before any call reaches the shared spy ──
    await userEvent.click(region('Saving').getByRole('button', { name: /I'm in/ }))
    await expect(args.onRespond).not.toHaveBeenCalled()

    // ── Prop-contract spies: both buttons actually call onRespond with the right state ──────────
    await userEvent.click(region('Default').getByRole('button', { name: /I'm in/ }))
    await expect(args.onRespond).toHaveBeenLastCalledWith('ATTENDING')
    await userEvent.click(region('Default').getByRole('button', { name: /Can't make it/ }))
    await expect(args.onRespond).toHaveBeenLastCalledWith('ABSENT')
  },
}
