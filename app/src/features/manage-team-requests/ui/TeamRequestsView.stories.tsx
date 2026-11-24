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
// has no picture and drives the approve confirm and the reject-with-reason flow against the spies.
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
    // Approve asks first: Cancel backs out without calling the spy, the confirm calls it.
    const firstRow = within(canvas.getAllByRole('listitem')[0])
    await userEvent.click(firstRow.getByRole('button', { name: 'Approve' }))
    await expect(firstRow.getByText('Approving creates a creation code and emails it to anna@example.com.')).toBeInTheDocument()
    await userEvent.click(firstRow.getByRole('button', { name: 'Cancel' }))
    await expect(args.onApprove).not.toHaveBeenCalled()
    await userEvent.click(firstRow.getByRole('button', { name: 'Approve' }))
    await userEvent.click(firstRow.getByRole('button', { name: 'Approve and send code' }))
    await expect(args.onApprove).toHaveBeenCalledWith(PENDING)
    // The spy doesn't refetch, so the confirm stays open; back out so the reject steps below see the row's buttons.
    await userEvent.click(firstRow.getByRole('button', { name: 'Cancel' }))

    // Reject the second request with a reason, then with a blank one.
    await userEvent.click(canvas.getAllByRole('button', { name: 'Reject' })[1])
    await userEvent.type(canvas.getByLabelText('Reason (optional, sent to the requester)'), ' Not now ')
    await userEvent.click(canvas.getByRole('button', { name: 'Reject request' }))
    await expect(args.onReject).toHaveBeenCalledWith(PENDING_2, 'Not now')

    // The spies don't refetch, so the second row's form stays open: scope to the first row.
    const first = within(canvas.getAllByRole('listitem')[0])
    await userEvent.click(first.getByRole('button', { name: /^Reject$/ }))
    await userEvent.click(first.getByRole('button', { name: 'Reject request' }))
    await expect(args.onReject).toHaveBeenLastCalledWith(PENDING, undefined)
    // A failed reject must not lose the typed reason: the second row's form still holds it.
    await expect(canvas.getByDisplayValue('Not now')).toBeInTheDocument()
  },
}
