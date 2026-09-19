import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Member } from '@shared/api/members'
import type { Position } from '@shared/api/positions'
import { Stack } from '@shared/testing/stack'
import { MemberRosterView } from './MemberRosterView'

// MemberRosterView is the presentational admin roster behind the /members route container. It owns
// only local view state (per-row name edits + the remove-confirm dialog); the members/positions
// queries and the update/remove mutations stay in the container, so every state renders from props.
//
// One quiet row per member (issue #341, variant B): avatar, name as read-only text, the position
// picker inline since it's the common edit, an Admin badge only on admins, and a single overflow (⋯)
// menu carrying the rarer actions (Rename, promote/demote, the destructive Remove…).
//
// Three-story shape (ADR-0032 §1, §3): the read-only roster (canManage: false) is what
// pages/team/TeamPageView already pictures, so it lives here only as a behavioural shell, not a
// second Data snapshot. The editable roster (canManage: true, the default args) is not shown by any
// composite, so it keeps Data's picture.
//   1. Data — the one populated editable instance, and the picture of this View.
//   2. Shells — every other state (load / error / no positions configured / the read-only rows /
//      both zero-member variants / the last-admin refusal / a long roster of long names) stacked in
//      one frame, each state's assertions scoped to its labelled region.
//   3. Interactions — no picture; one play walks every editable-row interaction reached through the
//      ⋯ menu (rename, escape-cancel a rename, change a position, toggle role, remove) and keeps
//      every onRename/onToggleRole/onChangePosition/onRemove spy assertion.
// Plus two extra pictures for frames no composite shows: RemoveConfirmOpen (the open dialog) and
// MenuOpen (the open ⋯ menu itself — a different frame from RemoveConfirmOpen, whose final picture
// is the dialog, not the menu that opened it).
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter', kind: 'PLAYING' },
  { id: 'p2', label: 'Libero', kind: 'PLAYING' },
]

const MEMBERS: Member[] = [
  { userId: 'u1', displayName: 'Ada Lovelace', role: 'ADMIN', position: POSITIONS[0], onboarded: true },
  { userId: 'u2', displayName: 'Grace Hopper', role: 'ADMIN', position: undefined, onboarded: true },
  { userId: 'u3', displayName: 'Alan Turing', role: 'USER', position: POSITIONS[1], onboarded: true },
  { userId: 'u4', displayName: 'Katherine Johnson', role: 'USER', position: undefined, onboarded: true },
]

// The row stays one line even at 390px with a long, real-world name — the name wins over the picker
// (a fixed compact width) and truncates with a title attribute rather than wrapping or pushing the
// menu off-row. Fifteen members also proves nothing about the row shape breaks down a longer list.
const LONG_NAMES = [
  'Christopher Vandenbroucke-Janssen',
  'Anastasia Konstantinopoulos',
  'Bartholomew Fitzwilliam-Harrington',
  'Guadalupe Hernández-Villanueva',
  'Maximilian Oosterhuis-van der Berg',
]

const MANY_MEMBERS: Member[] = Array.from({ length: 15 }, (_, i) => ({
  userId: `m${i}`,
  displayName: LONG_NAMES[i % LONG_NAMES.length] + (i >= LONG_NAMES.length ? ` ${i}` : ''),
  role: i === 0 ? 'ADMIN' : 'USER',
  position: POSITIONS[i % POSITIONS.length],
  onboarded: true,
}))

