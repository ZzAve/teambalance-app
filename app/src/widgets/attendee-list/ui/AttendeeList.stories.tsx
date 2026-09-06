import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { AttendanceEntry } from '@shared/api/events'
import { makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { AttendeeList } from './AttendeeList'

// The event-detail attendance list: no tabs. Everyone shows under their position (Unassigned last),
// tinted by their answer, with the three-way control on every row so a member can set anyone's answer
// in one tap (ADR-0003 trust-based). A quiet "set by …" line marks a row a teammate changed. Prop-only
// (ADR-0017) — the mutation lives in the route container.
const att = (
  userId: string,
  displayName: string,
  role: string,
  overrides: Partial<AttendanceEntry> = {},
): AttendanceEntry => ({
  id: userId,
  userId,
  displayName,
  role,
  state: 'ATTENDING',
  changedBy: undefined,
  updatedAt: undefined,
  ...overrides,
})

// Matches makeRoster(): Setter 2/2, Libero 1/1, Middle 1 of 2 — with a mix of answers so the tints
// (green / gold / red / neutral) all show, and one Unassigned member who lands in the last bucket.
const ROSTER_PEOPLE: AttendanceEntry[] = [
  att('u-set1', 'Sanne', 'Setter'),
  att('u-set2', 'Sofia', 'Setter', { state: 'MAYBE' }),
  att('u-lib', 'Lars', 'Libero'),
  att('u-mid1', 'Milan', 'Middle'),
  att('u-mid2', 'Mees', 'Middle', { state: 'ABSENT' }),
  att('u-un', 'Uwe', 'Unassigned', { state: 'NOT_RESPONDED' }),
]

const meta = {
  title: 'widgets/attendee-list/AttendeeList',
  component: AttendeeList,
  args: {
    attendees: ROSTER_PEOPLE,
    roster: makeRoster(),
    onRespond: fn(),
  },
  decorators: [
    (Story) => (
      <div className="max-w-md overflow-hidden rounded-2xl border border-border/40 bg-card">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AttendeeList>

export default meta

type Story = StoryObj<typeof meta>

export const GroupedByPosition: Story = {
  play: async ({ canvas }) => {
    // Every position with someone gets a heading and the roster's own fraction beside it.
    await expect(canvas.getByRole('heading', { name: 'Setter' })).toBeInTheDocument()
    await expect(canvas.getByText('2/2')).toBeInTheDocument()
    await expect(canvas.getByText('1/2')).toBeInTheDocument() // Middle, one short
    // Unassigned is a heading with no fraction and comes last.
    const headings = canvas.getAllByRole('heading').map((h) => h.textContent)
    expect(headings.at(-1)).toContain('Unassigned')
    // Every member carries their own three-way control, always visible (no drilling in).
    await expect(canvas.getByRole('group', { name: "Sanne's answer" })).toBeInTheDocument()
    await expect(canvas.getByRole('group', { name: "Uwe's answer" })).toBeInTheDocument()
  },
}

export const FlatWhenNoPositions: Story = {
  args: { roster: NO_ROSTER, attendees: [att('u-a', 'Sanne', 'Unassigned'), att('u-b', 'Lars', 'Unassigned')] },
  play: async ({ canvas }) => {
    // No position headings; the people are a plain list, still each with a control.
    await expect(canvas.queryByRole('heading')).not.toBeInTheDocument()
    await expect(canvas.getByRole('group', { name: "Sanne's answer" })).toBeInTheDocument()
  },
}

export const Empty: Story = {
  args: { attendees: [], roster: NO_ROSTER },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No one')).toBeInTheDocument()
  },
}

export const YourRow: Story = {
  args: { currentUserId: 'u-set1' },
  play: async ({ canvas }) => {
    // The viewer's own row is marked; nobody else's is.
    await expect(canvas.getByText('You')).toBeInTheDocument()
    expect(canvas.getAllByText('You')).toHaveLength(1)
  },
}

export const Attribution: Story = {
  args: {
    roster: NO_ROSTER,
    attendees: [
      att('u-bob', 'Bob', 'Unassigned', { changedBy: 'u-tim' }),
      att('u-me', 'Me', 'Unassigned', { changedBy: 'u-me' }),
      att('u-tim', 'Tim de Vries', 'Unassigned'),
    ],
  },
  play: async ({ canvas }) => {
    // A row a teammate changed names them...
    await expect(canvas.getByText('set by Tim de Vries')).toBeInTheDocument()
    // ...and a row set by its own member says nothing — the negative is the whole design.
    await expect(canvas.queryByText(/set by Me/)).not.toBeInTheDocument()
  },
}

export const EditingTargetsThatMember: Story = {
  args: { attendees: [att('u-bob', 'Bob', 'Setter', { state: 'ATTENDING' })] },
  play: async ({ canvas, args }) => {
    // The control is always visible — setting Bob's answer targets *Bob*, not the viewer.
    const control = within(canvas.getByRole('group', { name: "Bob's answer" }))
    await control.getByRole('button', { name: "Can't go" }).click()
    // The bug this feature invites is editing the wrong person — assert the target id.
    await expect(args.onRespond).toHaveBeenCalledWith('u-bob', 'ABSENT')
  },
}
