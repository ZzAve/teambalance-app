import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { TeamRequest } from '@shared/api/team-requests'
import { Stack } from '@shared/testing/stack'
import { RequestTeamView } from './RequestTeamView'

const REQUEST: TeamRequest = {
  id: 'r1',
  teamName: 'Tovo Heren 4',
  purpose: 'We play on Tuesdays',
  status: 'PENDING',
  requesterEmail: 'a@example.com',
  requestedAt: '2026-11-01T00:00:00Z',
  decidedAt: undefined,
  rejectReason: undefined,
  creationCode: undefined,
}

// Three stories (ADR-0032 §1): Data is the empty form (no request yet) and carries the snapshot.
// Shells stacks every other card state. Interactions has no picture: it fills and submits the form,
// then follows the approved link, asserting the spies.
const meta = {
  title: 'features/request-team/RequestTeamView',
  component: RequestTeamView,
  args: { onSubmit: fn(), onOpenCreateTeam: fn() },
} satisfies Meta<typeof RequestTeamView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Team name')).toHaveValue('')
    await expect(canvas.getByLabelText('What will you use it for?')).toHaveValue('')
    await expect(canvas.getByRole('button', { name: 'Send request' })).toBeDisabled()
    await expect(canvas.getByRole('link', { name: 'I already have a code' })).toHaveAttribute('href', '/create-team')
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <RequestTeamView {...args} isLoading />,
        Pending: <RequestTeamView {...args} request={REQUEST} />,
        Approved: <RequestTeamView {...args} request={{ ...REQUEST, status: 'APPROVED', creationCode: 'AAAA-BBBB-CCCC' }} />,
        'Approved, code used': (
          <RequestTeamView {...args} request={{ ...REQUEST, status: 'APPROVED', creationCode: undefined }} />
        ),
        Rejected: <RequestTeamView {...args} request={{ ...REQUEST, status: 'REJECTED', rejectReason: 'Please be more specific' }} />,
        'Already pending': <RequestTeamView {...args} errorCode="NOT_PENDING" />,
        'Invalid name': <RequestTeamView {...args} errorCode="INVALID_NAME" />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    await expect(region('Loading').queryByRole('button', { name: 'Send request' })).not.toBeInTheDocument()

    await expect(region('Pending').getByText('Request sent for Tovo Heren 4, waiting for approval.')).toBeInTheDocument()
    await expect(region('Pending').queryByRole('button', { name: 'Send request' })).not.toBeInTheDocument()

    await expect(region('Approved').getByRole('link', { name: 'Approved: create Tovo Heren 4' })).toHaveAttribute(
      'href',
      '/create-team?code=AAAA-BBBB-CCCC&name=Tovo+Heren+4',
    )

    await expect(region('Approved, code used').getByLabelText('Team name')).toBeInTheDocument()

    await expect(region('Rejected').getByText('Not approved this time')).toBeInTheDocument()
    await expect(region('Rejected').getByText('Reason: Please be more specific')).toBeInTheDocument()
    await expect(region('Rejected').getByLabelText('Team name')).toBeInTheDocument()

    await expect(region('Already pending').getByRole('alert')).toHaveTextContent('already have a request')
    await expect(region('Invalid name').getByText('Enter a team name of 1 to 100 characters.')).toBeInTheDocument()
  },
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        Form: <RequestTeamView {...args} />,
        Approved: <RequestTeamView {...args} request={{ ...REQUEST, status: 'APPROVED', creationCode: 'AAAA-BBBB-CCCC' }} />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    const form = region('Form')

    // Whitespace-only fields keep submit disabled; the values are trimmed when sent.
    await userEvent.type(form.getByLabelText('Team name'), '   ')
    await userEvent.type(form.getByLabelText('What will you use it for?'), 'x')
    await expect(form.getByRole('button', { name: 'Send request' })).toBeDisabled()
    await userEvent.clear(form.getByLabelText('Team name'))
    await userEvent.type(form.getByLabelText('Team name'), '  Tovo Heren 4 ')
    await userEvent.clear(form.getByLabelText('What will you use it for?'))
    await userEvent.type(form.getByLabelText('What will you use it for?'), ' We play on Tuesdays ')
    await userEvent.click(form.getByRole('button', { name: 'Send request' }))
    await expect(args.onSubmit).toHaveBeenCalledWith({ teamName: 'Tovo Heren 4', purpose: 'We play on Tuesdays' })

    await userEvent.click(form.getByRole('link', { name: 'I already have a code' }))
    await expect(args.onOpenCreateTeam).toHaveBeenLastCalledWith(undefined)

    await userEvent.click(region('Approved').getByRole('link', { name: 'Approved: create Tovo Heren 4' }))
    await expect(args.onOpenCreateTeam).toHaveBeenLastCalledWith({ code: 'AAAA-BBBB-CCCC', name: 'Tovo Heren 4' })
  },
}
