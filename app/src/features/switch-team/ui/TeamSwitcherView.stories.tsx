import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import type { TeamRef } from '@shared/api/teams'
import { TeamSwitcherView } from './TeamSwitcherView'

// The rule worth pinning is not the dropdown mechanics but the one ADR-0023 §3 leans on: the
// switcher ALWAYS names the current Team, including in the single-Team case that has no menu.
const SETPOINT: TeamRef = { id: 't1', name: 'Setpoint VT', slug: 'setpoint-vt' }
const TOVO: TeamRef = { id: 't2', name: 'Tovo Heren 5', slug: 'tovo-heren-5' }

const meta = {
  title: 'features/switch-team/TeamSwitcherView',
  component: TeamSwitcherView,
  args: { teams: [SETPOINT, TOVO], activeTeam: SETPOINT, onSelect: fn() },
} satisfies Meta<typeof TeamSwitcherView>

export default meta

type Story = StoryObj<typeof meta>

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
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument()
  },
}

export const MenuOpen: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Current team: Setpoint VT/ }))
    await expect(canvas.getByRole('listbox', { name: 'Your teams' })).toBeInTheDocument()
    await expect(canvas.getByRole('option', { name: /Setpoint VT/ })).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByRole('option', { name: /Tovo Heren 5/ })).toHaveAttribute('aria-selected', 'false')
  },
}

// The slug, not the id: it is what the team-scoped URL carries, and opening that URL is the switch.
export const SwitchesToTheOtherTeam: Story = {
  // Behavioural twin of SeveralTeams — the menu closes after the pick, settling to the trigger-closed
  // picture (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Current team: Setpoint VT/ }))
    await userEvent.click(canvas.getByRole('option', { name: /Tovo Heren 5/ }))
    await expect(args.onSelect).toHaveBeenCalledWith('tovo-heren-5')
  },
}

// Re-picking the current Team is not a switch, and must not fire one.
export const PickingTheActiveTeamDoesNothing: Story = {
  // Behavioural twin of SeveralTeams — the menu closes with no switch, settling to the trigger-closed
  // picture (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Current team: Setpoint VT/ }))
    await userEvent.click(canvas.getByRole('option', { name: /Setpoint VT/ }))
    await expect(args.onSelect).not.toHaveBeenCalled()
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument()
  },
}

export const NoActiveTeam: Story = {
  args: { activeTeam: null },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText('Setpoint VT')).not.toBeInTheDocument()
  },
}
