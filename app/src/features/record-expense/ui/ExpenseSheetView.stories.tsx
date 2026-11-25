import { useState, type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor, within } from 'storybook/test'
import { Button } from '@shared/ui/button'
import { ExpenseSheetView } from './ExpenseSheetView'

// The form behind the RecordExpense and EditExpense containers, prop-only (ADR-0017). A portal sheet driven
// by `open`, so there is no closed picture. Three stories (ADR-0032 §1):
//   1. Data — the open form for a new expense, as a member sees it: the receipt comes first.
//   2. Shells — the form for a stored expense as an Admin sees it (member picker, delete), after a refused save.
//   3. Interactions — no picture. New: the total read from the photo fills the amount but never replaces
//      what was typed, the photo is shrunk and handed to onSubmit, and a save without a photo asks first.
//      Stored: the values are filled in, a save hands them to onSubmit, and delete asks first.
const MEMBERS = [
  { userId: 'u-lisa', displayName: 'Lisa' },
  { userId: 'u-tom', displayName: 'Tom' },
]
const STORED = { amount: 1250, date: '2026-10-05', description: 'Match balls', summary: 'Match balls, €12.50' }

const meta = {
  title: 'features/record-expense/ExpenseSheetView',
  component: ExpenseSheetView,
  args: { open: true, onOpenChange: fn(), onSubmit: fn(), userId: 'u-lisa', today: '2026-10-07', readTotal: fn(async () => 1250) },
} satisfies Meta<typeof ExpenseSheetView>

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
    // The receipt comes before the amount, which is read from it.
    const addReceipt = dialog.getByRole('button', { name: 'Add receipt' })
    await expect(dialog.getByText(/^Start with a photo of the receipt\./)).toBeInTheDocument()
    await expect(addReceipt.compareDocumentPosition(dialog.getByLabelText('Amount (€)')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    // A member records for themselves: no member picker.
    await expect(dialog.queryByLabelText('Paid by')).not.toBeInTheDocument()
    await expect(dialog.getByLabelText('Date')).toHaveValue('2026-10-07')
    await expect(dialog.getByLabelText('Date')).toHaveAttribute('max', '2026-10-07')
    await expect(dialog.getByRole('button', { name: 'Save expense' })).toBeDisabled()
    await expect(dialog.queryByRole('button', { name: 'Delete this expense' })).not.toBeInTheDocument()
  },
}

export const Shells: Story = {
  args: { members: MEMBERS, error: 'INVALID', readTotal: undefined, editing: { ...STORED, onDelete: fn() } },
  play: async () => {
    const dialog = await sheet()
    await expect(dialog.getByRole('heading', { name: 'Change this expense' })).toBeInTheDocument()
    await expect(dialog.getByLabelText('Paid by')).toHaveValue('u-lisa')
    await expect(dialog.getByLabelText('Amount (€)')).toHaveValue('12,50')
    await expect(dialog.getByLabelText('What was it for?')).toHaveValue('Match balls')
    await expect(dialog.getByLabelText('Date')).toHaveValue('2026-10-05')
    // The receipt of a stored expense is changed with the receipt control in the list.
    await expect(dialog.queryByLabelText('Photo of the receipt')).not.toBeInTheDocument()
    await expect(dialog.getByRole('alert')).toHaveTextContent('Check the amount, the description and the date.')
    await expect(dialog.getByRole('button', { name: 'Save changes' })).toBeEnabled()
    await expect(dialog.getByRole('button', { name: 'Delete this expense' })).toBeInTheDocument()
  },
}

const onChanged = fn()
const onDelete = fn()

