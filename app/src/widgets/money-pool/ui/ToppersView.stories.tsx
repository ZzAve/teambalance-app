import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test'
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
//   1. Data — every member ranked (Fien, who never topped up, at zero), the viewer's badge and the unmatched caption.
//   2. Shells — empty, one contributor, a tie, a former member, nothing unmatched.
//   3. Interactions — the entrance ended by the time bar, Last 30 days, the time bar, then play, pause, resume to the end and reset.
//
// The entrance and the ticks are motion, so the snapshot is taken under reduced motion: the final state, with no
// animation frame to land on (Chromatic's prefersReducedMotion). Interactions runs with motion on, to prove the entrance ends.
const member = (userId: string, displayName: string): Member => ({
  userId,
  displayName,
  role: 'USER',
  position: undefined,
  onboarded: true,
  shirtNumber: undefined,
  photoVersion: undefined,
})
const MEMBERS = [member('m-anna', 'Anna'), member('m-bram', 'Bram'), member('m-cleo', 'Cleo'), member('m-dirk', 'Dirk'), member('m-eva', 'Eva'), member('m-fien', 'Fien')]

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
  args: { payments: PAYMENTS, today: '2026-11-09', members: MEMBERS, youId: 'm-dirk' },
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
      'Number 4: Dirk (you), €20.00',
      'Number 5: Former member, €15.00',
      'Number 6: Eva, €10.00',
      'Number 7: Fien, €0.00',
    ])
    // The viewer's row carries the badge, and only that row.
    await expect(canvas.getAllByText('You')).toHaveLength(1)
    await expect(canvas.getByText('You').closest('span.truncate')).toHaveTextContent('Dirk')
    // The time bar stands on now, with a date for each position.
    await expect(canvas.getByRole('slider', { name: 'Day' })).toHaveValue('6')
    await expect(canvas.getByText('€8.00 came in without a name we know.')).toBeInTheDocument()
    // Nothing plays until it is asked to.
    await expect(canvas.getByRole('button', { name: 'Play the ranking' })).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Back to now' })).not.toBeInTheDocument()
  },
}

