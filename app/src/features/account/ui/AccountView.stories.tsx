import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { appColumn } from '@shared/testing/app-column-decorator'
import { withRouter } from '@shared/testing/router-decorator'
import type { AccountSection } from '../lib/account-sections'
import { appShell } from '../../../../storybook-support/app-shell-decorator'
import { dutchMode, pageModes } from '../../../../.storybook/modes'
import { AccountView } from './AccountView'

// AccountView is the root of the Account tab (ADR-0027 §2) — a card naming who is signed in, then
// one row per scope — so it is rendered as a page composite (ADR-0032 §3): inside the real app
// shell, on the Profile tab. It is prop-only and network-free, so every context — teamless / single /
// multi / admin / act-as — renders purely from props.
//
// The invariant under test in EVERY frame: **Log out renders**. It is not gated on any section flag
// and the view reads no member data, so nothing that loads or fails can hide it — which is the whole
// reason the ADR exists. Interactions proves the click reaches onLogout (a fn() spy).
const WITH_TEAM: AccountSection[] = ['signIn', 'teamProfile', 'teams', 'preferences', 'logout']
const TEAMLESS: AccountSection[] = ['signIn', 'teams', 'preferences', 'logout']
const ADMIN: AccountSection[] = ['signIn', 'teams', 'preferences', 'platformAdmin', 'logout']

const shell = appShell('account', 'Account')

const meta = {
  title: 'features/account/AccountView',
  component: AccountView,
  parameters: shell.parameters,
  args: {
    userId: 'u1',
    displayName: 'Alex',
    email: 'alex@example.com',
    sections: WITH_TEAM,
    activeTeamName: 'Setpoint VT',
    activeTeamSlug: 'setpoint-vt',
    onLogout: fn(),
  },
} satisfies Meta<typeof AccountView>

export default meta

type Story = StoryObj<typeof meta>

// A member of one team: every row a member sees.
export const Data: Story = {
  decorators: shell.decorators,
  // The page's picture, in dark and once at desktop width too (ADR-0032 §4-§5), and in Dutch (ADR-0043 §8).
  parameters: { chromatic: { modes: { ...pageModes, ...dutchMode } } },
  play: async ({ canvas, globals }) => {
    if (globals.locale === 'nl') {
      await expect(canvas.getByRole('button', { name: 'Uitloggen' })).toBeInTheDocument()
      await expect(canvas.getByRole('link', { name: /Account en inloggen/ })).toHaveAttribute('href', '/account/sign-in')
      await expect(canvas.getByRole('link', { name: /Mijn profiel in Setpoint VT/ })).toBeInTheDocument()
      await expect(canvas.getByRole('link', { name: /Voorkeuren/ })).toBeInTheDocument()
      await expect(canvas.getByRole('link', { name: 'Profiel' })).toHaveAttribute('aria-current', 'page')
      return
    }
    await expect(canvas.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
    await expect(canvas.getByText('alex@example.com')).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: /Account and sign-in/ })).toHaveAttribute('href', '/account/sign-in')
    // The team profile has one editor: the viewer's own member page.
    await expect(canvas.getByRole('link', { name: /My profile in Setpoint VT/ })).toHaveAttribute('href', '/t/setpoint-vt/team/u1')
    await expect(canvas.getByRole('link', { name: /Teams/ })).toHaveAttribute('href', '/select-team')
    await expect(canvas.getByRole('link', { name: /Preferences/ })).toHaveAttribute('href', '/account/preferences')
    await expect(canvas.getByRole('link', { name: 'Profile' })).toHaveAttribute('aria-current', 'page')
  },
}

// Every other context, stacked. Hosted in the app column rather than the real shell (unlike Data):
// one header and one tab bar around a Stack of pages would frame them as a single page. Data already
// proves the real shell renders this View correctly; this story's job is the prop shapes.
export const Shells: Story = {
  decorators: [...appColumn.decorators, withRouter],
  render: (args) => (
    <Stack
      items={{
        Teamless: <AccountView {...args} sections={TEAMLESS} activeTeamName={null} activeTeamSlug={null} />,
        'Multi-team': <AccountView {...args} activeTeamName="Tovo Heren" activeTeamSlug="tovo-heren" />,
        'Platform admin': <AccountView {...args} sections={ADMIN} activeTeamName={null} activeTeamSlug={null} />,
        // A Platform Admin acting-as: an Active Team, but no own member page (ADR-0024 §2).
        'Act-as': <AccountView {...args} sections={ADMIN} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    const teamless = region('Teamless')
    await expect(teamless.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
    await expect(teamless.getByText('Not on a team yet')).toBeInTheDocument()
    await expect(teamless.getByRole('link', { name: /Join or create a team/ })).toHaveAttribute('href', '/select-team')
    await expect(teamless.queryByRole('link', { name: /My profile in/ })).not.toBeInTheDocument()

    const multi = region('Multi-team')
    await expect(multi.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
    await expect(multi.getByRole('link', { name: /My profile in Tovo Heren/ })).toHaveAttribute('href', '/t/tovo-heren/team/u1')

    const admin = region('Platform admin')
    await expect(admin.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
    await expect(admin.getByRole('link', { name: 'Teams console' })).toHaveAttribute('href', '/admin/teams')
    await expect(admin.getByRole('link', { name: 'Creation codes' })).toHaveAttribute('href', '/admin/creation-codes')

    const actAs = region('Act-as')
    await expect(actAs.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
    await expect(actAs.getByText('Setpoint VT')).toBeInTheDocument()
    await expect(actAs.queryByRole('link', { name: /My profile in/ })).not.toBeInTheDocument()
  },
}

// Picture owned by Data — behavioural only (ADR-0032 §1).
export const Interactions: Story = {
  decorators: shell.decorators,
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Log out' }))
    await expect(args.onLogout).toHaveBeenCalledOnce()
  },
}
