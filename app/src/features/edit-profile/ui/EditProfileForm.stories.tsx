import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Position } from '@shared/api/positions'
import { Stack } from '@shared/testing/stack'
import { EditProfileForm } from './EditProfileForm'

// EditProfileForm is the presentational form behind the /profile route container. It owns only the
// text field, the position picker + inline validation; the member query and update mutation stay in
// the container, so every state (default, editing, saving, name-taken, position) renders from props.
//
// Three stories (ADR-0032 §1): Data is the one live instance — no positions defined for the team, so
// no picker shows. Shells stacks the saving / name-taken / position-required / position-preselected
// states in one frame. Interactions keeps every onSubmit spy assertion — plus the editing and
// position-picking gestures that lead up to it — in a multi-step play.
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter', kind: 'PLAYING' },
  { id: 'p2', label: 'Libero', kind: 'PLAYING' },
]

const meta = {
  title: 'features/edit-profile/EditProfileForm',
  component: EditProfileForm,
  args: {
    currentName: 'Ada Lovelace',
    positions: [],
    currentPositionId: null,
    isSaving: false,
    onSubmit: fn(),
  },
} satisfies Meta<typeof EditProfileForm>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Display name')).toHaveValue('Ada Lovelace')
    // No positions defined for the team → no picker is shown.
    await expect(canvas.queryByLabelText('Position')).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Save' })).toBeEnabled()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Saving: <EditProfileForm {...args} isSaving />,
        'Name taken': <EditProfileForm {...args} errorCode="NAME_TAKEN" />,
        // Required-when-available: the team defines positions but this member has none yet, so the
        // picker shows and Save stays disabled until one is picked.
        'Position required': <EditProfileForm {...args} positions={POSITIONS} currentPositionId={null} />,
        // A member with an existing position: the picker is preselected.
        'Position preselected': <EditProfileForm {...args} positions={POSITIONS} currentPositionId="p1" />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    const save = region('Saving').getByRole('button', { name: 'Saving...' })
    await expect(save).toBeInTheDocument()
    await expect(save).toBeDisabled()

    await expect(
      region('Name taken').getByText('That display name is already taken.'),
    ).toBeInTheDocument()

    await expect(region('Position required').getByLabelText('Position')).toBeInTheDocument()
    await expect(region('Position required').getByRole('button', { name: 'Save' })).toBeDisabled()

    await expect(
      within(region('Position preselected').getByLabelText('Position')).getByText('Setter'),
    ).toBeInTheDocument()
  },
}

// Picture owned by Data — behavioural only (ADR-0032 §1). Three instances: the default form (editing
// the name, then saving), and the required/preselected position configurations, each proving onSubmit
// carries the right (name, positionId) pair.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        Default: <EditProfileForm {...args} />,
        'Position required': <EditProfileForm {...args} positions={POSITIONS} currentPositionId={null} />,
        'Position preselected': <EditProfileForm {...args} positions={POSITIONS} currentPositionId="p1" />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    // Editing leaves the form structurally identical to Data — the field value and Save's enabled
    // state are the only visible change.
    const nameField = region('Default').getByLabelText('Display name')
    await userEvent.clear(nameField)
    await userEvent.type(nameField, 'Grace Hopper')
    await expect(nameField).toHaveValue('Grace Hopper')
    await expect(region('Default').getByRole('button', { name: 'Save' })).toBeEnabled()
    await userEvent.click(region('Default').getByRole('button', { name: 'Save' }))
    await expect(args.onSubmit).toHaveBeenCalledWith('Grace Hopper', null)

    await userEvent.click(region('Position required').getByLabelText('Position'))
    await userEvent.click(await within(document.body).findByRole('option', { name: 'Libero' }))
    const requiredSave = region('Position required').getByRole('button', { name: 'Save' })
    await expect(requiredSave).toBeEnabled()
    await userEvent.click(requiredSave)
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Ada Lovelace', 'p2')

    // Preselected: submitting carries the id already chosen, with no picker interaction needed.
    await userEvent.click(region('Position preselected').getByRole('button', { name: 'Save' }))
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Ada Lovelace', 'p1')
  },
}
