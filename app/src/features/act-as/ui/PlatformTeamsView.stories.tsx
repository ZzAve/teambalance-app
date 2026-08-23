import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import type { TeamRef } from '@shared/api/act-as'
import { PlatformTeamsView } from './PlatformTeamsView'

const TEAMS: TeamRef[] = [
  { id: 't1', name: 'Tovo Dames 5', slug: 'tovo-dames-5' },
  { id: 't2', name: 'Tovo Heren 3', slug: 'tovo-heren-3' },
]

const meta = {
  title: 'features/act-as/PlatformTeamsView',
  component: PlatformTeamsView,
  args: { teams: TEAMS, onEnter: fn() },
} satisfies Meta<typeof PlatformTeamsView>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {
  args: { isLoading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Loading…')).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Enter' })).not.toBeInTheDocument()
  },
}

export const ErrorState: Story = {
  args: { isError: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Couldn't load teams. Please try again.")).toBeInTheDocument()
  },
}

export const Forbidden: Story = {
  args: { isForbidden: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("You don't have access to the platform console.")).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Enter' })).not.toBeInTheDocument()
  },
}

export const Empty: Story = {
  args: { teams: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No teams yet.')).toBeInTheDocument()
  },
}

// Every team, listed — restricting the list would be theatre (ADR-0024 §6). The slug is shown next
// to the name because near-identical squad names are exactly what this screen has to disambiguate.
export const EveryTeam: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Tovo Dames 5')).toBeInTheDocument()
    await expect(canvas.getByText('/tovo-heren-3')).toBeInTheDocument()
    await expect(canvas.getAllByRole('button', { name: 'Enter' })).toHaveLength(2)
  },
}

export const EnterATeam: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getAllByRole('button', { name: 'Enter' })[1])
    await expect(args.onEnter).toHaveBeenCalledWith(TEAMS[1])
  },
}

// Where a lapse lands: back on the console, told why (ADR-0024 §4).
export const AfterALapse: Story = {
  args: { wasExpired: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Your act-as ran out after 60 minutes/)).toBeInTheDocument()
    await expect(canvas.getAllByRole('button', { name: 'Enter' })).toHaveLength(2)
  },
}

export const Entering: Story = {
  args: { isEntering: true },
  play: async ({ canvas }) => {
    for (const button of canvas.getAllByRole('button', { name: 'Enter' })) {
      await expect(button).toBeDisabled()
    }
  },
}
