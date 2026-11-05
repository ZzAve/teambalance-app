import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Button } from '@shared/ui/button'
import { MoneyPoolView } from '@widgets/money-pool/ui/MoneyPoolView'
import { appShell } from '../../../../storybook-support/app-shell-decorator'
import { dutchMode, pageModes } from '../../../../.storybook/modes'
import { MoneyPageView } from './MoneyPageView'

// The money page as a phone shows it (ADR-0032 §3): the title over the connected pool with its Top up button, inside the
// real app shell. This composite owns the pixels for the connected MoneyPoolView; the other pool
// states are pictured by MoneyPoolView's own Shells story.
const shell = appShell('money')

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
        topUp={<Button size="lg">Top up</Button>}
        payments={[
          { date: '2026-10-06', name: 'Lisa de Vries', amount: 2000, direction: 'In' },
          { date: '2026-10-04', name: 'Sporthal De Kuil', amount: 4500, direction: 'Out' },
          { date: '2026-09-29', name: 'Tom Bakker', amount: 1000, direction: 'In' },
        ]}
      />
    ),
  },
} satisfies Meta<typeof MoneyPageView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  // Plus the Dutch picture (ADR-0043 §8): the money keeps the euro with Dutch separators.
  parameters: { chromatic: { modes: { ...pageModes, ...dutchMode } } },
  play: async ({ canvas, globals }) => {
    // Chromatic runs this play in every mode. In the Dutch one it proves the translated screen (#464).
    if (globals.locale === 'nl') {
      await expect(canvas.getByRole('heading', { name: 'Teampot' })).toBeInTheDocument()
      await expect(within(canvas.getByRole('region', { name: 'Saldo' })).getByText(/187,50/)).toBeInTheDocument()
      const beers = within(canvas.getByRole('region', { name: 'Bierteller' }))
      await expect(beers.getByText('69 biertjes')).toBeInTheDocument()
      await expect(beers.getByText(/Het saldo van de teampot is genoeg voor 69 biertjes van .*2,70 per stuk\./)).toBeInTheDocument()
      await expect(within(canvas.getByRole('region', { name: 'Betalingen' })).getByText('6 okt')).toBeInTheDocument()
      await expect(canvas.getByRole('link', { name: 'Teampot' })).toHaveAttribute('aria-current', 'page')
      return
    }
    await expect(canvas.getByRole('heading', { name: 'Money' })).toBeInTheDocument()
    await expect(canvas.getByText('Lisa de Vries')).toBeInTheDocument()
    await expect(canvas.getByText('69 beers')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Top up' })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'Money' })).toHaveAttribute('aria-current', 'page')
  },
}
