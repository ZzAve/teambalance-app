import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { BulkAttendButtonView } from './BulkAttendButtonView'

// The presentational half of Bulk Attend (ADR-0020). Every state is props-driven, so the whole
// component renders with no network — the mutation and Undo toast live in the container.
const meta = {
  title: 'features/bulk-attend/BulkAttendButtonView',
  component: BulkAttendButtonView,
  args: { count: 3, onAttend: fn() },
} satisfies Meta<typeof BulkAttendButtonView>

export default meta

type Story = StoryObj<typeof meta>

// Nothing left to fill: the button hides entirely rather than showing a disabled "Attend 0".
export const Hidden: Story = {
  args: { count: 0 },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('button')).not.toBeInTheDocument()
  },
}

export const WithCount: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /Attend 3 events/ })).toBeInTheDocument()
  },
}

// The label is the pre-tap confirmation, so a single event must not read "Attend 1 events".
export const SingleEvent: Story = {
  args: { count: 1 },
  play: async ({ canvas }) => {
    // Singular noun, so the label never reads "Attend 1 events".
    await expect(canvas.getByRole('button', { name: 'Attend 1 event' })).toBeInTheDocument()
  },
}

// Filtered to one type: the label names it, so the scope is legible before the tap.
export const SingleType: Story = {
  args: { count: 4, typeName: 'Training' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Attend 4 trainings' })).toBeInTheDocument()
  },
}

export const Pending: Story = {
  args: { isPending: true },
  play: async ({ canvas }) => {
    // Disabled while the batch is in flight, so a double-tap can't fire it twice.
    await expect(canvas.getByRole('button', { name: /Attend 3 events/ })).toBeDisabled()
  },
}

// Prop-contract spy: proves the tap actually reaches onAttend, not merely that the label renders.
export const TapFiresOnAttend: Story = {
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Attend 3 events/ }))
    await expect(args.onAttend).toHaveBeenCalled()
  },
}
