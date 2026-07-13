import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { makeEvent } from '@shared/testing/event-fixtures'
import { EventCard } from './EventCard'

// EventCard renders a TanStack Router <Link to="/events/$eventId">, which needs a router in context.
// The shared withRouter decorator supplies a minimal in-memory router so the link target resolves.
const meta = {
  title: 'entities/event/EventCard',
  component: EventCard,
  decorators: [withRouter],
} satisfies Meta<typeof EventCard>

export default meta

type Story = StoryObj<typeof meta>

export const Populated: Story = {
  args: { event: makeEvent() },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/5 going/)).toBeInTheDocument()
    await expect(canvas.getByText('2 Outside Hitter')).toBeInTheDocument()
    await expect(canvas.getByText('1 Libero')).toBeInTheDocument()
    await expect(canvas.getByText('1 Opposite')).toBeInTheDocument()
    await expect(canvas.getByText('1 Setter')).toBeInTheDocument()
  },
}

export const NoResponses: Story = {
  args: {
    event: makeEvent({
      attendanceSummary: { attending: 0, maybe: 0, absent: 0, notResponded: 0, roleBreakdown: [] },
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/0 going/)).toBeInTheDocument()
    await expect(
      canvas.queryByText(/\d+\s+(Setter|Libero|Outside Hitter|Opposite)/),
    ).not.toBeInTheDocument()
  },
}
