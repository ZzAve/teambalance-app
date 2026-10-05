import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import type { Member } from '@shared/api/members'
import type { Position } from '@shared/api/positions'
import { Button } from '@shared/ui/button'
import { Stack } from '@shared/testing/stack'
import { MemberRosterView } from '@features/manage-members/ui/MemberRosterView'
import { ManageSubstitutesView } from '@features/manage-substitutes/ui/ManageSubstitutesView'
import { appShell } from '../../../../.storybook/app-shell-decorator'
import { pageModes } from '../../../../.storybook/modes'
import { TeamPageView } from './TeamPageView'

// The team page as a phone shows it (ADR-0032 §3): the header (title, invite action and settings
// gear for admins) over the read-only roster and the read-only Substitute list, inside the real app
// shell. This composite owns the pixels for the header, the read-only MemberRosterView and the
// read-only ManageSubstitutesView; those keep their own snapshots only for what this page can't show.
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter', kind: 'PLAYING' },
  { id: 'p2', label: 'Libero', kind: 'PLAYING' },
  { id: 'p3', label: 'Trainer', kind: 'STAFF' },
]

const MEMBERS: Member[] = [
  { userId: 'u1', displayName: 'Ada Lovelace', role: 'ADMIN', position: POSITIONS[0], onboarded: true, shirtNumber: 7 },
  { userId: 'u2', displayName: 'Grace Hopper', role: 'ADMIN', position: POSITIONS[2], onboarded: true, shirtNumber: undefined },
  { userId: 'u3', displayName: 'Alan Turing', role: 'USER', position: POSITIONS[1], onboarded: true, shirtNumber: 1 },
  { userId: 'u4', displayName: 'Katherine Johnson', role: 'USER', position: undefined, onboarded: true, shirtNumber: 112 },
]

const noop = () => {}
const roster = (state: Partial<Parameters<typeof MemberRosterView>[0]> = {}) => (
  <MemberRosterView
    canManage={false}
    members={MEMBERS}
    positions={POSITIONS}
    onRename={noop}
    onToggleRole={noop}
    onChangePosition={noop}
    onRemove={noop}
    {...state}
  />
)

const substitutes = (
  <ManageSubstitutesView
    canManage={false}
    substitutes={[
      { id: 's1', name: 'Jan de Vries', position: { id: 'p2', label: 'Libero' } },
      { id: 's2', name: 'Sam Bakker', position: undefined },
    ]}
    positions={POSITIONS}
    onRename={noop}
    onChangePosition={noop}
    onRemove={noop}
  />
)

const shell = appShell('team')

const meta = {
  title: 'pages/team/TeamPageView',
  component: TeamPageView,
  decorators: shell.decorators,
  parameters: shell.parameters,
  args: {
    isAdmin: true,
    inviteAction: <Button variant="outline">Invite Link</Button>,
    roster: roster(),
    substitutes,
  },
} satisfies Meta<typeof TeamPageView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  // The page's picture, in dark and once at desktop width too (ADR-0032 §4-§5).
  parameters: { chromatic: { modes: pageModes } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Team' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Invite Link' })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'Team settings' })).toHaveAttribute('href', '/t/setpoint-vt/team/settings')
    // The roster is a grid of faces, each opening that member's page (ADR-0038).
    for (const name of ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson']) {
      await expect(canvas.getByRole('link', { name })).toBeInTheDocument()
    }
    await expect(canvas.getByLabelText('Shirt number 112')).toBeInTheDocument()
    // The Team's Substitutes sit under the roster: people the Team calls in, not Members (ADR-0033).
    await expect(canvas.getByRole('heading', { name: 'Substitutes' })).toBeInTheDocument()
    await expect(canvas.getByText('Jan de Vries')).toBeInTheDocument()
    // Read-only for everyone, admins included: management lives under settings.
    await expect(canvas.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument()
    await expect(canvas.queryByLabelText(/^Actions for /)).not.toBeInTheDocument()
    // The shell around it: the Team tab is the current one.
    await expect(canvas.getByRole('link', { name: 'Team' })).toHaveAttribute('aria-current', 'page')
  },
}

// A member's view of the same page, and the roster's two shells under the header.
export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Member: <TeamPageView {...args} isAdmin={false} inviteAction={undefined} />,
        Loading: <TeamPageView {...args} roster={roster({ members: undefined, isLoading: true })} />,
        Error: <TeamPageView {...args} roster={roster({ members: undefined, isError: true })} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    await expect(region('Member').queryByRole('button', { name: 'Invite Link' })).not.toBeInTheDocument()
    await expect(region('Member').queryByRole('link', { name: 'Team settings' })).not.toBeInTheDocument()
    await expect(region('Member').getByRole('link', { name: 'Ada Lovelace' })).toBeInTheDocument()
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    await expect(region('Error').getByText(/couldn't load/i)).toBeInTheDocument()
  },
}
