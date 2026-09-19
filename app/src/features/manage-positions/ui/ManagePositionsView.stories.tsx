import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Position } from '@shared/api/positions'
import { Stack } from '@shared/testing/stack'
import { ManagePositionsView } from './ManagePositionsView'

// ManagePositionsView is the presentational positions-management UI behind the ManagePositions
// container. It owns only local view state (new-label field, per-row edits, delete-confirm dialog);
// the query + mutations stay in the container, so every state renders purely from props.
//
// One quiet row per position (issue #341, variant B): label as text (rename lives behind the row's
// ⋯ menu, not an always-open input), the Staff checkbox inline since it's the common edit, and a
// single overflow (⋯) menu carrying Rename and the destructive Delete….
//
// This is the reference exemplar for the three-story shape (ADR-0032 §1):
//   1. Data — the one populated live instance, and the picture of this View.
//   2. Shells — every non-data state (load / error / empty / staff / label-taken) stacked in one
//      frame, one picture, each state's assertions scoped to its labelled region.
//   3. Interactions — no picture; one play walks every interaction and keeps every prop-contract
//      spy (args.onCreate/onRename/onSetKind/onDelete are fn() spies). This proves the wiring
//      survives a dependency bump; a getByText assertion alone would not.
// Plus two extra pictures for frames no composite shows: DeleteConfirmOpen (the open dialog) and
// MenuOpen (the open ⋯ menu itself — a distinct frame Interactions never rests on, since every step
// that opens it goes on to click a menu item).
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
    // Labels render as plain text (with rename behind the ⋯ menu) — not an always-open input.
    await expect(canvas.getByText('Setter')).toBeInTheDocument()
    await expect(canvas.getByText('Libero')).toBeInTheDocument()
    await expect(canvas.queryByLabelText('Label for Setter')).not.toBeInTheDocument()
    // One overflow-menu trigger per row, no inline Delete buttons.
    await expect(canvas.getAllByLabelText(/^Actions for /)).toHaveLength(2)
    await expect(canvas.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
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

// The ⋯ menu itself is a frame Interactions never rests on — every step that opens it goes on to
// click a menu item. Delete… carries the red destructive treatment (the row itself carries none).
export const MenuOpen: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Setter'))
    const menu = within(document.body)
    const deleteItem = await menu.findByRole('menuitem', { name: 'Delete…' })
    await expect(menu.getByRole('menuitem', { name: 'Rename' })).toBeInTheDocument()
    await expect(deleteItem).toHaveAttribute('data-tone', 'destructive')
  },
}

// The open-dialog frame (#264, #219): the populated blast-radius dialog is what an admin actually
// reads before a destructive action, and it is why that work exists at all. Opened and left open
// — none of the Interactions steps can picture it, because they confirm or cancel.
export const DeleteConfirmOpen: Story = {
  args: { usage: USAGE },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Setter'))
    const dialog = within(document.body)
    await userEvent.click(await dialog.findByRole('menuitem', { name: 'Delete…' }))
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

// Picture owned by Data, MenuOpen and DeleteConfirmOpen — behavioural only (ADR-0032 §1). Several
// instances because some steps need a state the default one is never in (an empty list to create
// into, a staff position to reclassify, a dialog with nothing / no answer yet to read).
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
    const portal = within(document.body)

    // The gesture is the flip itself — no Save to press, unlike a rename beside it.
    await userEvent.click(region('Positions').getByLabelText('Setter is staff'))
    await expect(args.onSetKind).toHaveBeenLastCalledWith('p1', 'STAFF')
    // Reclassifying is not one-way: an admin who marked the wrong position can put it back.
    await userEvent.click(region('Staff').getByLabelText('Trainer is staff'))
    await expect(args.onSetKind).toHaveBeenLastCalledWith('p3', 'PLAYING')

    await userEvent.type(region('Empty').getByLabelText('New position label'), 'Middle Blocker')
    await userEvent.click(region('Empty').getByRole('button', { name: 'Add' }))
    await expect(args.onCreate).toHaveBeenCalledWith('Middle Blocker')

    // Escape backs out of a rename without calling onRename — checked before the successful rename
    // below, since a spy's "not called" assertion must precede any step that calls it.
    await userEvent.click(region('Positions').getByLabelText('Actions for Libero'))
    await userEvent.click(await portal.findByRole('menuitem', { name: 'Rename' }))
    const liberoField = region('Positions').getByLabelText('Label for Libero')
    await userEvent.type(liberoField, ' extra{Escape}')
    await expect(region('Positions').queryByLabelText('Label for Libero')).not.toBeInTheDocument()
    await expect(region('Positions').getByText('Libero')).toBeInTheDocument()
    await expect(args.onRename).not.toHaveBeenCalled()

    // Rename lives behind the ⋯ menu and swaps the label for an inline input; Enter saves without a
    // mouse click on a Save button.
    await userEvent.click(region('Positions').getByLabelText('Actions for Setter'))
    await userEvent.click(await portal.findByRole('menuitem', { name: 'Rename' }))
    const field = region('Positions').getByLabelText('Label for Setter')
    await expect(field).toHaveValue('Setter')
    await userEvent.clear(field)
    await userEvent.type(field, 'Middle Blocker{Enter}')
    await expect(args.onRename).toHaveBeenCalledWith('p1', 'Middle Blocker')

    // Confirming the blast-radius dialog fires the delete and closes it. Reached via the ⋯ menu;
    // Delete… itself carries the red destructive treatment (MenuOpen carries that baseline).
    await userEvent.click(region('Positions').getByLabelText('Actions for Setter'))
    await userEvent.click(await portal.findByRole('menuitem', { name: 'Delete…' }))
    await expect(await portal.findByText(/3 members become Unassigned/)).toBeInTheDocument()
    await userEvent.click(portal.getByRole('button', { name: 'Delete' }))
    await expect(args.onDelete).toHaveBeenCalledWith(POSITIONS[0])

    // A position nothing uses reads as a clean removal rather than a list of three zeroes.
    await userEvent.click(region('Unused').getByLabelText('Actions for Setter'))
    await userEvent.click(await portal.findByRole('menuitem', { name: 'Delete…' }))
    await expect(await portal.findByText('Nothing currently uses this position.')).toBeInTheDocument()
    await userEvent.click(portal.getByRole('button', { name: 'Cancel' }))

    // The usage query is admin-only and fires when the dialog opens, so there is a moment with no
    // answer yet. It must not read as "nothing uses this".
    await userEvent.click(region('Usage loading').getByLabelText('Actions for Setter'))
    await userEvent.click(await portal.findByRole('menuitem', { name: 'Delete…' }))
    await expect(await portal.findByText('Checking what uses this position…')).toBeInTheDocument()
    await expect(portal.queryByText(/Nothing currently uses/)).not.toBeInTheDocument()
    await userEvent.click(portal.getByRole('button', { name: 'Cancel' }))
  },
}
