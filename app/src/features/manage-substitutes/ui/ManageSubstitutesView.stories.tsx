import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Position } from '@entities/position/api/positions'
import type { Substitute } from '@entities/substitute/api/substitutes'
import { Stack } from '@shared/testing/stack'
import { ManageSubstitutesView } from './ManageSubstitutesView'

// ManageSubstitutesView is the Team's list of Substitutes (ADR-0033): editable for Admins on
// /team/settings, read-only for everyone on /team. It owns only local view state (the inline rename
// field and the remove-confirm target); the query and mutations stay in the ManageSubstitutes
// container, so every state renders from props.
//
// Three-story shape (ADR-0032): the read-only list is what pages/team/TeamPageView pictures, so it
// lives here only as a behavioural shell; the editable list is shown by no composite and keeps Data's
// picture.
//   1. Data — the editable list, and the picture of this View.
//   2. Shells — every other state stacked in one frame, each asserted in its labelled region,
//      including a row left mid-rename.
//   3. Interactions — no picture; one play drives rename, change Position and remove-with-confirm.
// Plus RemoveConfirmOpen, the open dialog, as on MemberRosterView: a portal, so it cannot ride in
// Shells without covering the other cases.
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter', kind: 'PLAYING' },
  { id: 'p2', label: 'Libero', kind: 'PLAYING' },
]

const SUBSTITUTES: Substitute[] = [
  { id: 's1', name: 'Jan de Vries', position: { id: 'p2', label: 'Libero' } },
  { id: 's2', name: 'Sam Bakker', position: undefined },
]

const meta = {
  title: 'features/manage-substitutes/ManageSubstitutesView',
  component: ManageSubstitutesView,
  args: {
    canManage: true,
    substitutes: SUBSTITUTES,
    positions: POSITIONS,
    onConfirmTargetChange: fn(),
    onRename: fn(),
    onChangePosition: fn(),
    onRemove: fn(),
  },
} satisfies Meta<typeof ManageSubstitutesView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Substitutes' })).toBeInTheDocument()
    await expect(canvas.getByText('Jan de Vries')).toBeInTheDocument()
    // The rename field only appears once Rename is picked from the row's menu.
    await expect(canvas.queryByLabelText('Name for Jan de Vries')).not.toBeInTheDocument()
    await expect(canvas.getAllByLabelText(/^Actions for /)).toHaveLength(2)
    // The Position picker is inline, as on the Member roster: the common edit.
    await expect(within(canvas.getByLabelText('Position for Jan de Vries')).getByText('Libero')).toBeInTheDocument()
    await expect(within(canvas.getByLabelText('Position for Sam Bakker')).getByText('Unassigned')).toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <ManageSubstitutesView {...args} substitutes={undefined} isLoading />,
        Error: <ManageSubstitutesView {...args} substitutes={undefined} isError />,
        'Empty (admin)': <ManageSubstitutesView {...args} substitutes={[]} />,
        'Empty (read-only)': <ManageSubstitutesView {...args} substitutes={[]} canManage={false} />,
        // Everyone sees the list on /team; only Admins can change it.
        'Read only': <ManageSubstitutesView {...args} canManage={false} />,
        // With no Positions in the team, rows fall back to a plain Unassigned label (no picker).
        'No positions': <ManageSubstitutesView {...args} positions={[]} />,
        'Name taken': <ManageSubstitutesView {...args} errorMessage="Sam Bakker is already on the list." />,
        // Rename picked from the row's menu: the name becomes a field. Opened by the play and left open.
        Renaming: <ManageSubstitutesView {...args} />,
      }}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    await expect(region('Loading').queryByText('Jan de Vries')).not.toBeInTheDocument()

    await expect(region('Error').getByText("Couldn't load substitutes. Please try again.")).toBeInTheDocument()

    await expect(
      region('Empty (admin)').getByText('No substitutes yet. Members add them when calling someone in for an event.'),
    ).toBeInTheDocument()
    await expect(region('Empty (read-only)').getByText('No substitutes yet.')).toBeInTheDocument()

    await expect(region('Read only').getByText('Jan de Vries')).toBeInTheDocument()
    await expect(region('Read only').getByText('Libero')).toBeInTheDocument()
    await expect(region('Read only').queryByLabelText(/^Actions for /)).not.toBeInTheDocument()
    await expect(region('Read only').queryByLabelText(/^Position for /)).not.toBeInTheDocument()

    await expect(region('No positions').queryByLabelText(/^Position for /)).not.toBeInTheDocument()
    await expect(region('No positions').getByText('Unassigned')).toBeInTheDocument()

    await expect(region('Name taken').getByRole('alert')).toHaveTextContent('Sam Bakker is already on the list.')

    await userEvent.click(region('Renaming').getByLabelText('Actions for Jan de Vries'))
    await userEvent.click(await within(document.body).findByRole('menuitem', { name: 'Rename' }))
    await expect(region('Renaming').getByLabelText('Name for Jan de Vries')).toHaveValue('Jan de Vries')
    await expect(region('Renaming').getByRole('button', { name: 'Save' })).toBeInTheDocument()
  },
}

