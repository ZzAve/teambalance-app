import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { TeamHeader } from './TeamHeader'

// TeamHeader renders a TanStack Router <Link> for the admin gear, so it needs a router in context.
// The two stories pin the only behaviour that matters: admins see the settings entry, members don't.
const meta = {
  title: 'widgets/team-header/TeamHeader',
  component: TeamHeader,
  decorators: [withRouter],
} satisfies Meta<typeof TeamHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Admin: Story = {
  args: { isAdmin: true },
  play: async ({ canvas }) => {
    const gear = canvas.getByRole('link', { name: 'Team settings' })
    await expect(gear).toBeInTheDocument()
    await expect(gear).toHaveAttribute('href', '/team/settings')
  },
}

export const Member: Story = {
  args: { isAdmin: false },
  play: async ({ canvas }) => {
    // Title still renders; the settings gear is the only admin-gated element and must be absent.
    await expect(canvas.getByRole('heading', { name: 'Team' })).toBeInTheDocument()
    await expect(canvas.queryByRole('link', { name: 'Team settings' })).not.toBeInTheDocument()
  },
}
