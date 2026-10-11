import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import type { Payment } from '@shared/api/money-pool'
import { Stack } from '@shared/testing/stack'
import { MoneyPoolView } from './MoneyPoolView'

// MoneyPoolView is the prop-only money pool behind the MoneyPool container, so every state renders
// without a network (ADR-0017). It has no callbacks yet — connecting Bunq and topping up come later —
// so there is no Interactions story.
//
// Two-story shape (ADR-0032 §1):
//   1. Data — the connected pool: balance and payment list.
//   2. Shells — every other state stacked: loading, error, off, not connected (member and admin),
//      unavailable, and connected edge cases (no payments, same-day duplicates, missing balance).
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
  },
} satisfies Meta<typeof MoneyPoolView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  // MoneyPageView's Data owns the connected picture (ADR-0032 §3).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    await expect(within(canvas.getByRole('region', { name: 'Balance' })).getByText(/187,50/)).toBeInTheDocument()
    const payments = within(canvas.getByRole('region', { name: 'Payments' }))
    await expect(payments.getByText('Lisa de Vries')).toBeInTheDocument()
    await expect(payments.getAllByText(/Incoming/)).toHaveLength(2)
    await expect(payments.getByText(/Outgoing/)).toBeInTheDocument()
    await expect(payments.getByText(/\+.*20,00/)).toBeInTheDocument()
    await expect(payments.getByText(/−.*45,00/)).toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <MoneyPoolView {...args} state={undefined} isLoading />,
        Error: <MoneyPoolView {...args} state={undefined} isError />,
        Off: <MoneyPoolView {...args} state="Off" />,
        'Not connected (member)': <MoneyPoolView {...args} state="NotConnected" />,
        'Not connected (admin)': <MoneyPoolView {...args} state="NotConnected" isAdmin />,
        Unavailable: <MoneyPoolView {...args} state="Unavailable" />,
        'No payments': <MoneyPoolView {...args} payments={[]} />,
        'Same-day duplicates': <MoneyPoolView {...args} payments={[PAYMENTS[0], PAYMENTS[0]]} />,
        'Missing balance': <MoneyPoolView {...args} balance={undefined} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    await expect(region('Error').getByText(/couldn't load/i)).toBeInTheDocument()
    await expect(region('Off').getByText('The money pool is switched off for this team.')).toBeInTheDocument()
    await expect(region('Not connected (member)').getByText(/once an admin connects/i)).toBeInTheDocument()
    await expect(region('Not connected (admin)').getByText(/connecting the team.s bunq account is coming soon/i)).toBeInTheDocument()
    await expect(region('Unavailable').getByText('The pool is unavailable right now')).toBeInTheDocument()
    await expect(region('No payments').getByText('No payments in this period.')).toBeInTheDocument()
    await expect(region('Same-day duplicates').getAllByText('Lisa de Vries')).toHaveLength(2)
    await expect(region('Missing balance').getByText(/couldn't load/i)).toBeInTheDocument()
  },
}
