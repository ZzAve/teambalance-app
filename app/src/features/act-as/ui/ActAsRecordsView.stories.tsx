import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import type { ActAsRecord } from '@shared/api/act-as'
import { ActAsRecordsView } from './ActAsRecordsView'

const LEFT_DELIBERATELY: ActAsRecord = {
  actorKind: 'PLATFORM_ADMIN',
  enteredAt: '2026-08-20T09:00:00Z',
  lastActiveAt: '2026-08-20T09:40:00Z',
  exitedAt: '2026-08-20T09:45:00Z',
}

const RAN_OUT: ActAsRecord = {
  actorKind: 'PLATFORM_ADMIN',
  enteredAt: '2026-08-18T19:00:00Z',
  lastActiveAt: '2026-08-18T19:20:00Z',
  exitedAt: undefined,
}

const meta = {
  title: 'features/act-as/ActAsRecordsView',
  component: ActAsRecordsView,
  args: { records: [LEFT_DELIBERATELY, RAN_OUT] },
} satisfies Meta<typeof ActAsRecordsView>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {
  args: { isLoading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Loading…')).toBeInTheDocument()
  },
}

export const ErrorState: Story = {
  args: { isError: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Couldn't load platform access. Please try again.")).toBeInTheDocument()
  },
}

export const NeverVisited: Story = {
  args: { records: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('The platform has never worked inside this team.')).toBeInTheDocument()
  },
}

// The actor is the platform, never a person: no name, no email, nothing to look up (ADR-0024 §4).
export const AttributesThePlatformGenerically: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getAllByText('TeamBalance')).toHaveLength(2)
    await expect(canvas.getAllByText(/was here on/)).toHaveLength(2)
  },
}

// An episode that ran out has no exitedAt, so the window ends at the last activity rather than at a
// time the record cannot actually vouch for.
export const RanOutRatherThanExited: Story = {
  args: { records: [RAN_OUT] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/last seen/)).toBeInTheDocument()
    await expect(canvas.queryByText(/until/)).not.toBeInTheDocument()
  },
}