const meta = {
  title: 'features/manage-members/MemberRosterView',
  component: MemberRosterView,
  args: {
    canManage: true,
    members: MEMBERS,
    positions: POSITIONS,
    onRename: fn(),
    onToggleRole: fn(),
    onChangePosition: fn(),
    onRemove: fn(),
  },
} satisfies Meta<typeof MemberRosterView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    // Names render as plain text (Rename in the ⋯ menu reveals an inline field) — not an
    // always-open input.
    await expect(canvas.getByText('Ada Lovelace')).toBeInTheDocument()
    await expect(canvas.queryByLabelText('Display name for Ada Lovelace')).not.toBeInTheDocument()
    // Each row leads with the shared avatar (colour circle + initials), same as event details.
    await expect(canvas.getByText('GH')).toBeInTheDocument()
    // Only admins carry the Admin badge — there is no Member badge for the rest.
    await expect(canvas.getAllByText('Admin')).toHaveLength(2)
    await expect(canvas.queryByText('Member')).not.toBeInTheDocument()
    await expect(canvas.queryByText('USER')).not.toBeInTheDocument()
    // Every row has one overflow menu trigger and no inline promote/demote/remove buttons — those
    // rarer actions moved into the menu (#341).
    await expect(canvas.getAllByLabelText(/^Actions for /)).toHaveLength(4)
    await expect(canvas.queryByRole('button', { name: 'Make member' })).not.toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Make admin' })).not.toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument()
    // Each member row exposes a position picker showing their current position (or Unassigned).
    await expect(within(canvas.getByLabelText('Position for Ada Lovelace')).getByText('Setter')).toBeInTheDocument()
    await expect(
      within(canvas.getByLabelText('Position for Grace Hopper')).getByText('Unassigned'),
    ).toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <MemberRosterView {...args} isLoading />,
        Error: <MemberRosterView {...args} isError />,
        // With no positions in the team, rows fall back to a plain Unassigned label (no picker).
        'No positions': <MemberRosterView {...args} positions={[]} />,
        // The member-facing (canManage: false) roster: every authenticated member sees the roster
        // read-only. Names and positions render as plain text, the role/admin badge is shown to
        // everyone, and none of the admin controls (rename, position picker, overflow menu) render.
        'Read only': <MemberRosterView {...args} canManage={false} />,
        // A team a Platform Admin created memberless and is preparing under act-as, before its first
        // Admin accepts the handover link (ADR-0024 §5). The admin view points at the invite link
        // rather than showing an empty box.
        'Empty (admin)': <MemberRosterView {...args} members={[]} />,
        // The same zero-member team as a plain viewer would see it: just that the roster is empty,
        // with no invite prompt (they can't act on it).
        'Empty (read-only)': <MemberRosterView {...args} members={[]} canManage={false} />,
        'Last admin refused': (
          <MemberRosterView
            {...args}
            members={[
              { userId: 'u1', displayName: 'Ada Lovelace', role: 'ADMIN', position: undefined, onboarded: true },
              { userId: 'u3', displayName: 'Alan Turing', role: 'USER', position: undefined, onboarded: true },
            ]}
            errorMessage="A team must keep at least one admin."
          />
        ),
        // Fifteen rows, five real-world long names repeated (#341): the row shape (name truncates,
        // picker keeps its width, the menu trigger stays put) holds up past the four-member fixture.
        'Long roster, long names': <MemberRosterView {...args} members={MANY_MEMBERS} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    // The roster is suppressed while the query is in flight — no rows yet.
    await expect(region('Loading').queryByLabelText('Actions for Ada Lovelace')).not.toBeInTheDocument()

    await expect(
      region('Error').getByText("Couldn't load members. Please try again."),
    ).toBeInTheDocument()
    await expect(region('Error').queryByLabelText('Actions for Ada Lovelace')).not.toBeInTheDocument()

    await expect(
      region('No positions').queryByLabelText('Position for Ada Lovelace'),
    ).not.toBeInTheDocument()
    await expect(region('No positions').getAllByText('Unassigned').length).toBeGreaterThan(0)

    // The shared avatar (colour circle + initials) leads read-only rows too.
    await expect(region('Read only').getByText('AL')).toBeInTheDocument()
    // Names and positions are plain text — no rename control, no position picker.
    await expect(region('Read only').getByText('Ada Lovelace')).toBeInTheDocument()
    await expect(region('Read only').getByText('Libero')).toBeInTheDocument()
    await expect(
      region('Read only').queryByLabelText('Actions for Ada Lovelace'),
    ).not.toBeInTheDocument()
    await expect(
      region('Read only').queryByLabelText('Position for Alan Turing'),
    ).not.toBeInTheDocument()
    // The role/admin badge stays visible to everyone, sentence case ("Admin"/"Member" — no more
    // "ADMIN"/"USER").
    await expect(region('Read only').getAllByText('Admin')).toHaveLength(2)
    await expect(region('Read only').getAllByText('Member')).toHaveLength(2)
    // None of the admin actions render — no overflow menu at all on a read-only row.
    await expect(
      region('Read only').queryByLabelText(/^Actions for /),
    ).not.toBeInTheDocument()

    await expect(
      region('Empty (admin)').getByText('No members yet. Share an invite link to bring people in.'),
    ).toBeInTheDocument()
    // No roster rows and no per-row controls when there is nobody on the roster.
    await expect(
      region('Empty (admin)').queryByLabelText(/^Actions for /),
    ).not.toBeInTheDocument()

    await expect(region('Empty (read-only)').getByText('No members yet.')).toBeInTheDocument()
    await expect(
      region('Empty (read-only)').queryByText('No members yet. Share an invite link to bring people in.'),
    ).not.toBeInTheDocument()

    await expect(
      region('Last admin refused').getByRole('alert'),
    ).toHaveTextContent('A team must keep at least one admin.')

    const longRoster = region('Long roster, long names')
    await expect(longRoster.getAllByLabelText(/^Actions for /)).toHaveLength(15)
    const firstRow = longRoster.getByText(LONG_NAMES[0])
    await expect(firstRow).toHaveAttribute('title', LONG_NAMES[0])
    // truncate + min-w-0 keep the long name from wrapping the row onto a second line.
    await expect(firstRow.className).toContain('truncate')
  },
}

