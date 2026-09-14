import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Member } from '@shared/api/members'
import type { Position } from '@shared/api/positions'
import { MemberRosterView } from './MemberRosterView'

// MemberRosterView is the presentational admin roster behind the /members route container. It owns
// only local view state (per-row name edits + the remove-confirm dialog); the members/positions
// queries and the update/remove mutations stay in the container, so every state renders from props.
//
// One quiet row per member (issue #341, variant B): avatar, name as text with a pencil to rename it,
// the position picker inline, an ADMIN badge only on admins, and a single overflow (⋯) menu carrying
// promote/demote and the destructive remove.
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

export const Loading: Story = {
  args: { isLoading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Loading…')).toBeInTheDocument()
    // The roster is suppressed while the query is in flight — no rows yet.
    await expect(canvas.queryByLabelText('Actions for Ada Lovelace')).not.toBeInTheDocument()
  },
}

export const ErrorState: Story = {
  args: { isError: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Couldn't load members. Please try again.")).toBeInTheDocument()
    await expect(canvas.queryByLabelText('Actions for Ada Lovelace')).not.toBeInTheDocument()
  },
}

export const Default: Story = {
  play: async ({ canvas }) => {
    // Names render as plain text (with a pencil to rename) — not an always-open input.
    await expect(canvas.getByText('Ada Lovelace')).toBeInTheDocument()
    await expect(canvas.queryByLabelText('Display name for Ada Lovelace')).not.toBeInTheDocument()
    // Each row leads with the shared avatar (colour circle + initials), same as event details.
    await expect(canvas.getByText('GH')).toBeInTheDocument()
    // Only admins carry the Admin badge — there is no Member badge for the rest.
    await expect(canvas.getAllByText('Admin')).toHaveLength(2)
    await expect(canvas.queryByText('Member')).not.toBeInTheDocument()
    await expect(canvas.queryByText('USER')).not.toBeInTheDocument()
    // Every row has one overflow menu trigger and no inline promote/demote/remove buttons.
    await expect(canvas.getAllByLabelText(/^Actions for /)).toHaveLength(4)
    await expect(canvas.queryByRole('button', { name: 'Make member' })).not.toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument()
    // Each member row exposes a position picker showing their current position (or Unassigned).
    await expect(within(canvas.getByLabelText('Position for Ada Lovelace')).getByText('Setter')).toBeInTheDocument()
    await expect(
      within(canvas.getByLabelText('Position for Grace Hopper')).getByText('Unassigned'),
    ).toBeInTheDocument()
  },
}

export const ChangePosition: Story = {
  // Behavioural twin of Default — the controlled select closes back to the roster picture
  // (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByLabelText('Position for Grace Hopper'))
    const listbox = within(document.body)
    await userEvent.click(await listbox.findByRole('option', { name: 'Libero' }))
    await expect(args.onChangePosition).toHaveBeenCalledWith(MEMBERS[1], 'p2')
  },
}

export const NoPositionsDefined: Story = {
  args: { positions: [] },
  play: async ({ canvas }) => {
    // With no positions in the team, rows fall back to a plain Unassigned label (no picker).
    await expect(canvas.queryByLabelText('Position for Ada Lovelace')).not.toBeInTheDocument()
    await expect(canvas.getAllByText('Unassigned').length).toBeGreaterThan(0)
  },
}

// Prop-contract: Rename in the ⋯ menu swaps the name for an inline input; Enter saves without a mouse click.
export const RenameMember: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Grace Hopper'))
    await userEvent.click(await within(document.body).findByRole('menuitem', { name: 'Rename' }))
    const field = canvas.getByLabelText('Display name for Grace Hopper')
    await expect(field).toHaveValue('Grace Hopper')
    await userEvent.clear(field)
    await userEvent.type(field, 'Grace M. Hopper{Enter}')
    await expect(args.onRename).toHaveBeenCalledWith('u2', 'Grace M. Hopper')
  },
}

// Escape backs out of the rename without calling onRename.
export const RenameCancelledWithEscape: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Grace Hopper'))
    await userEvent.click(await within(document.body).findByRole('menuitem', { name: 'Rename' }))
    const field = canvas.getByLabelText('Display name for Grace Hopper')
    await userEvent.type(field, ' extra{Escape}')
    await expect(canvas.queryByLabelText('Display name for Grace Hopper')).not.toBeInTheDocument()
    await expect(canvas.getByText('Grace Hopper')).toBeInTheDocument()
    await expect(args.onRename).not.toHaveBeenCalled()
  },
}

