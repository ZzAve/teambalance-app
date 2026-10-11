import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { TopUpSheetView } from './TopUpSheetView'

// The amount picker behind the TopUp container. A portal sheet driven by `open`, so there is no
// closed picture. Two stories (ADR-0032 §1), same convention as AnswerSheet:
//   1. Data — the open sheet, the one snapshot.
//   2. Interactions — no picture; presets and the custom amount hand whole euros to onPick, and
//      invalid amounts never reach it.
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

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ userEvent, args }) => {
    const dialog = await sheet()
    const custom = dialog.getByLabelText('Other amount (€)')
    const pay = dialog.getByRole('button', { name: 'Pay' })

    await userEvent.click(dialog.getByRole('button', { name: '€20' }))
    await expect(args.onPick).toHaveBeenCalledWith(20)

    await userEvent.type(custom, '75')
    await userEvent.click(pay)
    await expect(args.onPick).toHaveBeenCalledWith(75)

    // Rejected amounts keep Pay disabled and never reach onPick.
    ;(args.onPick as ReturnType<typeof fn>).mockClear()
    for (const invalid of ['0', '501', '12.5']) {
      await userEvent.clear(custom)
      await userEvent.type(custom, invalid)
      await expect(dialog.getByText('Enter a whole amount from €1 to €500.')).toBeInTheDocument()
      await expect(pay).toBeDisabled()
    }
    await userEvent.type(custom, '{Enter}')
    await expect(args.onPick).not.toHaveBeenCalled()

    // An empty field is not an error message, just not payable.
    await userEvent.clear(custom)
    await expect(dialog.queryByText('Enter a whole amount from €1 to €500.')).not.toBeInTheDocument()
    await expect(pay).toBeDisabled()
  },
}
