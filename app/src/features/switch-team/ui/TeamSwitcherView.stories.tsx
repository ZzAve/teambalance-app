import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import type { TeamRef } from '@shared/api/teams'
import { Stack } from '@shared/testing/stack'
import { TeamSwitcherView } from './TeamSwitcherView'

// The rule worth pinning is not the dropdown mechanics but the one ADR-0023 §3 leans on: the
// switcher ALWAYS names the current Team, including in the single-Team case that has no menu.
//
// Three-story shape (ADR-0031 §1) plus one extra snapshotted state:
//   1. Data — the one populated live instance, several teams, menu closed.
//   2. Shells — the single-team and no-active-team variants, stacked in one frame.
//   3. Interactions — no picture; picking the active team (no-op) then the other team (switches),
//      keeping every onSelect spy assertion.
//   + MenuOpen — the open listbox is a visually new state reachable only by interaction, and no
//     composite shows it open, so it keeps its own snapshot (ADR-0031 §1).
const SETPOINT: TeamRef = { id: 't1', name: 'Setpoint VT', slug: 'setpoint-vt' }
const TOVO: TeamRef = { id: 't2', name: 'Tovo Heren 5', slug: 'tovo-heren-5' }

const meta = {
  title: 'features/switch-team/TeamSwitcherView',
  component: TeamSwitcherView,
  args: { teams: [SETPOINT, TOVO], activeTeam: SETPOINT, onSelect: fn() },
} satisfies Meta<typeof TeamSwitcherView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /Current team: Setpoint VT/ })
    await expect(trigger).toBeInTheDocument()
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        'Single team': <TeamSwitcherView {...args} teams={[SETPOINT]} />,
        'No active team': <TeamSwitcherView {...args} activeTeam={null} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Single team').getByText('Setpoint VT')).toBeInTheDocument()
    await expect(region('Single team').queryByRole('button')).not.toBeInTheDocument()

    await expect(region('No active team').queryByText('Setpoint VT')).not.toBeInTheDocument()
  },
}

// The open-dialog-shaped frame no composite shows: opened and left open.
export const MenuOpen: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Current team: Setpoint VT/ }))
    await expect(canvas.getByRole('listbox', { name: 'Your teams' })).toBeInTheDocument()
    await expect(canvas.getByRole('option', { name: /Setpoint VT/ })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(canvas.getByRole('option', { name: /Tovo Heren 5/ })).toHaveAttribute(
      'aria-selected',
      'false',
    )
  },
}

// Picture owned by Data and MenuOpen — behavioural only (ADR-0031 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, args }) => {
    // Re-picking the current Team is not a switch, and must not fire one.
    await userEvent.click(canvas.getByRole('button', { name: /Current team: Setpoint VT/ }))
    await userEvent.click(canvas.getByRole('option', { name: /Setpoint VT/ }))
    await expect(args.onSelect).not.toHaveBeenCalled()
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument()

    // The slug, not the id: it is what the team-scoped URL carries, and opening that URL is the
    // switch.
    await userEvent.click(canvas.getByRole('button', { name: /Current team: Setpoint VT/ }))
    await userEvent.click(canvas.getByRole('option', { name: /Tovo Heren 5/ }))
    await expect(args.onSelect).toHaveBeenCalledWith('tovo-heren-5')
  },
}
