import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Position } from '@shared/api/positions'
import { Stack } from '@shared/testing/stack'
import { PositionPicker } from './PositionPicker'

// PositionPicker is the reusable presentational control shared by the profile form and the admin
// roster. It emits the chosen position id (or null for Unassigned). Props-only and network-free, so
// its states (no-positions / has-positions / preselected) render as stories.
//
// One gallery story (ADR-0031 §2) stacks the static trigger states; opening the menu and picking an
// option is behavioural only and lives in Interactions.
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter', kind: 'PLAYING' },
  { id: 'p2', label: 'Libero', kind: 'PLAYING' },
  { id: 'p3', label: 'Outside Hitter', kind: 'PLAYING' },
]

const meta = {
  title: 'entities/position/PositionPicker',
  component: PositionPicker,
  args: { positions: POSITIONS, value: null, onChange: fn() },
} satisfies Meta<typeof PositionPicker>

export default meta

type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {/* No positions defined: the trigger still renders with its placeholder and no options. */}
      <div data-testid="variant-noPositions">
        <PositionPicker {...args} positions={[]} />
      </div>
      {/* A preselected value shows the current position's label in the trigger. */}
      <div data-testid="variant-preselected">
        <PositionPicker {...args} value="p3" />
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const variant = (name: string) => within(canvas.getByTestId(`variant-${name}`))

    await expect(variant('noPositions').getByText('Select a position')).toBeInTheDocument()

    await expect(
      within(variant('preselected').getByRole('combobox')).getByText('Outside Hitter'),
    ).toBeInTheDocument()
  },
}

// Picture owned by Gallery — behavioural only (ADR-0031 §1). Two instances: positions available
// (select-and-report) and the roster's explicit Unassigned choice.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        'Has positions': <PositionPicker {...args} />,
        'With unassigned': <PositionPicker {...args} includeUnassigned value="p1" />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    const listbox = within(document.body)

    // Positions available: opening the picker lists them and choosing one emits its id.
    await userEvent.click(region('Has positions').getByRole('combobox'))
    await expect(await listbox.findByRole('option', { name: 'Setter' })).toBeInTheDocument()
    await userEvent.click(listbox.getByRole('option', { name: 'Libero' }))
    await expect(args.onChange).toHaveBeenLastCalledWith('p2')

    // The roster variant offers an explicit Unassigned choice that emits null.
    await userEvent.click(region('With unassigned').getByRole('combobox'))
    await userEvent.click(await listbox.findByRole('option', { name: 'Unassigned' }))
    await expect(args.onChange).toHaveBeenLastCalledWith(null)
  },
}