export const Shells: Story = {
  parameters: { chromatic: { modes: darkMode, prefersReducedMotion: 'reduce' } },
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
        'Podium you': (
          <ToppersView {...args} youId="m-anna" payments={[pay('1', '2026-11-03', 500, 'm-dirk'), pay('2', '2026-11-02', 500, 'm-anna'), pay('3', '2026-11-01', 100, 'm-cleo')]} />
        ),
        'Zero you': <ToppersView {...args} youId="m-fien" />,
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
      'Number 1: Dirk (you), €5.00',
      'Number 4: Bram, €1.00',
      'Number 5: Eva, €0.00',
      'Number 5: Fien, €0.00',
    ])
    // On the podium the viewer shows as "You" instead of the name; a zero row carries the badge in the list.
    await expect(within(canvas.getByRole('region', { name: 'Podium you' })).getAllByText('You')).toHaveLength(1)
    await expect(within(canvas.getByRole('region', { name: 'Zero you' })).getAllByText('You')).toHaveLength(1)
    // Payments that are the last 90 days, not a season, name the period so.
    await expect(region('Last 90 days').getByRole('button', { name: 'Last 90 days' })).toHaveAttribute('aria-pressed', 'true')
    await expect(region('Last 90 days').getByText('Now, last 90 days')).toBeInTheDocument()
    await expect(ranking(region('Everyone left'))[0]).toHaveTextContent('Number 1: Former member, €50.00')
  },
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    // The entrance starts once the podium is in view. Moving the time bar ends it at its final state.
    const card = canvas.getByRole('slider', { name: 'Day' }).parentElement!
    // Into view whatever the viewport, so the observer's 35% threshold is met.
    card.scrollIntoView({ block: 'center' })
    await waitFor(() => expect(card).toHaveClass('toppers-enter'))
    fireEvent.change(canvas.getByRole('slider', { name: 'Day' }), { target: { value: '0' } })
    await expect(card).not.toHaveClass('toppers-enter')

    // Last 30 days is today minus 30 days, inclusive: the ranking changes and nothing is unmatched.
    await userEvent.click(canvas.getByRole('button', { name: 'Last 30 days' }))
    await expect(canvas.getByRole('button', { name: 'Last 30 days' })).toHaveAttribute('aria-pressed', 'true')
    await expect(ranking(canvas).map((li) => li.textContent)).toEqual([
      'Number 1: Cleo, €50.00',
      'Number 2: Bram, €25.00',
      'Number 3: Former member, €15.00',
      'Number 4: Anna, €10.00',
      'Number 5: Dirk (you), €0.00',
      'Number 5: Eva, €0.00',
      'Number 5: Fien, €0.00',
    ])
    await expect(canvas.queryByText(/came in without a name/)).not.toBeInTheDocument()
    await expect(canvas.getByText('Now, last 30 days')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Season' }))
    await expect(ranking(canvas)).toHaveLength(7)

    // The time bar steps through the payment days, from now (the last) back to the first.
    const slider = canvas.getByRole('slider', { name: 'Day' })
    // At rest the bar is on now, and screen readers hear that, not a date.
    await expect(slider).toHaveAttribute('aria-valuetext', 'Now, this season')
    // user-event does not implement arrow keys on a range input, so the steps are change events (what the browser fires for a key).
    fireEvent.change(slider, { target: { value: '2' } })
    fireEvent.change(slider, { target: { value: '6' } }) // End
    await expect(slider).toHaveValue('6')
    await expect(slider).toHaveAttribute('aria-valuetext', 'Now, this season')
    await expect(canvas.getByText('Now, this season')).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Back to now' })).not.toBeInTheDocument()
    // One step back is the previous payment day (1 Nov).
    fireEvent.change(slider, { target: { value: '5' } }) // ArrowLeft from the end
    await expect(slider).toHaveValue('5')
    await expect(slider).toHaveAttribute('aria-valuetext', '1 Nov')
    await expect(canvas.queryByText('Now, this season')).not.toBeInTheDocument()
    await expect(ranking(canvas).map((li) => li.textContent)).toContain('Number 6: Bram, €0.00') // Bram pays on the last day
    // Once the bar rests, the summary says who is on top.
    await expect(await canvas.findByText('Cleo is on top with €50.00.')).toBeInTheDocument()
    fireEvent.change(slider, { target: { value: '0' } })
    await expect(ranking(canvas)[0]).toHaveTextContent('Number 1: Eva, €10.00')
    await expect(canvas.getByRole('button', { name: 'Back to now' })).toBeInTheDocument()

    // Changing the period puts the bar back on now, at that period's last day.
    await userEvent.click(canvas.getByRole('button', { name: 'Last 30 days' }))
    await expect(slider).toHaveValue('3')
    await expect(canvas.queryByRole('button', { name: 'Back to now' })).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Season' }))
    await expect(slider).toHaveValue('6')
    fireEvent.change(slider, { target: { value: '0' } })

    // Play carries on from the thumb; pausing holds it.
    await userEvent.click(canvas.getByRole('button', { name: 'Resume' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }))
    const heldAt = slider.getAttribute('aria-valuetext')
    await new Promise((resolve) => setTimeout(resolve, 800))
    await expect(slider).toHaveAttribute('aria-valuetext', heldAt!)

    // Moving the bar while playing pauses it.
    await userEvent.click(canvas.getByRole('button', { name: 'Resume' }))
    fireEvent.change(slider, { target: { value: '1' } })
    await expect(canvas.getByRole('button', { name: 'Resume' })).toBeInTheDocument()

    // Resume, run to the end: the playback lands on now, with today's ranking and Play offered again.
    await userEvent.click(canvas.getByRole('button', { name: 'Resume' }))
    const playAgain = await canvas.findByRole('button', { name: 'Play the ranking' }, { timeout: 5000 })
    await expect(slider).toHaveValue('6')
    await expect(slider).toHaveAttribute('aria-valuetext', 'Now, this season')
    await userEvent.click(playAgain)
    await expect(slider).toHaveAttribute('aria-valuetext', expect.not.stringMatching(/^Now/))
    await expect(canvas.getByRole('button', { name: 'Pause' })).toBeInTheDocument()

    // Reset returns to the ranking as of today, whatever step the playback is on.
    await userEvent.click(canvas.getByRole('button', { name: 'Back to now' }))
    await expect(ranking(canvas)).toHaveLength(7)
    await expect(canvas.getByText('Now, this season')).toBeInTheDocument()
    await expect(slider).toHaveValue('6')
    // The reset button is gone, so focus moved to the play button.
    await expect(canvas.getByRole('button', { name: 'Play the ranking' })).toHaveFocus()
    await expect(canvas.queryByRole('button', { name: 'Back to now' })).not.toBeInTheDocument()
  },
}
