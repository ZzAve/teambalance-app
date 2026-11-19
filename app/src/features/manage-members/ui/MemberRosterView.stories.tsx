import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import type { Member } from '@shared/api/members'
import type { Position } from '@shared/api/positions'
import { Stack } from '@shared/testing/stack'
import { withRouter } from '@shared/testing/router-decorator'
import { MemberRosterView } from './MemberRosterView'

// MemberRosterView is the Team's Roster as a grid of faces (ADR-0038). The populated grid is what
// pages/team/TeamPageView pictures, so this file keeps only the states that composite can't show
// (ADR-0032): loading, error and an empty roster, plus the face order as a behavioural region.
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter', kind: 'PLAYING' },
  { id: 'p2', label: 'Libero', kind: 'PLAYING' },
]

const MEMBERS: Member[] = [
  { userId: 'u1', displayName: 'Ada Lovelace', role: 'ADMIN', position: POSITIONS[0], onboarded: true, shirtNumber: 12, photoVersion: undefined },
  { userId: 'u2', displayName: 'Grace Hopper', role: 'ADMIN', position: undefined, onboarded: true, shirtNumber: undefined, photoVersion: undefined },
  { userId: 'u3', displayName: 'Alan Turing', role: 'USER', position: POSITIONS[1], onboarded: true, shirtNumber: 1, photoVersion: undefined },
  { userId: 'u4', displayName: 'Katherine Johnson', role: 'USER', position: undefined, onboarded: true, shirtNumber: 112, photoVersion: undefined },
]

const meta = {
  title: 'features/manage-members/MemberRosterView',
  component: MemberRosterView,
  // Each face links to the member's page, built from the Team in the URL.
  decorators: [withRouter],
  parameters: { router: { initialEntries: ['/t/setpoint-vt/team'] } },
  args: { members: MEMBERS },
} satisfies Meta<typeof MemberRosterView>

export default meta

type Story = StoryObj<typeof meta>

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <MemberRosterView {...args} members={undefined} isLoading />,
        Error: <MemberRosterView {...args} members={undefined} isError />,
        // A memberless team, until its first Admin accepts the handover link (ADR-0024 §5).
        Empty: <MemberRosterView {...args} members={[]} />,
        // Behavioural only: TeamPageView's Data owns the picture of the populated grid.
        Faces: <MemberRosterView {...args} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    await expect(region('Error').getByText(/couldn't load members/i)).toBeInTheDocument()
    await expect(region('Empty').getByText('No members yet.')).toBeInTheDocument()

    // Faces ordered by Shirt Number, members without one last.
    const faces = region('Faces').getAllByRole('link')
    await expect(faces.map((a) => a.getAttribute('aria-label'))).toEqual([
      'Alan Turing',
      'Ada Lovelace',
      'Katherine Johnson',
      'Grace Hopper',
    ])
    await expect(region('Faces').getByRole('link', { name: 'Ada Lovelace' })).toHaveAttribute('href', '/t/setpoint-vt/team/u1')
    await expect(region('Faces').getByLabelText('Shirt number 112')).toBeInTheDocument()
    // The shared avatar (colour circle + initials) carries the face.
    await expect(region('Faces').getByText('AL')).toBeInTheDocument()
  },
}
