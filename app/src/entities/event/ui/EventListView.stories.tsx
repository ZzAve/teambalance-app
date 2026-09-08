import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { makeEvent } from '@shared/testing/event-fixtures'
import { EventListView } from './EventListView'

// EventListView is the presentational list region of the events page: it renders one of four
// states (loading / error / empty / data) from props the container hands down. Each state is a
// story. The data state renders EventCards (which link out), so the router decorator is applied.
const NOW = new Date(2026, 7, 10, 9, 0) // Monday 10 August 2026, 09:00 local
const on = (day: number) => new Date(2026, 7, day, 20, 0).toISOString()

const meta = {
  title: 'entities/event/EventListView',
  component: EventListView,
  decorators: [withRouter],
  args: { now: NOW },
} satisfies Meta<typeof EventListView>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {
  args: { events: [], isLoading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status', { name: /loading events/i })).toBeInTheDocument()
  },
}

export const ErrorState: Story = {
  args: { events: [], error: new Error('boom') },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/couldn't load events/i)).toBeInTheDocument()
  },
}

// The page-level "no hero" case bottoms out here: with nothing upcoming there is no hero and no
// placeholder in its place — just this message. (The ≤7-day boundary itself is proven by the
// selectHeroEvent unit test.)
export const Empty: Story = {
  args: { events: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No upcoming events.')).toBeInTheDocument()
  },
}

export const EmptyWhenFiltered: Story = {
  args: { events: [], emptyMessage: 'No events for this type.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No events for this type.')).toBeInTheDocument()
  },
}

// Stranded on an empty list by filters hidden behind a popover — the way out has to be on the empty
// state itself (ADR-0029). The reset lives in the route; this view only reports the tap.
export const EmptyWithClearFilters: Story = {
  args: {
    events: [],
    emptyMessage: 'Nothing needs your answer.',
    onClearFilters: fn(),
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText('Nothing needs your answer.')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }))
    await expect(args.onClearFilters).toHaveBeenCalled()
  },
}

// A flat, chronological list — no This Week / Later headings; each card's chit carries its date.
export const WithEvents: Story = {
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

// A background refetch can fail while react-query still holds cached data: `error` is set but
// `events` is non-empty. The list must keep showing the cached events, not blank them out.
export const DataDespiteBackgroundError: Story = {
  args: {
    error: new Error('refetch failed'),
    events: [makeEvent({ id: 'evt-1', title: 'League Match', startTime: on(11) })],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('League Match')).toBeInTheDocument()
    await expect(canvas.queryByText(/couldn't load events/i)).not.toBeInTheDocument()
  },
}

// ⑪ on the card. The list payload carries `myChangedBy` but no attendance rows, so the id cannot be
// named yet — the fact still lands. Only the event a teammate touched is marked: the negative on the
// self-set card is the design, not an oversight.
export const AttributionOnTheCard: Story = {
  args: {
    currentUserId: 'u-me',
    events: [
      makeEvent({
        id: 'evt-1',
        title: 'League Match',
        startTime: on(11),
        myState: 'ABSENT',
        myChangedBy: 'u-tim',
      }),
      makeEvent({
        id: 'evt-2',
        title: 'Training',
        startTime: on(13),
        myState: 'ATTENDING',
        myChangedBy: 'u-me',
      }),
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByText('set by a teammate')).toHaveLength(1)
    await expect(canvas.queryByText('set by u-me')).not.toBeInTheDocument()
  },
}

// The pick in flight is the viewer's own, so the attribution it replaces is dropped the moment they
// tap — not one round-trip later, when the refetched list finally agrees.
export const AttributionClearsWhileSettling: Story = {
  args: {
    currentUserId: 'u-me',
    optimistic: { eventId: 'evt-1', state: 'ATTENDING' },
    events: [
      makeEvent({
        id: 'evt-1',
        title: 'League Match',
        startTime: on(11),
        myState: 'ABSENT',
        myChangedBy: 'u-tim',
      }),
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("You're in")).toBeInTheDocument()
    await expect(canvas.queryByText(/^set by /)).not.toBeInTheDocument()
  },
}