// The containers own `open`; this stands in for them.
function SheetBehindTrigger(props: ComponentProps<typeof ExpenseSheetView>) {
  const [open, setOpen] = useState(false)
  return <ExpenseSheetView {...props} open={open} onOpenChange={setOpen} />
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  args: { members: MEMBERS },
  // Two sheets behind their triggers: one for a new expense, one for a stored expense whose payer left the team.
  render: (args) => (
    <div className="flex gap-2">
      <SheetBehindTrigger {...args} trigger={<Button>New expense</Button>} />
      <SheetBehindTrigger
        {...args}
        userId="u-gone"
        readTotal={undefined}
        onSubmit={onChanged}
        editing={{ ...STORED, onDelete }}
        trigger={<Button>Stored expense</Button>}
      />
    </div>
  ),
  play: async ({ canvas, userEvent, args }) => {
    onChanged.mockClear()
    onDelete.mockClear()
    const readTotal = args.readTotal as ReturnType<typeof fn>
    const picture = await cameraPicture()

    await userEvent.click(canvas.getByRole('button', { name: 'New expense' }))
    let dialog = await sheet()
    const amount = dialog.getByLabelText('Amount (€)')
    const photo = dialog.getByLabelText('Photo of the receipt')

    // The total read from the photo fills the empty amount, and says where it came from.
    await userEvent.upload(photo, picture)
    await expect(await dialog.findByRole('img', { name: 'The receipt you added' })).toBeInTheDocument()
    await waitFor(() => expect(amount).toHaveValue('12,50'))
    await expect(amount).toHaveAccessibleDescription('Read from the receipt. Check that it is the total.')
    // What is read is the photo as it will be uploaded: shrunk in the browser, like any receipt (ADR-0044).
    const read: Blob = readTotal.mock.calls[0][0]
    await expect(read.type).toBe('image/webp')
    const bitmap = await createImageBitmap(read)
    await expect([bitmap.width, bitmap.height]).toEqual([1600, 1200])

    // Another photo replaces an amount that came from a photo…
    readTotal.mockResolvedValueOnce(2075)
    await userEvent.upload(photo, picture)
    await waitFor(() => expect(amount).toHaveValue('20,75'))
    // …but never one the member typed, and a photo without a readable total says so.
    await userEvent.clear(amount)
    await userEvent.type(amount, '9,99')
    await expect(amount).not.toHaveAccessibleDescription()
    readTotal.mockResolvedValueOnce(500)
    await userEvent.upload(photo, picture)
    await waitFor(() => expect(readTotal).toHaveBeenCalledTimes(3))
    await expect(amount).toHaveValue('9,99')
    readTotal.mockResolvedValueOnce(null)
    await userEvent.upload(photo, picture)
    await waitFor(() => expect(amount).toHaveAccessibleDescription('Could not read the amount from the receipt. Enter it yourself.'))
    await expect(amount).toHaveValue('9,99')

    // An amount that is not payable shows why and keeps Save disabled.
    await userEvent.type(dialog.getByLabelText('What was it for?'), '  Match balls ')
    await userEvent.type(amount, '9')
    await waitFor(() => expect(amount).toHaveAccessibleDescription('Enter an amount from €0.01 to €10,000.'))
    await expect(amount).toBeInvalid()
    await expect(dialog.getByRole('button', { name: 'Save expense' })).toBeDisabled()
    await userEvent.type(amount, '{Backspace}')

    // The viewer is preselected; an Admin picks someone else. The save carries the photo.
    await expect(dialog.getByLabelText('Paid by')).toHaveValue('u-lisa')
    await userEvent.selectOptions(dialog.getByLabelText('Paid by'), 'u-tom')
    await userEvent.click(dialog.getByRole('button', { name: 'Save expense' }))
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    const submitted = (args.onSubmit as ReturnType<typeof fn>).mock.calls[0][0]
    await expect(submitted).toMatchObject({ userId: 'u-tom', amount: 999, date: '2026-10-07', description: 'Match balls' })
    await expect(submitted.receipt.type).toBe('image/webp')

    // Without a photo the first press only asks; the second saves without one.
    await userEvent.click(dialog.getByRole('button', { name: 'Remove' }))
    await userEvent.click(dialog.getByRole('button', { name: 'Save expense' }))
    await expect(dialog.getByText('You did not add a receipt. Add a photo of it, or save without one.')).toBeInTheDocument()
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await userEvent.click(dialog.getByRole('button', { name: 'Save without receipt' }))
    await expect(args.onSubmit).toHaveBeenLastCalledWith({ userId: 'u-tom', amount: 999, date: '2026-10-07', description: 'Match balls', receipt: undefined })
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument())

    // A stored expense: the payer who left the team stays selectable, and a save asks nothing about a receipt.
    await userEvent.click(canvas.getByRole('button', { name: 'Stored expense' }))
    dialog = await sheet()
    await expect(dialog.getByLabelText('Paid by')).toHaveValue('u-gone')
    await expect(dialog.getByRole('option', { name: 'Former member' })).toBeInTheDocument()
    await userEvent.clear(dialog.getByLabelText('Amount (€)'))
    await userEvent.type(dialog.getByLabelText('Amount (€)'), '15')
    await userEvent.click(dialog.getByRole('button', { name: 'Save changes' }))
    await expect(onChanged).toHaveBeenCalledOnce()
    await expect(onChanged).toHaveBeenCalledWith({ userId: 'u-gone', amount: 1500, date: '2026-10-05', description: 'Match balls', receipt: undefined })

    // Delete asks first. Cancel deletes nothing and hands focus back to the button.
    const deleteButton = dialog.getByRole('button', { name: 'Delete this expense' })
    await userEvent.click(deleteButton)
    let question = within(await within(document.body).findByRole('dialog', { name: 'Delete this expense?' }))
    await expect(question.getByText(/^Match balls, €12\.50\./)).toBeInTheDocument()
    await userEvent.click(question.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(within(document.body).queryByRole('dialog', { name: 'Delete this expense?' })).not.toBeInTheDocument())
    await expect(onDelete).not.toHaveBeenCalled()
    await waitFor(() => expect(deleteButton).toHaveFocus())
    await userEvent.click(deleteButton)
    question = within(await within(document.body).findByRole('dialog', { name: 'Delete this expense?' }))
    await userEvent.click(question.getByRole('button', { name: 'Delete' }))
    await expect(onDelete).toHaveBeenCalledOnce()
  },
}
