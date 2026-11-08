import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { PasskeyLoginView } from './PasskeyLoginView'

const meta = {
  title: 'features/passkey-login/PasskeyLoginView',
  component: PasskeyLoginView,
  args: { onSignIn: fn() },
} satisfies Meta<typeof PasskeyLoginView>

export default meta

type Story = StoryObj<typeof meta>

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in with a passkey' }))
    await expect(args.onSignIn).toHaveBeenCalledTimes(1)
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Marked: <PasskeyLoginView {...args} isLast />,
        Pending: <PasskeyLoginView {...args} isPending />,
        Error: <PasskeyLoginView {...args} errorMessage="Signing in with a passkey failed. Use your email link instead." />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Last')).toBeInTheDocument()
    await expect(canvas.getAllByRole('button', { name: 'Sign in with a passkey' })[0]).toHaveAccessibleDescription('Last')
    await expect(canvas.getAllByRole('button', { name: 'Sign in with a passkey' })[1]).toBeDisabled()
    await expect(canvas.getByRole('alert')).toHaveTextContent('Signing in with a passkey failed.')
  },
}
