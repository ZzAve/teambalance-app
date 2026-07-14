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

export const WithLocation: Story = {
  args: { event: makeEvent({ location: 'Sporthal De Boog' }) },
  play: async ({ canvas, canvasElement }) => {
    // The location renders as a real maps link that opens in a new tab...
    const maps = canvas.getByRole('link', { name: 'Sporthal De Boog' })
    await expect(maps).toHaveAttribute('href', expect.stringContaining('maps.google.com'))
    await expect(maps).toHaveAttribute('target', '_blank')
    // ...and it must NOT be nested inside the card's own <Link> anchor (invalid HTML — the
    // "<a> cannot contain a nested <a>" warning this fix removes). The card link and the maps
    // link are siblings; the card stays clickable via a stretched-link overlay.
    await expect(canvasElement.querySelectorAll('a a')).toHaveLength(0)
  },
}
