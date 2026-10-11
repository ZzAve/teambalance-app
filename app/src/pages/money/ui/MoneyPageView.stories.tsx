import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Button } from '@shared/ui/button'
import { MoneyPoolView } from '@widgets/money-pool/ui/MoneyPoolView'
import { appShell } from '../../../../storybook-support/app-shell-decorator'
import { pageModes } from '../../../../.storybook/modes'
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
        topUp={<Button>Top up</Button>}
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
  parameters: { chromatic: { modes: pageModes } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Money' })).toBeInTheDocument()
    await expect(canvas.getByText('Lisa de Vries')).toBeInTheDocument()
    await expect(canvas.getByText('69 beers')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Top up' })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'Money' })).toHaveAttribute('aria-current', 'page')
  },
}
