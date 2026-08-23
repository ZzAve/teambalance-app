import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { Button } from '@shared/ui/button'
import { TeamHeader } from './TeamHeader'

// TeamHeader renders a TanStack Router <Link> for the admin gear, so it needs a router in context.
// The two stories pin the only behaviour that matters: admins see the settings entry, members don't.
//
// The gear's target is team-scoped (ADR-0023 §2), derived from the slug in the path the header is
// rendered on — hence the initialEntries below. That is the whole reason it can be asserted here at
// all: the destination is a function of the URL, not of a store the story would have to prime.
const meta = {
  title: 'widgets/team-header/TeamHeader',
  component: TeamHeader,
  decorators: [withRouter],
  parameters: { router: { initialEntries: ['/t/setpoint-vt/team'] } },
} satisfies Meta<typeof TeamHeader>

export default meta

type Story = StoryObj<typeof meta>

// A stand-in for the real GenerateInviteDialog trigger (a container that needs a QueryClient).
// It mirrors the real trigger's markup exactly — `<Button variant="outline">Invite Link</Button>`
// — so the Chromatic snapshot of the admin header is visually faithful (an actual button, not
// bare text). The story only needs the slot to render; the dialog behaviour is covered by the
// generate-invite feature's own stories.
const inviteAction = <Button variant="outline">Invite Link</Button>

export const Admin: Story = {
  args: { isAdmin: true, actions: inviteAction },
  play: async ({ canvas }) => {
    const gear = canvas.getByRole('link', { name: 'Team settings' })
    await expect(gear).toBeInTheDocument()
    await expect(gear).toHaveAttribute('href', '/t/setpoint-vt/team/settings')
    // The admin actions slot (invite link) renders alongside the gear.
    await expect(canvas.getByRole('button', { name: 'Invite Link' })).toBeInTheDocument()
  },
}

export const Member: Story = {
  args: { isAdmin: false, actions: inviteAction },
  play: async ({ canvas }) => {
    // Title still renders; the gear and the admin actions are the only admin-gated elements and
    // must both be absent — a non-admin never sees the invite link even when one is passed.
    await expect(canvas.getByRole('heading', { name: 'Team' })).toBeInTheDocument()
    await expect(canvas.queryByRole('link', { name: 'Team settings' })).not.toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Invite Link' })).not.toBeInTheDocument()
  },
}
