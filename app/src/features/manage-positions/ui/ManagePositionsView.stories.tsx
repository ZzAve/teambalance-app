import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Position } from '@shared/api/positions'
import { Stack } from '@shared/testing/stack'
import { ManagePositionsView } from './ManagePositionsView'

// ManagePositionsView is the presentational positions-management UI behind the ManagePositions
// container. It owns only local view state (new-label field, per-row edits, delete-confirm dialog);
// the query + mutations stay in the container, so every state renders purely from props.
//
// This is the reference exemplar for the three-story shape (ADR-0031 §1):
//   1. Data — the one populated live instance, and the picture of this View.
//   2. Shells — every non-data state (load / error / empty / staff / label-taken) stacked in one
//      frame, one picture, each state's assertions scoped to its labelled region.
//   3. Interactions — no picture; one play walks every interaction and keeps every prop-contract
//      spy (args.onCreate/onRename/onSetKind/onDelete are fn() spies). This proves the wiring
//      survives a dependency bump; a getByText assertion alone would not.
// Plus one extra picture, DeleteConfirmOpen, for the frame no composite shows: the open dialog.
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter', kind: 'PLAYING' },
  { id: 'p2', label: 'Libero', kind: 'PLAYING' },
]

// A vocabulary with the distinction actually used (#281). Kept apart from POSITIONS so the default
// picture stays the one every team sees before an admin marks anything.
const WITH_STAFF: Position[] = [
  { id: 'p1', label: 'Setter', kind: 'PLAYING' },
  { id: 'p3', label: 'Trainer', kind: 'STAFF' },
]

const USAGE = { eventTypeCount: 2, eventCount: 1, memberCount: 3 }

const meta = {
  title: 'features/manage-positions/ManagePositionsView',
  component: ManagePositionsView,
  args: { positions: POSITIONS, onCreate: fn(), onRename: fn(), onSetKind: fn(), onDelete: fn() },
} satisfies Meta<typeof ManagePositionsView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Label for Setter')).toHaveValue('Setter')
    await expect(canvas.getByLabelText('Label for Libero')).toHaveValue('Libero')
    await expect(canvas.getAllByRole('button', { name: 'Delete' })).toHaveLength(2)
    // The staff toggle's resting state (#281): a team that has marked nothing sees every box clear,
    // so the distinction costs an existing admin no attention until they want it.
    await expect(canvas.getByLabelText('Setter is staff')).not.toBeChecked()
    await expect(canvas.getByLabelText('Libero is staff')).not.toBeChecked()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <ManagePositionsView {...args} isLoading />,
        Error: <ManagePositionsView {...args} isError />,
        Empty: <ManagePositionsView {...args} positions={[]} />,
        'With a staff position': <ManagePositionsView {...args} positions={WITH_STAFF} />,
        'Label taken': <ManagePositionsView {...args} errorCode="POSITION_LABEL_TAKEN" />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    // The form is suppressed while the query is in flight — no add control yet.
    await expect(region('Loading').queryByRole('button', { name: 'Add' })).not.toBeInTheDocument()

    await expect(
      region('Error').getByText("Couldn't load positions. Please try again."),
    ).toBeInTheDocument()
    await expect(region('Error').queryByRole('button', { name: 'Add' })).not.toBeInTheDocument()

    await expect(region('Empty').getByText('No positions yet. Add one above.')).toBeInTheDocument()
    // Add is disabled until a non-empty label is typed.
    await expect(region('Empty').getByRole('button', { name: 'Add' })).toBeDisabled()

    await expect(region('With a staff position').getByLabelText('Trainer is staff')).toBeChecked()
    await expect(
      region('With a staff position').getByLabelText('Setter is staff'),
    ).not.toBeChecked()

    await expect(
      region('Label taken').getByText('That position already exists.'),
    ).toBeInTheDocument()
  },
}

// The open-dialog frame (#264, #219): the populated blast-radius dialog is what an admin actually
// reads before a destructive action, and it is why that work exists at all. Opened and left open
// — none of the Interactions steps can picture it, because they confirm or cancel.
export const DeleteConfirmOpen: Story = {
  args: { usage: USAGE },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getAllByRole('button', { name: 'Delete' })[0])
    const dialog = within(document.body)
    // The dialog names what the delete will actually touch (#219) rather than warning in the
    // abstract — a warning, not a veto: the Delete button is still live.
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

// Picture owned by Data and DeleteConfirmOpen — behavioural only (ADR-0031 §1). Several instances
// because some steps need a state the default one is never in (an empty list to create into, a
// staff position to reclassify, a dialog with nothing / no answer yet to read).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        Positions: <ManagePositionsView {...args} usage={USAGE} />,
        Staff: <ManagePositionsView {...args} positions={WITH_STAFF} />,
        Empty: <ManagePositionsView {...args} positions={[]} />,
        Unused: (
          <ManagePositionsView
            {...args}
            usage={{ eventTypeCount: 0, eventCount: 0, memberCount: 0 }}
          />
        ),
        'Usage loading': <ManagePositionsView {...args} usage={undefined} />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    const dialog = within(document.body)

    // The gesture is the flip itself — no Save to press, unlike the label beside it.
    await userEvent.click(region('Positions').getByLabelText('Setter is staff'))
    await expect(args.onSetKind).toHaveBeenLastCalledWith('p1', 'STAFF')
    // Reclassifying is not one-way: an admin who marked the wrong position can put it back.
    await userEvent.click(region('Staff').getByLabelText('Trainer is staff'))
    await expect(args.onSetKind).toHaveBeenLastCalledWith('p3', 'PLAYING')

    await userEvent.type(region('Empty').getByLabelText('New position label'), 'Middle Blocker')
    await userEvent.click(region('Empty').getByRole('button', { name: 'Add' }))
    await expect(args.onCreate).toHaveBeenCalledWith('Middle Blocker')

    // The per-row Save button only appears once the label is edited to a new, non-empty value.
    const field = region('Positions').getByLabelText('Label for Setter')
    await userEvent.clear(field)
    await userEvent.type(field, 'Middle Blocker')
    await userEvent.click(region('Positions').getByRole('button', { name: 'Save' }))
    await expect(args.onRename).toHaveBeenCalledWith('p1', 'Middle Blocker')

    // Confirming the blast-radius dialog fires the delete and closes it.
    await userEvent.click(region('Positions').getAllByRole('button', { name: 'Delete' })[0])
    await expect(await dialog.findByText(/3 members become Unassigned/)).toBeInTheDocument()
    await userEvent.click(dialog.getByRole('button', { name: 'Delete' }))
    await expect(args.onDelete).toHaveBeenCalledWith(POSITIONS[0])

    // A position nothing uses reads as a clean removal rather than a list of three zeroes.
    await userEvent.click(region('Unused').getAllByRole('button', { name: 'Delete' })[0])
    await expect(await dialog.findByText('Nothing currently uses this position.')).toBeInTheDocument()
    await userEvent.click(dialog.getByRole('button', { name: 'Cancel' }))

    // The usage query is admin-only and fires when the dialog opens, so there is a moment with no
    // answer yet. It must not read as "nothing uses this".
    await userEvent.click(region('Usage loading').getAllByRole('button', { name: 'Delete' })[0])
    await expect(await dialog.findByText('Checking what uses this position…')).toBeInTheDocument()
    await expect(dialog.queryByText(/Nothing currently uses/)).not.toBeInTheDocument()
    await userEvent.click(dialog.getByRole('button', { name: 'Cancel' }))
  },
}
