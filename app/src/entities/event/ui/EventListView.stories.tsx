import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
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
