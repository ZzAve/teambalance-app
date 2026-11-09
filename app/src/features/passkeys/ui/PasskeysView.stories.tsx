import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { PasskeysView } from './PasskeysView'

// ADR-0032 cap: Data carries the pixels, Shells the loading/empty/error/busy/unsupported states as props,
// Interactions proves the wiring (add, and remove behind the confirmation).
const PASSKEYS = [
  { id: 'abc', label: 'This device', createdAt: '2026-05-01T10:00:00Z', lastUsedAt: '2026-06-01T10:00:00Z' },
  { id: 'def', label: 'Security key', createdAt: '2026-05-02T10:00:00Z', lastUsedAt: undefined },
]

const meta = {
  title: 'features/passkeys/PasskeysView',
  component: PasskeysView,
  args: { passkeys: PASSKEYS, supported: true, onAdd: fn(), onDelete: fn() },
} satisfies Meta<typeof PasskeysView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('This device')).toBeInTheDocument()
    await expect(canvas.getByText(/Never used/)).toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <PasskeysView {...args} passkeys={[]} isLoading />,
        Empty: <PasskeysView {...args} passkeys={[]} />,
        Error: <PasskeysView {...args} passkeys={[]} isError />,
        Adding: <PasskeysView {...args} isAdding />,
        Removing: <PasskeysView {...args} isRemoving />,
        Failed: <PasskeysView {...args} errorMessage="That did not work. Try again." />,
        Unsupported: <PasskeysView {...args} passkeys={[]} supported={false} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByText('No passkeys yet.')[0]).toBeInTheDocument()
    await expect(canvas.getByText('This browser does not support passkeys.')).toBeInTheDocument()
    // A removal in flight disables Add without claiming to wait for the device.
    await expect(within(canvas.getByRole('region', { name: 'Removing' })).getByRole('button', { name: 'Add a passkey' })).toBeDisabled()
    await expect(canvas.getByRole('alert')).toHaveTextContent('That did not work. Try again.')
  },
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Add a passkey' }))
    await expect(args.onAdd).toHaveBeenCalledTimes(1)

    await userEvent.click(canvas.getAllByRole('button', { name: 'Remove' })[1])
    const dialog = within(await within(document.body).findByRole('dialog'))
    await userEvent.click(dialog.getByRole('button', { name: 'Cancel' }))
    await expect(args.onDelete).not.toHaveBeenCalled()

    await userEvent.click(canvas.getAllByRole('button', { name: 'Remove' })[1])
    const again = within(await within(document.body).findByRole('dialog'))
    await userEvent.click(again.getByRole('button', { name: 'Remove' }))
    await expect(args.onDelete).toHaveBeenCalledWith('def')
  },
}
