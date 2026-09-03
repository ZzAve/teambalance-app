import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import type { AttendanceEntry } from '@shared/api/events'
import { makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { AttendeeList } from './AttendeeList'

// The event-detail attendance list: the Going tab grouped by position (unassigned last), the other
// tabs flat, every row tappable to edit *that* member (ADR-0003 trust-based editing), and a quiet
// "set by …" line where a teammate made the change. Prop-only (ADR-0017) apart from which row is
// expanded — the mutation lives in the route container.
const att = (userId: string, displayName: string, role: string, overrides: Partial<AttendanceEntry> = {}): AttendanceEntry => ({
  id: userId,
  userId,
  displayName,
  role,
  state: 'ATTENDING',
  changedBy: undefined,
  updatedAt: undefined,
  ...overrides,
})

// Matches makeRoster(): Setter 2/2, Libero 1/1, Middle 1 of 2.
const GOING: AttendanceEntry[] = [
  att('u-set1', 'Sanne', 'Setter'),
  att('u-set2', 'Sofia', 'Setter'),
  att('u-lib', 'Lars', 'Libero'),
  att('u-mid', 'Milan', 'Middle'),
  att('u-un', 'Uwe', 'Unassigned'),
]

const meta = {
  title: 'widgets/attendee-list/AttendeeList',
  component: AttendeeList,
  args: {
    attendees: GOING,
    allAttendees: GOING,
    roster: makeRoster(),
    grouped: true,
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
    // Every position that has someone gets a heading with the roster's own fraction beside it.
    await expect(canvas.getByText('Setter')).toBeInTheDocument()
    await expect(canvas.getByText('2/2')).toBeInTheDocument()
    await expect(canvas.getByText('Libero')).toBeInTheDocument()
    await expect(canvas.getByText('1/2')).toBeInTheDocument() // Middle, one short
    // Unassigned is a heading with no fraction, and comes last.
    const headings = canvas.getAllByRole('heading').map((h) => h.textContent)
    expect(headings.some((t) => t?.includes('Unassigned'))).toBe(true)
    expect(headings.at(-1)).toContain('Unassigned')
    await expect(canvas.getByRole('button', { name: /Uwe/ })).toBeInTheDocument()
  },
}

export const FlatWhenNotGrouped: Story = {
  args: { grouped: false },
  play: async ({ canvas }) => {
    // No position headings; the people are a plain list.
    await expect(canvas.queryByRole('heading', { name: /Setter/ })).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /Sanne/ })).toBeInTheDocument()
  },
}

export const Empty: Story = {
  args: { attendees: [], allAttendees: [], roster: NO_ROSTER, grouped: false },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No one')).toBeInTheDocument()
  },
}

export const Attribution: Story = {
  args: {
    grouped: false,
    attendees: [
      att('u-bob', 'Bob', 'Unassigned', { changedBy: 'u-tim' }),
      att('u-me', 'Me', 'Unassigned', { changedBy: 'u-me' }),
    ],
    allAttendees: [
      att('u-bob', 'Bob', 'Unassigned', { changedBy: 'u-tim' }),
      att('u-me', 'Me', 'Unassigned', { changedBy: 'u-me' }),
      att('u-tim', 'Tim de Vries', 'Setter'),
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
  args: {
    grouped: false,
    attendees: [att('u-bob', 'Bob', 'Unassigned', { state: 'ATTENDING' })],
    allAttendees: [att('u-bob', 'Bob', 'Unassigned', { state: 'ATTENDING' })],
  },
  play: async ({ canvas, args, userEvent }) => {
    // Tapping Bob's row opens the three-way control for *Bob*, not the viewer.
    await userEvent.click(canvas.getByRole('button', { name: /Bob/ }))
    await userEvent.click(canvas.getByRole('button', { name: /Can't go/ }))
    // The bug this feature invites is editing the wrong person — assert the target id, not the viewer's.
    await expect(args.onRespond).toHaveBeenCalledWith('u-bob', 'ABSENT')
  },
}
