import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import type { Member } from '@shared/api/members'
import type { Payment } from '@shared/api/money-pool'
import { Stack } from '@shared/testing/stack'
import { darkMode } from '../../../../.storybook/modes'
import { ToppersView } from './ToppersView'

// ToppersView is prop-only; the toggle and the playback are state inside it, so there are no callback
// props to spy on and Interactions asserts the rendered result instead. The visual podium and list are
// aria-hidden, so the assertions read the text ranking (an ordered list) that is complete at every step.
// The page composite (MoneyPageView) owns the pixels; Shells keeps a snapshot for the states it cannot show.
//
// Three-story shape (ADR-0032 §1):
//   1. Data — the season ranking and its unmatched caption.
//   2. Shells — empty, one contributor, a tie, a former member, nothing unmatched.
//   3. Interactions — Last 30 days, then play, pause, resume to the end and reset.
const member = (userId: string, displayName: string): Member => ({
  userId,
  displayName,
  role: 'USER',
  position: undefined,
  onboarded: true,
  shirtNumber: undefined,
  photoVersion: undefined,
})
const MEMBERS = [member('m-anna', 'Anna'), member('m-bram', 'Bram'), member('m-cleo', 'Cleo'), member('m-dirk', 'Dirk'), member('m-eva', 'Eva')]

const pay = (id: string, date: string, amount: number, memberId?: string, direction: Payment['direction'] = 'In'): Payment => ({
  id,
  date,
  name: memberId ?? 'Someone',
  amount,
  direction,
  memberId,
  counterpartyName: undefined,
  receiptVersion: undefined,
})

// Newest first. Season: Cleo 50, Anna 40, Bram 25, Dirk 20, a former member 15, Eva 10; 8 came in without a name.
const PAYMENTS: Payment[] = [
  pay('1', '2026-11-05', 2500, 'm-bram'),
  pay('2', '2026-11-01', 1000, 'm-anna'),
  pay('3', '2026-10-20', 5000, 'm-cleo'),
  pay('4', '2026-10-12', 1500, 'm-gone'),
  pay('5', '2026-10-02', 3000, 'm-anna'),
  pay('6', '2026-09-20', 2000, 'm-dirk'),
  pay('7', '2026-09-10', 4000, undefined, 'Out'),
  pay('8', '2026-09-05', 800),
  pay('9', '2026-09-01', 1000, 'm-eva'),
]

const meta = {
  title: 'widgets/money-pool/ToppersView',
  component: ToppersView,
  args: { payments: PAYMENTS, today: '2026-11-09', members: MEMBERS },
} satisfies Meta<typeof ToppersView>

export default meta

type Story = StoryObj<typeof meta>

const ranking = (canvas: ReturnType<typeof within>) => within(canvas.getByRole('list', { name: 'Toppers ranking' })).getAllByRole('listitem')

export const Data: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Season' })).toHaveAttribute('aria-pressed', 'true')
    await expect(ranking(canvas).map((li) => li.textContent)).toEqual([
      'Number 1: Cleo, €50.00',
      'Number 2: Anna, €40.00',
      'Number 3: Bram, €25.00',
      'Number 4: Dirk, €20.00',
      'Number 5: Former member, €15.00',
      'Number 6: Eva, €10.00',
    ])
    await expect(canvas.getByText('€8.00 came in without a name we know.')).toBeInTheDocument()
    // Nothing plays until it is asked to.
    await expect(canvas.getByRole('button', { name: 'Play the ranking' })).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Back to now' })).not.toBeInTheDocument()
  },
}

