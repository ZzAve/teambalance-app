import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import type { TeamRef } from '@shared/api/teams'
import { Stack } from '@shared/testing/stack'
import { TeamsView } from './TeamsView'

// The Teams "main view" (ADR-0027 §4): the fuller entry point the Account tab's Teams row opens.
// Beside switching between your teams it offers the two ways to gain another — join with an invite
// link, or create a team. Prop-only and presentational; the route container owns the navigation each
// callback performs.
//
// Three-story shape (ADR-0031 §1):
//   1. Data — the one populated live instance: the common case, a member of one team.
//   2. Shells — the multiple-teams variant, in its own frame (only the active team carries the badge).
//   3. Interactions — no picture; selecting a team, joining, and creating, keeping every spy
//      assertion.
const SETPOINT: TeamRef = { id: 't1', name: 'Setpoint VT', slug: 'setpoint-vt' }
const TOVO: TeamRef = { id: 't2', name: 'Tovo Heren 5', slug: 'tovo-heren-5' }

const meta = {
  title: 'features/switch-team/TeamsView',
  component: TeamsView,
  args: { teams: [SETPOINT], activeTeam: SETPOINT, onSelect: fn(), onJoin: fn(), onCreate: fn() },
} satisfies Meta<typeof TeamsView>

export default meta

type Story = StoryObj<typeof meta>

// The common case: a member of one team. Two clearly divided sections — the teams you belong to,
// and the ways to gain another (join / create).
export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Teams' })).toBeInTheDocument()
    // The two section headings that give the page its visual structure.
    await expect(canvas.getByRole('heading', { name: 'Your teams' })).toBeInTheDocument()
    await expect(canvas.getByRole('heading', { name: 'Join or create' })).toBeInTheDocument()
    await expect(canvas.getByText('Setpoint VT')).toBeInTheDocument()
    await expect(canvas.getByText('Active')).toBeInTheDocument()
    await expect(canvas.getByText('Join with an invite link')).toBeInTheDocument()
    await expect(canvas.getByText('Create a team')).toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        // Only the active team carries the badge.
        'Multiple teams': <TeamsView {...args} teams={[SETPOINT, TOVO]} activeTeam={SETPOINT} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = within(canvas.getByRole('region', { name: 'Multiple teams' }))
    await expect(region.getAllByText('Active')).toHaveLength(1)
    await expect(region.getByText('Tovo Heren 5')).toBeInTheDocument()
  },
}

// Picture owned by Data and Shells — behavioural only (ADR-0031 §1). Two instances because selecting
// a non-active team needs a second team to pick.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        Single: <TeamsView {...args} />,
        Multiple: <TeamsView {...args} teams={[SETPOINT, TOVO]} activeTeam={SETPOINT} />,
      }}
    />
  ),
  play: async ({ canvas, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await userEvent.click(region('Single').getByText('Join with an invite link'))
    await expect(args.onJoin).toHaveBeenCalled()

    await userEvent.click(region('Single').getByText('Create a team'))
    await expect(args.onCreate).toHaveBeenCalled()

    // Selecting a team hands the container its slug; opening `/t/:slug` is what performs the switch.
    await userEvent.click(region('Multiple').getByText('Tovo Heren 5'))
    await expect(args.onSelect).toHaveBeenCalledWith('tovo-heren-5')
  },
}
