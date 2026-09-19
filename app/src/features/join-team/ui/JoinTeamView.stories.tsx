import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { JoinTeamView } from './JoinTeamView'

// JoinTeamView is the presentational paste-your-invite UI behind the /onboarding/join route
// container. It owns no state of its own (value/onChange are controlled by the container so the
// route can hand the same raw text to a retried submit); it does own the token parsing (via the pure
// parse-invite-token) so onSubmit always receives the bare token, never the raw pasted URL.
//
// Three stories (ADR-0032 §1): Data is the empty, ready-to-paste form and carries the snapshot.
// Shells stacks the submitting and error states in one frame. Interactions has no picture; one play
// types into the field, submits a pasted link, and opens the "I don't have a link" disclosure,
// keeping every onChange/onSubmit assertion.
const meta = {
  title: 'features/join-team/JoinTeamView',
  component: JoinTeamView,
  args: { value: '', onChange: fn(), onSubmit: fn() },
} satisfies Meta<typeof JoinTeamView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Invite link')).toHaveValue('')
    // Nothing pasted yet → submit is disabled.
    await expect(canvas.getByRole('button', { name: 'Join' })).toBeDisabled()
    await expect(canvas.getByText("I don't have a link")).toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Submitting: <JoinTeamView {...args} value="abc123" submitting />,
        Error: (
          <JoinTeamView
            {...args}
            value="abc123"
            error="That invite link didn't work — it may be invalid or expired. Ask your team admin for a fresh one."
          />
        ),
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Submitting').getByRole('button', { name: 'Joining…' })).toBeDisabled()
    await expect(region('Error').getByRole('alert')).toHaveTextContent('invalid or expired')
  },
}

// Picture owned by Data — behavioural only (ADR-0032 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        Typing: <JoinTeamView {...args} />,
        'Ready to submit': (
          <JoinTeamView {...args} value="https://app.teambalance.nl/invite/abc123?utm=share" />
        ),
        'No link fallback': <JoinTeamView {...args} />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    // Typing reports to onChange without changing the picture — the field is controlled by the
    // container (ADR-0027 §2).
    await userEvent.type(region('Typing').getByLabelText('Invite link'), 'abc')
    await expect(args.onChange).toHaveBeenCalled()

    const submitButton = region('Ready to submit').getByRole('button', { name: 'Join' })
    await expect(submitButton).toBeEnabled()
    await userEvent.click(submitButton)
    // The view parses the pasted URL down to the bare token before calling onSubmit.
    await expect(args.onSubmit).toHaveBeenCalledWith('abc123')

    await userEvent.click(region('No link fallback').getByText("I don't have a link"))
    await expect(
      await region('No link fallback').findByText(/Ask your team's captain or admin/),
    ).toBeInTheDocument()
    await expect(
      region('No link fallback').getByRole('link', { name: 'Create a team' }),
    ).toBeInTheDocument()
  },
}
