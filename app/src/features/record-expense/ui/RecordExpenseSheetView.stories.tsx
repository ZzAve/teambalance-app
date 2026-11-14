import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor, within } from 'storybook/test'
import { RecordExpenseSheetView } from './RecordExpenseSheetView'

// The form behind the RecordExpense container, prop-only (ADR-0017). A portal sheet driven by `open`, so
// there is no closed picture. Three stories (ADR-0032 §1):
//   1. Data — the open form as a member sees it.
//   2. Shells — the form as an Admin sees it (with the member picker), after a refused save.
//   3. Interactions — no picture; a save without a receipt asks first, a picked photo is shrunk and
//      handed to onSubmit with the amount in cents, and an Admin's pick of the member reaches onSubmit.
const MEMBERS = [
  { userId: 'u-lisa', displayName: 'Lisa' },
  { userId: 'u-tom', displayName: 'Tom' },
]

const meta = {
  title: 'features/record-expense/RecordExpenseSheetView',
  component: RecordExpenseSheetView,
  args: { open: true, onOpenChange: fn(), onSubmit: fn(), userId: 'u-lisa', today: '2026-10-07' },
} satisfies Meta<typeof RecordExpenseSheetView>

export default meta

type Story = StoryObj<typeof meta>

const sheet = async () => within(await within(document.body).findByRole('dialog'))

async function cameraPicture(): Promise<File> {
  const canvas = document.createElement('canvas')
  canvas.width = 4000
  canvas.height = 3000
  const context = canvas.getContext('2d')!
  context.fillStyle = '#fbfaf6'
  context.fillRect(0, 0, 4000, 3000)
  const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'))
  return new File([blob], 'receipt.png', { type: 'image/png' })
}

export const Data: Story = {
  play: async () => {
    const dialog = await sheet()
    await expect(dialog.getByRole('heading', { name: 'Add an expense you paid' })).toBeInTheDocument()
    // A member records for themselves: no member picker.
    await expect(dialog.queryByLabelText('Paid by')).not.toBeInTheDocument()
    await expect(dialog.getByLabelText('Date')).toHaveValue('2026-10-07')
    await expect(dialog.getByLabelText('Date')).toHaveAttribute('max', '2026-10-07')
    await expect(dialog.getByText('Add a photo of the receipt so the team can see what this was spent on.')).toBeInTheDocument()
    await expect(dialog.getByRole('button', { name: 'Add receipt' })).toBeEnabled()
    await expect(dialog.getByRole('button', { name: 'Save expense' })).toBeDisabled()
  },
}

export const Shells: Story = {
  args: { members: MEMBERS, userId: '', error: 'INVALID' },
  play: async () => {
    const dialog = await sheet()
    await expect(dialog.getByLabelText('Paid by')).toHaveValue('')
    await expect(dialog.getByRole('alert')).toHaveTextContent('Check the amount, the description and the date.')
  },
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  args: { members: MEMBERS },
  play: async ({ userEvent, args }) => {
    const dialog = await sheet()
    const amount = dialog.getByLabelText('Amount (€)')
    const save = dialog.getByRole('button', { name: 'Save expense' })

    // The viewer is preselected; an Admin picks someone else.
    await expect(dialog.getByLabelText('Paid by')).toHaveValue('u-lisa')
    await userEvent.selectOptions(dialog.getByLabelText('Paid by'), 'u-tom')

    // An amount that is not payable shows why and keeps Save disabled.
    await userEvent.type(dialog.getByLabelText('What was it for?'), '  Match balls ')
    await userEvent.type(amount, '12,345')
    await waitFor(() => expect(amount).toHaveAccessibleDescription('Enter an amount from €0.01 to €10,000.'))
    await expect(amount).toBeInvalid()
    await expect(save).toBeDisabled()
    await userEvent.clear(amount)
    await userEvent.type(amount, '12,50')
    await expect(save).toBeEnabled()

    // Without a receipt the first press only asks; nothing is submitted yet.
    await userEvent.click(save)
    await expect(dialog.getByText('You did not add a receipt. Add a photo of it, or save without one.')).toBeInTheDocument()
    await expect(args.onSubmit).not.toHaveBeenCalled()
    await expect(dialog.getByRole('button', { name: 'Save without receipt' })).toBeEnabled()

    // Adding the photo answers the question: the button is Save again and the photo shows.
    await userEvent.upload(dialog.getByLabelText('Photo of the receipt'), await cameraPicture())
    await expect(await dialog.findByRole('img', { name: 'The receipt you added' })).toBeInTheDocument()
    await expect(dialog.queryByText('You did not add a receipt. Add a photo of it, or save without one.')).not.toBeInTheDocument()
    await userEvent.click(dialog.getByRole('button', { name: 'Save expense' }))
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    const submitted = (args.onSubmit as ReturnType<typeof fn>).mock.calls[0][0]
    await expect(submitted).toMatchObject({ userId: 'u-tom', amount: 1250, date: '2026-10-07', description: 'Match balls' })
    // The photo is shrunk in the browser, like any receipt (ADR-0044).
    await expect(submitted.receipt.type).toBe('image/webp')
    const bitmap = await createImageBitmap(submitted.receipt)
    await expect([bitmap.width, bitmap.height]).toEqual([1600, 1200])

    // With the photo removed, the second press saves without one.
    await userEvent.click(dialog.getByRole('button', { name: 'Remove' }))
    await userEvent.click(dialog.getByRole('button', { name: 'Save expense' }))
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await userEvent.click(dialog.getByRole('button', { name: 'Save without receipt' }))
    await expect(args.onSubmit).toHaveBeenCalledTimes(2)
    await expect(args.onSubmit).toHaveBeenLastCalledWith({ userId: 'u-tom', amount: 1250, date: '2026-10-07', description: 'Match balls', receipt: undefined })
  },
}
