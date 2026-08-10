import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { JoinTeamView } from './JoinTeamView'

// JoinTeamView is the presentational paste-your-invite UI behind the /onboarding/join route
// container. It owns no state of its own (value/onChange are controlled by the container so the
// route can hand the same raw text to a retried submit); it does own the token parsing (via the pure
// parse-invite-token) so onSubmit always receives the bare token, never the raw pasted URL.
const meta = {
  title: 'features/join-team/JoinTeamView',
  component: JoinTeamView,
  args: { value: '', onChange: fn(), onSubmit: fn() },
} satisfies Meta<typeof JoinTeamView>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Invite link')).toHaveValue('')
    // Nothing pasted yet → submit is disabled.
    await expect(canvas.getByRole('button', { name: 'Join' })).toBeDisabled()
    await expect(canvas.getByText("I don't have a link")).toBeInTheDocument()
  },
}

export const TypingUpdatesTheContainer: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.type(canvas.getByLabelText('Invite link'), 'abc')
    await expect(args.onChange).toHaveBeenCalled()
  },
}

export const Submit: Story = {
  args: { value: 'https://app.teambalance.nl/invite/abc123?utm=share' },
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole('button', { name: 'Join' })
    await expect(button).toBeEnabled()
    await userEvent.click(button)
    // The view parses the pasted URL down to the bare token before calling onSubmit.
    await expect(args.onSubmit).toHaveBeenCalledWith('abc123')
  },
}

export const Submitting: Story = {
  args: { value: 'abc123', submitting: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Joining…' })).toBeDisabled()
  },
}

export const ErrorState: Story = {
  args: {
    value: 'abc123',
    error: "That invite link didn't work — it may be invalid or expired. Ask your team admin for a fresh one.",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('invalid or expired')
  },
}

export const NoLinkFallback: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("I don't have a link"))
    await expect(await canvas.findByText(/Ask your team's captain or admin/)).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'Create a team' })).toBeInTheDocument()
  },
}
