import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import type { ActAsRecord } from '@shared/api/act-as'
import { Stack } from '@shared/testing/stack'
import { ActAsRecordsView } from './ActAsRecordsView'

// ActAsRecordsView is the Admin-visible Act-as Record (ADR-0024 §4): what platform access this Team
// has had. Quiet by default — one line, two more taps to the full reasoning — and scoped to the
// act-as session rather than the row, since most tenant tables carry no per-row authorship column.
// Pure prop-driven view with local disclosure state only (no callback props).
//
// Three-story shape (ADR-0032 §1):
//   1. Data — the one populated live instance, at rest and collapsed.
//   2. Shells — loading / error / never-visited / a single-record instance, stacked in one frame.
//   3. Interactions — no picture; one play walks the disclosure all the way to the reasoning text,
//      and separately into the ran-out wording, keeping every assertion the old per-branch stories
//      made.
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

// At rest the whole section is one line. Platform access is rare and, out of context, alarming —
// the list is not the resting state (ADR-0024 §4).
export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /worked here 2 times/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await expect(canvas.queryByText(/worked in your team/)).not.toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <ActAsRecordsView {...args} isLoading />,
        Error: <ActAsRecordsView {...args} isError />,
        'Never visited': <ActAsRecordsView {...args} records={[]} />,
        // Singular wording, not "1 times".
        'One visit': <ActAsRecordsView {...args} records={[LEFT_DELIBERATELY]} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()

    await expect(
      region('Error').getByText("Couldn't load platform access. Please try again."),
    ).toBeInTheDocument()

    await expect(
      region('Never visited').getByText('The TeamBalance owner has never worked in your team.'),
    ).toBeInTheDocument()
    // Nothing to disclose, so the section does not offer a control that opens an empty list.
    await expect(region('Never visited').queryByRole('button')).not.toBeInTheDocument()

    await expect(
      region('One visit').getByRole('button', { name: /worked here once/ }),
    ).toBeInTheDocument()
  },
}

// Picture owned by Data and Shells — behavioural only (ADR-0032 §1). Two instances because the
// ran-out wording ("when the hour ran out") only shows for a record with no exitedAt.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        Records: <ActAsRecordsView {...args} />,
        'Ran out': <ActAsRecordsView {...args} records={[RAN_OUT]} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    // The actor is the platform, never a person: no name, no email, nothing to look up (ADR-0024 §4).
    await userEvent.click(region('Records').getByRole('button', { name: /worked here 2 times/ }))
    await expect(
      region('Records').getAllByText('The TeamBalance owner worked in your team'),
    ).toHaveLength(2)

    // Second tap: the per-visit facts. Nothing here claims a change was made — the record is scoped
    // to the session, so it knows access happened and not what came of it.
    const [first, second] = region('Records').getAllByRole('button', { name: /worked in your team/ })
    await userEvent.click(first)
    await expect(region('Records').getByText('Started')).toBeInTheDocument()
    await expect(region('Records').getByText(/when they left/)).toBeInTheDocument()
    await expect(region('Records').getByText('An admin of your team')).toBeInTheDocument()

    // Third tap: the reason. This is the whole point of the redesign — an Admin who asks "why was
    // someone in our team?" gets an answer in place rather than having to write to us.
    await userEvent.click(region('Records').getByRole('button', { name: 'Why does this happen?' }))
    await expect(region('Records').getByText(/TeamBalance is run by a small team/)).toBeInTheDocument()
    await expect(region('Records').getByText(/whether or not anything changed/)).toBeInTheDocument()

    // The reasoning belongs to the record it was opened from: collapsing that record takes it with
    // it, so opening a different one never starts mid-explanation.
    await userEvent.click(second)
    await expect(
      region('Records').queryByText(/TeamBalance is run by a small team/),
    ).not.toBeInTheDocument()

    // An episode that ran out has no exitedAt, so the window ends at the last activity rather than
    // at a time the record cannot actually vouch for.
    await userEvent.click(region('Ran out').getByRole('button', { name: /worked here once/ }))
    await userEvent.click(region('Ran out').getByRole('button', { name: /worked in your team/ }))
    await expect(region('Ran out').getByText(/when the hour ran out/)).toBeInTheDocument()
    await expect(region('Ran out').queryByText(/when they left/)).not.toBeInTheDocument()
  },
}