// The open-dialog frame: what an admin reads before a removal that reaches past Events. Opened and
// left open; Interactions confirms it, so this is the only place the dialog carries a baseline.
export const RemoveConfirmOpen: Story = {
  args: { eventCount: 4 },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Jan de Vries'))
    await userEvent.click(await within(document.body).findByRole('menuitem', { name: 'Remove…' }))
    const dialog = within(await within(document.body).findByRole('dialog'))
    await expect(dialog.getByText('Jan de Vries is on 4 events.')).toBeInTheDocument()
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  },
}

// Picture owned by Data, Shells and RemoveConfirmOpen — behavioural only (ADR-0032 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  args: { eventCount: 4 },
  play: async ({ canvas, userEvent, args }) => {
    const portal = within(document.body)

    // Escape backs out of a rename without saving.
    await userEvent.click(canvas.getByLabelText('Actions for Jan de Vries'))
    await userEvent.click(await portal.findByRole('menuitem', { name: 'Rename' }))
    await userEvent.type(canvas.getByLabelText('Name for Jan de Vries'), ' extra{Escape}')
    await expect(canvas.queryByLabelText('Name for Jan de Vries')).not.toBeInTheDocument()
    await expect(args.onRename).not.toHaveBeenCalled()

    // Rename: the field starts at the current name and saves the trimmed new one.
    await userEvent.click(canvas.getByLabelText('Actions for Jan de Vries'))
    await userEvent.click(await portal.findByRole('menuitem', { name: 'Rename' }))
    const field = canvas.getByLabelText('Name for Jan de Vries')
    await expect(field).toHaveValue('Jan de Vries')
    await userEvent.clear(field)
    await userEvent.type(field, '  Jan Visser  ')
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(args.onRename).toHaveBeenCalledWith(SUBSTITUTES[0], 'Jan Visser')

    // Change Position: set one, and clear one back to Unassigned.
    await userEvent.click(canvas.getByLabelText('Position for Sam Bakker'))
    await userEvent.click(await portal.findByRole('option', { name: 'Setter' }))
    await expect(args.onChangePosition).toHaveBeenCalledWith(SUBSTITUTES[1], 'p1')
    await userEvent.click(canvas.getByLabelText('Position for Jan de Vries'))
    await userEvent.click(await portal.findByRole('option', { name: 'Unassigned' }))
    await expect(args.onChangePosition).toHaveBeenCalledWith(SUBSTITUTES[0], null)

    // Remove: the dialog asks the container for the count, warns about past Events, and only the
    // confirm click removes.
    await userEvent.click(canvas.getByLabelText('Actions for Jan de Vries'))
    await userEvent.click(await portal.findByRole('menuitem', { name: 'Remove…' }))
    await expect(args.onConfirmTargetChange).toHaveBeenCalledWith(SUBSTITUTES[0])
    const dialog = within(await portal.findByRole('dialog'))
    await expect(dialog.getByText('Jan de Vries is on 4 events.')).toBeInTheDocument()
    await expect(
      dialog.getByText(
        "Jan de Vries will disappear from every event they were added to, including past ones. This can't be undone.",
      ),
    ).toBeInTheDocument()
    await expect(args.onRemove).not.toHaveBeenCalled()
    await userEvent.click(dialog.getByRole('button', { name: 'Remove' }))
    await expect(args.onRemove).toHaveBeenCalledWith(SUBSTITUTES[0])
    await expect(args.onConfirmTargetChange).toHaveBeenLastCalledWith(null)
  },
}
