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
  // items picture; the open-dialog frames keep their own baselines below (#263, ADR-0027 §2) —
  // three of them now, because #219 gives the dialog three states rather than one.
  parameters: { chromatic: { disableSnapshot: true } },
  args: { usage: { eventTypeCount: 2, eventCount: 1, memberCount: 3 } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getAllByRole('button', { name: 'Delete' })[0])
    const dialog = within(document.body)
    // The dialog names what the delete will actually touch (#219) rather than warning in the
    // abstract — a warning, not a veto: the Delete button is still live.
    await expect(await dialog.findByText(/3 members become Unassigned/)).toBeInTheDocument()
    await expect(dialog.getByText(/dropped from 2 event types/)).toBeInTheDocument()
    await expect(dialog.getByText(/from 1 event with their own roster/)).toBeInTheDocument()
    await userEvent.click(dialog.getByRole('button', { name: 'Delete' }))
    await expect(args.onDelete).toHaveBeenCalledWith(POSITIONS[0])
  },
}

// Open-dialog baselines. #264 added a single DeleteConfirmOpen here for the frame DeleteConfirm
// cannot picture (its play confirms, so the dialog is gone before Chromatic shoots). #219 gives that
// dialog three distinct states — the counts have arrived, they arrived as zero, or they are still in
// flight — so the one story becomes three. Each opens the dialog and stops; none confirms.
//
// The populated one is the frame an admin actually reads before a destructive action, and it is why
// the blast-radius work exists at all.
export const DeleteConfirmUsageCounts: Story = {
  args: { usage: { eventTypeCount: 2, eventCount: 1, memberCount: 3 } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getAllByRole('button', { name: 'Delete' })[0])
    const dialog = within(document.body)
    await expect(await dialog.findByText(/3 members become Unassigned/)).toBeInTheDocument()
    await expect(dialog.getByText(/dropped from 2 event types/)).toBeInTheDocument()
    await expect(dialog.getByText(/from 1 event with their own roster/)).toBeInTheDocument()
    // Deliberately not confirmed: a warning is not a veto, so the Delete button stays live and
    // nothing has fired yet.
    await expect(dialog.getByRole('button', { name: 'Delete' })).toBeEnabled()
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    await expect(args.onDelete).not.toHaveBeenCalled()
  },
}

// A position nothing uses reads as a clean removal rather than a list of three zeroes.
export const DeleteConfirmUnused: Story = {
  args: { usage: { eventTypeCount: 0, eventCount: 0, memberCount: 0 } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getAllByRole('button', { name: 'Delete' })[0])
    const dialog = within(document.body)
    await expect(await dialog.findByText('Nothing currently uses this position.')).toBeInTheDocument()
  },
}

// The usage query is admin-only and fires when the dialog opens, so there is a moment with no
// answer yet. It must not read as "nothing uses this".
export const DeleteConfirmUsageLoading: Story = {
  args: { usage: undefined },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getAllByRole('button', { name: 'Delete' })[0])
    const dialog = within(document.body)
    await expect(await dialog.findByText('Checking what uses this position…')).toBeInTheDocument()
    await expect(dialog.queryByText(/Nothing currently uses/)).not.toBeInTheDocument()
  },
}

export const LabelTaken: Story = {
  args: { errorCode: 'POSITION_LABEL_TAKEN' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('That position already exists.')).toBeInTheDocument()
  },
}
