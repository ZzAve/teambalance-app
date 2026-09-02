import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { VerifyErrorView } from './VerifyErrorView'

// The /auth/verify error state (ADR-0027 §3). Prop-only: it renders a <Link to="/login">, so it takes
// the shared withRouter decorator. "Back to login" is always present; the escape hatch renders only
// when `onLogout` is passed — the container passes it iff a session exists (or might). Stranded is the
// key edge: sign-in worked but the invite failed, so a client-only logout is the only way out.
const meta = {
  title: 'shared/ui/VerifyErrorView',
  component: VerifyErrorView,
  decorators: [withRouter],
  args: { onLogout: fn() },
} satisfies Meta<typeof VerifyErrorView>

export default meta

type Story = StoryObj<typeof meta>

// Authenticated but stranded (invite-accept-failure): both "Back to login" and the escape hatch show.
export const Stranded: Story = {
  args: {
    message:
      'Your sign-in worked, but the invite link has expired or is no longer valid. Ask your team admin for a new invitation.',
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole('link', { name: 'Back to login' })).toHaveAttribute('href', '/login')
    await userEvent.click(canvas.getByRole('button', { name: 'Log out' }))
    await expect(args.onLogout).toHaveBeenCalled()
  },
}

// No session (an expired/used magic link never signed anyone in): "Back to login" only, no hatch.
export const LoggedOut: Story = {
  args: {
    message: 'This link has expired or already been used. Request a new one.',
    onLogout: undefined,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Back to login' })).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Log out' })).not.toBeInTheDocument()
  },
}
