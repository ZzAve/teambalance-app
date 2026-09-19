import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { AttendanceEntry } from '@shared/api/events'
import { makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { AttendeeList } from './AttendeeList'

// The event-detail attendance list: everyone under their position (Unassigned last), tinted by their
// answer, and any row opens the one answer sheet the event card also opens. Headings lead with the
// verdict word and demote the fraction, exactly as the card's lineup does. A "set by …" line marks a
// row a teammate changed. Prop-only apart from which row's sheet is open (ADR-0017) — the mutation
// and its Undo toast live in the route container.
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

// Matches makeRoster(): Setter 2/2, Libero 1/1, Middle 1 of 2 — a mix of answers so the tints and the
// collapsed pills (green / gold / red / neutral) all show, and one Unassigned member, last.
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
      <div className="max-w-md overflow-hidden rounded-lg border border-border/40 bg-card">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AttendeeList>

export default meta

type Story = StoryObj<typeof meta>

export const GroupedByPosition: Story = {
  play: async ({ canvas }) => {
    const heading = (name: string) => within(canvas.getByRole('heading', { name }).parentElement!)

    // Each position's verdict leads and its fraction is demoted — the card's order, the card's words.
    // Setter's two people are one Going and one Maybe, so the fraction counts the *attending* member
    // rather than the roster's server-side 2/2: the heading can never contradict the rows beneath it.
    await expect(heading('Setter').getByText('needs 1 more')).toBeInTheDocument()
    await expect(heading('Setter').getByText('1/2')).toBeInTheDocument()
    await expect(heading('Libero').getByText('covered')).toBeInTheDocument()
    await expect(heading('Libero').getByText('1/1')).toBeInTheDocument()

    // Unassigned is last and carries no verdict — there is nothing for it to fall short of.
    const headings = canvas.getAllByRole('heading').map((h) => h.textContent)
    expect(headings.at(-1)).toContain('Unassigned')
    await expect(heading('Unassigned').queryByText(/covered|needs|spare|nobody/)).not.toBeInTheDocument()

    // Nothing is open: each row is a way into the sheet, and no answer control is on screen yet.
    await expect(canvas.getByRole('button', { name: /Sanne — Going/ })).toBeInTheDocument()
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
  },
}

export const FlatWhenNoPositions: Story = {
  args: { roster: NO_ROSTER, attendees: [att('u-a', 'Sanne', 'Unassigned'), att('u-b', 'Lars', 'Unassigned')] },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('heading')).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /Sanne — Going/ })).toBeInTheDocument()
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
    // Open Bob's row, then set *his* answer — the write targets Bob, not the viewer.
    await canvas.getByRole('button', { name: /Bob — Going/ }).click()
    // The sheet is a portal, so it lands on document.body rather than inside the canvas.
    const sheet = within(await within(document.body).findByRole('dialog'))
    await sheet.getByRole('button', { name: "Can't go" }).click()
    await expect(args.onRespond).toHaveBeenCalledWith('u-bob', 'ABSENT')
  },
}

export const ChangingATeammateSaysSo: Story = {
  args: { currentUserId: 'u-set1' }, // the viewer is Sanne
  play: async ({ canvas, userEvent }) => {
    // The sheet names the teammate, their position and that you are answering for them.
    await userEvent.click(canvas.getByRole('button', { name: /Sofia — Maybe/ }))
    const body = within(document.body)
    const sheet = within(await body.findByRole('dialog'))
    await expect(sheet.getByText('Sofia')).toBeInTheDocument()
    await expect(sheet.getByText(/Setter · currently maybe · you are answering for them/)).toBeInTheDocument()
  },
}

export const AnsweringForYourselfSaysNothingExtra: Story = {
  args: { currentUserId: 'u-set1' }, // the viewer is Sanne
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Sanne \(you\) — Going/ }))
    const sheet = within(await within(document.body).findByRole('dialog'))
    await expect(sheet.getByText(/Setter · currently going/)).toBeInTheDocument()
    await expect(sheet.queryByText(/answering for them/)).not.toBeInTheDocument()
  },
}

// Without `onRespond` the same list is a read-out, not a control: every member still named, tinted
// and pilled, but nothing to open.
export const ReadOnly: Story = {
  args: { onRespond: undefined },
  play: async ({ canvas }) => {
    // The list itself is unchanged — same groups, same names, same answers.
    await expect(canvas.getByRole('heading', { name: 'Setter' })).toBeInTheDocument()
    await expect(canvas.getByText('Sanne')).toBeInTheDocument()
    await expect(canvas.getByText('Awaiting')).toBeInTheDocument()
    // But no row is a control, so there is no route to anyone's answer.
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
  },
}
