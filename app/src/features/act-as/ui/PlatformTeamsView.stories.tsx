import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { TeamRef } from '@shared/api/act-as'
import { Stack } from '@shared/testing/stack'
import { PlatformTeamsView } from './PlatformTeamsView'

// The platform console's team list (ADR-0024 §6): every team, because restricting the list would be
// theatre — a Platform Admin owns the database. What makes it defensible is that entering is
// explicit, time-boxed and recorded. Presentational — the query and the enter mutation live in the
// container.
//
// Three-story shape (ADR-0032 §1):
//   1. Data — the one populated live instance, every team listed with its slug.
//   2. Shells — load / error / forbidden / empty / after-a-lapse / entering, stacked in one frame.
//   3. Interactions — no picture; the Enter click, keeping the onEnter spy assertion.
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

// Every team, listed — restricting the list would be theatre (ADR-0024 §6). The slug is shown next
// to the name because near-identical squad names are exactly what this screen has to disambiguate.
export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Tovo Dames 5')).toBeInTheDocument()
    await expect(canvas.getByText('/tovo-heren-3')).toBeInTheDocument()
    await expect(canvas.getAllByRole('button', { name: 'Enter' })).toHaveLength(2)
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <PlatformTeamsView {...args} isLoading />,
        Error: <PlatformTeamsView {...args} isError />,
        // 403 — the caller is not a Platform Admin; renders a no-access shell rather than an error.
        Forbidden: <PlatformTeamsView {...args} isForbidden />,
        Empty: <PlatformTeamsView {...args} teams={[]} />,
        // Where a lapse lands: back on the console, told why (ADR-0024 §4).
        'After a lapse': <PlatformTeamsView {...args} wasExpired />,
        Entering: <PlatformTeamsView {...args} isEntering />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    await expect(region('Loading').queryByRole('button', { name: 'Enter' })).not.toBeInTheDocument()

    await expect(
      region('Error').getByText("Couldn't load teams. Please try again."),
    ).toBeInTheDocument()

    await expect(
      region('Forbidden').getByText("You don't have access to the platform console."),
    ).toBeInTheDocument()
    await expect(region('Forbidden').queryByRole('button', { name: 'Enter' })).not.toBeInTheDocument()

    await expect(region('Empty').getByText('No teams yet.')).toBeInTheDocument()

    await expect(
      region('After a lapse').getByText(/Your act-as ran out after 60 minutes/),
    ).toBeInTheDocument()
    await expect(region('After a lapse').getAllByRole('button', { name: 'Enter' })).toHaveLength(2)

    for (const button of region('Entering').getAllByRole('button', { name: 'Enter' })) {
      await expect(button).toBeDisabled()
    }
  },
}

// Picture owned by Data — behavioural only (ADR-0032 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getAllByRole('button', { name: 'Enter' })[1])
    await expect(args.onEnter).toHaveBeenCalledWith(TEAMS[1])
  },
}
