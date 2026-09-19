import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { Stack } from '@shared/testing/stack'
import { Button } from '@shared/ui/button'
import { TeamHeader } from './TeamHeader'

// TeamHeader renders a TanStack Router <Link> for the admin gear, so it needs a router in context.
// The gear's target is derived from the slug in the path the header is rendered on — hence the
// initialEntries below.
//
// Covered by the team page composite (TeamPageView, ADR-0032 §3): the only behaviour that matters —
// admins see the settings entry, members don't — is folded into one disableSnapshot Gallery; the
// picture lives on the composite.
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
// — so the gallery is visually faithful (an actual button, not bare text). The story only needs the
// slot to render; the dialog behaviour is covered by the generate-invite feature's own stories.
const inviteAction = <Button variant="outline">Invite Link</Button>

// Picture owned by the team page composite (TeamPageView) — behavioural only (ADR-0032 §3).
export const Gallery: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  // isAdmin is required on TeamHeader; unused by render below — each Stack instance sets its own.
  args: { isAdmin: true },
  render: () => (
    <Stack
      items={{
        Admin: <TeamHeader isAdmin actions={inviteAction} />,
        Member: <TeamHeader isAdmin={false} actions={inviteAction} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    const gear = region('Admin').getByRole('link', { name: 'Team settings' })
    await expect(gear).toBeInTheDocument()
    await expect(gear).toHaveAttribute('href', '/t/setpoint-vt/team/settings')
    // The admin actions slot (invite link) renders alongside the gear.
    await expect(region('Admin').getByRole('button', { name: 'Invite Link' })).toBeInTheDocument()

    // Title still renders; the gear and the admin actions are the only admin-gated elements and
    // must both be absent — a non-admin never sees the invite link even when one is passed.
    await expect(region('Member').getByRole('heading', { name: 'Team' })).toBeInTheDocument()
    await expect(region('Member').queryByRole('link', { name: 'Team settings' })).not.toBeInTheDocument()
    await expect(
      region('Member').queryByRole('button', { name: 'Invite Link' }),
    ).not.toBeInTheDocument()
  },
}
