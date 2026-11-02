import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { CreateTeamError } from '@shared/api/teams'
import { Stack } from '@shared/testing/stack'
import { CreateTeamForm } from './CreateTeamForm'

// CreateTeamForm is the presentational create-team UI behind the /create-team route container. It owns
// only local field state (name/slug/code + the slug auto-suggest-until-edited flag); the mutation,
// navigation, and success side-effects stay in the container, so every state renders purely from props.
//
// Three stories (ADR-0032 §1):
//   1. Data — the pristine form, and the picture of this View.
//   2. Shells — every non-data state (submitting / code invalid / slug taken / generic failure)
//      stacked in one frame, one picture, each state's assertions scoped to its labelled region.
//   3. Interactions — no picture; one play walks the submit contract (valid input, and a name+slug
//      combination client validation blocks) and keeps every prop-contract spy assertion.
const meta = {
  title: 'features/create-team/CreateTeamForm',
  component: CreateTeamForm,
  args: { isPending: false, onSubmit: fn() },
} satisfies Meta<typeof CreateTeamForm>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Team name')).toHaveValue('')
    await expect(canvas.getByLabelText('Team address')).toHaveValue('')
    await expect(canvas.getByLabelText('Creation code')).toHaveValue('')
    // Nothing typed yet → submit is disabled (hard gate before anything can be sent).
    await expect(canvas.getByRole('button', { name: 'Create team' })).toBeDisabled()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        // reassuranceDelayMs: 0 forces the delayed "still setting up" line visible without a real wait.
        Submitting: <CreateTeamForm {...args} isPending reassuranceDelayMs={0} />,
        'Code invalid': (
          <CreateTeamForm {...args} error={new CreateTeamError('INVALID_CREATION_CODE', "That creation code isn't valid.")} />
        ),
        'Slug taken': (
          <CreateTeamForm {...args} error={new CreateTeamError('SLUG_TAKEN', 'That address is already taken — try another.')} />
        ),
        // GENERIC is the only error with nowhere better to go than a banner, now that ADR-0023 lifted
        // ALREADY_IN_TEAM — so this shell keeps that slot covered.
        'Generic failure': (
          <CreateTeamForm
            {...args}
            error={new CreateTeamError('GENERIC', 'Something went wrong creating your team. Please try again.')}
          />
        ),
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    const submit = region('Submitting').getByRole('button', { name: 'Creating your team…' })
    await expect(submit).toBeDisabled()
    await expect(await region('Submitting').findByText(/Setting up your team's space/)).toBeInTheDocument()

    await expect(region('Code invalid').getByText("That creation code isn't valid.")).toBeInTheDocument()

    await expect(
      region('Slug taken').getByText('That address is already taken — try another.'),
    ).toBeInTheDocument()

    await expect(region('Generic failure').getByRole('alert')).toHaveTextContent(
      'Something went wrong creating your team.',
    )
  },
}

// A single live instance — not a Stack — because the fields use static ids (team-name/team-slug/
// creation-code), and two mounted instances would collide on them and break getByLabelText. The
// invalid-slug detour runs first, then the slug is fixed back up so the same instance can carry on
// to a valid submit.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.type(canvas.getByLabelText('Team name'), 'Tovo Heren 4')
    // The slug is auto-suggested from the name until the user edits it.
    await expect(canvas.getByLabelText('Team address')).toHaveValue('tovo-heren-4')

    // The user edits the auto-suggested slug into something invalid — client validation catches it.
    const slug = canvas.getByLabelText('Team address')
    await userEvent.clear(slug)
    await userEvent.type(slug, 'Bad Slug')
    await expect(canvas.getByText('Use lowercase letters, numbers, and hyphens.')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Create team' })).toBeDisabled()

    // Fixing the slug back up unblocks submit again.
    await userEvent.clear(slug)
    await userEvent.type(slug, 'tovo-heren-4')
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
