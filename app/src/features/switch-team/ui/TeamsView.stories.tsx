import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import type { TeamRef } from '@shared/api/teams'
import { TeamsView } from './TeamsView'

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
export const SingleTeam: Story = {
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

export const MultipleTeams: Story = {
  args: { teams: [SETPOINT, TOVO], activeTeam: SETPOINT },
  play: async ({ canvas }) => {
    // Only the active team carries the badge.
    await expect(canvas.getAllByText('Active')).toHaveLength(1)
    await expect(canvas.getByText('Tovo Heren 5')).toBeInTheDocument()
  },
}

// Selecting a team hands the container its slug; opening `/t/:slug` is what performs the switch.
export const SelectingATeam: Story = {
  args: { teams: [SETPOINT, TOVO], activeTeam: SETPOINT },
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByText('Tovo Heren 5'))
    await expect(args.onSelect).toHaveBeenCalledWith('tovo-heren-5')
  },
}

export const JoiningWithAnInvite: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByText('Join with an invite link'))
    await expect(args.onJoin).toHaveBeenCalled()
  },
}

export const CreatingATeam: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByText('Create a team'))
    await expect(args.onCreate).toHaveBeenCalled()
  },
}
