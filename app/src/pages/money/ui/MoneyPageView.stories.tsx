import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pencil } from 'lucide-react'
import { expect, fn, within } from 'storybook/test'
import { ReceiptButtonView } from '@features/attach-receipt/ui/ReceiptButtonView'
import { RECEIPT_IMAGE } from '@features/attach-receipt/ui/receipt-image.fixture'
import type { Member } from '@shared/api/members'
import { Button } from '@shared/ui/button'
import { MoneyPoolView } from '@widgets/money-pool/ui/MoneyPoolView'
import { appShell } from '../../../../storybook-support/app-shell-decorator'
import { dutchMode, pageModes } from '../../../../.storybook/modes'
import { MoneyPageView } from './MoneyPageView'

// The money page as a phone shows it (ADR-0032 §3): the title over the connected pool with its Top up button, inside the
// real app shell. This composite owns the pixels for the connected MoneyPoolView; the other pool
// states are pictured by MoneyPoolView's own Shells story.
const shell = appShell('money')

// The roster the Toppers name; two top-ups show a podium with two places.
const member = (userId: string, displayName: string): Member => ({ userId, displayName, role: 'USER', position: undefined, onboarded: true, shirtNumber: undefined, photoVersion: undefined })
const MEMBERS = [member('u-lisa', 'Lisa'), member('u-tom', 'Tom'), member('u-mia', 'Mia')]

const meta = {
  title: 'pages/money/MoneyPageView',
  component: MoneyPageView,
  parameters: shell.parameters,
  decorators: shell.decorators,
  args: {
    pool: (
      <MoneyPoolView
        state="Connected"
        isLoading={false}
        isError={false}
        isAdmin={false}
        balance={18750}
        beerPrice={270}
        beerCount={69}
        canTopUp
        today="2026-10-07"
        members={MEMBERS}
        youId="u-mia"
        topUp={<Button size="lg">Top up</Button>}
        recordExpense={
          <Button size="lg" variant="outline">
            Add an expense you paid
          </Button>
        }
        editExpense={(expense) => (
          <Button variant="ghost" size="icon" aria-label={`Change expense ${expense.name}`} className="shrink-0 text-muted-foreground">
            <Pencil size={18} aria-hidden="true" />
          </Button>
        )}
        payments={[
          { id: '1005', date: '2026-10-06', name: 'Lisa de Vries', amount: 2000, direction: 'In', memberId: 'u-lisa', counterpartyName: undefined, receiptVersion: undefined, outOfPocket: false },
          { id: 'oop-1', date: '2026-10-05', name: 'Match balls', amount: 1250, direction: 'Out', memberId: 'u-mia', counterpartyName: undefined, receiptVersion: undefined, outOfPocket: true },
          { id: '1006', date: '2026-10-04', name: 'Sporthal De Kuil', amount: 4500, direction: 'Out', memberId: undefined, counterpartyName: undefined, receiptVersion: 'a1b2', outOfPocket: false },
          { id: '1007', date: '2026-10-01', name: 'Drankenhandel Smit', amount: 3250, direction: 'Out', memberId: undefined, counterpartyName: undefined, receiptVersion: undefined, outOfPocket: false },
          { id: '1008', date: '2026-09-29', name: 'Tom Bakker', amount: 1000, direction: 'In', memberId: 'u-tom', counterpartyName: undefined, receiptVersion: undefined, outOfPocket: false },
        ]}
        receipt={(expense) => (
          <ReceiptButtonView
            name={expense.name}
            amount=""
            receiptUrl={expense.receiptVersion && RECEIPT_IMAGE}
            isSaving={false}
            onPicked={fn()}
            onRemove={fn()}
          />
        )}
      />
    ),
  },
} satisfies Meta<typeof MoneyPageView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  // Plus the Dutch picture (ADR-0043 §8): Dutch separators in the amounts and dates. Under reduced motion, so the
  // Toppers entrance and the beer count are at their final state in the snapshot.
  parameters: { chromatic: { modes: { ...pageModes, ...dutchMode }, prefersReducedMotion: 'reduce' } },
  play: async ({ canvas, globals }) => {
    // Chromatic runs this play in every mode. In the Dutch one it proves the translated screen (#464).
    if (globals.locale === 'nl') {
      await expect(canvas.getByRole('heading', { name: 'Teampot' })).toBeInTheDocument()
      await expect(within(canvas.getByRole('region', { name: 'Saldo' })).getByText(/187,50/)).toBeInTheDocument()
      await expect(within(canvas.getByRole('region', { name: 'Biermeter' })).getByText('69 biertjes')).toBeInTheDocument()
      await expect(canvas.getByRole('button', { name: 'Bonnetje voor Sporthal De Kuil' })).toBeInTheDocument()
      await expect(canvas.getByRole('link', { name: 'Teampot' })).toHaveAttribute('aria-current', 'page')
      return
    }
    await expect(canvas.getByRole('heading', { name: 'Money' })).toBeInTheDocument()
    await expect(canvas.getByText('Lisa de Vries')).toBeInTheDocument()
    await expect(within(canvas.getByRole('region', { name: 'Toppers' })).getByText('Number 1: Lisa, €20.00')).toBeInTheDocument()
    await expect(canvas.getByText(/covers 69 beers/)).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Top up' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Receipt for Sporthal De Kuil' })).toBeInTheDocument()
    // The viewer's own out-of-pocket expense: named as theirs, with the control that changes it.
    await expect(canvas.getByText(/^Paid by Mia \(you\) · /)).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Change expense Match balls' })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'Money' })).toHaveAttribute('aria-current', 'page')
  },
}
