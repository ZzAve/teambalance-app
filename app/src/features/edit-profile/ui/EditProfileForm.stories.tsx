import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Position } from '@shared/api/positions'
import { EditProfileForm } from './EditProfileForm'

// EditProfileForm is the presentational form behind the /profile route container. It owns only the
// text field, the position picker + inline validation; the member query and update mutation stay in
// the container, so every state (default, editing, saving, name-taken, position) renders from props.
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter' },
  { id: 'p2', label: 'Libero' },
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

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Display name')).toHaveValue('Ada Lovelace')
    // No positions defined for the team → no picker is shown.
    await expect(canvas.queryByLabelText('Position')).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Save' })).toBeEnabled()
  },
}

export const Editing: Story = {
  // Behavioural twin of Default — typing a name leaves the form structurally identical to Default
  // (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Display name')
    await userEvent.clear(input)
    await userEvent.type(input, 'Grace Hopper')
    await expect(input).toHaveValue('Grace Hopper')
    await expect(canvas.getByRole('button', { name: 'Save' })).toBeEnabled()
  },
}

export const Saving: Story = {
  args: { isSaving: true },
  play: async ({ canvas }) => {
    const save = canvas.getByRole('button', { name: 'Saving...' })
    await expect(save).toBeInTheDocument()
    await expect(save).toBeDisabled()
  },
}

export const NameTakenError: Story = {
  args: { errorCode: 'NAME_TAKEN' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('That display name is already taken.')).toBeInTheDocument()
  },
}

export const SavedSuccess: Story = {
  // Behavioural twin of Default — onSubmit fires; the post-play frame is the Default layout
  // (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByLabelText('Display name')
    await userEvent.clear(input)
    await userEvent.type(input, 'Grace Hopper')
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(args.onSubmit).toHaveBeenCalledWith('Grace Hopper', null)
  },
}

// The team defines positions but this member has none yet: the picker shows and, until one is
// picked, Save stays disabled (required-when-available). Choosing a position enables submit.
export const PositionRequired: Story = {
  args: { positions: POSITIONS, currentPositionId: null },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByLabelText('Position')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Save' })).toBeDisabled()

    await userEvent.click(canvas.getByLabelText('Position'))
    await userEvent.click(await within(document.body).findByRole('option', { name: 'Libero' }))

    const save = canvas.getByRole('button', { name: 'Save' })
    await expect(save).toBeEnabled()
    await userEvent.click(save)
    await expect(args.onSubmit).toHaveBeenCalledWith('Ada Lovelace', 'p2')
  },
}

// A member with an existing position: the picker is preselected and submitting carries the id.
export const PositionPreselected: Story = {
  args: { positions: POSITIONS, currentPositionId: 'p1' },
  play: async ({ canvas, userEvent, args }) => {
    await expect(within(canvas.getByLabelText('Position')).getByText('Setter')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(args.onSubmit).toHaveBeenCalledWith('Ada Lovelace', 'p1')
  },
}
