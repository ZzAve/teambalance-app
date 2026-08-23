import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import type { TeamRef } from '@shared/api/teams'
import { TeamSwitcherView } from './TeamSwitcherView'

// The Team switcher (ADR-0021 §3). The behaviour worth pinning is not the dropdown mechanics but the
// rule the ADR leans on: it ALWAYS names the current Team. One kind of switch means a teammate's
// link silently re-homes your default, and the only thing that makes that a one-tap correction
// rather than a mystery is being able to see which Team you are in — so every story below asserts
// the name is on screen, including the single-Team case that has no menu at all.
const SETPOINT: TeamRef = { id: 't1', name: 'Setpoint VT', slug: 'setpoint-vt' }
const TOVO: TeamRef = { id: 't2', name: 'Tovo Heren 5', slug: 'tovo-heren-5' }

const meta = {
  title: 'features/switch-team/TeamSwitcherView',
  component: TeamSwitcherView,
  args: { teams: [SETPOINT, TOVO], activeTeam: SETPOINT, onSelect: fn() },
} satisfies Meta<typeof TeamSwitcherView>

export default meta

type Story = StoryObj<typeof meta>

// A single-Team member gets a plain label: nothing to switch to, so no menu — but still the name.
export const SingleTeam: Story = {
  args: { teams: [SETPOINT] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Setpoint VT')).toBeInTheDocument()
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
  },
}

export const SeveralTeams: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /Current team: Setpoint VT/ })
    await expect(trigger).toBeInTheDocument()
    // Closed by default: the Teams are a menu away, the current one is not.
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument()
  },
}

export const MenuOpen: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Current team: Setpoint VT/ }))
    await expect(canvas.getByRole('listbox', { name: 'Your teams' })).toBeInTheDocument()
    // Both Teams listed, and the active one is marked as such for a screen reader too.
    await expect(canvas.getByRole('option', { name: /Setpoint VT/ })).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByRole('option', { name: /Tovo Heren 5/ })).toHaveAttribute('aria-selected', 'false')
  },
}

// The prop contract: picking the other Team hands its SLUG up, because the slug is what the
// team-scoped URL carries and opening that URL is what performs the switch.
export const SwitchesToTheOtherTeam: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Current team: Setpoint VT/ }))
    await userEvent.click(canvas.getByRole('option', { name: /Tovo Heren 5/ }))
    await expect(args.onSelect).toHaveBeenCalledWith('tovo-heren-5')
  },
}

// Re-picking the Team you are already in is not a switch. It must not fire one: every switch is
// remembered and re-pins the session routing, so a no-op switch is a pointless round-trip.
export const PickingTheActiveTeamDoesNothing: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Current team: Setpoint VT/ }))
    await userEvent.click(canvas.getByRole('option', { name: /Setpoint VT/ }))
    await expect(args.onSelect).not.toHaveBeenCalled()
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument()
  },
}

// Nothing to name yet — a caller mid-onboarding, or one who has not chosen between their Teams.
export const NoActiveTeam: Story = {
  args: { activeTeam: null },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText('Setpoint VT')).not.toBeInTheDocument()
  },
}
