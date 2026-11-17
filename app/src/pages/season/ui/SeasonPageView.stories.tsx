import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { AttendanceEntry } from '@shared/api/events'
import { makeAttendee, makeEvent, makeRoster } from '@shared/testing/event-fixtures'
import { Stack } from '@shared/testing/stack'
import { appColumn } from '@shared/testing/app-column-decorator'
import { withRouter } from '@shared/testing/router-decorator'
import { appShell } from '../../../../storybook-support/app-shell-decorator'
import { pageModes } from '../../../../.storybook/modes'
import { seasonGrid } from '../lib/season-grid'
import { SeasonPageView } from './SeasonPageView'

// The season grid as a desktop shows it, in the wide frame (the column cap lifted from `lg`).
const NOW = new Date(2026, 9, 15, 12, 0) // Thursday 15 October 2026
const ORDER = ['Setter', 'Libero', 'Middle']
const TRAINING = { id: 'et-1', name: 'Training', color: '#249E6C' }
const MATCH = { id: 'et-2', name: 'Match', color: '#225C9C' }

const PEOPLE: [string, string, string][] = [
  ['u-1', 'Anna de Vries', 'Setter'],
  ['u-2', 'Bram Jansen', 'Setter'],
  ['u-3', 'Nina Bakker', 'Libero'],
  ['u-4', 'Sofia Visser', 'Middle'],
  ['u-5', 'Tim Smit', 'Middle'],
  ['u-6', 'Noor Mulder', 'Unassigned'],
]
const STATES: AttendanceEntry['state'][] = ['ATTENDING', 'MAYBE', 'ABSENT', 'NOT_RESPONDED']
// A fixed spread of answers: past events mostly answered, the far future mostly blank.
const team = (n: number) =>
  PEOPLE.map(([id, name, role], i) => makeAttendee(id, name, role, { state: STATES[(i + n * 2) % (n > 6 ? 4 : 3)] }))

const TARGETS = makeRoster({
  positions: [
    { id: 'p-setter', label: 'Setter', required: 1, attending: 0, kind: 'PLAYING' },
    { id: 'p-libero', label: 'Libero', required: 1, attending: 0, kind: 'PLAYING' },
    { id: 'p-middle', label: 'Middle', required: 2, attending: 0, kind: 'PLAYING' },
  ],
  totalAttending: 0,
})

const EVENTS = Array.from({ length: 10 }, (_, n) => {
  const match = n % 3 === 2
  return makeEvent({
    id: `e-${n}`,
    eventType: match ? MATCH : TRAINING,
    title: match ? `Match ${n}` : `Training ${n}`,
    startTime: new Date(2026, 8, 3 + n * 4, 20, 0).toISOString(),
    attendances: team(n),
    roster: match ? TARGETS : makeRoster(),
  })
})

const GRID = seasonGrid(EVENTS, ORDER, NOW)
const shell = appShell('season')

const meta = {
  title: 'pages/season/SeasonPageView',
  component: SeasonPageView,
  parameters: { ...shell.parameters, shellWide: true },
  args: { grid: GRID, onRetry: fn(), onSetAnswer: fn() },
} satisfies Meta<typeof SeasonPageView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  decorators: shell.decorators,
  parameters: { chromatic: { modes: pageModes } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Today')).toBeInTheDocument()
    await expect(canvas.getByRole('rowheader', { name: 'Anna de Vries' })).toBeInTheDocument()
    // Each Position group heads its members; Unassigned comes last.
    await expect(canvas.getByRole('columnheader', { name: 'Unassigned' })).toBeInTheDocument()
    // The lineup verdict per Position, under every match column only.
    await expect(canvas.getByText('Lineup')).toBeInTheDocument()
  },
}

export const Shells: Story = {
  decorators: [...appColumn.decorators, withRouter],
  render: () => (
    <Stack
      items={{
        Loading: <SeasonPageView isLoading onRetry={() => {}} onSetAnswer={() => {}} />,
        Error: <SeasonPageView isError onRetry={() => {}} onSetAnswer={() => {}} />,
        Empty: <SeasonPageView grid={seasonGrid([], ORDER, NOW)} onRetry={() => {}} onSetAnswer={() => {}} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    await expect(region('Error').getByText("Couldn't load the season.")).toBeInTheDocument()
    await expect(region('Empty').getByText('No events in this season yet.')).toBeInTheDocument()
  },
}

export const Interactions: Story = {
  decorators: shell.decorators,
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    // A cell cycles to the next answer: Bram's first training was Maybe, so the click asks for Absent.
    await userEvent.click(canvas.getByRole('button', { name: 'Bram Jansen, Training 0: Maybe' }))
    await expect(args.onSetAnswer).toHaveBeenCalledWith('e-0', 'u-2', 'ABSENT')
    await userEvent.click(canvas.getByRole('button', { name: 'Anna de Vries, Training 0: Going' }))
    await expect(args.onSetAnswer).toHaveBeenLastCalledWith('e-0', 'u-1', 'MAYBE')
  },
}
