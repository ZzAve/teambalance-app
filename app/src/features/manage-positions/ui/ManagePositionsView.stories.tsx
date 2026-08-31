import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Position } from '@shared/api/positions'
import { ManagePositionsView } from './ManagePositionsView'

// ManagePositionsView is the presentational positions-management UI behind the ManagePositions
// container. It owns only local view state (new-label field, per-row edits, delete-confirm dialog);
// the query + mutations stay in the container, so every state renders purely from props.
//
// This is the reference exemplar for two conventions (ADR-0017):
//   1. All four data states are stories — Loading / ErrorState / Empty / WithItems — because the
//      load+error shells were pushed down from the container into the View (props-driven), so they
//      render with no network.
//   2. Prop-contract spies — CreatePosition / RenamePosition / DeleteConfirm drive a real
//      interaction and assert the callback fired with the right args (args.onCreate/onRename/
//      onDelete are fn() spies). This proves the wiring survives a dependency bump; a getByText
//      assertion alone would not.
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

export const Loading: Story = {
  args: { isLoading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Loading…')).toBeInTheDocument()
    // The form is suppressed while the query is in flight — no add control yet.
    await expect(canvas.queryByRole('button', { name: 'Add' })).not.toBeInTheDocument()
  },
}

export const ErrorState: Story = {
  args: { isError: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Couldn't load positions. Please try again.")).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Add' })).not.toBeInTheDocument()
  },
}

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
  // Behavioural twin of Empty — the field clears with `positions: []`, settling to the Empty picture
  // (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  args: { positions: [] },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.type(canvas.getByLabelText('New position label'), 'Middle Blocker')
    await userEvent.click(canvas.getByRole('button', { name: 'Add' }))
    await expect(args.onCreate).toHaveBeenCalledWith('Middle Blocker')
  },
}

export const RenamePosition: Story = {
  play: async ({ canvas, userEvent, args }) => {
    // The per-row Save button only appears once the label is edited to a new, non-empty value.
    const field = canvas.getByLabelText('Label for Setter')
    await userEvent.clear(field)
    await userEvent.type(field, 'Middle Blocker')
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(args.onRename).toHaveBeenCalledWith('p1', 'Middle Blocker')
  },
}

export const DeleteConfirm: Story = {
  // Behavioural twin of WithItems — the confirm dialog closes on confirm and settles back to the
  // items picture; the open-dialog frame keeps its own baseline via DeleteConfirmOpen below
  // (#263, ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
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

// Open-dialog baseline: the first row's Delete opens the confirm dialog (a portal); we stop with it
// open — no confirm click — so the open dialog frame gets its own keep-baseline snapshot. The
// DeleteConfirm spy above closes on confirm, so it never pictures the open dialog.
export const DeleteConfirmOpen: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getAllByRole('button', { name: 'Delete' })[0])
    const dialog = within(document.body)
    await expect(
      await dialog.findByText(/Members with this position will become Unassigned/),
    ).toBeInTheDocument()
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  },
}

export const LabelTaken: Story = {
  args: { errorCode: 'POSITION_LABEL_TAKEN' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('That position already exists.')).toBeInTheDocument()
  },
}