// Prop-contract: the overflow menu's "Make member"/"Make admin" reuses the update mutation — opening
// the first admin's (Ada's) menu and picking it fires onToggleRole with that member.
export const ToggleRole: Story = {
  // Behavioural twin of Default — onToggleRole fires while the roster picture is unchanged
  // (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Ada Lovelace'))
    const menu = within(document.body)
    await userEvent.click(await menu.findByRole('menuitem', { name: 'Make member' }))
    await expect(args.onToggleRole).toHaveBeenCalledWith(MEMBERS[0])
  },
}

// Opening a row's menu shows Remove… as the last item, in the red destructive treatment — but the
// row itself carries no red.
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

// Prop-contract: "Remove…" in the menu opens the confirm dialog (a portal); confirming there fires
// onRemove with the member. Nothing fires before the confirm click.
export const RemoveMember: Story = {
  // Behavioural twin of Default — the confirm dialog closes on confirm and settles back to the
  // roster picture (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Ada Lovelace'))
    const menu = within(document.body)
    await userEvent.click(await menu.findByRole('menuitem', { name: 'Remove…' }))
    await expect(args.onRemove).not.toHaveBeenCalled()

    const dialog = within(document.body)
    await expect(await dialog.findByText(/Remove Ada Lovelace from the team/)).toBeInTheDocument()
    await userEvent.click(dialog.getByRole('button', { name: 'Remove' }))
    await expect(args.onRemove).toHaveBeenCalledWith(MEMBERS[0])
  },
}

export const RemoveConfirmOpen: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Alan Turing'))
    const menu = within(document.body)
    await userEvent.click(await menu.findByRole('menuitem', { name: 'Remove…' }))
    const dialog = within(document.body)
    await expect(await dialog.findByText(/Remove Alan Turing from the team/)).toBeInTheDocument()
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  },
}

// The member-facing (canManage: false) roster: every authenticated member sees the roster read-only.
// Names and positions render as plain text, the role/admin badge is shown to everyone, and none of
// the admin controls (rename, position picker, overflow menu) are present.
export const ReadOnly: Story = {
  args: { canManage: false },
  play: async ({ canvas }) => {
    // The shared avatar (colour circle + initials) leads read-only rows too.
    await expect(canvas.getByText('AL')).toBeInTheDocument()
    // Names and positions are plain text — no rename control, no position picker.
    await expect(canvas.getByText('Ada Lovelace')).toBeInTheDocument()
    await expect(canvas.getByText('Libero')).toBeInTheDocument()
    await expect(canvas.queryByLabelText('Actions for Ada Lovelace')).not.toBeInTheDocument()
    await expect(canvas.queryByLabelText('Position for Alan Turing')).not.toBeInTheDocument()
    // The role/admin badge stays visible to everyone.
    await expect(canvas.getAllByText('Admin')).toHaveLength(2)
    await expect(canvas.getAllByText('Member')).toHaveLength(2)
    // None of the admin actions render.
    await expect(canvas.queryByLabelText(/^Actions for /)).not.toBeInTheDocument()
  },
}

// The zero-member state (ADR-0024 §5): a team a Platform Admin created memberless and is preparing
// under act-as, before its first Admin accepts the handover link. The admin view points at the invite
// link rather than showing an empty box.
export const EmptyManaged: Story = {
  args: { members: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No members yet. Share an invite link to bring people in.')).toBeInTheDocument()
    // No roster rows and no per-row controls when there is nobody on the roster.
    await expect(canvas.queryByLabelText(/^Actions for /)).not.toBeInTheDocument()
  },
}

// The same zero-member team as a plain viewer would see it: just that the roster is empty, with no
// invite prompt (they can't act on it).
export const EmptyReadOnly: Story = {
  args: { members: [], canManage: false },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No members yet.')).toBeInTheDocument()
    await expect(
      canvas.queryByText('No members yet. Share an invite link to bring people in.'),
    ).not.toBeInTheDocument()
  },
}

export const LastAdminRefused: Story = {
  args: {
    members: [
      { userId: 'u1', displayName: 'Ada Lovelace', role: 'ADMIN', position: undefined, onboarded: true },
      { userId: 'u3', displayName: 'Alan Turing', role: 'USER', position: undefined, onboarded: true },
    ],
    errorMessage: 'A team must keep at least one admin.',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('A team must keep at least one admin.')
  },
}

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

export const LongRosterWithLongNames: Story = {
  args: { members: MANY_MEMBERS },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByLabelText(/^Actions for /)).toHaveLength(15)
    const firstRow = canvas.getByText(LONG_NAMES[0])
    await expect(firstRow).toHaveAttribute('title', LONG_NAMES[0])
    // truncate + min-w-0 keep the long name from wrapping the row onto a second line.
    await expect(firstRow.className).toContain('truncate')
  },
}
