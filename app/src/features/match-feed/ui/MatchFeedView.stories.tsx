import { useState, type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { MatchFeedStatus } from '@shared/api/match-feed'
import { withRouter } from '@shared/testing/router-decorator'
import { Stack } from '@shared/testing/stack'
import { MatchFeedView } from './MatchFeedView'

// MatchFeedView is the presentational match feed settings behind the MatchFeed container (ADR-0047).
//
// Three stories (ADR-0032 §1):
//   1. Data — a connected feed with one event that differs and one match without an event.
//   2. Shells — loading, error, no feed yet, a lookup that failed, a feed in sync, a failed last check.
//   3. Interactions — no picture; enter a feed, find its teams, pick one, save; apply, create, remove.
const FEED = 'https://api.nevobo.nl/export/poule/regio-west/regio-west-h2j-12/programma.rss'

const STATUS: MatchFeedStatus = {
  feedUrl: FEED,
  teamName: 'Tovo HS 4',
  lastCheckedAt: '2026-11-11T05:00:00Z',
  lastCheckFailed: false,
  mismatches: [
    {
      eventId: 'evt-1',
      eventTitle: 'Servylo HS 1 - Tovo HS 4',
      eventStartTime: '2026-11-13T19:00:00Z',
      eventLocation: 'Sporthal Zuid',
      feedMatch: {
        code: 'EA',
        link: 'https://api.nevobo.nl/permalink/wedstrijd/2017987',
        startTime: '2026-11-13T18:30:00Z',
        homeTeam: 'Servylo HS 1',
        awayTeam: 'Tovo HS 4',
        venue: 'De Mammoet',
        address: 'De Mammoet, Calslaan 101, 2804RT Gouda',
      },
      differences: ['START_TIME', 'LOCATION'],
    },
  ],
  missing: [
    {
      code: 'AD',
      link: 'https://api.nevobo.nl/permalink/wedstrijd/2017818',
      startTime: '2026-11-20T18:30:00Z',
      homeTeam: 'Tovo HS 4',
      awayTeam: 'UVV-Sphynx HS 2',
      venue: 'Zuilen',
      address: undefined,
    },
  ],
}

const meta = {
  title: 'features/match-feed/MatchFeedView',
  component: MatchFeedView,
  decorators: [withRouter],
  parameters: { router: { initialEntries: ['/t/tovo/team/settings'] } },
  args: { status: STATUS, onFindTeams: fn(), onSave: fn(), onRemove: fn(), onApply: fn(), onCreate: fn() },
} satisfies Meta<typeof MatchFeedView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Tovo HS 4')).toBeInTheDocument()
    await expect(canvas.getByText('1 event differs from Nevobo')).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'Servylo HS 1 - Tovo HS 4' })).toBeInTheDocument()
    await expect(canvas.getByText(/^Location: Sporthal Zuid → Nevobo: De Mammoet$/)).toBeInTheDocument()
    await expect(canvas.getByText('1 match has no event')).toBeInTheDocument()
    await expect(canvas.getByText('Home against UVV-Sphynx HS 2')).toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <MatchFeedView {...args} status={undefined} isLoading />,
        Error: <MatchFeedView {...args} status={undefined} isError />,
        'No feed': <MatchFeedView {...args} status={null} />,
        'Lookup failed': <MatchFeedView {...args} status={null} error="INVALID_FEED_URL" />,
        'In sync': <MatchFeedView {...args} status={{ ...STATUS, mismatches: [], missing: [] }} />,
        'Check failed': <MatchFeedView {...args} status={{ ...STATUS, lastCheckFailed: true }} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Loading').getByRole('status')).toHaveTextContent('Loading…')
    await expect(region('Error').getByRole('alert')).toHaveTextContent('Could not load the match feed.')
    await expect(region('No feed').getByRole('button', { name: 'Find teams' })).toBeDisabled()
    await expect(region('Lookup failed').getByText(/not a Nevobo poule programme feed/)).toBeInTheDocument()
    await expect(region('In sync').getByText('Your events agree with the feed.')).toBeInTheDocument()
    await expect(region('Check failed').getByText(/could not read the feed/)).toBeInTheDocument()
  },
}

// Stands in for the container: a lookup answers with the feed's team names.
function LookupRoundTrip(args: ComponentProps<typeof MatchFeedView>) {
  const [teams, setTeams] = useState<string[] | undefined>()
  return (
    <MatchFeedView
      {...args}
      teams={teams}
      onFindTeams={(url) => {
        args.onFindTeams(url)
        setTeams(['Servylo HS 1', 'Tovo HS 4'])
      }}
    />
  )
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        New: <LookupRoundTrip {...args} status={null} />,
        Connected: <MatchFeedView {...args} />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    const form = region('New')

    await userEvent.type(form.getByLabelText('Programme feed (RSS)'), FEED)
    await userEvent.click(form.getByRole('button', { name: 'Find teams' }))
    await expect(args.onFindTeams).toHaveBeenCalledWith(FEED)

    await expect(form.getByRole('button', { name: 'Save feed' })).toBeDisabled()
    await userEvent.click(form.getByRole('combobox', { name: 'Your team in this feed' }))
    await userEvent.click(within(document.body).getByRole('option', { name: 'Tovo HS 4' }))
    await userEvent.click(form.getByRole('button', { name: 'Save feed' }))
    await expect(args.onSave).toHaveBeenCalledWith(FEED, 'Tovo HS 4')

    const connected = region('Connected')
    await userEvent.click(connected.getByRole('button', { name: 'Apply Nevobo values' }))
    await expect(args.onApply).toHaveBeenCalledWith(STATUS.mismatches[0])
    await userEvent.click(connected.getByRole('button', { name: 'Create event' }))
    await expect(args.onCreate).toHaveBeenCalledWith(STATUS.missing[0])

    await userEvent.click(connected.getByRole('button', { name: 'Remove feed' }))
    await expect(args.onRemove).toHaveBeenCalled()
  },
}