export const Shells: Story = {
  parameters: { chromatic: { modes: darkMode } },
  render: (args) => (
    <Stack
      items={{
        Empty: <ToppersView {...args} payments={[]} />,
        'Only unmatched money': <ToppersView {...args} payments={[pay('1', '2026-11-01', 1200)]} />,
        'One contributor': <ToppersView {...args} payments={[pay('1', '2026-11-01', 1200, 'm-anna')]} />,
        Tie: (
          <ToppersView
            {...args}
            payments={[pay('1', '2026-11-03', 500, 'm-dirk'), pay('2', '2026-11-02', 500, 'm-anna'), pay('3', '2026-11-01', 500, 'm-cleo'), pay('4', '2026-10-30', 100, 'm-bram')]}
          />
        ),
        'Last 90 days': <ToppersView {...args} seasonSet={false} />,
        'Everyone left': <ToppersView {...args} members={[]} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    await expect(region('Empty').getByText('No one has topped up yet.')).toBeInTheDocument()
    await expect(region('Empty').queryByRole('button', { name: 'Play the ranking' })).not.toBeInTheDocument()
    await expect(region('Only unmatched money').getByText('€12.00 came in without a name we know.')).toBeInTheDocument()
    await expect(region('Only unmatched money').getByText('No one has topped up yet.')).toBeInTheDocument()
    // One payment day is nothing to replay.
    await expect(region('One contributor').getByRole('button', { name: 'Play the ranking' })).toBeDisabled()
    await expect(region('One contributor').queryByText(/came in without a name/)).not.toBeInTheDocument()
    // Equal totals share a rank, the next rank is skipped, and ties go alphabetically.
    await expect(ranking(region('Tie')).map((li) => li.textContent)).toEqual([
      'Number 1: Anna, €5.00',
      'Number 1: Cleo, €5.00',
      'Number 1: Dirk, €5.00',
      'Number 4: Bram, €1.00',
    ])
    // Payments that are the last 90 days, not a season, name the period so.
    await expect(region('Last 90 days').getByRole('button', { name: 'Last 90 days' })).toHaveAttribute('aria-pressed', 'true')
    await expect(region('Last 90 days').getByText('Now, last 90 days')).toBeInTheDocument()
    await expect(ranking(region('Everyone left'))[0]).toHaveTextContent('Number 1: Former member, €50.00')
  },
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    // Last 30 days is today minus 30 days, inclusive: the ranking changes and nothing is unmatched.
    await userEvent.click(canvas.getByRole('button', { name: 'Last 30 days' }))
    await expect(canvas.getByRole('button', { name: 'Last 30 days' })).toHaveAttribute('aria-pressed', 'true')
    await expect(ranking(canvas).map((li) => li.textContent)).toEqual([
      'Number 1: Cleo, €50.00',
      'Number 2: Bram, €25.00',
      'Number 3: Former member, €15.00',
      'Number 4: Anna, €10.00',
    ])
    await expect(canvas.queryByText(/came in without a name/)).not.toBeInTheDocument()
    await expect(canvas.getByText('Now, last 30 days')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Season' }))
    await expect(ranking(canvas)).toHaveLength(6)

    // Play starts on the first payment day (Eva, 1 Sep) and can be paused: the ranking then stays put.
    await userEvent.click(canvas.getByRole('button', { name: 'Play the ranking' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }))
    const paused = ranking(canvas).map((li) => li.textContent)
    await expect(paused.length).toBeLessThan(6)
    await expect(paused[0]).toMatch(/^Number 1: (Eva|Dirk|Anna|Former member|Cleo)/)
    await new Promise((resolve) => setTimeout(resolve, 800))
    await expect(ranking(canvas).map((li) => li.textContent)).toEqual(paused)

    // Pausing says who is on top, once.
    await expect(canvas.getByText(/is on top with/)).toBeInTheDocument()

    // Resume, run to the end: the final ranking is today's, and playing again is offered.
    await userEvent.click(canvas.getByRole('button', { name: 'Resume' }))
    await userEvent.click(await canvas.findByRole('button', { name: 'Play again' }, { timeout: 5000 }))
    await expect(canvas.getByRole('button', { name: 'Pause' })).toBeInTheDocument()

    // Reset returns to the ranking as of today, whatever step the playback is on.
    await userEvent.click(canvas.getByRole('button', { name: 'Back to now' }))
    await expect(ranking(canvas)).toHaveLength(6)
    await expect(canvas.getByText('Now, this season')).toBeInTheDocument()
    // The reset button is gone, so focus moved to the play button.
    await expect(canvas.getByRole('button', { name: 'Play the ranking' })).toHaveFocus()
    await expect(canvas.queryByRole('button', { name: 'Back to now' })).not.toBeInTheDocument()
  },
}
