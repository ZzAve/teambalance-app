import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { CreateEntryChooser } from './CreateEntryChooser'

// The create-entry chooser (prototype A): the first thing the bottom sheet shows — pick single vs
// recurring. Purely presentational; the sheet wires each choice.
const meta = {
  title: 'widgets/create-event/CreateEntryChooser',
  component: CreateEntryChooser,
  args: { onSingle: fn(), onRecurring: fn() },
} satisfies Meta<typeof CreateEntryChooser>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText('Single event')).toBeInTheDocument()
    await expect(canvas.getByText('Recurring series')).toBeInTheDocument()

    await userEvent.click(canvas.getByText('Single event'))
    await expect(args.onSingle).toHaveBeenCalled()

    await userEvent.click(canvas.getByText('Recurring series'))
    await expect(args.onRecurring).toHaveBeenCalled()
  },
}
