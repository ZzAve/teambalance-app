import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { AttendanceEntry } from '@shared/api/events'
import { makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { Stack } from '@shared/testing/stack'
import { AttendeeList } from './AttendeeList'

// The event-detail attendance list: no tabs. Everyone shows under their position (Unassigned last),
// tinted by their answer, each row a collapsed pill that expands to the three-way control — the same
// disclosure the event card uses. Editing a teammate carries a quiet "Changing …" notice (ADR-0003
// trust-based). A "set by …" line marks a row a teammate changed. Prop-only apart from which row is
// open (ADR-0017) — the mutation and its Undo toast live in the route container.
//
// Rendered inside the event-detail page composite (EventDetailView), so per the ownership rule
// (ADR-0031 §3) its Data story is behavioural only — the composite's own picture already shows this
// list in context.
//
// Three-story shape (ADR-0031 §1):
//   1. Data — the one populated live instance, grouped by position, disableSnapshot (picture owned
//      by the page).
//   2. Shells — the flat / empty / your-row / attribution / read-only variants, stacked in one
//      frame — this picture stays, since the composite's default frame cannot show them.
//   3. Interactions — no picture; editing a teammate's answer (which targets *them*, not the
//      viewer) and the "Changing …" notice that a cross-member edit carries.
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
      <div className="max-w-md overflow-hidden rounded-2xl border border-border/40 bg-card">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AttendeeList>

export default meta

type Story = StoryObj<typeof meta>

// Picture owned by the page composite (pages/EventDetailView) — behavioural only (ADR-0031 §3).
export const Data: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    // Every position with someone gets a heading and the roster's own fraction beside it.
    await expect(canvas.getByRole('heading', { name: 'Setter' })).toBeInTheDocument()
    await expect(canvas.getByText('2/2')).toBeInTheDocument()
    await expect(canvas.getByText('1/2')).toBeInTheDocument() // Middle, one short
    const headings = canvas.getAllByRole('heading').map((h) => h.textContent)
    expect(headings.at(-1)).toContain('Unassigned')
    // Rows are collapsed: each is a disclosure trigger, and no answer control is on screen yet.
    await expect(canvas.getByRole('button', { name: /Change Sanne's answer/ })).toBeInTheDocument()
    await expect(canvas.queryByRole('group')).not.toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        'Flat when no positions': (
          <AttendeeList
            {...args}
            roster={NO_ROSTER}
            attendees={[att('u-a', 'Sanne', 'Unassigned'), att('u-b', 'Lars', 'Unassigned')]}
          />
        ),
        Empty: <AttendeeList {...args} attendees={[]} roster={NO_ROSTER} />,
        'Your row': <AttendeeList {...args} currentUserId="u-set1" />,
        Attribution: (
          <AttendeeList
            {...args}
            roster={NO_ROSTER}
            attendees={[
              att('u-bob', 'Bob', 'Unassigned', { changedBy: 'u-tim' }),
              att('u-me', 'Me', 'Unassigned', { changedBy: 'u-me' }),
              att('u-tim', 'Tim de Vries', 'Unassigned'),
            ]}
          />
        ),
        // Without `onRespond` the same list is a read-out, not a control: every member still named,
        // tinted and pilled, but nothing to open. That is how the events-list card renders it, which
        // is what keeps editing a teammate's attendance on detail-page rows only (#271 ⑫, #326).
        ReadOnly: <AttendeeList {...args} onRespond={undefined} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Flat when no positions').queryByRole('heading')).not.toBeInTheDocument()
    await expect(
      region('Flat when no positions').getByRole('button', { name: /Change Sanne's answer/ }),
    ).toBeInTheDocument()

    await expect(region('Empty').getByText('No one')).toBeInTheDocument()

    await expect(region('Your row').getByText('You')).toBeInTheDocument()
    expect(region('Your row').getAllByText('You')).toHaveLength(1)

    // A row a teammate changed names them...
    await expect(region('Attribution').getByText('set by Tim de Vries')).toBeInTheDocument()
    // ...and a row set by its own member says nothing — the negative is the whole design.
    await expect(region('Attribution').queryByText(/set by Me/)).not.toBeInTheDocument()

    // The list itself is unchanged — same groups, same names, same answers.
    await expect(region('ReadOnly').getByRole('heading', { name: 'Setter' })).toBeInTheDocument()
    await expect(region('ReadOnly').getByText('Sanne')).toBeInTheDocument()
    await expect(region('ReadOnly').getByText('Awaiting')).toBeInTheDocument()
    // But no row is a disclosure, so there is no route to anyone's answer control.
    await expect(
      region('ReadOnly').queryByRole('button', { name: /Change .*'s answer/ }),
    ).not.toBeInTheDocument()
    await expect(region('ReadOnly').queryByRole('button')).not.toBeInTheDocument()
  },
}

// Picture owned by Data — behavioural only (ADR-0031 §1, §3). Two instances: one a single member to
// edit, the other the viewer's own team so the "Changing …" notice can be told apart from a self-edit.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        'Target member': (
          <AttendeeList {...args} attendees={[att('u-bob', 'Bob', 'Setter', { state: 'ATTENDING' })]} />
        ),
        // The viewer is Sanne.
        'Viewer among teammates': <AttendeeList {...args} currentUserId="u-set1" />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    // Expand Bob's row, then set *his* answer — the write targets Bob, not the viewer.
    await userEvent.click(region('Target member').getByRole('button', { name: /Change Bob's answer/ }))
    const control = within(region('Target member').getByRole('group', { name: "Bob's answer" }))
    await userEvent.click(control.getByRole('button', { name: "Can't go" }))
    await expect(args.onRespond).toHaveBeenCalledWith('u-bob', 'ABSENT')

    // Opening a teammate's control announces whose answer you're about to change.
    await userEvent.click(
      region('Viewer among teammates').getByRole('button', { name: /Change Sofia's answer/ }),
    )
    await expect(region('Viewer among teammates').getByText(/Changing/)).toBeInTheDocument()
    await expect(
      within(region('Viewer among teammates').getByRole('group', { name: "Sofia's answer" })).getByText(
        'Sofia',
      ),
    ).toBeInTheDocument()
    // The viewer's own row gets no such notice — it isn't a cross-member change.
    await userEvent.click(
      region('Viewer among teammates').getByRole('button', { name: /Change Sanne's answer/ }),
    )
    await expect(region('Viewer among teammates').queryByText(/Changing/)).not.toBeInTheDocument()
  },
}
