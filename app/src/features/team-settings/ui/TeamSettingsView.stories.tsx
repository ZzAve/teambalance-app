import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { TeamSettingsView } from './TeamSettingsView'

// TeamSettingsView is the presentational season-settings UI behind the TeamSettings container. It
// owns only local draft state (the two date fields); the query + SetSeason mutation stay in the
// container, so every state renders purely from props.
//
// Three stories (ADR-0032 §1):
//   1. Data — the one populated live instance (a configured, pristine season), and the picture of
//      this View.
//   2. Shells — every non-data state (loading / error / unset) stacked in one frame, one picture,
//      each state's assertions scoped to its labelled region.
//   3. Interactions — no picture; one play walks editing a configured season (the non-blocking
//      change warning) and an inverted range (the blocking validation error), keeping every
//      prop-contract spy assertion.
const meta = {
  title: 'features/team-settings/TeamSettingsView',
  component: TeamSettingsView,
  args: { season: { start: '2026-09-01', end: '2027-04-30' }, onSave: fn() },
} satisfies Meta<typeof TeamSettingsView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Start date')).toHaveValue('2026-09-01')
    await expect(canvas.getByLabelText('End date')).toHaveValue('2027-04-30')
    // Pristine form: Save disabled, no change warning.
    await expect(canvas.getByRole('button', { name: 'Save season' })).toBeDisabled()
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <TeamSettingsView {...args} isLoading />,
        Error: <TeamSettingsView {...args} isError />,
        Unset: <TeamSettingsView {...args} season={{}} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    // The form is suppressed while the query is in flight — no save control yet.
    await expect(region('Loading').queryByRole('button', { name: 'Save season' })).not.toBeInTheDocument()

    await expect(
      region('Error').getByText("Couldn't load team settings. Please try again."),
    ).toBeInTheDocument()
    await expect(region('Error').queryByRole('button', { name: 'Save season' })).not.toBeInTheDocument()

    await expect(
      region('Unset').getByText('No season set — events can be scheduled on any date.'),
    ).toBeInTheDocument()
    // Nothing to save until the user picks a date.
    await expect(region('Unset').getByRole('button', { name: 'Save season' })).toBeDisabled()
  },
}

// A single live instance — not a Stack — because the date fields use static ids (season-start/
// season-end), and two mounted instances would collide on them and break getByLabelText. The
// invalid-range detour runs first and is fixed back up, so the same instance can carry on to a
// change-warning save.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    const end = canvas.getByLabelText('End date')
    await userEvent.clear(end)
    await userEvent.type(end, '2026-08-01')
    await waitFor(() =>
      expect(canvas.getByText('End date must be on or after the start date.')).toBeInTheDocument(),
    )
    // An inverted range blocks the save.
    await expect(canvas.getByRole('button', { name: 'Save season' })).toBeDisabled()

    // Fixing the range back up unblocks it again.
    await userEvent.clear(end)
    await userEvent.type(end, '2027-04-30')

    const start = canvas.getByLabelText('Start date')
    await userEvent.clear(start)
    await userEvent.type(start, '2026-10-01')
    // Editing a configured season surfaces the non-blocking warning and enables Save.
    await waitFor(() =>
      expect(canvas.getByRole('alert')).toHaveTextContent(/won't move or delete existing events/),
    )
    const save = canvas.getByRole('button', { name: 'Save season' })
    await expect(save).toBeEnabled()
    await userEvent.click(save)
    await expect(args.onSave).toHaveBeenCalledWith({ start: '2026-10-01', end: '2027-04-30' })
  },
}
