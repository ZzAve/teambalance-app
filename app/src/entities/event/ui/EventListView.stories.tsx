import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { Stack } from '@shared/testing/stack'
import { makeAttendee, makeEvent } from '@shared/testing/event-fixtures'
import { EventListView } from './EventListView'

// EventListView is the presentational list region of the events page: it renders one of four
// states (loading / error / empty / data) from props the container hands down. The data state
// renders EventCards (which link out), so the router decorator is applied.
//
// Rendered inside the events page composite (EventsPageView), so per the ownership rule
// (ADR-0031 §3) its Data story is behavioural only — the composite's own picture already shows
// this list in context.
//
// Three-story shape (ADR-0031 §1):
//   1. Data — the one populated live instance, disableSnapshot (picture owned by the page).
//   2. Shells — loading / error / empty / filtered-empty / background-error / attribution, stacked
//      in one frame — this picture stays, since the composite's default frame cannot show them.
//   3. Interactions — no picture; a card's Respond control fires onRespond with the *event's own*
//      id, not just the state — the one thing this View adds on top of the card it renders.
const NOW = new Date(2026, 7, 10, 9, 0) // Monday 10 August 2026, 09:00 local
const on = (day: number) => new Date(2026, 7, day, 20, 0).toISOString()

const meta = {
  title: 'entities/event/EventListView',
  component: EventListView,
  decorators: [withRouter],
  // `events` has no default; a top-level [] lets Shells and Interactions build their own instances
  // via `render` without TypeScript flagging the required prop as missing.
  args: { now: NOW, events: [] },
} satisfies Meta<typeof EventListView>

export default meta

type Story = StoryObj<typeof meta>

// Picture owned by the page composite (pages/EventsPageView) — behavioural only (ADR-0031 §3).
// A flat, chronological list — no This Week / Later headings; each card's chit carries its date.
export const Data: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  args: {
    events: [
      makeEvent({ id: 'evt-1', title: 'League Match', startTime: on(11) }),
      makeEvent({ id: 'evt-2', title: 'Training', startTime: on(13) }),
      makeEvent({ id: 'evt-3', title: 'Regio-toernooi', startTime: on(29) }),
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('League Match')).toBeInTheDocument()
    await expect(canvas.getByText('Training')).toBeInTheDocument()
    await expect(canvas.getByText('Regio-toernooi')).toBeInTheDocument()
    // The old section headings are gone for good.
    await expect(canvas.queryByText('This Week')).not.toBeInTheDocument()
    await expect(canvas.queryByText('Later')).not.toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <EventListView {...args} events={[]} isLoading />,
        Error: <EventListView {...args} events={[]} error={new Error('boom')} />,
        // The page-level "no hero" case bottoms out here: with nothing upcoming there is no hero
        // and no placeholder in its place — just this message. (The ≤7-day boundary itself is
        // proven by the selectHeroEvent unit test.)
        Empty: <EventListView {...args} events={[]} />,
        'Filtered to nothing': (
          <EventListView {...args} events={[]} emptyMessage="No events for this type." />
        ),
        // A background refetch can fail while react-query still holds cached data: `error` is set
        // but `events` is non-empty. The list must keep showing the cached events, not blank them out.
        'Data despite background error': (
          <EventListView
            {...args}
            error={new Error('refetch failed')}
            events={[makeEvent({ id: 'evt-1', title: 'League Match', startTime: on(11) })]}
          />
        ),
        // ⑪ on the card: the list payload carries every member (ADR-0030 §8), so the setter resolves
        // to a real name here exactly as it does on the detail page. Only the event a teammate
        // touched is marked — the negative on the self-set card is the design, not an oversight.
        Attribution: (
          <EventListView
            {...args}
            currentUserId="u-me"
            events={[
              makeEvent({
                id: 'evt-1',
                title: 'League Match',
                startTime: on(11),
                myState: 'ABSENT',
                attendances: [
                  makeAttendee('u-me', 'Me', 'Unassigned', { state: 'ABSENT', changedBy: 'u-tim' }),
                  makeAttendee('u-tim', 'Tim de Vries', 'Unassigned', { changedBy: 'u-tim' }),
                ],
              }),
              makeEvent({
                id: 'evt-2',
                title: 'Training',
                startTime: on(13),
                myState: 'ATTENDING',
                attendances: [makeAttendee('u-me', 'Me', 'Unassigned', { changedBy: 'u-me' })],
              }),
            ]}
          />
        ),
        // The pick in flight is the viewer's own, so the attribution it replaces is dropped the
        // moment they tap — not one round-trip later, when the refetched list finally agrees.
        'Attribution clears while settling': (
          <EventListView
            {...args}
            currentUserId="u-me"
            optimistic={{ eventId: 'evt-1', state: 'ATTENDING' }}
            events={[
              makeEvent({
                id: 'evt-1',
                title: 'League Match',
                startTime: on(11),
                myState: 'ABSENT',
                attendances: [
                  makeAttendee('u-me', 'Me', 'Unassigned', { state: 'ABSENT', changedBy: 'u-tim' }),
                  makeAttendee('u-tim', 'Tim de Vries', 'Unassigned', { changedBy: 'u-tim' }),
                ],
              }),
            ]}
          />
        ),
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Loading').getByRole('status', { name: /loading events/i })).toBeInTheDocument()

    await expect(region('Error').getByText(/couldn't load events/i)).toBeInTheDocument()

    await expect(region('Empty').getByText('No upcoming events.')).toBeInTheDocument()

    await expect(region('Filtered to nothing').getByText('No events for this type.')).toBeInTheDocument()

    await expect(region('Data despite background error').getByText('League Match')).toBeInTheDocument()
    await expect(
      region('Data despite background error').queryByText(/couldn't load events/i),
    ).not.toBeInTheDocument()

    await expect(region('Attribution').getByText("Tim de Vries said you're out")).toBeInTheDocument()
    // The self-set card stays in the first person.
    await expect(region('Attribution').getByText("You're in")).toBeInTheDocument()

    await expect(region('Attribution clears while settling').getByText("You're in")).toBeInTheDocument()
    await expect(
      region('Attribution clears while settling').queryByText(/ said /),
    ).not.toBeInTheDocument()
  },
}

// Picture owned by Data — behavioural only (ADR-0031 §1, §3). The card itself only knows its own
// event's id; this View's own job is folding that id into onRespond, which no per-card story proves.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  args: {
    onRespond: fn(),
    events: [
      makeEvent({ id: 'evt-1', title: 'League Match', startTime: on(11) }),
      makeEvent({ id: 'evt-2', title: 'Training', startTime: on(13) }),
    ],
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getAllByRole('button', { name: /Change your answer/ })[1])
    await userEvent.click(canvas.getByRole('button', { name: /^Going$/ }))
    await expect(args.onRespond).toHaveBeenCalledWith('evt-2', 'ATTENDING')
  },
}
