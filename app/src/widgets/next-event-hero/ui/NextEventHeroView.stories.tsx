import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { makeEvent } from '@shared/testing/event-fixtures'
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

const meta = {
  title: 'widgets/next-event-hero/NextEventHeroView',
  component: NextEventHeroView,
  decorators: [withRouter],
  args: { event: EVENT, now: NOW, myState: 'NOT_RESPONDED', onRespond: fn() },
} satisfies Meta<typeof NextEventHeroView>

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
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /I'm in/ }))
    await expect(args.onRespond).toHaveBeenCalledWith('ATTENDING')
  },
}

export const RsvpOut: Story = {
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