// The open-dialog frame: the populated confirm dialog is what an admin actually reads before a
// destructive action. Opened and left open — Interactions below confirms it, so this is the only
// place the dialog carries a baseline (ADR-0027 §2).
export const RemoveConfirmOpen: Story = {
  play: async ({ canvas, userEvent }) => {
    // Alan Turing is the third row; opening his ⋯ menu and choosing Remove… opens the confirm
    // dialog (a portal).
    await userEvent.click(canvas.getByLabelText('Actions for Alan Turing'))
    const menu = within(document.body)
    await userEvent.click(await menu.findByRole('menuitem', { name: 'Remove…' }))
    const dialog = within(document.body)
    await expect(await dialog.findByText(/Remove Alan Turing from the team/)).toBeInTheDocument()
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  },
}

// The open ⋯ menu itself (#341) — a different frame from RemoveConfirmOpen, whose own final picture
// is the confirm dialog, not the menu that opened it. Shows Remove… as the last item in the red
// destructive treatment, while the row it belongs to carries no red.
export const MenuOpen: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Alan Turing'))
    const menu = within(document.body)
    await expect(await menu.findByRole('menuitem', { name: 'Make admin' })).toBeInTheDocument()
    const removeItem = menu.getByRole('menuitem', { name: 'Remove…' })
    await expect(removeItem).toBeInTheDocument()
    await expect(removeItem).toHaveAttribute('data-tone', 'destructive')
  },
}

// Picture owned by Data, Shells, RemoveConfirmOpen and MenuOpen — behavioural only (ADR-0032 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    const portal = within(document.body)

    // Escape backs out of a rename without calling onRename: Rename in the ⋯ menu swaps the name
    // for an inline field, and Escape cancels it and puts the row back exactly where it was. Asserted
    // first, before onRename is ever called for real below.
    await userEvent.click(canvas.getByLabelText('Actions for Grace Hopper'))
    await userEvent.click(await portal.findByRole('menuitem', { name: 'Rename' }))
    const cancelledField = canvas.getByLabelText('Display name for Grace Hopper')
    await userEvent.type(cancelledField, ' extra{Escape}')
    await expect(canvas.queryByLabelText('Display name for Grace Hopper')).not.toBeInTheDocument()
    await expect(canvas.getByText('Grace Hopper')).toBeInTheDocument()
    await expect(args.onRename).not.toHaveBeenCalled()

    // Prop-contract: changing a row's position reuses the position picker; picking Libero for
    // Grace Hopper fires onChangePosition with her member and the chosen position id.
    await userEvent.click(canvas.getByLabelText('Position for Grace Hopper'))
    await userEvent.click(await portal.findByRole('option', { name: 'Libero' }))
    await expect(args.onChangePosition).toHaveBeenCalledWith(MEMBERS[1], 'p2')

    // Prop-contract: Rename in the ⋯ menu swaps the name for an inline input, pre-filled with the
    // current name; clicking Save fires onRename with the member's id and the trimmed new name —
    // proving the rename wiring survives a dependency bump.
    await userEvent.click(canvas.getByLabelText('Actions for Grace Hopper'))
    await userEvent.click(await portal.findByRole('menuitem', { name: 'Rename' }))
    const field = canvas.getByLabelText('Display name for Grace Hopper')
    await expect(field).toHaveValue('Grace Hopper')
    await userEvent.clear(field)
    await userEvent.type(field, 'Grace M. Hopper')
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(args.onRename).toHaveBeenCalledWith('u2', 'Grace M. Hopper')

    // Prop-contract: the overflow menu's "Make member"/"Make admin" reuses the update mutation —
    // opening the first admin's (Ada's) menu and picking it fires onToggleRole with that member.
    await userEvent.click(canvas.getByLabelText('Actions for Ada Lovelace'))
    await userEvent.click(await portal.findByRole('menuitem', { name: 'Make member' }))
    await expect(args.onToggleRole).toHaveBeenCalledWith(MEMBERS[0])

    // Prop-contract: "Remove…" in the menu opens the confirm dialog (a portal); nothing fires before
    // the confirm click, and confirming there fires onRemove with the member. The row buttons go
    // aria-hidden while the modal is open, so the dialog's Remove is unambiguous.
    await userEvent.click(canvas.getByLabelText('Actions for Ada Lovelace'))
    await userEvent.click(await portal.findByRole('menuitem', { name: 'Remove…' }))
    await expect(args.onRemove).not.toHaveBeenCalled()
    await expect(await portal.findByText(/Remove Ada Lovelace from the team/)).toBeInTheDocument()
    await userEvent.click(portal.getByRole('button', { name: 'Remove' }))
    await expect(args.onRemove).toHaveBeenCalledWith(MEMBERS[0])
  },
}
