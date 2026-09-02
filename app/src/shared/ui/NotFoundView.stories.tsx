import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { NotFoundView } from './NotFoundView'

// The router's not-found screen (ADR-0027 §3). Prop-only: it renders a <Link to="/"> ("Go home"), so
// it takes the shared withRouter decorator. The escape hatch renders only when `onLogout` is passed —
// the container passes it iff a session exists (or might); LoggedOut proves it's absent otherwise.
const meta = {
  title: 'shared/ui/NotFoundView',
  component: NotFoundView,
  decorators: [withRouter],
  args: { onLogout: fn() },
} satisfies Meta<typeof NotFoundView>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText('Page not found')).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'Go home' })).toHaveAttribute('href', '/')
    await userEvent.click(canvas.getByRole('button', { name: 'Log out' }))
    await expect(args.onLogout).toHaveBeenCalled()
  },
}

// No session: "Go home" stands alone, no escape hatch.
export const LoggedOut: Story = {
  args: { onLogout: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Go home' })).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Log out' })).not.toBeInTheDocument()
  },
}
