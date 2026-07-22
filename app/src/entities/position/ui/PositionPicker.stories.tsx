import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Position } from '@shared/api/positions'
import { PositionPicker } from './PositionPicker'

// PositionPicker is the reusable presentational control shared by the profile form and the admin
// roster. It emits the chosen position id (or null for Unassigned). Props-only and network-free, so
// its states (no-positions / has-positions / preselected) render as stories.
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter' },
  { id: 'p2', label: 'Libero' },
  { id: 'p3', label: 'Outside Hitter' },
]

const meta = {
  title: 'entities/position/PositionPicker',
  component: PositionPicker,
  args: { positions: POSITIONS, value: null, onChange: fn() },
} satisfies Meta<typeof PositionPicker>

export default meta

type Story = StoryObj<typeof meta>

// No positions defined: the trigger still renders with its placeholder and no options.
export const NoPositions: Story = {
  args: { positions: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Select a position')).toBeInTheDocument()
  },
}

// Positions available: opening the picker lists them and choosing one emits its id.
export const HasPositions: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('combobox'))
    const listbox = within(document.body)
    await expect(await listbox.findByRole('option', { name: 'Setter' })).toBeInTheDocument()
    await userEvent.click(listbox.getByRole('option', { name: 'Libero' }))
    await expect(args.onChange).toHaveBeenCalledWith('p2')
  },
}

// A preselected value shows the current position's label in the trigger.
export const Preselected: Story = {
  args: { value: 'p3' },
  play: async ({ canvas }) => {
    await expect(within(canvas.getByRole('combobox')).getByText('Outside Hitter')).toBeInTheDocument()
  },
}

// The roster variant offers an explicit Unassigned choice that emits null.
export const WithUnassigned: Story = {
  args: { includeUnassigned: true, value: 'p1' },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('combobox'))
    const listbox = within(document.body)
    await userEvent.click(await listbox.findByRole('option', { name: 'Unassigned' }))
    await expect(args.onChange).toHaveBeenCalledWith(null)
  },
}
