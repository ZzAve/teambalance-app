import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { AttendanceEntry } from '@shared/api/events'
import { makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { Stack } from '@shared/testing/stack'
import { appColumn } from '@shared/testing/app-column-decorator'
import { AttendeeList } from './AttendeeList'

// The event-detail attendance list: everyone under their position (Unassigned last), tinted by their
// answer, and any row opens the one answer sheet the event card also opens. Headings lead with the
// verdict word and demote the fraction, exactly as the card's lineup does. A "set by …" line marks a
// row a teammate changed. Prop-only apart from which row's sheet is open (ADR-0017) — the mutation
// and its Undo toast live in the route container.
//
// Rendered inside the event-detail page composite (EventDetailView), so per the ownership rule
// (ADR-0032 §3) its Data story is behavioural only — the composite's own picture already shows this
// list in context.
//
// Three-story shape (ADR-0032 §1):
//   1. Data — the one populated live instance, grouped by position, disableSnapshot (picture owned
//      by the page).
//   2. Shells — the flat / empty / your-row / attribution / read-only variants, stacked in one
//      frame — this picture stays, since the composite's default frame cannot show them.
//   3. Interactions — no picture; opening the sheet to edit a teammate's answer (which targets
//      *them*, not the viewer), and the "you are answering for them" line a cross-member edit
//      carries in the sheet (absent for the viewer's own row).
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
  // The card the detail page wraps it in, hosted in the app column so a wider viewport shows the
  // width the product gives the list at each breakpoint (ADR-0032 §4).
  decorators: [
    (Story) => (
      <div className="overflow-hidden rounded-lg border border-border/40 bg-card">
        <Story />
      </div>
    ),
    ...appColumn.decorators,
  ],
  parameters: appColumn.parameters,
} satisfies Meta<typeof AttendeeList>

export default meta

type Story = StoryObj<typeof meta>

// Picture owned by the page composite (pages/EventDetailView) — behavioural only (ADR-0032 §3).
export const Data: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    const heading = (name: string) => within(canvas.getByRole('heading', { name }).parentElement!)

    // Each position's verdict leads and its fraction is demoted — the card's order, the card's words.
    // Setter's two people are one Going and one Maybe, so the fraction counts the *attending* member
    // rather than the roster's server-side 2/2: the heading can never contradict the rows beneath it.
    await expect(heading('Setter').getByText('needs 1 more')).toBeInTheDocument()
    await expect(heading('Setter').getByText('1/2')).toBeInTheDocument()
    await expect(heading('Libero').getByText('covered')).toBeInTheDocument()
    await expect(heading('Libero').getByText('1/1')).toBeInTheDocument()
    // Middle is short the same way (Milan going, Mees can't).
    await expect(heading('Middle').getByText('needs 1 more')).toBeInTheDocument()
    await expect(heading('Middle').getByText('1/2')).toBeInTheDocument()

    // Unassigned is last and carries no verdict — there is nothing for it to fall short of.
    const headings = canvas.getAllByRole('heading').map((h) => h.textContent)
    expect(headings.at(-1)).toContain('Unassigned')
    await expect(heading('Unassigned').queryByText(/covered|needs|spare|nobody/)).not.toBeInTheDocument()

    // Nothing is open: each row is a way into the sheet, and no answer control or dialog is on screen.
    await expect(canvas.getByRole('button', { name: /Sanne — Going/ })).toBeInTheDocument()
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
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
        // tinted and pilled, but nothing to open.
        ReadOnly: <AttendeeList {...args} onRespond={undefined} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Flat when no positions').queryByRole('heading')).not.toBeInTheDocument()
    await expect(
      region('Flat when no positions').getByRole('button', { name: /Sanne — Going/ }),
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
    // But no row is a control, so there is no route to anyone's answer.
    await expect(region('ReadOnly').queryByRole('button')).not.toBeInTheDocument()
  },
}

// Picture owned by Data — behavioural only (ADR-0032 §1, §3). Two instances: one a single member to
// edit, the other the viewer's own team so the sheet's "you are answering for them" line can be told
// apart from a self-edit.
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
    const body = within(document.body)

    // Open Bob's row, then set *his* answer — the write targets Bob, not the viewer. The sheet is a
    // portal, so it lands on document.body rather than inside the canvas.
    await userEvent.click(region('Target member').getByRole('button', { name: /Bob — Going/ }))
    const bobSheet = within(await body.findByRole('dialog'))
    await userEvent.click(bobSheet.getByRole('button', { name: "Can't go" }))
    await expect(args.onRespond).toHaveBeenCalledWith('u-bob', 'ABSENT')

    // The sheet names the teammate, their position and that you are answering for them.
    await userEvent.click(region('Viewer among teammates').getByRole('button', { name: /Sofia — Maybe/ }))
    const sofiaSheet = within(await body.findByRole('dialog'))
    await expect(sofiaSheet.getByText('Sofia')).toBeInTheDocument()
    await expect(
      sofiaSheet.getByText(/Setter · currently maybe · you are answering for them/),
    ).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument()

    // The viewer's own row gets no such line — it isn't a cross-member change.
    await userEvent.click(
      region('Viewer among teammates').getByRole('button', { name: /Sanne \(you\) — Going/ }),
    )
    const sanneSheet = within(await body.findByRole('dialog'))
    await expect(sanneSheet.getByText(/Setter · currently going/)).toBeInTheDocument()
    await expect(sanneSheet.queryByText(/answering for them/)).not.toBeInTheDocument()
  },
}
