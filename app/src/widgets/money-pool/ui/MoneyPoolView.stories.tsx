import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import type { Payment } from '@shared/api/money-pool'
import { Button } from '@shared/ui/button'
import { Stack } from '@shared/testing/stack'
import { darkMode } from '../../../../.storybook/modes'
import { MoneyPoolView } from './MoneyPoolView'

// MoneyPoolView is the prop-only money pool behind the MoneyPool container, so every state renders
// without a network (ADR-0017). It has no callback props: the top-up button is a slot, and the
// payment list's "Show all" is state inside the connected pool, so Interactions asserts the rendered
// result instead of a spy.
//
// Three-story shape (ADR-0032 §1):
//   1. Data — the connected pool: balance, In and Spent totals, graph and payment list.
//   2. Shells — every other state stacked: loading, error, off, not connected (member and admin),
//      unavailable, rejected (member, admin, admin with connecting off), top-up with and without a link (the admin's hint only on a connected pool), and connected edge cases (no payments, same-day duplicates, missing balance, no beer price, an empty pool).
//   3. Interactions — expand and collapse the payment list past its first 15.
const PAYMENTS: Payment[] = [
  { id: '1005', date: '2026-10-06', name: 'Lisa de Vries', amount: 2000, direction: 'In', memberId: undefined, counterpartyName: undefined, receiptVersion: undefined },
  { id: '1006', date: '2026-10-04', name: 'Sporthal De Kuil', amount: 4500, direction: 'Out', memberId: undefined, counterpartyName: undefined, receiptVersion: 'a1b2' },
  { id: '1007', date: '2026-09-29', name: 'Tom Bakker', amount: 1000, direction: 'In', memberId: undefined, counterpartyName: undefined, receiptVersion: undefined },
]

// 18 payments, newest first, alternating In and Out, for the 15-row cut-off.
const MANY_PAYMENTS: Payment[] = Array.from({ length: 18 }, (_, i) => ({
  id: String(2000 + i),
  receiptVersion: undefined,
  date: `2026-10-${String(20 - i).padStart(2, '0')}`,
  name: `Payment ${i + 1}`,
  amount: 1000 + i * 100,
  direction: i % 3 === 0 ? 'Out' : 'In',
}))

const meta = {
  title: 'widgets/money-pool/MoneyPoolView',
  component: MoneyPoolView,
  args: {
    state: 'Connected',
    isLoading: false,
    isError: false,
    isAdmin: false,
    balance: 18750,
    payments: PAYMENTS,
    beerPrice: 270,
    beerCount: 69,
    seasonSet: true,
    canTopUp: true,
    topUp: <Button size="lg">Top up</Button>,
    receipt: (expense: Payment) => <Button size="icon">{`Receipt ${expense.name}`}</Button>,
  },
} satisfies Meta<typeof MoneyPoolView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  // MoneyPageView's Data owns the connected picture (ADR-0032 §3).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    const balance = within(canvas.getByRole('region', { name: 'Balance' }))
    await expect(balance.getByText('Pool balance')).toBeInTheDocument()
    await expect(balance.getByText('This season')).toBeInTheDocument()
    await expect(balance.getByText(/^€187\.50$/)).toBeInTheDocument()
    // In and Spent are totals over the payments listed: 20 + 10 in, 45 out.
    await expect(balance.getByText('In').nextElementSibling).toHaveTextContent(/30\.00/)
    await expect(balance.getByText('Spent').nextElementSibling).toHaveTextContent(/45\.00/)
    // The graph is a static image whose name carries the summary.
    await expect(balance.getByRole('img', { name: /The pot went from .*to .*187\.50 on 6 Oct/ })).toBeInTheDocument()
    await expect(balance.queryByRole('slider')).not.toBeInTheDocument()
    // The beer counter lives inside the balance card.
    const beers = within(balance.getByRole('group', { name: 'Beer Counter' }))
    await expect(beers.getByText(/The pool balance covers 69 beers at .*2\.70 each\./)).toBeInTheDocument()
    // The button follows the Balance card.
    const topUp = canvas.getByRole('button', { name: 'Top up' })
    const balanceCard = canvas.getByRole('region', { name: 'Balance' })
    await expect(balanceCard.compareDocumentPosition(topUp) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    const payments = within(canvas.getByRole('region', { name: 'Payments' }))
    await expect(payments.getByText('Lisa de Vries')).toBeInTheDocument()
    await expect(payments.getAllByText(/Incoming/)).toHaveLength(2)
    await expect(payments.getByText(/Outgoing/)).toBeInTheDocument()
    // The sign is visual only; screen readers get the direction from the sr-only text.
    await expect(payments.getAllByText('+')[0]).toHaveAttribute('aria-hidden', 'true')
    await expect(payments.getByText(/20\.00/)).toBeInTheDocument()
    await expect(payments.getByText('−')).toHaveAttribute('aria-hidden', 'true')
    await expect(payments.getByText(/45\.00/)).toBeInTheDocument()
    // The receipt control sits on expenses only.
    await expect(payments.getByRole('button', { name: 'Receipt Sporthal De Kuil' })).toBeInTheDocument()
    await expect(payments.queryByRole('button', { name: 'Receipt Lisa de Vries' })).not.toBeInTheDocument()
  },
}

