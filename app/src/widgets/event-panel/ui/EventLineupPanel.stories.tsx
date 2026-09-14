import { useState, type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { AttendanceEntry } from '@shared/api/events'
import { makeAttendee, makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { allModes } from '../../../../.storybook/modes'
import { EventLineupPanel } from './EventLineupPanel'

/**
 * The lineup panel in each shape a roster can take, plus the wiring a card depends on.
 *
 * Prop-only (ADR-0017), so every state below is an argument rather than a fetch: what the panel does
 * with a squad is decided entirely by `attendances` and `roster`. The container seam — the write, its
 * rollback, and the optimistic hold — is the events route's, covered by the attendance e2e.
 *
 * The interactive stories pass `fn()` spies and assert `toHaveBeenCalledWith`, because the thing
 * worth pinning here is not that a chip renders but that tapping one reaches the right *member*: the
 * panel answers for anybody (ADR-0003), and a chip wired to the wrong id would look perfectly fine.
 */

// ── The squad ────────────────────────────────────────────────────────────────────────────────────
// Every row shape on one card: a position covered exactly, one over-subscribed past the chip cap,
// one short, one whose whole group declined, an untargeted staff row, and two with no position.
const SQUAD: AttendanceEntry[] = [
  makeAttendee('u-anna', 'Anna Bakker', 'Setter'),
  makeAttendee('u-bram', 'Bram de Vries', 'Setter'),
  makeAttendee('u-carmen', 'Carmen Jansen', 'Setter', { state: 'ABSENT' }),

  makeAttendee('u-daan', 'Daan Willems', 'Outside'),
  makeAttendee('u-eva', 'Eva Smit', 'Outside'),
  makeAttendee('u-femke', 'Femke Koning', 'Outside'),
  makeAttendee('u-gijs', 'Gijs Mulder', 'Outside'),
  makeAttendee('u-hanna', 'Hanna Vos', 'Outside'),
  makeAttendee('u-iris', 'Iris Kok', 'Outside'),
  makeAttendee('u-ivo', 'Ivo Peters', 'Outside', { state: 'MAYBE' }),
  makeAttendee('u-julia', 'Julia Meijer', 'Outside', { state: 'NOT_RESPONDED' }),

  makeAttendee('u-koen', 'Koen Bos', 'Middle'),
  makeAttendee('u-lotte', 'Lotte Dijkstra', 'Middle', { state: 'MAYBE' }),
  makeAttendee('u-mees', 'Mees van Dam', 'Middle', { state: 'NOT_RESPONDED' }),

  makeAttendee('u-nina', 'Nina Hendriks', 'Libero', { state: 'ABSENT' }),

  makeAttendee('u-pien', 'Pien Groot', 'Coach'),

  makeAttendee('u-quinn', 'Quinn Aalders', 'Unassigned', { state: 'MAYBE' }),
  makeAttendee('u-roos', 'Roos Timmer', 'Unassigned', { state: 'NOT_RESPONDED' }),
]

const POSITIONS = [
  { id: 'p-setter', label: 'Setter', required: 2, attending: 2, kind: 'PLAYING' as const },
  { id: 'p-outside', label: 'Outside', required: 4, attending: 6, kind: 'PLAYING' as const },
  { id: 'p-middle', label: 'Middle', required: 2, attending: 1, kind: 'PLAYING' as const },
  { id: 'p-libero', label: 'Libero', required: 1, attending: 0, kind: 'PLAYING' as const },
  { id: 'p-coach', label: 'Coach', required: undefined, attending: 1, kind: 'STAFF' as const },
]

/** Feeds the answer back in as a prop, which is what the events route's optimistic hold does. */
function LivePanel(props: ComponentProps<typeof EventLineupPanel>) {
  const [attendances, setAttendances] = useState(props.attendances)
  return (
    <EventLineupPanel
      {...props}
      attendances={attendances}
      onRespond={(userId, state) => {
        props.onRespond(userId, state)
        setAttendances((current) => current.map((a) => (a.userId === userId ? { ...a, state } : a)))
      }}
    />
  )
}

const meta = {
  title: 'widgets/event-panel/EventLineupPanel',
  component: EventLineupPanel,
  args: {
    attendances: SQUAD,
    roster: makeRoster({ positions: POSITIONS, totalAttending: 11, totalTarget: undefined }),
    currentUserId: 'u-eva',
    onRespond: fn(),
  },
  // Card width: the panel lives inside an event card in a list, which is the width its chips have to
  // wrap and cap against. Judging it any wider would hide the only layout pressure it is under.
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-[360px] rounded-2xl border border-border/40 bg-card p-3.5">
        <Story />
      </div>
    ),
  ],
  parameters: { chromatic: { modes: { light: allModes.light, dark: allModes.dark } } },
} satisfies Meta<typeof EventLineupPanel>

export default meta
type Story = StoryObj<typeof meta>

