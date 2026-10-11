import { useState, type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { TOP_UP_PRESETS } from '../lib/amount'
import { TopUpSheetView } from './TopUpSheetView'

// The amount picker behind the TopUp container. A portal sheet driven by `open`, so there is no
// closed picture. Three stories (ADR-0032 §1), same convention as AnswerSheet:
//   1. Data — the open sheet.
//   2. Shells — the open sheet after a failed attempt.
//   3. Interactions — no picture; presets and the custom amount hand whole euros to onPick, invalid
//      amounts never reach it, and the sheet locks while a pick is pending.
const meta = {
  title: 'features/top-up/TopUpSheetView',
  component: TopUpSheetView,
  args: { open: true, onOpenChange: fn(), onPick: fn() },
} satisfies Meta<typeof TopUpSheetView>

export default meta

type Story = StoryObj<typeof meta>

const sheet = async () => within(await within(document.body).findByRole('dialog'))

export const Data: Story = {
  play: async () => {
    const dialog = await sheet()
    await expect(dialog.getByText('Top up the pool')).toBeInTheDocument()
    for (const label of ['€10', '€20', '€50']) await expect(dialog.getByRole('button', { name: label })).toBeEnabled()
    await expect(dialog.getByLabelText('Other amount (€)')).toHaveValue('')
    await expect(dialog.getByRole('button', { name: 'Pay' })).toBeDisabled()
  },
}

export const Shells: Story = {
  args: { error: "Couldn't open the payment page. Please try again." },
  play: async () => {
    const dialog = await sheet()
    await expect(dialog.getByRole('alert')).toHaveTextContent("Couldn't open the payment page. Please try again.")
  },
}

// The container sets isPending while the link is fetched. This stands in for it after a preset
// pick, so the custom amount can still be exercised first.
function PendingAfterPresetPick(args: ComponentProps<typeof TopUpSheetView>) {
  const [isPending, setIsPending] = useState(false)
  return (
    <TopUpSheetView
      {...args}
      isPending={isPending}
      onPick={(euros) => {
        args.onPick(euros)
        setIsPending(TOP_UP_PRESETS.includes(euros))
      }}
    />
  )
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => <PendingAfterPresetPick {...args} />,
  play: async ({ userEvent, args }) => {
    const dialog = await sheet()
    const custom = dialog.getByLabelText('Other amount (€)')
    const pay = dialog.getByRole('button', { name: 'Pay' })

    // Rejected amounts keep Pay disabled and never reach onPick.
    for (const invalid of ['0', '501', '12.5']) {
      await userEvent.clear(custom)
      await userEvent.type(custom, invalid)
      await expect(dialog.getByRole('alert')).toHaveTextContent('Enter a whole amount from €1 to €500.')
      await expect(custom).toHaveAccessibleDescription('Enter a whole amount from €1 to €500.')
      await expect(pay).toBeDisabled()
    }
    await userEvent.type(custom, '{Enter}')
    await expect(args.onPick).not.toHaveBeenCalled()

    // An empty field is not an error message, just not payable.
    await userEvent.clear(custom)
    await expect(dialog.queryByText('Enter a whole amount from €1 to €500.')).not.toBeInTheDocument()
    await expect(pay).toBeDisabled()

    await userEvent.type(custom, '75')
    await userEvent.click(pay)
    await expect(args.onPick).toHaveBeenCalledWith(75)

    await userEvent.click(dialog.getByRole('button', { name: '€20' }))
    await expect(args.onPick).toHaveBeenCalledWith(20)
    // While the link is fetched, nothing else can be picked.
    await expect(dialog.getByRole('button', { name: 'Opening…' })).toBeDisabled()
    for (const label of ['€10', '€20', '€50']) await expect(dialog.getByRole('button', { name: label })).toBeDisabled()
  },
}
