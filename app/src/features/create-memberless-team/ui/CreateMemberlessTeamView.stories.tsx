import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { CreateTeamError } from '@shared/api/teams'
import { Stack } from '@shared/testing/stack'
import { CreateMemberlessTeamView } from './CreateMemberlessTeamView'

// The console's memberless-create form (ADR-0024 §5). Prop-only, so loading / error / success / the
// submit contract all render from props with no network — the mutation lives in the container.
//
// Three stories (ADR-0031 §1):
//   1. Data — the pristine form, and the picture of this View.
//   2. Shells — every non-data state (pending / slug taken / generic error / created) stacked in one
//      frame, one picture, each state's assertions scoped to its labelled region.
//   3. Interactions — no picture; one play walks the submit contract (valid input, and a bad slug
//      that blocks it) and keeps every prop-contract spy assertion.
const meta = {
  title: 'features/create-memberless-team/CreateMemberlessTeamView',
  component: CreateMemberlessTeamView,
  args: { isPending: false, onSubmit: fn() },
} satisfies Meta<typeof CreateMemberlessTeamView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Team name')).toBeInTheDocument()
    await expect(canvas.getByLabelText('Team address')).toBeInTheDocument()
    // No creation code — the /admin allowlist is the gate.
    await expect(canvas.queryByLabelText('Creation code')).not.toBeInTheDocument()
    // Submit is disabled until name + a valid slug are present.
    await expect(canvas.getByRole('button', { name: 'Create team' })).toBeDisabled()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Pending: <CreateMemberlessTeamView {...args} isPending />,
        'Slug taken': (
          <CreateMemberlessTeamView
            {...args}
            error={new CreateTeamError('SLUG_TAKEN', 'That address is already taken — try another.')}
          />
        ),
        'Generic error': (
          <CreateMemberlessTeamView
            {...args}
            error={new CreateTeamError('GENERIC', 'Something went wrong creating the team. Please try again.')}
          />
        ),
        Created: <CreateMemberlessTeamView {...args} createdName="Tovo Dames 5" />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Pending').getByRole('button', { name: 'Creating…' })).toBeDisabled()

    await expect(
      region('Slug taken').getByText('That address is already taken — try another.'),
    ).toBeInTheDocument()

    await expect(region('Generic error').getByRole('alert')).toHaveTextContent(
      'Something went wrong creating the team.',
    )

    await expect(region('Created').getByRole('status')).toHaveTextContent('Created “Tovo Dames 5”.')
  },
}

// A single live instance — not a Stack — because the form's inputs use static ids
// (ml-team-name/ml-team-slug), and two mounted instances would collide on them and break
// getByLabelText. The malformed-address step runs first so the "never called" assertion happens
// before any step that could call the spy.
//
// Prop-contract: a malformed address is caught client-side before submit and blocks it; a valid
// name + address then enables submit and fires onSubmit with the typed values — proving the create
// wiring survives a dependency bump.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.type(canvas.getByLabelText('Team name'), 'Tovo Dames 5')
    await userEvent.type(canvas.getByLabelText('Team address'), 'Bad Slug')
    await expect(canvas.getByText('Use lowercase letters, numbers, and hyphens.')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Create team' })).toBeDisabled()
    await expect(args.onSubmit).not.toHaveBeenCalled()

    await userEvent.clear(canvas.getByLabelText('Team address'))
    await userEvent.type(canvas.getByLabelText('Team address'), 'tovo-dames-5')
    await userEvent.click(canvas.getByRole('button', { name: 'Create team' }))
    await expect(args.onSubmit).toHaveBeenCalledWith({ name: 'Tovo Dames 5', slug: 'tovo-dames-5' })
  },
}
