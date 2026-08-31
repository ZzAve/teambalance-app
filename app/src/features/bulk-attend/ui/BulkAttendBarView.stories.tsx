import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { makeEvent } from '@shared/testing/event-fixtures'
import type { EligibleTypeGroup } from '../lib/group-by-type'
import { BulkAttendBarView } from './BulkAttendBarView'

// The per-type Bulk Attend row (ADR-0021). Props-driven throughout, so every state renders with no
// network: the container does the grouping, the mutation and the Undo toast.
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

// Nothing left to fill anywhere: the row disappears rather than leaving an empty band.
export const Hidden: Story = {
  args: { groups: [] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('button')).not.toBeInTheDocument()
  },
}

// The point of ADR-0021: each type gets its own button, so the scope needs no filtering to read.
export const PerType: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Attend 12 trainings' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Attend 3 matches' })).toBeInTheDocument()
  },
}

// The common case for a team that mostly trains: exactly one button, already named.
export const SingleType: Story = {
  args: { groups: [group('et-training', 'Training', 8)] },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Attend 8 trainings' })).toBeInTheDocument()
    await expect(canvas.getAllByRole('button')).toHaveLength(1)
  },
}

// Several types wrap onto another line instead of sliding off the edge of a phone.
export const ManyTypes: Story = {
  args: {
    groups: [
      group('et-training', 'Training', 9),
      group('et-match', 'Match', 4),
      group('et-social', 'Social', 2),
      group('et-tournament', 'Tournament', 1),
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('button')).toHaveLength(4)
    // Singular noun on the one-event group.
    await expect(canvas.getByRole('button', { name: 'Attend 1 tournament' })).toBeInTheDocument()
  },
}

// Only the type whose batch is in flight goes disabled; the others stay tappable.
export const OneTypePending: Story = {
  args: { pendingTypeId: 'et-training' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Attend 12 trainings' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Attend 3 matches' })).toBeEnabled()
  },
}

// Prop-contract spy: the tap must reach onAttend with the type it named, not merely render.
export const TapReportsItsType: Story = {
  // Behavioural twin of PerType — onAttend fires with its type; the per-type bar is unchanged
  // (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Attend 3 matches' }))
    await expect(args.onAttend).toHaveBeenCalledWith('et-match')
  },
}
