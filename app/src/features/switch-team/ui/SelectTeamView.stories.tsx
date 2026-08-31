import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import type { TeamRef } from '@shared/api/teams'
import { SelectTeamView } from './SelectTeamView'

// Reaching this screen is a normal state, not an error — a first sign-in after joining a second
// Team, or the remembered Team's membership ending — and the copy has to read that way.
const TEAMS: TeamRef[] = [
  { id: 't1', name: 'Setpoint VT', slug: 'setpoint-vt' },
  { id: 't2', name: 'Tovo Heren 5', slug: 'tovo-heren-5' },
]

const meta = {
  title: 'features/switch-team/SelectTeamView',
  component: SelectTeamView,
  args: { teams: TEAMS, onSelect: fn() },
} satisfies Meta<typeof SelectTeamView>

export default meta

type Story = StoryObj<typeof meta>

export const TwoTeams: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Which team?' })).toBeInTheDocument()
    await expect(canvas.getByText('Setpoint VT')).toBeInTheDocument()
    await expect(canvas.getByText('Tovo Heren 5')).toBeInTheDocument()
    await expect(canvas.getByText('/setpoint-vt')).toBeInTheDocument()
  },
}

export const ManyTeams: Story = {
  args: {
    teams: [
      ...TEAMS,
      { id: 't3', name: 'Tovo Dames 2', slug: 'tovo-dames-2' },
      { id: 't4', name: 'Utrecht Mixed', slug: 'utrecht-mixed' },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('button')).toHaveLength(4)
  },
}

// The container turns this slug into a /t/:slug navigation, which is what performs the switch.
export const ChoosingHandsUpTheSlug: Story = {
  // Behavioural twin of TwoTeams — onSelect fires with the slug; the two-team list is unchanged
  // (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByText('Tovo Heren 5'))
    await expect(args.onSelect).toHaveBeenCalledWith('tovo-heren-5')
  },
}
