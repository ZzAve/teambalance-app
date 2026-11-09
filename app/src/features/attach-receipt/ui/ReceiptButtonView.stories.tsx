import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { RECEIPT_IMAGE } from './receipt-image.fixture'
import { ReceiptButtonView } from './ReceiptButtonView'

// The receipt on one expense, prop-only (ADR-0017): the container passes the receipt URL and the
// upload and remove calls. The shrinking runs for real in the browser, so Interactions checks what
// would be uploaded.
//
// Three-story shape (ADR-0032 §1):
//   1. Data — the dialog open on an expense with a receipt.
//   2. Shells — the dialog without a receipt, while saving, and with each error.
//   3. Interactions — add a receipt (a 4000×3000 picture leaves as WebP of at most 1600 px), then remove one.
const meta = {
  title: 'features/attach-receipt/ReceiptButtonView',
  component: ReceiptButtonView,
  args: {
    name: 'Sporthal De Kuil',
    amount: '€ 45,00',
    receiptUrl: RECEIPT_IMAGE,
    isSaving: false,
    onPicked: fn(),
    onRemove: fn(),
  },
} satisfies Meta<typeof ReceiptButtonView>

export default meta

type Story = StoryObj<typeof meta>

const openDialog = async (canvas: ReturnType<typeof within>) => {
  await userEvent.click(canvas.getByRole('button', { name: 'Receipt for Sporthal De Kuil' }))
  return within(await screen.findByRole('dialog'))
}

export const Data: Story = {
  play: async ({ canvas }) => {
    const dialog = await openDialog(canvas)
    await expect(dialog.getByText('Sporthal De Kuil, € 45,00')).toBeInTheDocument()
    await expect(dialog.getByRole('img', { name: 'Receipt for Sporthal De Kuil' })).toHaveAttribute('src', RECEIPT_IMAGE)
    await expect(dialog.getByRole('button', { name: 'Replace' })).toBeEnabled()
    await expect(dialog.getByRole('button', { name: 'Remove' })).toBeEnabled()
  },
}

export const Shells: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        'No receipt': <ReceiptButtonView {...args} receiptUrl={undefined} />,
        Saving: <ReceiptButtonView {...args} isSaving />,
        'Too large': <ReceiptButtonView {...args} error="RECEIPT_TOO_LARGE" />,
        'Payment gone': <ReceiptButtonView {...args} receiptUrl={undefined} error="EXPENSE_NOT_FOUND" />,
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const region = (name: string) => within(within(canvasElement).getByRole('region', { name }))
    const dialogFor = async (name: string) => {
      await userEvent.click(region(name).getByRole('button', { name: 'Receipt for Sporthal De Kuil' }))
      const dialog = within(await screen.findByRole('dialog'))
      return dialog
    }
    const close = async () => {
      await userEvent.keyboard('{Escape}')
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    }

    const empty = await dialogFor('No receipt')
    await expect(empty.getByText(/No receipt yet/)).toBeInTheDocument()
    await expect(empty.getByRole('button', { name: 'Add receipt' })).toBeEnabled()
    await expect(empty.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument()
    await close()

    const saving = await dialogFor('Saving')
    await expect(saving.getByRole('button', { name: 'Saving…' })).toBeDisabled()
    await expect(saving.getByRole('button', { name: 'Remove' })).toBeDisabled()
    await close()

    await expect((await dialogFor('Too large')).getByRole('alert')).toHaveTextContent(/too large/)
    await close()
    await expect((await dialogFor('Payment gone')).getByRole('alert')).toHaveTextContent(/no longer in the pool/)
    await close()
  },
}

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

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        'No receipt': <ReceiptButtonView {...args} receiptUrl={undefined} />,
        'With receipt': <ReceiptButtonView {...args} />,
      }}
    />
  ),
  play: async ({ canvasElement, args }) => {
    const region = (name: string) => within(within(canvasElement).getByRole('region', { name }))

    await userEvent.click(region('No receipt').getByRole('button', { name: 'Receipt for Sporthal De Kuil' }))
    const dialog = within(await screen.findByRole('dialog'))
    await userEvent.upload(dialog.getByLabelText('Add receipt'), await cameraPicture())
    await waitFor(() => expect(args.onPicked).toHaveBeenCalledOnce())
    const receipt: Blob = (args.onPicked as ReturnType<typeof fn>).mock.calls[0][0]
    await expect(receipt.type).toBe('image/webp')
    const bitmap = await createImageBitmap(receipt)
    await expect([bitmap.width, bitmap.height]).toEqual([1600, 1200])
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

    await userEvent.click(region('With receipt').getByRole('button', { name: 'Receipt for Sporthal De Kuil' }))
    await userEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Remove' }))
    await expect(args.onRemove).toHaveBeenCalledOnce()
    await expect(args.onPicked).toHaveBeenCalledOnce()
  },
}
