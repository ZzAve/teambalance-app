import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Member } from '@shared/api/members'
import type { Position } from '@shared/api/positions'
import { Stack } from '@shared/testing/stack'
import type { AccountSection } from '../lib/account-sections'
import { appShell } from '../../../../.storybook/app-shell-decorator'
import { pageModes } from '../../../../.storybook/modes'
import { AccountView } from './AccountView'

// AccountView is the adaptive Account settings list behind the /account container (ADR-0027 §2), and
// the whole of that page — so it is rendered as a page composite (ADR-0031 §3): inside the real app
// shell, on the Profile tab, at phone width in both themes and once at desktop width. It is prop-only
// and network-free, so every context — teamless / single / multi / admin — and both profile shells
// (loading / error) render purely from props. It renders TanStack Router <Link>s (the platform-admin
// section), which the shell's router supplies.
//
// The invariant under test in EVERY frame: **Log out renders**. It is not gated on any section flag
// and sits outside the profile loading/error shells, so a failed member fetch can never hide it —
// which is the whole reason the ADR exists. Interactions additionally proves the click reaches
// onLogout (a fn() spy), so the wiring survives a dependency bump.
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter', kind: 'PLAYING' },
  { id: 'p2', label: 'Libero', kind: 'PLAYING' },
]

const MEMBER: Member = {
  userId: 'u1',
  displayName: 'Alex',
  role: 'MEMBER',
  position: { id: 'p1', label: 'Setter' },
  onboarded: true,
}

const WITH_TEAM: AccountSection[] = ['email', 'displayName', 'position', 'appearance', 'teams', 'logout']
const TEAMLESS: AccountSection[] = ['email', 'appearance', 'teams', 'logout']
const ADMIN: AccountSection[] = ['email', 'appearance', 'teams', 'platformAdmin', 'logout']

const shell = appShell('account')

const meta = {
  title: 'features/account/AccountView',
  component: AccountView,
  decorators: shell.decorators,
  parameters: { ...shell.parameters, chromatic: { modes: pageModes } },
  args: {
    email: 'alex@example.com',
    sections: WITH_TEAM,
    member: MEMBER,
    positions: POSITIONS,
    activeTeamName: 'Setpoint VT',
    onLogout: fn(),
    onSubmitProfile: fn(),
  },
} satisfies Meta<typeof AccountView>

export default meta

type Story = StoryObj<typeof meta>

// A member of one team: the full list.
export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
    await expect(canvas.getByLabelText('Display name')).toHaveValue('Alex')
    // Named once in the Teams section and once in the shell's header.
    await expect(canvas.getAllByText('Setpoint VT')).toHaveLength(2)
    await expect(canvas.getByRole('link', { name: 'Profile' })).toHaveAttribute('aria-current', 'page')
  },
}

// Every other context, stacked. Multi-team with one active shows the same sections — the switcher is
// Slice 2, so the only visible difference is that Teams names the active one.
export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Teamless: <AccountView {...args} sections={TEAMLESS} member={null} positions={[]} activeTeamName={null} />,
        'Multi-team': <AccountView {...args} activeTeamName="Tovo Heren" />,
        'Platform admin': <AccountView {...args} sections={ADMIN} member={null} activeTeamName={null} />,
        Loading: <AccountView {...args} member={null} isMemberLoading />,
        Error: <AccountView {...args} member={null} isMemberError />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    const teamless = region('Teamless')
    await expect(teamless.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
    // No profile form and no team named when teamless.
    await expect(teamless.queryByLabelText('Display name')).not.toBeInTheDocument()
    await expect(teamless.getByText('Join or create a team')).toBeInTheDocument()

    await expect(region('Multi-team').getByRole('button', { name: 'Log out' })).toBeInTheDocument()
    await expect(region('Multi-team').getByText('Tovo Heren')).toBeInTheDocument()

    const admin = region('Platform admin')
    await expect(admin.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
    await expect(admin.getByRole('link', { name: 'Teams console' })).toHaveAttribute('href', '/admin/teams')
    await expect(admin.getByRole('link', { name: 'Creation codes' })).toHaveAttribute('href', '/admin/creation-codes')

    // The member-profile query is in flight: the profile section shows its loading shell, but Log
    // out (which acts on the session, not the profile) still renders.
    const loading = region('Loading')
    await expect(loading.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
    await expect(loading.getByText('Loading…')).toBeInTheDocument()
    await expect(loading.queryByLabelText('Display name')).not.toBeInTheDocument()

    // The member-profile query failed: the profile section shows its error shell — Log out is still
    // reachable, so a broken member fetch never strands the user.
    const error = region('Error')
    await expect(error.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
    await expect(error.getByText("Couldn't load your profile. Please try again.")).toBeInTheDocument()
    await expect(error.queryByLabelText('Display name')).not.toBeInTheDocument()
  },
}

// Picture owned by Data — behavioural only (ADR-0031 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    // Saving the profile hands the name and the position up.
    const name = canvas.getByLabelText('Display name')
    await userEvent.clear(name)
    await userEvent.type(name, 'Alex B')
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(args.onSubmitProfile).toHaveBeenCalledWith('Alex B', 'p1')

    await userEvent.click(canvas.getByRole('button', { name: 'Log out' }))
    await expect(args.onLogout).toHaveBeenCalled()
  },
}
