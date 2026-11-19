import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Member } from '@shared/api/members'
import type { Position } from '@shared/api/positions'
import { Stack } from '@shared/testing/stack'
import { appColumn } from '@shared/testing/app-column-decorator'
import { withRouter } from '@shared/testing/router-decorator'
import { MemberRosterView } from '@features/manage-members/ui/MemberRosterView'
import { SubstituteRosterView } from '@features/manage-substitutes/ui/SubstituteRosterView'
import { BulletinBoardView } from '@features/bulletin-board/ui/BulletinBoardView'
import { appShell } from '../../../../storybook-support/app-shell-decorator'
import { dutchMode, pageModes } from '../../../../.storybook/modes'
import { TeamPageView } from './TeamPageView'

// The team page as a phone shows it (ADR-0032 §3): the title in the app bar, then for admins the
// "Invite people" row, the Roster and the Substitutes as faces, and for admins the "Team settings"
// row, inside the real app shell. This composite owns the pixels for the header, MemberRosterView and
// SubstituteRosterView; those keep their own stories only for what this page can't show.
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

const roster = (state: Partial<Parameters<typeof MemberRosterView>[0]> = {}) => <MemberRosterView members={MEMBERS} {...state} />

const substitutes = (
  <SubstituteRosterView
    substitutes={[
      { id: 's1', name: 'Jan de Vries', position: { id: 'p2', label: 'Libero' }, shirtNumber: 14 },
      { id: 's2', name: 'Sam Bakker', position: undefined, shirtNumber: undefined },
    ]}
  />
)

// The route wraps the row in the invite dialog; here a click on it reaches the spy.
const invite = (trigger: ReactNode) => <div onClick={() => onInvite('invite')}>{trigger}</div>

const bulletin = (isAdmin: boolean) => (
  <BulletinBoardView
    isAdmin={isAdmin}
    onCreate={noop}
    onUpdate={noop}
    onDelete={noop}
    onRestore={noop}
    now={new Date('2026-11-14T12:00:00Z')}
    posts={[
      {
        id: 'b1',
        authorName: 'Ada Lovelace',
        postedAt: '2026-11-10T18:00:00Z',
        pinned: true,
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
    invite,
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
      await expect(canvas.getByRole('link', { name: /^Teaminstellingen/ })).toHaveAttribute('href', '/t/setpoint-vt/team/settings')
      await expect(canvas.getByRole('heading', { name: 'Leden' })).toBeInTheDocument()
      await expect(canvas.getByRole('heading', { name: 'Invallers' })).toBeInTheDocument()
      await expect(canvas.getByRole('heading', { name: 'Prikbord' })).toBeInTheDocument()
      return
    }
    await expect(canvas.getByRole('heading', { name: 'Team' })).toBeInTheDocument()
    // The Bulletin Board comes first, above the roster (ADR-0050).
    const headings = canvas.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
    await expect(headings).toEqual(['Bulletin board', 'Members', 'Substitutes'])
    await expect(canvas.getByText('Ball bag rotation')).toBeInTheDocument()
    // The admin rows are labelled rows: invite above the faces, settings below them.
    await expect(canvas.getByRole('button', { name: /^Invite people/ })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: /^Team settings/ })).toHaveAttribute('href', '/t/setpoint-vt/team/settings')
    // The roster is a grid of faces, each opening that member's page (ADR-0038).
    for (const name of ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson']) {
      await expect(canvas.getByRole('link', { name })).toBeInTheDocument()
    }
    await expect(canvas.getByLabelText('Shirt number 112')).toBeInTheDocument()
    // The Team's Substitutes sit under the roster, as faces too: people the Team calls in, not
    // Members (ADR-0033). Each opens the Substitute's page.
    await expect(canvas.getByRole('heading', { name: 'Substitutes' })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'Jan de Vries, substitute' })).toHaveAttribute('href', '/t/setpoint-vt/team/sub/s1')
    // No editing controls on the page, admins included: an admin edits a person on their page.
    await expect(canvas.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument()
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
        Member: <TeamPageView {...args} isAdmin={false} bulletin={bulletin(false)} />,
        Loading: <TeamPageView {...args} roster={roster({ members: undefined, isLoading: true })} />,
        Error: <TeamPageView {...args} roster={roster({ members: undefined, isError: true })} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    await expect(region('Member').queryByRole('button', { name: /^Invite people/ })).not.toBeInTheDocument()
    await expect(region('Member').queryByRole('link', { name: /^Team settings/ })).not.toBeInTheDocument()
    await expect(region('Member').getByRole('link', { name: 'Ada Lovelace' })).toBeInTheDocument()
    await expect(region('Member').getByRole('heading', { name: 'Members' })).toBeInTheDocument()
    await expect(region('Member').queryByRole('button', { name: 'New post' })).not.toBeInTheDocument()
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    await expect(region('Error').getByText(/couldn't load/i)).toBeInTheDocument()
  },
}

// The invite row opens what the route wraps it in (behavioural only; Data owns the picture, and a
// click here would leave a focus ring in it).
export const Interactions: Story = {
  decorators: shell.decorators,
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent }) => {
    onInvite.mockClear()
    await userEvent.click(canvas.getByRole('button', { name: /^Invite people/ }))
    await expect(onInvite).toHaveBeenCalledWith('invite')
  },
}
