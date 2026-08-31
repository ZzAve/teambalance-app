import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { CreateTeamError } from '@shared/api/teams'
import { CreateMemberlessTeamView } from './CreateMemberlessTeamView'

// The console's memberless-create form (ADR-0024 §5). Prop-only, so loading / error / success / the
// submit contract all render from props with no network — the mutation lives in the container.
const meta = {
  title: 'features/create-memberless-team/CreateMemberlessTeamView',
  component: CreateMemberlessTeamView,
  args: { isPending: false, onSubmit: fn() },
} satisfies Meta<typeof CreateMemberlessTeamView>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Team name')).toBeInTheDocument()
    await expect(canvas.getByLabelText('Team address')).toBeInTheDocument()
    // No creation code — the /admin allowlist is the gate.
    await expect(canvas.queryByLabelText('Creation code')).not.toBeInTheDocument()
    // Submit is disabled until name + a valid slug are present.
    await expect(canvas.getByRole('button', { name: 'Create team' })).toBeDisabled()
  },
}

export const Pending: Story = {
  args: { isPending: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Creating…' })).toBeDisabled()
  },
}

export const SlugTaken: Story = {
  args: { error: new CreateTeamError('SLUG_TAKEN', 'That address is already taken — try another.') },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('That address is already taken — try another.')).toBeInTheDocument()
  },
}

export const GenericError: Story = {
  args: { error: new CreateTeamError('GENERIC', 'Something went wrong creating the team. Please try again.') },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Something went wrong creating the team.')
  },
}

export const Created: Story = {
  args: { createdName: 'Tovo Dames 5' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('Created “Tovo Dames 5”.')
  },
}

// Prop-contract: a valid name + address enables submit, and submitting fires onSubmit with the typed
// values — proving the create wiring survives a dependency bump.
export const SubmitsValidInput: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.type(canvas.getByLabelText('Team name'), 'Tovo Dames 5')
    await userEvent.type(canvas.getByLabelText('Team address'), 'tovo-dames-5')
    await userEvent.click(canvas.getByRole('button', { name: 'Create team' }))
    await expect(args.onSubmit).toHaveBeenCalledWith({ name: 'Tovo Dames 5', slug: 'tovo-dames-5' })
  },
}

// A malformed address is caught client-side before submit, and blocks it.
export const RejectsBadSlug: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.type(canvas.getByLabelText('Team name'), 'Tovo Dames 5')
    await userEvent.type(canvas.getByLabelText('Team address'), 'Bad Slug')
    await expect(canvas.getByText('Use lowercase letters, numbers, and hyphens.')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Create team' })).toBeDisabled()
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}
