import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { TeamRequest } from '@shared/api/team-requests'
import { Stack } from '@shared/testing/stack'
import { TeamRequestsView } from './TeamRequestsView'

const base: TeamRequest = {
  id: 'r1',
  teamName: 'Tovo Heren 4',
  purpose: 'We play on Tuesdays and want to track attendance.',
  status: 'PENDING',
  requesterEmail: 'anna@example.com',
  requestedAt: '2026-11-01T10:00:00Z',
  decidedAt: undefined,
  rejectReason: undefined,
  creationCode: undefined,
}

const PENDING: TeamRequest = base
const PENDING_2: TeamRequest = { ...base, id: 'r2', teamName: 'Setpoint Dames', requesterEmail: 'bo@example.com' }
const APPROVED: TeamRequest = { ...base, id: 'r3', teamName: 'Blok VT', status: 'APPROVED', decidedAt: '2026-10-20T10:00:00Z' }
const REJECTED: TeamRequest = {
  ...base,
  id: 'r4',
  teamName: 'Spam FC',
  status: 'REJECTED',
  decidedAt: '2026-10-21T10:00:00Z',
  rejectReason: 'Not a volleyball team',
}
const REQUESTS = [PENDING, PENDING_2, APPROVED, REJECTED]

// Three stories (ADR-0032 §1): Data is the populated list, Shells every other state, Interactions
// has no picture and drives approve and the reject-with-reason flow against the spies.
const meta = {
  title: 'features/manage-team-requests/TeamRequestsView',
  component: TeamRequestsView,
  args: { requests: REQUESTS, onApprove: fn(), onReject: fn() },
} satisfies Meta<typeof TeamRequestsView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Team requests' })).toBeInTheDocument()
    await expect(canvas.getByText('bo@example.com', { exact: false })).toBeInTheDocument()
    await expect(canvas.getAllByText(/We play on Tuesdays/)).toHaveLength(2)
    await expect(canvas.getAllByRole('button', { name: 'Approve' })).toHaveLength(2)
    await expect(canvas.getByText('Approved')).toBeInTheDocument()
    await expect(canvas.getByText('Rejected')).toBeInTheDocument()
    await expect(canvas.getByText('Reason: Not a volleyball team')).toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <TeamRequestsView {...args} isLoading />,
        Error: <TeamRequestsView {...args} isError />,
        Empty: <TeamRequestsView {...args} requests={[]} />,
        'Already decided': <TeamRequestsView {...args} errorCode="NOT_PENDING" />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    await expect(region('Error').getByText("Couldn't load team requests. Please try again.")).toBeInTheDocument()
    await expect(region('Empty').getByText('No pending requests.')).toBeInTheDocument()
    await expect(region('Already decided').getByRole('alert')).toHaveTextContent('already been decided')
  },
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getAllByRole('button', { name: 'Approve' })[0])
    await expect(args.onApprove).toHaveBeenCalledWith(PENDING)

    // Reject the second request with a reason, then with a blank one.
    await userEvent.click(canvas.getAllByRole('button', { name: 'Reject' })[1])
    await userEvent.type(canvas.getByLabelText('Reason (optional, sent to the requester)'), ' Not now ')
    await userEvent.click(canvas.getByRole('button', { name: 'Reject request' }))
    await expect(args.onReject).toHaveBeenCalledWith(PENDING_2, 'Not now')

    await userEvent.click(canvas.getAllByRole('button', { name: 'Reject' })[0])
    await userEvent.click(canvas.getByRole('button', { name: 'Reject request' }))
    await expect(args.onReject).toHaveBeenLastCalledWith(PENDING, undefined)
  },
}
