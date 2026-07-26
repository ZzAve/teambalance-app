import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { TeamSettingsView } from './TeamSettingsView'

// TeamSettingsView is the presentational season-settings UI behind the TeamSettings container. It
// owns only local draft state (the two date fields); the query + SetSeason mutation stay in the
// container, so every state renders purely from props.
const meta = {
  title: 'features/team-settings/TeamSettingsView',
  component: TeamSettingsView,
  args: { onSave: fn() },
} satisfies Meta<typeof TeamSettingsView>

export default meta

type Story = StoryObj<typeof meta>

export const Unset: Story = {
  args: { season: {} },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No season set — events can be scheduled on any date.')).toBeInTheDocument()
    // Nothing to save until the user picks a date.
    await expect(canvas.getByRole('button', { name: 'Save season' })).toBeDisabled()
  },
}

export const Set: Story = {
  args: { season: { start: '2026-09-01', end: '2027-04-30' } },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Start date')).toHaveValue('2026-09-01')
    await expect(canvas.getByLabelText('End date')).toHaveValue('2027-04-30')
    // Pristine form: Save disabled, no change warning.
    await expect(canvas.getByRole('button', { name: 'Save season' })).toBeDisabled()
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
  },
}

export const ChangeWarning: Story = {
  args: { season: { start: '2026-09-01', end: '2027-04-30' } },
  play: async ({ canvas, userEvent, args }) => {
    const start = canvas.getByLabelText('Start date')
    await userEvent.clear(start)
    await userEvent.type(start, '2026-10-01')

    // Editing a configured season surfaces the non-blocking warning and enables Save.
    await waitFor(() => expect(canvas.getByRole('alert')).toHaveTextContent(/won't move or delete existing events/))
    const save = canvas.getByRole('button', { name: 'Save season' })
    await expect(save).toBeEnabled()

    await userEvent.click(save)
    await expect(args.onSave).toHaveBeenCalledWith({ start: '2026-10-01', end: '2027-04-30' })
  },
}

export const InvalidRange: Story = {
  args: { season: { start: '2026-09-01', end: '2027-04-30' } },
  play: async ({ canvas, userEvent }) => {
    const end = canvas.getByLabelText('End date')
    await userEvent.clear(end)
    await userEvent.type(end, '2026-08-01')

    await waitFor(() =>
      expect(canvas.getByText('End date must be on or after the start date.')).toBeInTheDocument(),
    )
    // An inverted range blocks the save.
    await expect(canvas.getByRole('button', { name: 'Save season' })).toBeDisabled()
  },
}
