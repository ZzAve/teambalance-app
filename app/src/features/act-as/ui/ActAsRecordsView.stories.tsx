import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'
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
    await expect(canvas.getByText('The TeamBalance owner has never worked in your team.')).toBeInTheDocument()
    // Nothing to disclose, so the section does not offer a control that opens an empty list.
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
  },
}

// At rest the whole section is one line. Platform access is rare and, out of context, alarming —
// the list is not the resting state (ADR-0024 §4).
export const CollapsedByDefault: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /worked here 2 times/ })).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByText(/worked in your team/)).not.toBeInTheDocument()
  },
}

export const OneVisitReadsAsOnce: Story = {
  args: { records: [LEFT_DELIBERATELY] },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /worked here once/ })).toBeInTheDocument()
  },
}

// The actor is the platform, never a person: no name, no email, nothing to look up (ADR-0024 §4).
export const ExpandedListAttributesGenerically: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /worked here 2 times/ }))
    await expect(canvas.getAllByText('The TeamBalance owner worked in your team')).toHaveLength(2)
  },
}

// Second tap: the per-visit facts. Nothing here claims a change was made — the record is scoped to
// the session, so it knows access happened and not what came of it.
export const RecordExpandsToItsDetail: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /worked here 2 times/ }))
    const [first] = canvas.getAllByRole('button', { name: /worked in your team/ })
    await userEvent.click(first)
    await expect(canvas.getByText('Started')).toBeInTheDocument()
    await expect(canvas.getByText(/when they left/)).toBeInTheDocument()
    await expect(canvas.getByText('An admin of your team')).toBeInTheDocument()
  },
}

// An episode that ran out has no exitedAt, so the window ends at the last activity rather than at a
// time the record cannot actually vouch for.
export const RanOutRatherThanLeft: Story = {
  args: { records: [RAN_OUT] },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /worked here once/ }))
    await userEvent.click(canvas.getByRole('button', { name: /worked in your team/ }))
    await expect(canvas.getByText(/when the hour ran out/)).toBeInTheDocument()
    await expect(canvas.queryByText(/when they left/)).not.toBeInTheDocument()
  },
}

// Third tap: the reason. This is the whole point of the redesign — an Admin who asks "why was
// someone in our team?" gets an answer in place rather than having to write to us.
export const ReasoningIsReachable: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /worked here 2 times/ }))
    await userEvent.click(canvas.getAllByRole('button', { name: /worked in your team/ })[0])
    await userEvent.click(canvas.getByRole('button', { name: 'Why does this happen?' }))
    await expect(canvas.getByText(/TeamBalance is run by a small team/)).toBeInTheDocument()
    await expect(canvas.getByText(/whether or not anything changed/)).toBeInTheDocument()
  },
}

// The reasoning belongs to the record it was opened from: collapsing that record takes it with it,
// so re-opening a different one never starts mid-explanation.
export const ReasoningClosesWithItsRecord: Story = {
  // Behavioural twin of RecordExpandsToItsDetail — the final frame is the expanded-record detail
  // (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /worked here 2 times/ }))
    const records = canvas.getAllByRole('button', { name: /worked in your team/ })
    await userEvent.click(records[0])
    await userEvent.click(canvas.getByRole('button', { name: 'Why does this happen?' }))
    await userEvent.click(records[1])
    await expect(canvas.queryByText(/TeamBalance is run by a small team/)).not.toBeInTheDocument()
  },
}
