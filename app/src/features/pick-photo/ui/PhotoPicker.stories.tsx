import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { PhotoPicker } from './PhotoPicker'

// The picker's output is what the server stores, so the story checks the real crop in a real
// browser: a 400×300 picture in, a 256×256 WebP out.
const meta = {
  title: 'features/pick-photo/PhotoPicker',
  component: PhotoPicker,
  args: { label: 'Upload photo', onPicked: fn() },
} satisfies Meta<typeof PhotoPicker>

export default meta

type Story = StoryObj<typeof meta>

async function landscapePicture(): Promise<File> {
  const canvas = document.createElement('canvas')
  canvas.width = 400
  canvas.height = 300
  const context = canvas.getContext('2d')!
  context.fillStyle = '#2f6f4f'
  context.fillRect(0, 0, 400, 300)
  context.fillStyle = '#f2c14e'
  context.fillRect(150, 100, 100, 100)
  const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'))
  return new File([blob], 'me.png', { type: 'image/png' })
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, args }) => {
    const input = canvas.getByLabelText('Upload photo')

    // Cancel leaves nothing picked.
    await userEvent.upload(input, await landscapePicture())
    const first = within(await screen.findByRole('dialog'))
    await userEvent.click(first.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(args.onPicked).not.toHaveBeenCalled()

    await userEvent.upload(input, await landscapePicture())
    const dialog = within(await screen.findByRole('dialog'))
    const use = dialog.getByRole('button', { name: 'Use photo' })
    await waitFor(() => expect(use).toBeEnabled())
    await userEvent.click(use)

    await waitFor(() => expect(args.onPicked).toHaveBeenCalledOnce())
    const photo: Blob = (args.onPicked as ReturnType<typeof fn>).mock.calls[0][0]
    await expect(photo.type).toBe('image/webp')
    const bitmap = await createImageBitmap(photo)
    await expect([bitmap.width, bitmap.height]).toEqual([256, 256])
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  },
}
