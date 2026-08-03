import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { makeEvent } from '@shared/testing/event-fixtures'
import { EventListView } from './EventListView'

// EventListView is the presentational list region of the events page: it renders one of four
// states (loading / error / empty / data) from props the container hands down. Each state is a
// story. The data state renders EventCards (which link out), so the router decorator is applied.
const meta = {
  title: 'entities/event/EventListView',
  component: EventListView,
  decorators: [withRouter],
} satisfies Meta<typeof EventListView>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {
  args: { groups: [], isLoading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status', { name: /loading events/i })).toBeInTheDocument()
  },
}

export const ErrorState: Story = {
  args: { groups: [], error: new Error('boom') },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/couldn't load events/i)).toBeInTheDocument()
  },
}

export const Empty: Story = {
  args: { groups: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No events yet.')).toBeInTheDocument()
  },
}

export const WithEvents: Story = {
  args: {
    groups: [
      {
        label: 'This Week',
        events: [
          makeEvent({ id: 'evt-1', title: 'League Match' }),
          makeEvent({ id: 'evt-2', title: 'Training' }),
        ],
      },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('This Week')).toBeInTheDocument()
    await expect(canvas.getByText('League Match')).toBeInTheDocument()
    await expect(canvas.getByText('Training')).toBeInTheDocument()
  },
}

// A background refetch can fail while react-query still holds cached data: `error` is set but
// `groups` is non-empty. The list must keep showing the cached events, not blank them out.
export const DataDespiteBackgroundError: Story = {
  args: {
    error: new Error('refetch failed'),
    groups: [{ label: 'This Week', events: [makeEvent({ id: 'evt-1', title: 'League Match' })] }],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('League Match')).toBeInTheDocument()
    await expect(canvas.queryByText(/couldn't load events/i)).not.toBeInTheDocument()
  },
}
