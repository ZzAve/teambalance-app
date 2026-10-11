import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import type { Payment } from '@shared/api/money-pool'
import { Button } from '@shared/ui/button'
import { Stack } from '@shared/testing/stack'
import { darkMode } from '../../../../.storybook/modes'
import { MoneyPoolView } from './MoneyPoolView'

// MoneyPoolView is the prop-only money pool behind the MoneyPool container, so every state renders
// without a network (ADR-0017). It has no callbacks of its own: the top-up button is a slot, and the
// sheet behind it has its own stories, so there is no Interactions story.
//
// Two-story shape (ADR-0032 §1):
//   1. Data — the connected pool: balance and payment list.
//   2. Shells — every other state stacked: loading, error, off, not connected (member and admin),
//      unavailable, top-up with and without a link, and connected edge cases (no payments, same-day duplicates, missing balance, no beer price, an empty pool).
const PAYMENTS: Payment[] = [
  { date: '2026-10-06', name: 'Lisa de Vries', amount: 2000, direction: 'In' },
  { date: '2026-10-04', name: 'Sporthal De Kuil', amount: 4500, direction: 'Out' },
  { date: '2026-09-29', name: 'Tom Bakker', amount: 1000, direction: 'In' },
]

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
    canTopUp: true,
    topUp: <Button>Top up</Button>,
  },
} satisfies Meta<typeof MoneyPoolView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  // MoneyPageView's Data owns the connected picture (ADR-0032 §3).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    await expect(within(canvas.getByRole('region', { name: 'Balance' })).getByText(/187,50/)).toBeInTheDocument()
    const beers = within(canvas.getByRole('region', { name: 'Beer Counter' }))
    await expect(beers.getByText('69 beers')).toBeInTheDocument()
    await expect(beers.getByText(/The pool balance covers 69 beers at .*2,70 each\./)).toBeInTheDocument()
    // The button sits between the Balance card and the Beer Counter.
    const topUp = canvas.getByRole('button', { name: 'Top up' })
    const balanceCard = canvas.getByRole('region', { name: 'Balance' })
    const beerCard = canvas.getByRole('region', { name: 'Beer Counter' })
    await expect(balanceCard.compareDocumentPosition(topUp) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    await expect(topUp.compareDocumentPosition(beerCard) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    const payments = within(canvas.getByRole('region', { name: 'Payments' }))
    await expect(payments.getByText('Lisa de Vries')).toBeInTheDocument()
    await expect(payments.getAllByText(/Incoming/)).toHaveLength(2)
    await expect(payments.getByText(/Outgoing/)).toBeInTheDocument()
    // The sign is visual only; screen readers get the direction from the sr-only text.
    await expect(payments.getAllByText('+')[0]).toHaveAttribute('aria-hidden', 'true')
    await expect(payments.getByText(/20,00/)).toBeInTheDocument()
    await expect(payments.getByText('−')).toHaveAttribute('aria-hidden', 'true')
    await expect(payments.getByText(/45,00/)).toBeInTheDocument()
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
        Unavailable: <MoneyPoolView {...args} state="Unavailable" />,
        'No link (member)': <MoneyPoolView {...args} state="NotConnected" canTopUp={false} />,
        'No link (admin)': <MoneyPoolView {...args} state="NotConnected" canTopUp={false} isAdmin />,
        'No payments': <MoneyPoolView {...args} payments={[]} />,
        'Same-day duplicates': <MoneyPoolView {...args} payments={[PAYMENTS[0], PAYMENTS[0]]} />,
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
    await expect(region('Not connected (admin)').getByText(/connecting the team.s bunq account is coming soon/i)).toBeInTheDocument()
    await expect(region('Unavailable').getByText('The pool is unavailable right now')).toBeInTheDocument()
    // Paying through bunq.me needs no Bunq Connection, so Top up shows in every state but Off.
    await expect(region('Not connected (member)').getByRole('button', { name: 'Top up' })).toBeInTheDocument()
    await expect(region('Unavailable').getByRole('button', { name: 'Top up' })).toBeInTheDocument()
    await expect(region('Off').queryByRole('button', { name: 'Top up' })).not.toBeInTheDocument()
    await expect(region('No link (member)').queryByRole('button', { name: 'Top up' })).not.toBeInTheDocument()
    await expect(region('No link (member)').queryByText(/bunq\.me link/)).not.toBeInTheDocument()
    await expect(region('No link (admin)').queryByRole('button', { name: 'Top up' })).not.toBeInTheDocument()
    await expect(region('No link (admin)').getByText(/Add the team.s bunq\.me link in the team settings/)).toBeInTheDocument()
    await expect(region('No payments').getByText('No payments in this period.')).toBeInTheDocument()
    await expect(region('Same-day duplicates').getAllByText('Lisa de Vries')).toHaveLength(2)
    await expect(region('Missing balance').getByText(/couldn't load/i)).toBeInTheDocument()
    await expect(region('No beer price').queryByRole('region', { name: 'Beer Counter' })).not.toBeInTheDocument()
    await expect(within(region('Empty pool').getByRole('region', { name: 'Beer Counter' })).getByText('0 beers')).toBeInTheDocument()
  },
}