export const Shells: Story = {
  // Carries the dark-mode baseline for every pool state.
  parameters: { chromatic: { modes: darkMode } },
  render: (args) => (
    <Stack
      items={{
        Loading: <MoneyPoolView {...args} state={undefined} isLoading />,
        Error: <MoneyPoolView {...args} state={undefined} isError />,
        Off: <MoneyPoolView {...args} state="Off" />,
        'Not connected (member)': <MoneyPoolView {...args} state="NotConnected" />,
        'Not connected (admin)': <MoneyPoolView {...args} state="NotConnected" isAdmin />,
        'Not connected (admin, connecting off)': <MoneyPoolView {...args} state="NotConnected" isAdmin connectAvailable={false} />,
        'Not connected (admin, can connect)': <MoneyPoolView {...args} state="NotConnected" isAdmin connectAvailable />,
        'Not connected (admin, account pending)': (
          <MoneyPoolView {...args} state="NotConnected" isAdmin connectAvailable accountPending />
        ),
        'Not connected (admin, account pending, connecting off)': (
          <MoneyPoolView {...args} state="NotConnected" isAdmin connectAvailable={false} accountPending />
        ),
        Unavailable: <MoneyPoolView {...args} state="Unavailable" />,
        'Rejected (member)': <MoneyPoolView {...args} state="Rejected" />,
        'Rejected (admin)': <MoneyPoolView {...args} state="Rejected" isAdmin connectAvailable />,
        'Rejected (admin, connecting off)': <MoneyPoolView {...args} state="Rejected" isAdmin connectAvailable={false} />,
        'No link (member)': <MoneyPoolView {...args} canTopUp={false} />,
        'No link (admin)': <MoneyPoolView {...args} canTopUp={false} isAdmin />,
        'No link (admin, not connected)': <MoneyPoolView {...args} state="NotConnected" canTopUp={false} isAdmin connectAvailable />,
        'No link (admin, unavailable)': <MoneyPoolView {...args} state="Unavailable" canTopUp={false} isAdmin />,
        'No link (admin, rejected)': <MoneyPoolView {...args} state="Rejected" canTopUp={false} isAdmin connectAvailable />,
        'No season': <MoneyPoolView {...args} seasonSet={false} />,
        'No payments': <MoneyPoolView {...args} payments={[]} />,
        'Same-day duplicates': <MoneyPoolView {...args} payments={[PAYMENTS[0], { ...PAYMENTS[0], id: '1008' }]} />,
        'Missing balance': <MoneyPoolView {...args} balance={undefined} />,
        'No beer price': <MoneyPoolView {...args} beerPrice={undefined} beerCount={undefined} />,
        'Empty pool': <MoneyPoolView {...args} balance={0} beerCount={0} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    await expect(region('Loading').getByRole('status')).toHaveTextContent('Loading…')
    await expect(region('Error').getByRole('alert')).toHaveTextContent(/couldn't load/i)
    await expect(region('Off').getByText('The money pool is switched off for this team')).toBeInTheDocument()
    await expect(region('Not connected (member)').getByText(/once an admin connects/i)).toBeInTheDocument()
    // Until the connection status is known (or when it could not be read) the admin copy promises nothing.
    await expect(region('Not connected (admin)').getByText(/balance and payments of the team.s bunq account will show up here/i)).toBeInTheDocument()
    await expect(region('Not connected (admin)').queryByText(/coming soon/i)).not.toBeInTheDocument()
    await expect(region('Not connected (admin, connecting off)').getByText(/connecting the team.s bunq account is coming soon/i)).toBeInTheDocument()
    await expect(region('Not connected (admin, can connect)').getByText(/connect the team.s bunq account in the team settings/i)).toBeInTheDocument()
    await expect(region('Not connected (admin, can connect)').queryByText(/coming soon/i)).not.toBeInTheDocument()
    await expect(region('Not connected (admin, account pending)').getByText(/pick the account in the team settings/i)).toBeInTheDocument()
    await expect(region('Not connected (admin, account pending)').queryByText(/connect the team.s bunq account/i)).not.toBeInTheDocument()
    // With connecting off the settings show nothing to pick from, so the existing copy stands.
    const pendingOff = region('Not connected (admin, account pending, connecting off)')
    await expect(pendingOff.queryByText(/pick the account in the team settings/i)).not.toBeInTheDocument()
    await expect(pendingOff.getByText(/connecting the team.s bunq account is coming soon/i)).toBeInTheDocument()
    await expect(region('Unavailable').getByText('The pool is unavailable right now')).toBeInTheDocument()
    const rejectedMember = region('Rejected (member)')
    await expect(rejectedMember.getByText('The pool is unavailable right now')).toBeInTheDocument()
    await expect(rejectedMember.getByText(/Bunq no longer accepts the team's connection\. An admin needs to reconnect it\./)).toBeInTheDocument()
    await expect(rejectedMember.queryByText(/team settings/)).not.toBeInTheDocument()
    const rejectedAdmin = region('Rejected (admin)')
    await expect(rejectedAdmin.getByText(/Bunq no longer accepts the team's connection\. Reconnect it in the team settings\./)).toBeInTheDocument()
    await expect(rejectedAdmin.queryByText(/An admin needs to/)).not.toBeInTheDocument()
    // With connecting off the settings show nothing to reconnect with, so the copy does not point there.
    const rejectedOff = region('Rejected (admin, connecting off)')
    await expect(rejectedOff.getByText(/Bunq no longer accepts the team's connection\. Reconnect it\./)).toBeInTheDocument()
    await expect(rejectedOff.queryByText(/team settings/)).not.toBeInTheDocument()
    // Paying through bunq.me needs no Bunq Connection, so Top up shows in every state but Off.
    await expect(region('Not connected (member)').getByRole('button', { name: 'Top up' })).toBeInTheDocument()
    await expect(region('Unavailable').getByRole('button', { name: 'Top up' })).toBeInTheDocument()
    await expect(rejectedMember.getByRole('button', { name: 'Top up' })).toBeInTheDocument()
    await expect(rejectedAdmin.getByRole('button', { name: 'Top up' })).toBeInTheDocument()
    await expect(region('Off').queryByRole('button', { name: 'Top up' })).not.toBeInTheDocument()
    await expect(region('No link (member)').queryByRole('button', { name: 'Top up' })).not.toBeInTheDocument()
    await expect(region('No link (member)').queryByText(/bunq\.me link/)).not.toBeInTheDocument()
    await expect(region('No link (admin)').queryByRole('button', { name: 'Top up' })).not.toBeInTheDocument()
    await expect(region('No link (admin)').getByText(/Add the team.s bunq\.me link in the team settings/)).toBeInTheDocument()
    // The hint belongs to a pool that shows a balance; without one it only adds a second to-do under the notice.
    for (const name of ['No link (admin, not connected)', 'No link (admin, unavailable)', 'No link (admin, rejected)']) {
      await expect(region(name).queryByText(/bunq\.me link/)).not.toBeInTheDocument()
      await expect(region(name).queryByRole('button', { name: 'Top up' })).not.toBeInTheDocument()
    }
    await expect(region('No payments').getByText('No payments in this period.')).toBeInTheDocument()
    await expect(region('No season').getByText('Last 90 days')).toBeInTheDocument()
    await expect(region('No payments').queryByRole('img')).not.toBeInTheDocument()
    await expect(region('Same-day duplicates').getAllByText('Lisa de Vries')).toHaveLength(2)
    await expect(region('Missing balance').getByText(/couldn't load/i)).toBeInTheDocument()
    await expect(region('No beer price').queryByRole('group', { name: 'Beer Counter' })).not.toBeInTheDocument()
    await expect(within(region('Empty pool').getByRole('group', { name: 'Beer Counter' })).getByText(/covers 0 beers/)).toBeInTheDocument()
  },
}

export const Interactions: Story = {
  args: { payments: MANY_PAYMENTS, balance: 50000 },
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    const payments = within(canvas.getByRole('region', { name: 'Payments' }))

    // The list stops at 15; the same button expands it and collapses it again, and keeps focus.
    await expect(payments.getAllByRole('listitem')).toHaveLength(15)
    const toggle = payments.getByRole('button', { name: 'Show all 18 payments' })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(toggle)
    await expect(payments.getAllByRole('listitem')).toHaveLength(18)
    await expect(toggle).toHaveTextContent('Show fewer')
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(toggle).toHaveFocus()
    await userEvent.click(toggle)
    await expect(payments.getAllByRole('listitem')).toHaveLength(15)
    await expect(toggle).toHaveFocus()
  },
}
