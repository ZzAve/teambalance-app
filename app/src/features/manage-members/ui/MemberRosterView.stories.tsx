import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Member } from '@shared/api/members'
import type { Position } from '@shared/api/positions'
import { MemberRosterView } from './MemberRosterView'

// MemberRosterView is the presentational admin roster behind the /members route container. It owns
// only local view state (per-row name edits + the remove-confirm dialog); the members/positions
// queries and the update/remove mutations stay in the container, so every state renders from props.
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter' },
  { id: 'p2', label: 'Libero' },
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
    await expect(canvas.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument()
  },
}

export const ErrorState: Story = {
  args: { isError: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Couldn't load members. Please try again.")).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument()
  },
}

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Display name for Ada Lovelace')).toHaveValue('Ada Lovelace')
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

export const ChangePosition: Story = {
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

export const RemoveConfirmOpen: Story = {
  play: async ({ canvas, userEvent }) => {
    // Alan Turing is the third row; his Remove button opens the confirm dialog (a portal).
    await userEvent.click(canvas.getAllByRole('button', { name: 'Remove' })[2])
    const dialog = within(document.body)
    await expect(await dialog.findByText(/Remove Alan Turing from the team/)).toBeInTheDocument()
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  },
}

// Prop-contract: editing a row's name surfaces its Save button; clicking it fires onRename with the
// member's id and the trimmed new name — proving the rename wiring survives a dependency bump.
export const RenameMember: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const field = canvas.getByLabelText('Display name for Grace Hopper')
    await userEvent.clear(field)
    await userEvent.type(field, 'Grace M. Hopper')
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(args.onRename).toHaveBeenCalledWith('u2', 'Grace M. Hopper')
  },
}

// Prop-contract: promoting/demoting reuses the update mutation — the first "Make member" (the first
// admin, Ada) fires onToggleRole with that member.
export const ToggleRole: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getAllByRole('button', { name: 'Make member' })[0])
    await expect(args.onToggleRole).toHaveBeenCalledWith(MEMBERS[0])
  },
}

// Prop-contract: a row Remove opens the confirm dialog (a portal); confirming there fires onRemove
// with the member. The row buttons go aria-hidden while the modal is open, so the dialog's Remove is
// unambiguous.
export const RemoveMember: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getAllByRole('button', { name: 'Remove' })[0])
    const dialog = within(document.body)
    await expect(await dialog.findByText(/Remove Ada Lovelace from the team/)).toBeInTheDocument()
    await userEvent.click(dialog.getByRole('button', { name: 'Remove' }))
    await expect(args.onRemove).toHaveBeenCalledWith(MEMBERS[0])
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
