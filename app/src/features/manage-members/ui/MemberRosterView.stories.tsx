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
// Three-story shape (ADR-0031 §1, §3): the read-only roster (canManage: false) is what
// pages/team/TeamPageView already pictures, so it lives here only as a behavioural shell, not a
// second Data snapshot. The editable roster (canManage: true, the default args) is not shown by any
// composite, so it keeps Data's picture.
//   1. Data — the one populated editable instance, and the picture of this View.
//   2. Shells — every other state (load / error / no positions configured / the read-only rows /
//      both zero-member variants / the last-admin refusal) stacked in one frame, each state's
//      assertions scoped to its labelled region.
//   3. Interactions — no picture; one play walks every editable-row interaction (change a position,
//      rename, toggle role, remove) and keeps every onChangePosition/onRename/onToggleRole/onRemove
//      spy assertion.
// Plus one extra picture, RemoveConfirmOpen, for the frame no composite shows: the open dialog.
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

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Display name for Ada Lovelace')).toHaveValue('Ada Lovelace')
    // Each row leads with the shared avatar (colour circle + initials), same as event details.
    await expect(canvas.getByText('GH')).toBeInTheDocument()
    // Two admins can be demoted, two users can be promoted.
    await expect(canvas.getAllByRole('button', { name: 'Make member' })).toHaveLength(2)
    await expect(canvas.getAllByRole('button', { name: 'Make admin' })).toHaveLength(2)
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
        // everyone, and none of the admin controls (rename input, position picker, promote/demote,
        // remove) are present.
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
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    // The roster is suppressed while the query is in flight — no rows yet.
    await expect(region('Loading').queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument()

    await expect(
      region('Error').getByText("Couldn't load members. Please try again."),
    ).toBeInTheDocument()
    await expect(region('Error').queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument()

    await expect(
      region('No positions').queryByLabelText('Position for Ada Lovelace'),
    ).not.toBeInTheDocument()
    await expect(region('No positions').getAllByText('Unassigned').length).toBeGreaterThan(0)

    // The shared avatar (colour circle + initials) leads read-only rows too.
    await expect(region('Read only').getByText('AL')).toBeInTheDocument()
    // Names and positions are plain text — no rename input, no position picker.
    await expect(region('Read only').getByText('Ada Lovelace')).toBeInTheDocument()
    await expect(region('Read only').getByText('Libero')).toBeInTheDocument()
    await expect(
      region('Read only').queryByLabelText('Display name for Ada Lovelace'),
    ).not.toBeInTheDocument()
    await expect(
      region('Read only').queryByLabelText('Position for Alan Turing'),
    ).not.toBeInTheDocument()
    // The role/admin badge stays visible to everyone.
    await expect(region('Read only').getAllByText('ADMIN')).toHaveLength(2)
    await expect(region('Read only').getAllByText('USER')).toHaveLength(2)
    // None of the admin actions render.
    await expect(region('Read only').queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
    await expect(
      region('Read only').queryByRole('button', { name: 'Make member' }),
    ).not.toBeInTheDocument()
    await expect(
      region('Read only').queryByRole('button', { name: 'Make admin' }),
    ).not.toBeInTheDocument()
    await expect(region('Read only').queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument()

    await expect(
      region('Empty (admin)').getByText('No members yet. Share an invite link to bring people in.'),
    ).toBeInTheDocument()
    // No roster rows and no per-row controls when there is nobody on the roster.
    await expect(
      region('Empty (admin)').queryByRole('button', { name: 'Remove' }),
    ).not.toBeInTheDocument()

    await expect(region('Empty (read-only)').getByText('No members yet.')).toBeInTheDocument()
    await expect(
      region('Empty (read-only)').queryByText('No members yet. Share an invite link to bring people in.'),
    ).not.toBeInTheDocument()

    await expect(
      region('Last admin refused').getByRole('alert'),
    ).toHaveTextContent('A team must keep at least one admin.')
  },
}

// The open-dialog frame: the populated confirm dialog is what an admin actually reads before a
// destructive action. Opened and left open — Interactions below confirms it, so this is the only
// place the dialog carries a baseline (ADR-0027 §2).
export const RemoveConfirmOpen: Story = {
  play: async ({ canvas, userEvent }) => {
    // Alan Turing is the third row; his Remove button opens the confirm dialog (a portal).
    await userEvent.click(canvas.getAllByRole('button', { name: 'Remove' })[2])
    const dialog = within(document.body)
    await expect(await dialog.findByText(/Remove Alan Turing from the team/)).toBeInTheDocument()
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  },
}

// Picture owned by Data, Shells and RemoveConfirmOpen — behavioural only (ADR-0031 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    const portal = within(document.body)

    // Prop-contract: changing a row's position reuses the position picker; picking Libero for
    // Grace Hopper fires onChangePosition with her member and the chosen position id.
    await userEvent.click(canvas.getByLabelText('Position for Grace Hopper'))
    await userEvent.click(await portal.findByRole('option', { name: 'Libero' }))
    await expect(args.onChangePosition).toHaveBeenCalledWith(MEMBERS[1], 'p2')

    // Prop-contract: editing a row's name surfaces its Save button; clicking it fires onRename with
    // the member's id and the trimmed new name — proving the rename wiring survives a dependency
    // bump.
    const field = canvas.getByLabelText('Display name for Grace Hopper')
    await userEvent.clear(field)
    await userEvent.type(field, 'Grace M. Hopper')
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(args.onRename).toHaveBeenCalledWith('u2', 'Grace M. Hopper')

    // Prop-contract: promoting/demoting reuses the update mutation — the first "Make member" (the
    // first admin, Ada) fires onToggleRole with that member.
    await userEvent.click(canvas.getAllByRole('button', { name: 'Make member' })[0])
    await expect(args.onToggleRole).toHaveBeenCalledWith(MEMBERS[0])

    // Prop-contract: a row Remove opens the confirm dialog (a portal); confirming there fires
    // onRemove with the member. The row buttons go aria-hidden while the modal is open, so the
    // dialog's Remove is unambiguous.
    await userEvent.click(canvas.getAllByRole('button', { name: 'Remove' })[0])
    await expect(await portal.findByText(/Remove Ada Lovelace from the team/)).toBeInTheDocument()
    await userEvent.click(portal.getByRole('button', { name: 'Remove' }))
    await expect(args.onRemove).toHaveBeenCalledWith(MEMBERS[0])
  },
}
