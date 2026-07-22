import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { EditProfileForm } from './EditProfileForm'

// EditProfileForm is the presentational form behind the /profile route container. It owns only the
// text field + inline validation; the member query and update mutation stay in the container, so
// every state (default, editing, saving, name-taken, saved) is renderable purely from props.
const meta = {
  title: 'features/edit-profile/EditProfileForm',
  component: EditProfileForm,
  args: { currentName: 'Ada Lovelace', isSaving: false, onSubmit: fn() },
} satisfies Meta<typeof EditProfileForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Display name')).toHaveValue('Ada Lovelace')
    await expect(canvas.getByRole('button', { name: 'Save' })).toBeEnabled()
  },
}

export const Editing: Story = {
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
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByLabelText('Display name')
    await userEvent.clear(input)
    await userEvent.type(input, 'Grace Hopper')
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(args.onSubmit).toHaveBeenCalledWith('Grace Hopper')
  },
}
