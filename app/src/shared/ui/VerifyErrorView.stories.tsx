import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { Stack } from '@shared/testing/stack'
import { VerifyErrorView } from './VerifyErrorView'

// The /auth/verify error state (ADR-0027 §3). Prop-only: it renders a <Link to="/login">, so it takes
// the shared withRouter decorator. "Back to login" is always present; the escape hatch renders only
// when `onLogout` is passed — the container passes it iff a session exists (or might). Stranded is the
// key edge: sign-in worked but the invite failed, so a client-only logout is the only way out.
//
// One gallery story (ADR-0032 §2) stacks both variants; the Log out click-through is behavioural only
// and lives in Interactions.
const meta = {
  title: 'shared/ui/VerifyErrorView',
  component: VerifyErrorView,
  decorators: [withRouter],
  args: { onLogout: fn() },
} satisfies Meta<typeof VerifyErrorView>

export default meta

type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  // message is required on VerifyErrorView; each Stack instance below sets its own.
  args: { message: '' },
  render: (args) => (
    <Stack
      items={{
        // Authenticated but stranded (invite-accept-failure): both "Back to login" and the escape
        // hatch show.
        Stranded: (
          <VerifyErrorView
            {...args}
            message="Your sign-in worked, but the invite link has expired or is no longer valid. Ask your team admin for a new invitation."
          />
        ),
        // No session (an expired/used magic link never signed anyone in): "Back to login" only, no
        // hatch.
        LoggedOut: (
          <VerifyErrorView
            {...args}
            message="This link has expired or already been used. Request a new one."
            onLogout={undefined}
          />
        ),
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Stranded').getByRole('link', { name: 'Back to login' })).toHaveAttribute(
      'href',
      '/login',
    )

    await expect(region('LoggedOut').getByRole('link', { name: 'Back to login' })).toBeInTheDocument()
    await expect(region('LoggedOut').queryByRole('button', { name: 'Log out' })).not.toBeInTheDocument()
  },
}

// Picture owned by Gallery — behavioural only (ADR-0032 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  args: {
    message:
      'Your sign-in worked, but the invite link has expired or is no longer valid. Ask your team admin for a new invitation.',
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Log out' }))
    await expect(args.onLogout).toHaveBeenCalled()
  },
}
