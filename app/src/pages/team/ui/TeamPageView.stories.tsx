import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Member } from '@shared/api/members'
import type { Position } from '@shared/api/positions'
import { Button } from '@shared/ui/button'
import { Stack } from '@shared/testing/stack'
import { appColumn } from '@shared/testing/app-column-decorator'
import { withRouter } from '@shared/testing/router-decorator'
import { MemberRosterView } from '@features/manage-members/ui/MemberRosterView'
import { ManageSubstitutesView } from '@features/manage-substitutes/ui/ManageSubstitutesView'
import { BulletinBoardView } from '@features/bulletin-board/ui/BulletinBoardView'
import { appShell } from '../../../../storybook-support/app-shell-decorator'
import { dutchMode, pageModes } from '../../../../.storybook/modes'
import { TeamPageView } from './TeamPageView'

// The team page as a phone shows it (ADR-0032 §3): the title in the app bar, then the read-only roster
// (invite action and settings gear for admins on its heading's line) and the read-only Substitute list, inside the real app
// shell. This composite owns the pixels for the header, the read-only MemberRosterView and the
// read-only ManageSubstitutesView; those keep their own snapshots only for what this page can't show.
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter', kind: 'PLAYING' },
  { id: 'p2', label: 'Libero', kind: 'PLAYING' },
  { id: 'p3', label: 'Trainer', kind: 'STAFF' },
]

const MEMBERS: Member[] = [
  { userId: 'u1', displayName: 'Ada Lovelace', role: 'ADMIN', position: POSITIONS[0], onboarded: true, shirtNumber: 7, photoVersion: undefined },
  { userId: 'u2', displayName: 'Grace Hopper', role: 'ADMIN', position: POSITIONS[2], onboarded: true, shirtNumber: undefined, photoVersion: undefined },
  { userId: 'u3', displayName: 'Alan Turing', role: 'USER', position: POSITIONS[1], onboarded: true, shirtNumber: 1, photoVersion: undefined },
  { userId: 'u4', displayName: 'Katherine Johnson', role: 'USER', position: undefined, onboarded: true, shirtNumber: 112, photoVersion: undefined },
]

const noop = () => {}
const onInvite = fn()
// The page hands its admin actions to the roster, which puts them on its heading's line.
const roster = (state: Partial<Parameters<typeof MemberRosterView>[0]> = {}) => (headerActions?: ReactNode) => (
  <MemberRosterView
    headerActions={headerActions}
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
      { id: 's1', name: 'Jan de Vries', position: { id: 'p2', label: 'Libero' }, shirtNumber: undefined },
      { id: 's2', name: 'Sam Bakker', position: undefined, shirtNumber: undefined },
    ]}
    positions={POSITIONS}
    onRename={noop}
    onChangePosition={noop}
    onChangeShirtNumber={noop}
    onRemove={noop}
  />
)

const bulletin = (isAdmin: boolean) => (
  <BulletinBoardView
    isAdmin={isAdmin}
    onCreate={noop}
    onUpdate={noop}
    posts={[
      {
        id: 'b1',
        authorName: 'Ada Lovelace',
        postedAt: '2026-11-10T18:00:00Z',
        edits: [{ editorName: 'Grace Hopper', editedAt: '2026-11-11T09:00:00Z' }],
        markdown: '### Ball bag rotation\nWho takes the **balls** home after training:\n\n- Week 46 — Alan\n- Week 47 — Katherine',
      },
    ]}
  />
)

const shell = appShell('team')

const meta = {
  title: 'pages/team/TeamPageView',
  component: TeamPageView,
  parameters: shell.parameters,
  args: {
    isAdmin: true,
    inviteAction: (
      <Button variant="outline" onClick={() => onInvite('invite')}>
        Invite Link
      </Button>
    ),
    roster: roster(),
    substitutes,
    bulletin: bulletin(true),
  },
} satisfies Meta<typeof TeamPageView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  decorators: shell.decorators,
  // The page's picture, in dark and once at desktop width too (ADR-0032 §4-§5), and in Dutch (ADR-0043 §8).
  parameters: { chromatic: { modes: { ...pageModes, ...dutchMode } } },
  play: async ({ canvas, globals }) => {
    // Chromatic runs this play in every mode. In the Dutch one it proves the translated screen (#464).
    if (globals.locale === 'nl') {
      await expect(canvas.getByRole('link', { name: 'Teaminstellingen' })).toHaveAttribute('href', '/t/setpoint-vt/team/settings')
      await expect(canvas.getByRole('heading', { name: 'Leden' })).toBeInTheDocument()
      await expect(canvas.getByRole('heading', { name: 'Invallers' })).toBeInTheDocument()
      await expect(canvas.getByRole('heading', { name: 'Prikbord' })).toBeInTheDocument()
      return
    }
    await expect(canvas.getByRole('heading', { name: 'Team' })).toBeInTheDocument()
    // The Bulletin Board comes first, above the roster (ADR-0048).
    const headings = canvas.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
    await expect(headings).toEqual(['Bulletin board', 'Members', 'Substitutes'])
    await expect(canvas.getByText('Ball bag rotation')).toBeInTheDocument()
    // The admin actions share the roster heading's line, not a row of their own.
    const membersLine = within(canvas.getByRole('heading', { name: 'Members' }).parentElement!)
    await expect(membersLine.getByRole('link', { name: 'Team settings' })).toHaveAttribute('href', '/t/setpoint-vt/team/settings')
    await expect(membersLine.getByRole('button', { name: 'Invite Link' })).toBeInTheDocument()
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
//
// Hosted in the app column rather than the real shell (unlike Data): one header and one tab bar
// around a Stack of three pages would frame them as a single page. Data already proves the real
// shell renders this View correctly; this story's job is the three prop shapes, not the chrome.
export const Shells: Story = {
  decorators: [...appColumn.decorators, withRouter],
  render: (args) => (
    <Stack
      items={{
        Member: <TeamPageView {...args} isAdmin={false} inviteAction={undefined} bulletin={bulletin(false)} />,
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
    await expect(region('Member').getByRole('heading', { name: 'Members' })).toBeInTheDocument()
    await expect(region('Member').queryByRole('button', { name: 'New post' })).not.toBeInTheDocument()
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    await expect(region('Error').getByText(/couldn't load/i)).toBeInTheDocument()
  },
}

// The admin actions handed to the roster stay wired to the page's handler (behavioural only; Data
// owns the picture, and a click here would leave a focus ring in it).
export const Interactions: Story = {
  decorators: shell.decorators,
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent }) => {
    const membersLine = within(canvas.getByRole('heading', { name: 'Members' }).parentElement!)
    onInvite.mockClear()
    await userEvent.click(membersLine.getByRole('button', { name: 'Invite Link' }))
    await expect(onInvite).toHaveBeenCalledWith('invite')
  },
}
