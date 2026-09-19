import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { BulkAttendButtonView } from './BulkAttendButtonView'

// The presentational half of Bulk Attend (ADR-0020). Every state is props-driven, so the whole
// component renders with no network — the mutation and Undo toast live in the container.
//
// One gallery story (ADR-0032 §2): every variant side by side, one snapshot, every branch asserted.
// `Interactions` (disableSnapshot) keeps the prop-contract spy: the tap actually reaches onAttend.
const VARIANTS = {
  // Nothing left to fill: the button hides entirely rather than showing a disabled "Attend 0".
  hidden: { count: 0 },
  withCount: { count: 3 },
  // The label is the pre-tap confirmation, so a single event must not read "Attend 1 events".
  singleEvent: { count: 1 },
  // Filtered to one type: the label names it, so the scope is legible before the tap.
  singleType: { count: 4, typeName: 'Training' },
  // Disabled while the batch is in flight, so a double-tap can't fire it twice.
  pending: { count: 3, isPending: true },
}

const meta = {
  title: 'features/bulk-attend/BulkAttendButtonView',
  component: BulkAttendButtonView,
  args: { count: 3, onAttend: fn() },
} satisfies Meta<typeof BulkAttendButtonView>

export default meta

type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {Object.entries(VARIANTS).map(([name, props]) => (
        <div key={name} data-testid={`variant-${name}`}>
          <BulkAttendButtonView {...args} {...props} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const variant = (name: keyof typeof VARIANTS) => within(canvas.getByTestId(`variant-${name}`))

    await expect(variant('hidden').queryByRole('button')).not.toBeInTheDocument()

    await expect(variant('withCount').getByRole('button', { name: /Attend 3 events/ })).toBeInTheDocument()

    // Singular noun, so the label never reads "Attend 1 events".
    await expect(variant('singleEvent').getByRole('button', { name: 'Attend 1 event' })).toBeInTheDocument()

    await expect(variant('singleType').getByRole('button', { name: 'Attend 4 trainings' })).toBeInTheDocument()

    await expect(variant('pending').getByRole('button', { name: /Attend 3 events/ })).toBeDisabled()
  },
}

// Picture owned by Gallery — behavioural only (ADR-0032 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Attend 3 events/ }))
    await expect(args.onAttend).toHaveBeenCalled()
  },
}