// ── The shapes a roster comes in ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvas }) => {
    // The verdict word leads and the fraction follows, for each of the four row states.
    await expect(canvas.getByText('covered')).toBeInTheDocument()
    await expect(canvas.getByText('2 spare')).toBeInTheDocument()
    await expect(canvas.getByText('needs 1 more')).toBeInTheDocument()
    await expect(canvas.getByText('nobody yet')).toBeInTheDocument()
    await expect(canvas.getByText('2 of 4 covered')).toBeInTheDocument()
  },
}

/** Nobody has answered and nobody is configured: the panel says so rather than rendering blank. */
export const NobodyYet: Story = {
  args: { attendances: [], roster: makeRoster({ positions: [], totalAttending: 0 }) },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Nobody has answered yet.')).toBeInTheDocument()
  },
}

/** Everyone declined a position the server therefore dropped — the row the old pips panel lost. */
export const APositionNobodyIsPlaying: Story = {
  args: {
    attendances: [makeAttendee('u-nina', 'Nina Hendriks', 'Libero', { state: 'ABSENT' })],
    roster: makeRoster({ positions: [POSITIONS[3]], totalAttending: 0 }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('nobody yet')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /Nina Hendriks — Can't/ })).toBeInTheDocument()
  },
}

/**
 * A headcount target with no position targets. There is no covered fraction to state, so the header
 * falls back to the headcount — and the staff note explains why it is smaller than the room.
 */
export const HeadcountOnly: Story = {
  args: {
    roster: makeRoster({
      positions: [POSITIONS[4]],
      totalAttending: 11,
      totalTarget: 12,
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('10/12 going')).toBeInTheDocument()
    await expect(canvas.getByText(/1 staff also going/)).toBeInTheDocument()
  },
}

/** A social: tracking off, so there are no targets — just who is coming, grouped by position. */
export const UntrackedSocial: Story = {
  args: { roster: makeRoster({ ...NO_ROSTER, totalAttending: 11 }) },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('11 going')).toBeInTheDocument()
    await expect(canvas.queryByText('covered')).not.toBeInTheDocument()
  },
}

// ── Crowding: the cap is what lets a chip refuse to clip a name ──────────────────────────────────

export const CrowdedPositionCollapses: Story = {
  play: async ({ canvas }) => {
    // Six going in Outside, capped at five: four chips and a counter for the rest.
    await expect(canvas.getByRole('button', { name: 'Show 2 more going' })).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: /Iris Kok/ })).not.toBeInTheDocument()
  },
}

export const ExpandingACrowdedPosition: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show 2 more going' }))
    await expect(canvas.getByRole('button', { name: /Iris Kok — Going/ })).toBeInTheDocument()
    // And back: the counter becomes the way to re-collapse, so the row is never stuck open.
    await userEvent.click(canvas.getByRole('button', { name: 'Show fewer going' }))
    await expect(canvas.queryByRole('button', { name: /Iris Kok/ })).not.toBeInTheDocument()
  },
}

// ── Wiring — a chip has to reach the right member ────────────────────────────────────────────────

export const AnsweringForATeammate: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Lotte Dijkstra — Maybe/ }))

    // The sheet is portalled out of the canvas, so it is queried from the document (as the
    // manage-positions dialogs are).
    const body = within(document.body)
    const sheet = await body.findByRole('dialog')
    // The sheet names whose answer is about to change — ADR-0003 allows it, but you should know.
    await expect(sheet).toHaveTextContent('Lotte Dijkstra')
    await expect(sheet).toHaveTextContent('Middle · currently maybe · you are answering for them')

    await userEvent.click(body.getByRole('button', { name: 'Going' }))
    await expect(args.onRespond).toHaveBeenCalledWith('u-lotte', 'ATTENDING')
  },
}

export const AnsweringForYourself: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Eva Smit \(you\) — Going/ }))

    const body = within(document.body)
    const sheet = await body.findByRole('dialog')
    // No "you are answering for them" on your own row — it is a warning, not a label.
    await expect(sheet).toHaveTextContent('Outside · currently going')
    await expect(sheet).not.toHaveTextContent('answering for them')

    await userEvent.click(body.getByRole('button', { name: "Can't go" }))
    await expect(args.onRespond).toHaveBeenCalledWith('u-eva', 'ABSENT')
  },
}

/** A write is in flight: the control is held so a second tap cannot race the first. */
export const Pending: Story = {
  args: { pending: true },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Lotte Dijkstra/ }))
    await expect(await within(document.body).findByRole('button', { name: 'Going' })).toBeDisabled()
  },
}

/**
 * The panel counts its fractions from the members it renders, so an answer moves the chip and the
 * count together. This is the state the events route holds while a write settles — proved here by
 * driving the same prop change a re-render would.
 */
export const AnswerMovesChipAndCountTogether: Story = {
  render: (args) => <LivePanel {...args} />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('needs 1 more')).toBeInTheDocument()
    await expect(canvas.getByText('2 of 4 covered')).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: /Lotte Dijkstra — Maybe/ }))
    await userEvent.click(within(document.body).getByRole('button', { name: 'Going' }))

    // Middle was 1/2; Lotte's chip turning green is the same fact as the row reading covered.
    await expect(canvas.queryByText('needs 1 more')).not.toBeInTheDocument()
    await expect(canvas.getByText('3 of 4 covered')).toBeInTheDocument()
  },
}
