import { useState, type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor, within } from 'storybook/test'
import { Button } from '@shared/ui/button'
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

// The container sets isPending while the link is fetched and owns `open`, with the Top up button as the
// trigger. This stands in for it: any pick sets it, and closing the sheet clears it.
function PendingAfterPick(args: ComponentProps<typeof TopUpSheetView>) {
  const [open, setOpen] = useState(args.open)
  const [isPending, setIsPending] = useState(false)
  return (
    <TopUpSheetView
      {...args}
      trigger={<Button size="lg">Top up</Button>}
      open={open}
      onOpenChange={(next) => {
        args.onOpenChange(next)
        setOpen(next)
        if (!next) setIsPending(false)
      }}
      isPending={isPending}
      onPick={(euros) => {
        args.onPick(euros)
        setIsPending(true)
      }}
    />
  )
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => <PendingAfterPick {...args} />,
  play: async ({ canvas, userEvent, args }) => {
    const dialog = await sheet()
    const custom = dialog.getByLabelText('Other amount (€)')
    const pay = dialog.getByRole('button', { name: 'Pay' })

    // The custom amount's polite live region is mounted from the start and empty until it has an error,
    // so the error is announced when it appears without interrupting the typing.
    const amountErrors = document.querySelectorAll('[role="dialog"] [aria-live="polite"]')
    await expect(amountErrors).toHaveLength(1)
    await expect(amountErrors[0]).toHaveAttribute('aria-atomic', 'true')
    await expect(amountErrors[0]).toBeEmptyDOMElement()
    await expect(dialog.getByRole('group', { name: 'Amounts' })).toContainElement(dialog.getByRole('button', { name: '€10' }))

    // Rejected amounts keep Pay disabled and never reach onPick.
    for (const invalid of ['0', '501', '12.5']) {
      await userEvent.clear(custom)
      await userEvent.type(custom, invalid)
      await waitFor(() => expect(amountErrors[0]).toHaveTextContent('Enter a whole amount from €1 to €500.'))
      await waitFor(() => expect(custom).toHaveAccessibleDescription('Enter a whole amount from €1 to €500.'))
      await expect(custom).toBeInvalid()
      await expect(dialog.queryByRole('alert')).not.toBeInTheDocument()
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
    // While the link is fetched, Pay is aria-disabled rather than disabled: a focused button that becomes
    // disabled drops focus to <body>, outside the modal dialog. Pressing it again, or Enter in the field,
    // picks nothing.
    await waitFor(() => expect(pay).toHaveTextContent('Opening…'))
    await expect(pay).toHaveFocus()
    await expect(pay).toHaveAttribute('aria-disabled', 'true')
    await userEvent.keyboard('{Enter}')
    await userEvent.type(custom, '{Enter}')
    await expect(args.onPick).toHaveBeenCalledTimes(1)

    // Closing ends the pending state; the sheet reopens with the amount still typed.
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument())
    await userEvent.click(canvas.getByRole('button', { name: 'Top up' }))
    const reopened = await sheet()

    const twenty = reopened.getByRole('button', { name: '€20' })
    await userEvent.click(twenty)
    await expect(args.onPick).toHaveBeenCalledWith(20)
    // While the link is fetched, nothing else can be picked. The presets are aria-disabled too, for the
    // same reason as Pay.
    await expect(reopened.getByRole('button', { name: 'Opening…' })).toHaveAttribute('aria-disabled', 'true')
    for (const label of ['€10', '€20', '€50']) {
      await expect(reopened.getByRole('button', { name: label })).toHaveAttribute('aria-disabled', 'true')
    }
    await expect(twenty).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onPick).toHaveBeenCalledTimes(2)

    // Closing hands focus back to the Top up button.
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(args.onOpenChange).toHaveBeenCalledWith(false))
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Top up' })).toHaveFocus())
  },
}
