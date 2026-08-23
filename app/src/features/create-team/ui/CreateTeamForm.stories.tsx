import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { CreateTeamError } from '@shared/api/teams'
import { CreateTeamForm } from './CreateTeamForm'

// CreateTeamForm is the presentational create-team UI behind the /create-team route container. It owns
// only local field state (name/slug/code + the slug auto-suggest-until-edited flag); the mutation,
// navigation, and success side-effects stay in the container, so every state renders purely from props.
//
// Conventions (ADR-0017): all form states are stories with no network, and the interactive stories
// pass an onSubmit fn() spy and assert it fired with the right args — proving the wiring, not just the
// render.
const meta = {
  title: 'features/create-team/CreateTeamForm',
  component: CreateTeamForm,
  args: { isPending: false, onSubmit: fn() },
} satisfies Meta<typeof CreateTeamForm>

export default meta

type Story = StoryObj<typeof meta>

export const Pristine: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Team name')).toHaveValue('')
    await expect(canvas.getByLabelText('Team address')).toHaveValue('')
    await expect(canvas.getByLabelText('Creation code')).toHaveValue('')
    // Nothing typed yet → submit is disabled (hard gate before anything can be sent).
    await expect(canvas.getByRole('button', { name: 'Create team' })).toBeDisabled()
  },
}

export const Valid: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.type(canvas.getByLabelText('Team name'), 'Tovo Heren 4')
    // The slug is auto-suggested from the name until the user edits it.
    await expect(canvas.getByLabelText('Team address')).toHaveValue('tovo-heren-4')
    await userEvent.type(canvas.getByLabelText('Creation code'), 'JOIN-2026')

    const submit = canvas.getByRole('button', { name: 'Create team' })
    await expect(submit).toBeEnabled()
    await userEvent.click(submit)
    await expect(args.onSubmit).toHaveBeenCalledWith({
      name: 'Tovo Heren 4',
      slug: 'tovo-heren-4',
      creationCode: 'JOIN-2026',
    })
  },
}

export const Submitting: Story = {
  // reassuranceDelayMs: 0 forces the delayed "still setting up" line visible without a real wait.
  args: { isPending: true, reassuranceDelayMs: 0 },
  play: async ({ canvas }) => {
    const submit = canvas.getByRole('button', { name: 'Creating your team…' })
    await expect(submit).toBeDisabled()
    await expect(
      await canvas.findByText(/Setting up your team's space/),
    ).toBeInTheDocument()
  },
}

export const CodeInvalid: Story = {
  args: { error: new CreateTeamError('INVALID_CREATION_CODE', "That creation code isn't valid.") },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("That creation code isn't valid.")).toBeInTheDocument()
  },
}

export const SlugTaken: Story = {
  args: { error: new CreateTeamError('SLUG_TAKEN', 'That address is already taken — try another.') },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('That address is already taken — try another.')).toBeInTheDocument()
  },
}

export const NameOrSlugInvalid: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Team name'), 'Tovo Heren 4')
    // The user edits the auto-suggested slug into something invalid — client validation catches it.
    const slug = canvas.getByLabelText('Team address')
    await userEvent.clear(slug)
    await userEvent.type(slug, 'Bad Slug')
    await expect(canvas.getByText('Use lowercase letters, numbers, and hyphens.')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Create team' })).toBeDisabled()
  },
}

// The banner slot, now that ADR-0019 §3's 409 ALREADY_IN_TEAM is lifted (ADR-0023 §4) and a founder
// who already plays somewhere may start another Team: GENERIC is the only error with nowhere better
// to go than a banner, so this story is what keeps that slot covered.
export const GenericFailure: Story = {
  args: { error: new CreateTeamError('GENERIC', 'Something went wrong creating your team. Please try again.') },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Something went wrong creating your team.')
  },
}

export const GenericError: Story = {
  args: {
    error: new CreateTeamError('GENERIC', 'Something went wrong creating your team. Please try again.'),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Something went wrong creating your team.')
  },
}
