import { useState, type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { AttendanceEntry } from '@shared/api/events'
import { makeAttendee, makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { Stack } from '@shared/testing/stack'
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
 *
 * Three-story shape (ADR-0032 §1). The panel is rendered inside the events page composite
 * (pages/EventsPageView), so per the ownership rule (ADR-0032 §3) its `Data` picture is behavioural
 * only:
 *   1. `Data` — the one populated live instance, disableSnapshot (the composite already shows this).
 *   2. `Shells` — every static roster shape stacked in one frame: nobody yet, a position nobody
 *      plays, headcount only, an untracked social, a crowded position collapsed, and a write pending.
 *      This picture stays — none of it is on screen in the composite's own default frame.
 *   3. `Interactions` — no picture; one play walks expanding a crowded position, answering for a
 *      teammate, answering for yourself, and the fact that an answer moves a chip and its row's count
 *      together, keeping every prop-contract spy.
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
} satisfies Meta<typeof EventLineupPanel>

export default meta
type Story = StoryObj<typeof meta>

// Picture owned by the page composite (pages/EventsPageView) — behavioural only (ADR-0032 §3).
export const Data: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    // The verdict word leads and the fraction follows, for each of the four row states.
    await expect(canvas.getByText('covered')).toBeInTheDocument()
    await expect(canvas.getByText('2 spare')).toBeInTheDocument()
    await expect(canvas.getByText('needs 1 more')).toBeInTheDocument()
    await expect(canvas.getByText('nobody yet')).toBeInTheDocument()
    await expect(canvas.getByText('2 of 4 covered')).toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        'Nobody yet': (
          <EventLineupPanel {...args} attendances={[]} roster={makeRoster({ positions: [], totalAttending: 0 })} />
        ),
        // Everyone declined a position the server therefore dropped — the row the old pips panel lost.
        'A position nobody plays': (
          <EventLineupPanel
            {...args}
            attendances={[makeAttendee('u-nina', 'Nina Hendriks', 'Libero', { state: 'ABSENT' })]}
            roster={makeRoster({ positions: [POSITIONS[3]], totalAttending: 0 })}
          />
        ),
        // A headcount target with no position targets: no covered fraction to state, so the header
        // falls back to the headcount, and the staff note explains why it is smaller than the room.
        'Headcount only': (
          <EventLineupPanel
            {...args}
            roster={makeRoster({ positions: [POSITIONS[4]], totalAttending: 11, totalTarget: 12 })}
          />
        ),
        // A social: tracking off, so there are no targets — just who is coming, grouped by position.
        'Untracked social': <EventLineupPanel {...args} roster={makeRoster({ ...NO_ROSTER, totalAttending: 11 })} />,
        // Six going in Outside, capped at five: four chips and a counter for the rest.
        'Crowded position collapsed': <EventLineupPanel {...args} />,
        // A write is in flight: the control is held so a second tap cannot race the first.
        Pending: <EventLineupPanel {...args} pending />,
      }}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Nobody yet').getByText('Nobody has answered yet.')).toBeInTheDocument()

    await expect(region('A position nobody plays').getByText('nobody yet')).toBeInTheDocument()
    await expect(
      region('A position nobody plays').getByRole('button', { name: /Nina Hendriks — Can't/ }),
    ).toBeInTheDocument()

    await expect(region('Headcount only').getByText('10/12 going')).toBeInTheDocument()
    await expect(region('Headcount only').getByText(/1 staff also going/)).toBeInTheDocument()

    await expect(region('Untracked social').getByText('11 going')).toBeInTheDocument()
    await expect(region('Untracked social').queryByText('covered')).not.toBeInTheDocument()

    await expect(
      region('Crowded position collapsed').getByRole('button', { name: 'Show 2 more going' }),
    ).toBeInTheDocument()
    await expect(
      region('Crowded position collapsed').queryByRole('button', { name: /Iris Kok/ }),
    ).not.toBeInTheDocument()

    await userEvent.click(region('Pending').getByRole('button', { name: /Lotte Dijkstra/ }))
    await expect(
      await within(document.body).findByRole('button', { name: 'Going' }),
    ).toBeDisabled()
  },
}

// Picture owned by the page composite (pages/EventsPageView) — behavioural only (ADR-0032 §3).
// Two instances: the default squad for the chip-cap and answer-sheet wiring, and a live one whose
// `attendances` is fed back in as a prop, which is what proves a written answer moves a chip and its
// row's count together rather than one lagging the other.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        Squad: <EventLineupPanel {...args} />,
        'Live count': <LivePanel {...args} />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    const body = within(document.body)

    // Expanding a crowded position: six going in Outside, capped at five.
    await userEvent.click(region('Squad').getByRole('button', { name: 'Show 2 more going' }))
    await expect(region('Squad').getByRole('button', { name: /Iris Kok — Going/ })).toBeInTheDocument()
    // And back: the counter becomes the way to re-collapse, so the row is never stuck open.
    await userEvent.click(region('Squad').getByRole('button', { name: 'Show fewer going' }))
    await expect(region('Squad').queryByRole('button', { name: /Iris Kok/ })).not.toBeInTheDocument()

    // Answering for a teammate — the sheet is portalled out of the canvas, so it is queried from the
    // document (as the manage-positions dialogs are).
    await userEvent.click(region('Squad').getByRole('button', { name: /Lotte Dijkstra — Maybe/ }))
    const teammateSheet = await body.findByRole('dialog')
    // The sheet names whose answer is about to change — ADR-0003 allows it, but you should know.
    await expect(teammateSheet).toHaveTextContent('Lotte Dijkstra')
    await expect(teammateSheet).toHaveTextContent('Middle · currently maybe · you are answering for them')
    await userEvent.click(body.getByRole('button', { name: 'Going' }))
    await expect(args.onRespond).toHaveBeenCalledWith('u-lotte', 'ATTENDING')

    // Answering for yourself — no "you are answering for them" on your own row; it is a warning, not
    // a label.
    await userEvent.click(region('Squad').getByRole('button', { name: /Eva Smit \(you\) — Going/ }))
    const selfSheet = await body.findByRole('dialog')
    await expect(selfSheet).toHaveTextContent('Outside · currently going')
    await expect(selfSheet).not.toHaveTextContent('answering for them')
    await userEvent.click(body.getByRole('button', { name: "Can't go" }))
    await expect(args.onRespond).toHaveBeenCalledWith('u-eva', 'ABSENT')

    // The panel counts its fractions from the members it renders, so an answer moves the chip and
    // the count together — proved here by driving the same prop change a re-render would. Middle was
    // 1/2; Lotte's chip turning green is the same fact as the row reading covered.
    await expect(region('Live count').getByText('needs 1 more')).toBeInTheDocument()
    await expect(region('Live count').getByText('2 of 4 covered')).toBeInTheDocument()
    await userEvent.click(region('Live count').getByRole('button', { name: /Lotte Dijkstra — Maybe/ }))
    await userEvent.click(body.getByRole('button', { name: 'Going' }))
    await expect(region('Live count').queryByText('needs 1 more')).not.toBeInTheDocument()
    await expect(region('Live count').getByText('3 of 4 covered')).toBeInTheDocument()
  },
}
