import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { MatchMismatchNoticeView } from './MatchMismatchNoticeView'

// The notice an admin sees on the event page when the event differs from its Nevobo match (ADR-0047).
// One story: every difference at once.
const meta = {
  title: 'features/match-feed/MatchMismatchNoticeView',
  component: MatchMismatchNoticeView,
  args: {
    teamName: 'Tovo HS 4',
    mismatch: {
      eventId: 'evt-1',
      eventTitle: 'Uitwedstrijd',
      eventStartTime: '2026-11-13T19:00:00Z',
      eventLocation: undefined,
      feedMatch: {
        code: 'EA',
        link: 'https://api.nevobo.nl/permalink/wedstrijd/2017987',
        startTime: '2026-11-13T18:30:00Z',
        homeTeam: 'Servylo HS 1',
        awayTeam: 'Tovo HS 4',
        venue: 'De Mammoet',
      },
      differences: ['START_TIME', 'LOCATION', 'OPPONENT'],
    },
  },
} satisfies Meta<typeof MatchMismatchNoticeView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('note')).toHaveTextContent('This event differs from Nevobo')
    await expect(canvas.getByText(/^Start: .+ → Nevobo: .+$/)).toBeInTheDocument()
    await expect(canvas.getByText('Location: none → Nevobo: De Mammoet')).toBeInTheDocument()
    await expect(canvas.getByText('The title does not name the opponent (Servylo HS 1)')).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'Open on Nevobo' })).toHaveAttribute(
      'href',
      'https://api.nevobo.nl/permalink/wedstrijd/2017987',
    )
  },
}
