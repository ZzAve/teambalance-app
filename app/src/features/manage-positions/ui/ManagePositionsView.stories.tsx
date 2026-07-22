import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Position } from '@shared/api/positions'
import { ManagePositionsView } from './ManagePositionsView'

// ManagePositionsView is the presentational positions-management UI behind the ManagePositions
// container. It owns only local view state (new-label field, per-row edits, delete-confirm dialog);
// the query + mutations stay in the container, so every state renders purely from props.
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter' },
  { id: 'p2', label: 'Libero' },
]

const meta = {
  title: 'features/manage-positions/ManagePositionsView',
  component: ManagePositionsView,
  args: { positions: POSITIONS, onCreate: fn(), onRename: fn(), onDelete: fn() },
} satisfies Meta<typeof ManagePositionsView>

export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: { positions: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No positions yet. Add one above.')).toBeInTheDocument()
    // Add is disabled until a non-empty label is typed.
    await expect(canvas.getByRole('button', { name: 'Add' })).toBeDisabled()
  },
}

export const WithItems: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Label for Setter')).toHaveValue('Setter')
    await expect(canvas.getByLabelText('Label for Libero')).toHaveValue('Libero')
    await expect(canvas.getAllByRole('button', { name: 'Delete' })).toHaveLength(2)
  },
}

export const CreatePosition: Story = {
  args: { positions: [] },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.type(canvas.getByLabelText('New position label'), 'Middle Blocker')
    await userEvent.click(canvas.getByRole('button', { name: 'Add' }))
    await expect(args.onCreate).toHaveBeenCalledWith('Middle Blocker')
  },
}

export const DeleteConfirm: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getAllByRole('button', { name: 'Delete' })[0])
    const dialog = within(document.body)
    await expect(
      await dialog.findByText(/Members with this position will become Unassigned/),
    ).toBeInTheDocument()
    await userEvent.click(dialog.getByRole('button', { name: 'Delete' }))
    await expect(args.onDelete).toHaveBeenCalledWith(POSITIONS[0])
  },
}

export const LabelTaken: Story = {
  args: { errorCode: 'POSITION_LABEL_TAKEN' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('That position already exists.')).toBeInTheDocument()
  },
}
