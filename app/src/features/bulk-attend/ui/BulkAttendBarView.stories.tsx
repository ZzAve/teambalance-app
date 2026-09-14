import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { makeEvent } from '@shared/testing/event-fixtures'
import { Stack } from '@shared/testing/stack'
import type { EligibleTypeGroup } from '../lib/group-by-type'
import { BulkAttendBarView } from './BulkAttendBarView'

// The per-type Bulk Attend row (ADR-0021). Props-driven throughout, so every state renders with no
// network: the container does the grouping, the mutation and the Undo toast. Rendered inside the
// events page composite (EventsPageView), so per the ownership rule (ADR-0031 §3) its Data story is
// behavioural only — the composite's own picture already shows this bar in context.
//
// Three-story shape (ADR-0031 §1):
//   1. Data — the one populated live instance, disableSnapshot (picture owned by the page).
//   2. Shells — hidden / single-type / many-types / one-type-pending, stacked in one frame — this
//      picture stays, since the composite's default frame cannot show these variants.
//   3. Interactions — no picture; the tap-to-attend click, keeping the onAttend spy assertion.
const group = (typeId: string, typeName: string, count: number): EligibleTypeGroup => ({
  typeId,
  typeName,
  events: Array.from({ length: count }, (_, i) => makeEvent({ id: `${typeId}-${i}` })),
})

const meta = {
  title: 'features/bulk-attend/BulkAttendBarView',
  component: BulkAttendBarView,
  args: {
    groups: [group('et-training', 'Training', 12), group('et-match', 'Match', 3)],
    onAttend: fn(),
  },
} satisfies Meta<typeof BulkAttendBarView>

export default meta

type Story = StoryObj<typeof meta>

// Picture owned by the page composite (pages/EventsPageView) — behavioural only (ADR-0031 §3).
// The point of ADR-0021: each type gets its own button, so the scope needs no filtering to read.
export const Data: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Attend 12 trainings' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Attend 3 matches' })).toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        // Nothing left to fill anywhere: the row disappears rather than leaving an empty band.
        Hidden: <BulkAttendBarView {...args} groups={[]} />,
        // The common case for a team that mostly trains: exactly one button, already named.
        'Single type': <BulkAttendBarView {...args} groups={[group('et-training', 'Training', 8)]} />,
        // Several types wrap onto another line instead of sliding off the edge of a phone.
        'Many types': (
          <BulkAttendBarView
            {...args}
            groups={[
              group('et-training', 'Training', 9),
              group('et-match', 'Match', 4),
              group('et-social', 'Social', 2),
              group('et-tournament', 'Tournament', 1),
            ]}
          />
        ),
        // Only the type whose batch is in flight goes disabled; the others stay tappable.
        'One type pending': <BulkAttendBarView {...args} pendingTypeId="et-training" />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Hidden').queryByRole('button')).not.toBeInTheDocument()

    await expect(
      region('Single type').getByRole('button', { name: 'Attend 8 trainings' }),
    ).toBeInTheDocument()
    await expect(region('Single type').getAllByRole('button')).toHaveLength(1)

    await expect(region('Many types').getAllByRole('button')).toHaveLength(4)
    // Singular noun on the one-event group.
    await expect(
      region('Many types').getByRole('button', { name: 'Attend 1 tournament' }),
    ).toBeInTheDocument()

    await expect(
      region('One type pending').getByRole('button', { name: 'Attend 12 trainings' }),
    ).toBeDisabled()
    await expect(
      region('One type pending').getByRole('button', { name: 'Attend 3 matches' }),
    ).toBeEnabled()
  },
}

// Prop-contract spy: the tap must reach onAttend with the type it named, not merely render. Picture
// owned by the page composite — behavioural only (ADR-0031 §1, §3).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Attend 3 matches' }))
    await expect(args.onAttend).toHaveBeenCalledWith('et-match')
  },
}
