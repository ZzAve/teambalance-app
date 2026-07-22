import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Member } from '@shared/api/members'
import { MemberRosterView } from './MemberRosterView'

// MemberRosterView is the presentational admin roster behind the /members route container. It owns
// only local view state (per-row name edits + the remove-confirm dialog); the members query and the
// update/remove mutations stay in the container, so every state renders purely from props.
const MEMBERS: Member[] = [
  { userId: 'u1', displayName: 'Ada Lovelace', role: 'ADMIN' },
  { userId: 'u2', displayName: 'Grace Hopper', role: 'ADMIN' },
  { userId: 'u3', displayName: 'Alan Turing', role: 'USER' },
  { userId: 'u4', displayName: 'Katherine Johnson', role: 'USER' },
]

const meta = {
  title: 'features/manage-members/MemberRosterView',
  component: MemberRosterView,
  args: { members: MEMBERS, onRename: fn(), onToggleRole: fn(), onRemove: fn() },
} satisfies Meta<typeof MemberRosterView>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Display name for Ada Lovelace')).toHaveValue('Ada Lovelace')
    // Two admins can be demoted, two users can be promoted.
    await expect(canvas.getAllByRole('button', { name: 'Make member' })).toHaveLength(2)
    await expect(canvas.getAllByRole('button', { name: 'Make admin' })).toHaveLength(2)
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

export const LastAdminRefused: Story = {
  args: {
    members: [
      { userId: 'u1', displayName: 'Ada Lovelace', role: 'ADMIN' },
      { userId: 'u3', displayName: 'Alan Turing', role: 'USER' },
    ],
    errorMessage: 'A team must keep at least one admin.',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('A team must keep at least one admin.')
  },
}
