import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { MatchMismatch } from '@shared/api/match-feed'
import { Stack } from '@shared/testing/stack'
import { ApplyMatchDialogView } from './ApplyMatchDialogView'

// Body of the "Apply Nevobo values" dialog (ADR-0047). Two stories (ADR-0032 §1):
//   1. Data — a match that moved to another day (the reset switch shows), a match that only changed hall
//      (no switch), saving and a failed apply, stacked.
//   2. Interactions — no picture; the reset choice reaches onConfirm, and Cancel calls onCancel.
const MOVED: MatchMismatch = {
  eventId: 'evt-1',
  eventTitle: 'Servylo HS 1 - Tovo HS 4',
  eventStartTime: '2026-11-12T19:00:00Z',
  eventLocation: 'De Mammoet',
  feedMatch: {
    code: 'EA',
    link: 'https://api.nevobo.nl/permalink/wedstrijd/2017987',
    startTime: '2026-11-13T18:30:00Z',
    homeTeam: 'Servylo HS 1',
    awayTeam: 'Tovo HS 4',
    venue: 'De Mammoet',
    address: 'De Mammoet, Calslaan 101, 2804RT Gouda',
  },
  differences: ['START_TIME'],
}

const HALL_ONLY: MatchMismatch = {
  ...MOVED,
  eventStartTime: MOVED.feedMatch.startTime,
  eventLocation: 'Sporthal Zuid',
  differences: ['LOCATION'],
}

const meta = {
  title: 'features/match-feed/ApplyMatchDialogView',
  component: ApplyMatchDialogView,
  args: { mismatch: MOVED, teamName: 'Tovo HS 4', onConfirm: fn(), onCancel: fn() },
} satisfies Meta<typeof ApplyMatchDialogView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  render: (args) => (
    <Stack
      items={{
        'Other day': <ApplyMatchDialogView {...args} />,
        'Hall only': <ApplyMatchDialogView {...args} mismatch={HALL_ONLY} />,
        Saving: <ApplyMatchDialogView {...args} isPending />,
        Failed: <ApplyMatchDialogView {...args} isError />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    await expect(region('Other day').getByRole('switch', { name: 'Reset responses' })).not.toBeChecked()
    await expect(region('Hall only').queryByRole('switch')).not.toBeInTheDocument()
    await expect(region('Saving').getByRole('button', { name: 'Saving…' })).toBeDisabled()
    await expect(region('Failed').getByText('Could not apply the Nevobo values. Please try again.')).toBeInTheDocument()
  },
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Apply Nevobo values' }))
    await expect(args.onConfirm).toHaveBeenLastCalledWith(false)

    await userEvent.click(canvas.getByRole('switch', { name: 'Reset responses' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Apply Nevobo values' }))
    await expect(args.onConfirm).toHaveBeenLastCalledWith(true)

    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }))
    await expect(args.onCancel).toHaveBeenCalled()
  },
}
