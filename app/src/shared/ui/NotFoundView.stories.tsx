import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { Stack } from '@shared/testing/stack'
import { NotFoundView } from './NotFoundView'

// The router's not-found screen (ADR-0027 §3). Prop-only: it renders a <Link to="/"> ("Go home"), so
// it takes the shared withRouter decorator. The escape hatch renders only when `onLogout` is passed —
// the container passes it iff a session exists (or might); LoggedOut proves it's absent otherwise.
//
// One gallery story (ADR-0031 §2) stacks both variants; the click-through to onLogout is behavioural
// only and lives in Interactions.
const meta = {
  title: 'shared/ui/NotFoundView',
  component: NotFoundView,
  decorators: [withRouter],
  args: { onLogout: fn() },
} satisfies Meta<typeof NotFoundView>

export default meta

type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  render: (args) => (
    <Stack
      items={{
        Default: <NotFoundView {...args} />,
        // No session: "Go home" stands alone, no escape hatch.
        LoggedOut: <NotFoundView {...args} onLogout={undefined} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Default').getByText('Page not found')).toBeInTheDocument()
    await expect(region('Default').getByRole('link', { name: 'Go home' })).toHaveAttribute('href', '/')

    await expect(region('LoggedOut').getByRole('link', { name: 'Go home' })).toBeInTheDocument()
    await expect(region('LoggedOut').queryByRole('button', { name: 'Log out' })).not.toBeInTheDocument()
  },
}

// Picture owned by Gallery — behavioural only (ADR-0031 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Log out' }))
    await expect(args.onLogout).toHaveBeenCalled()
  },
}
