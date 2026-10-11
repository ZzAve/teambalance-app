import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, within } from 'storybook/test'
import type { Member } from '@shared/api/members'
import type { Position } from '@shared/api/positions'
import { Stack } from '@shared/testing/stack'
import { appColumn } from '@shared/testing/app-column-decorator'
import { withRouter } from '@shared/testing/router-decorator'
import type { AccountSection } from '../lib/account-sections'
import { appShell } from '../../../../storybook-support/app-shell-decorator'
import { pageModes } from '../../../../.storybook/modes'
import { AccountView } from './AccountView'

// AccountView is the adaptive Account settings list behind the /account container (ADR-0027 §2), and
// the whole of that page — so it is rendered as a page composite (ADR-0032 §3): inside the real app
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
  shirtNumber: undefined,
  photoVersion: undefined,
}

const WITH_TEAM: AccountSection[] = ['email', 'photo', 'displayName', 'position', 'appearance', 'teams', 'logout']
const TEAMLESS: AccountSection[] = ['email', 'photo', 'appearance', 'teams', 'logout']
const ADMIN: AccountSection[] = ['email', 'photo', 'appearance', 'teams', 'platformAdmin', 'logout']

const shell = appShell('account')

const meta = {
  title: 'features/account/AccountView',
  component: AccountView,
  parameters: shell.parameters,
  args: {
    userId: 'u1',
    displayName: 'Alex',
    email: 'alex@example.com',
    sections: WITH_TEAM,
    member: MEMBER,
    positions: POSITIONS,
    activeTeamName: 'Setpoint VT',
    onLogout: fn(),
    onSubmitProfile: fn(),
    onUploadPersonalPhoto: fn(),
    onRemovePersonalPhoto: fn(),
    onCopyPhotoToTeam: fn(),
    onDismissCopyPhoto: fn(),
  },
} satisfies Meta<typeof AccountView>

export default meta

type Story = StoryObj<typeof meta>

// A member of one team: the full list.
export const Data: Story = {
  decorators: shell.decorators,
  // The page's picture, in dark and once at desktop width too (ADR-0032 §4-§5).
  parameters: { chromatic: { modes: pageModes } },
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
//
// Hosted in the app column rather than the real shell (unlike Data/Interactions): one header and
// one tab bar around a Stack of five pages would frame them as a single page. Data already proves
// the real shell renders this View correctly; this story's job is the five prop shapes, not the
// chrome.
export const Shells: Story = {
  decorators: [...appColumn.decorators, withRouter],
  render: (args) => (
    <Stack
      items={{
        Teamless: <AccountView {...args} sections={TEAMLESS} member={null} positions={[]} activeTeamName={null} />,
        'Multi-team': <AccountView {...args} activeTeamName="Tovo Heren" />,
        'Platform admin': <AccountView {...args} sections={ADMIN} member={null} activeTeamName={null} />,
        Loading: <AccountView {...args} member={null} isMemberLoading />,
        Error: <AccountView {...args} member={null} isMemberError />,
        // Just uploaded a Personal Photo while this Team has no Team Photo. (No network in stories,
        // so the photo falls back to initials.)
        'Photo copy offer': <AccountView {...args} personalPhotoVersion="v1" copyPhotoTeamName="Setpoint VT" />,
        'Photo upload failed': (
          <AccountView {...args} photoErrorMessage="That photo is too large. Please pick another one." />
        ),
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

    // The Personal Photo is the person's, so it is offered without a team too.
    await expect(teamless.getByRole('button', { name: 'Upload photo' })).toBeInTheDocument()
    await expect(teamless.queryByRole('button', { name: 'Remove photo' })).not.toBeInTheDocument()

    const offer = region('Photo copy offer')
    await expect(offer.getByText('Use this photo in Setpoint VT too?')).toBeInTheDocument()
    await expect(offer.getByRole('button', { name: 'Change photo' })).toBeInTheDocument()
    await expect(offer.getByRole('button', { name: 'Remove photo' })).toBeInTheDocument()

    await expect(region('Photo upload failed').getByText('That photo is too large. Please pick another one.')).toBeInTheDocument()
    await expect(region('Photo upload failed').queryByText(/Use this photo in/)).not.toBeInTheDocument()
  },
}

// Picture owned by Data — behavioural only (ADR-0032 §1). The photo upload itself is PhotoPicker's
// story; here the copy offer and Remove hand their intent up.
export const Interactions: Story = {
  decorators: shell.decorators,
  parameters: { chromatic: { disableSnapshot: true } },
  args: { personalPhotoVersion: 'v1', copyPhotoTeamName: 'Setpoint VT' },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Use in Setpoint VT' }))
    await expect(args.onCopyPhotoToTeam).toHaveBeenCalledOnce()
    await userEvent.click(canvas.getByRole('button', { name: 'Not now' }))
    await expect(args.onDismissCopyPhoto).toHaveBeenCalledOnce()
    // Removing asks first; Cancel leaves the photo alone.
    await userEvent.click(canvas.getByRole('button', { name: 'Remove photo' }))
    await userEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Cancel' }))
    await expect(args.onRemovePersonalPhoto).not.toHaveBeenCalled()
    await userEvent.click(canvas.getByRole('button', { name: 'Remove photo' }))
    await userEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Remove' }))
    await expect(args.onRemovePersonalPhoto).toHaveBeenCalledOnce()

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

