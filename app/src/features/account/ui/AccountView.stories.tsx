import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import type { Member } from '@shared/api/members'
import type { Position } from '@shared/api/positions'
import type { AccountSection } from '../lib/account-sections'
import { AccountView } from './AccountView'

// AccountView is the adaptive Account settings list behind the /account container (ADR-0027 §2).
// It is prop-only and network-free, so every context — teamless / single / multi / admin — and both
// profile shells (loading / error) render purely from props as a story. It renders TanStack Router
// <Link>s (the platform-admin section), so it takes the shared withRouter decorator.
//
// The invariant under test in EVERY story: **Log out renders**. It is not gated on any section flag
// and sits outside the profile loading/error shells, so a failed member fetch can never hide it —
// which is the whole reason the ADR exists. LoggingOut additionally proves the click reaches
// onLogout (a fn() spy), so the wiring survives a dependency bump.
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter' },
  { id: 'p2', label: 'Libero' },
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

const meta = {
  title: 'features/account/AccountView',
  component: AccountView,
  decorators: [withRouter],
  args: { email: 'alex@example.com', onLogout: fn(), onSubmitProfile: fn() },
} satisfies Meta<typeof AccountView>

export default meta

type Story = StoryObj<typeof meta>

export const Teamless: Story = {
  args: { sections: TEAMLESS },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
    // No profile form and no team named when teamless.
    await expect(canvas.queryByLabelText('Display name')).not.toBeInTheDocument()
    await expect(canvas.getByText('Join or create a team')).toBeInTheDocument()
  },
}

export const SingleTeam: Story = {
  args: { sections: WITH_TEAM, member: MEMBER, positions: POSITIONS, activeTeamName: 'Setpoint VT' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
    await expect(canvas.getByLabelText('Display name')).toHaveValue('Alex')
    await expect(canvas.getByText('Setpoint VT')).toBeInTheDocument()
  },
}

// Multi-team with one active shows the same sections — the switcher is Slice 2, so the only visible
// difference is that Teams names the active one. Log out still renders.
export const MultiTeam: Story = {
  args: { sections: WITH_TEAM, member: MEMBER, positions: POSITIONS, activeTeamName: 'Tovo Heren' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
    await expect(canvas.getByText('Tovo Heren')).toBeInTheDocument()
  },
}

export const Admin: Story = {
  args: { sections: ['email', 'appearance', 'teams', 'platformAdmin', 'logout'] },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'Teams console' })).toHaveAttribute('href', '/admin/teams')
    await expect(canvas.getByRole('link', { name: 'Creation codes' })).toHaveAttribute(
      'href',
      '/admin/creation-codes',
    )
  },
}

// The member-profile query is in flight: the profile section shows its loading shell, but Log out
// (which acts on the session, not the profile) still renders.
export const Loading: Story = {
  args: { sections: WITH_TEAM, isMemberLoading: true, activeTeamName: 'Setpoint VT' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
    await expect(canvas.getByText('Loading…')).toBeInTheDocument()
    await expect(canvas.queryByLabelText('Display name')).not.toBeInTheDocument()
  },
}

// The member-profile query failed: the profile section shows its error shell — Log out is still
// reachable, so a broken member fetch never strands the user.
export const ErrorState: Story = {
  args: { sections: WITH_TEAM, isMemberError: true, activeTeamName: 'Setpoint VT' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
    await expect(canvas.getByText("Couldn't load your profile. Please try again.")).toBeInTheDocument()
    await expect(canvas.queryByLabelText('Display name')).not.toBeInTheDocument()
  },
}

export const LoggingOut: Story = {
  args: { sections: TEAMLESS },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Log out' }))
    await expect(args.onLogout).toHaveBeenCalled()
  },
}
