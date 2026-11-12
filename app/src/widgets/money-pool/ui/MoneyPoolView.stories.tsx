import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import type { Member } from '@shared/api/members'
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
//   3. Interactions — expand and collapse the payment list past its first whole weeks of 15 or more.
const PAYMENTS: Payment[] = [
  { id: '1005', date: '2026-10-06', name: 'Lisa de Vries', amount: 2000, direction: 'In', memberId: 'u-lisa', counterpartyName: undefined, receiptVersion: undefined },
  { id: '1006', date: '2026-10-04', name: 'Sporthal De Kuil', amount: 4500, direction: 'Out', memberId: undefined, counterpartyName: undefined, receiptVersion: 'a1b2' },
  { id: '1007', date: '2026-09-29', name: 'Tom Bakker', amount: 1000, direction: 'In', memberId: undefined, counterpartyName: undefined, receiptVersion: undefined },
]

// The roster behind the attributed payment. Named apart from the payment so the Toppers do not repeat a payment's text.
const MEMBERS: Member[] = [
  { userId: 'u-lisa', displayName: 'Lisa V.', role: 'USER', position: undefined, onboarded: true, shirtNumber: undefined, photoVersion: undefined },
]

// 18 payments, newest first, one a day from 20 Oct back to 3 Oct, for the cut-off at a week's end.
const MANY_PAYMENTS: Payment[] = Array.from({ length: 18 }, (_, i) => ({
  id: String(2000 + i),
  memberId: undefined,
  counterpartyName: undefined,
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
    today: '2026-10-07',
    members: MEMBERS,
    canTopUp: true,
    topUp: <Button size="lg">Top up</Button>,
    receipt: (expense: Payment) => <Button size="icon">{`Receipt ${expense.name}`}</Button>,
    claim: (payment: Payment) => <Button size="icon">{`Claim ${payment.name}`}</Button>,
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
    // Topped up is the part of In that has a member: Lisa's 20; Tom's 10 has none.
    await expect(balance.getByText('Topped up').nextElementSibling).toHaveTextContent(/20\.00/)
    // The Toppers follow Payments and say how much came in without a name.
    const toppers = within(canvas.getByRole('region', { name: 'Toppers' }))
    await expect(toppers.getByText('Number 1: Lisa V., €20.00')).toBeInTheDocument()
    await expect(toppers.getByText('€10.00 came in without a name we know.')).toBeInTheDocument()
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
    // By week from Monday, each under a header with the week's net: today is Wednesday 7 Oct.
    await expect(payments.getByRole('heading', { name: 'This week Net +€20.00' })).toBeInTheDocument()
    await expect(payments.getByRole('heading', { name: 'Last week Net −€35.00' })).toBeInTheDocument()
    const [lisa, sporthal, tom] = payments.getAllByRole('listitem')
    await expect(lisa).toHaveTextContent('Lisa de Vries')
    // A top-up with a member shows that member's face and roster name; other money shows its direction.
    await expect(lisa).toHaveTextContent('LV')
    await expect(within(lisa).getByText('Lisa V. · Tue 6 Oct')).toBeInTheDocument()
    await expect(within(tom).getByText(/^Tue 29 Sept?$/)).toBeInTheDocument()
    await expect(payments.getAllByText(/Incoming/)).toHaveLength(2)
    await expect(payments.getByText(/Outgoing/)).toBeInTheDocument()
    // The sign is visual only; screen readers get the direction from the sr-only text.
    await expect(within(lisa).getByText('+')).toHaveAttribute('aria-hidden', 'true')
    await expect(within(lisa).getByText(/20\.00/)).toHaveClass('text-green-ink')
    await expect(within(sporthal).getByText('−')).toHaveAttribute('aria-hidden', 'true')
    await expect(within(sporthal).getByText(/45\.00/)).toHaveClass('text-orange-ink')
    // The receipt control sits on expenses only.
    await expect(payments.getByRole('button', { name: 'Receipt Sporthal De Kuil' })).toBeInTheDocument()
    await expect(payments.queryByRole('button', { name: 'Receipt Lisa de Vries' })).not.toBeInTheDocument()
    // The claim slot fills the incoming rows, as the receipt slot fills the expenses.
    await expect(payments.getByRole('button', { name: 'Claim Lisa de Vries' })).toBeInTheDocument()
    await expect(payments.queryByRole('button', { name: 'Claim Sporthal De Kuil' })).not.toBeInTheDocument()
  },
}

export const Shells: Story = {
  // Carries the dark-mode baseline for every pool state; under reduced motion, so the Toppers and the beer count are at their final state.
  parameters: { chromatic: { modes: darkMode, prefersReducedMotion: 'reduce' } },
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
        'Roster name same as payment': <MoneyPoolView {...args} payments={[{ ...PAYMENTS[0], name: 'Lisa V.' }]} />,
        'Missing balance': <MoneyPoolView {...args} balance={undefined} />,
        'Roster loading': <MoneyPoolView {...args} members={undefined} />,
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
    await expect(within(region('No season').getByRole('region', { name: 'Balance' })).getByText('Last 90 days')).toBeInTheDocument()
    await expect(region('No payments').queryByRole('img')).not.toBeInTheDocument()
    await expect(region('Same-day duplicates').getAllByText('Lisa de Vries')).toHaveLength(2)
    // A roster name that only repeats the payment's name is left out of the line under it.
    await expect(within(within(region('Roster name same as payment').getByRole('region', { name: 'Payments' })).getByRole('list')).getByText(/^Tue 6 Oct$/)).toBeInTheDocument()
    await expect(region('Missing balance').getByText(/couldn't load/i)).toBeInTheDocument()
    // Without the roster the Toppers would name everyone a former member, so they wait for it.
    await expect(region('Roster loading').queryByRole('region', { name: 'Toppers' })).not.toBeInTheDocument()
    await expect(region('No beer price').queryByRole('group', { name: 'Beer Counter' })).not.toBeInTheDocument()
    await expect(within(region('Empty pool').getByRole('group', { name: 'Beer Counter' })).getByText(/covers 0 beers/)).toBeInTheDocument()
  },
}

export const Interactions: Story = {
  args: { payments: MANY_PAYMENTS, balance: 50000, today: '2026-10-21' },
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    const payments = within(canvas.getByRole('region', { name: 'Payments' }))

    // The list stops at the end of the week that reaches 15 (2 + 7 + 7 = 16), so no week is split; the
    // same button expands it and collapses it again, and keeps focus.
    await expect(payments.getAllByRole('listitem')).toHaveLength(16)
    await expect(payments.getAllByRole('heading', { level: 4 }).map((h) => h.firstChild?.textContent)).toEqual(['This week', 'Last week', expect.stringMatching(/^5\s*–\s*11 Oct$/)])
    const toggle = payments.getByRole('button', { name: 'Show all 18 payments' })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(toggle)
    await expect(payments.getAllByRole('listitem')).toHaveLength(18)
    await expect(payments.getAllByRole('heading', { level: 4 })[3]).toHaveTextContent(/^28 Sept?\s*–\s*4 Oct/)
    await expect(toggle).toHaveTextContent('Show fewer')
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(toggle).toHaveFocus()
    await userEvent.click(toggle)
    await expect(payments.getAllByRole('listitem')).toHaveLength(16)
    await expect(toggle).toHaveFocus()
  },
}
