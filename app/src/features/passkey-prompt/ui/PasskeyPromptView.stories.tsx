import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { PasskeyPromptView } from './PasskeyPromptView'

const meta = {
  title: 'features/passkey-prompt/PasskeyPromptView',
  component: PasskeyPromptView,
  args: { onAdd: fn(), onDismiss: fn() },
} satisfies Meta<typeof PasskeyPromptView>

export default meta

type Story = StoryObj<typeof meta>

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Add a passkey' }))
    await expect(args.onAdd).toHaveBeenCalledTimes(1)
    await userEvent.click(canvas.getByRole('button', { name: 'Not now' }))
    await expect(args.onDismiss).toHaveBeenCalledTimes(1)
    await expect(args.onAdd).toHaveBeenCalledTimes(1)
  },
}

// The prompt is `fixed`; `contain-layout` makes each box its containing block (see UpdateToast.stories).
const boxed = (node: React.ReactNode) => <div className="relative h-40 contain-layout">{node}</div>

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Pending: boxed(<PasskeyPromptView {...args} isPending />),
        Error: boxed(<PasskeyPromptView {...args} errorMessage="That did not work. Try again." />),
      }}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Waiting for your device...' })).toBeDisabled()
    await expect(canvas.getByText('That did not work. Try again.')).toBeInTheDocument()
  },
}
