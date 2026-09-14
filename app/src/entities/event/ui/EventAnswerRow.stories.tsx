import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Event } from '@shared/api/events'
import { Stack } from '@shared/testing/stack'
import { makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { EventAnswerRow } from './EventAnswerRow'

type AttendanceState = Event['myState']

// The card's bottom row: two independent disclosures — attendance (left) and roster (right). Each
// opens its own panel; both can be open at once, with the attendance panel always above. Prop-only
// apart from the two open states (ADR-0017), so every combination is just props.
//
// Three stories (ADR-0031 §1): `Data` is the one live instance — the collapsed, unanswered row —
// and its picture is owned by the events page composite (pages/EventsPageView), so it is
// `disableSnapshot`. `Shells` stacks every visually distinct static state (attribution, long name,
// headcount fallbacks, the panels' default-open shapes, pending, both panels open, a social's
// injected panel) in one frame and carries the snapshot. `Interactions` is `disableSnapshot`; its
// play walks every click the old per-branch stories made, including the collapse-on-pick harness
// that models the container's optimistic update.
const CARD = 'max-w-md rounded-xl border border-border bg-card p-3.5'
const LONG_NAME_CARD = 'w-[300px] rounded-xl border border-border bg-card p-3.5'

const meta = {
  title: 'entities/event/EventAnswerRow',
  component: EventAnswerRow,
  args: { roster: makeRoster(), myState: 'NOT_RESPONDED', onRespond: fn() },
} satisfies Meta<typeof EventAnswerRow>

export default meta

type Story = StoryObj<typeof meta>

// Picture owned by the page composite (pages/EventsPageView) — behavioural only (ADR-0031 §3).
export const Data: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <div className={CARD}>
      <EventAnswerRow {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Respond')).toBeInTheDocument()
    await expect(canvas.getByText('1 spot open')).toBeInTheDocument()
    // Neither panel is open until asked.
    await expect(canvas.queryByRole('button', { name: /^Going$/ })).not.toBeInTheDocument()
    await expect(canvas.queryByText('Positions')).not.toBeInTheDocument()
    // Both sides are their own trigger.
    await expect(canvas.getByRole('button', { name: /Change your answer/ })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /Show lineup/ })).toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Attending: (
          <div className={CARD}>
            <EventAnswerRow {...args} myState="ATTENDING" />
          </div>
        ),
        // Attribution (⑪): an answer someone else gave on your behalf. Still your answer and still
        // yours to change: the pill is the same trigger it always was.
        'Set by teammate': (
          <div className={CARD}>
            <EventAnswerRow {...args} myState="ABSENT" setBy="Tim de Vries" />
          </div>
        ),
        // A name is the one thing on this row with no upper bound, so it yields first: the pill
        // truncates rather than pushing the chevron or the verdict off a narrow card.
        'Long name': (
          <div className={LONG_NAME_CARD}>
            <EventAnswerRow {...args} myState="ATTENDING" setBy="Sophie van Dijk-van der Bergh" />
          </div>
        ),
        // Headcount fallback (⑥), right side, off: a social with tracking off has no lineup, so the
        // verdict is a plain headcount, NOT a trigger.
        'Headcount fallback — off': (
          <div className={CARD}>
            <EventAnswerRow {...args} roster={makeRoster({ ...NO_ROSTER, totalAttending: 8 })} />
          </div>
        ),
        // Tracking on but no targets — still no verdict, so the badge shows the headcount, but there
        // ARE per-position rows to open.
        'Headcount fallback — tally only': (
          <div className={CARD}>
            <EventAnswerRow
              {...args}
              roster={makeRoster({ state: 'TALLY_ONLY', openSlots: 0, totalAttending: 5, positions: [] })}
            />
          </div>
        ),
        // The panel's default open state (ADR-0030 §6): `Keep open` on, affordable only because the
        // list payload now carries the whole picture (ADR-0030 §8).
        'Roster expanded by default': (
          <div className={CARD}>
            <EventAnswerRow {...args} defaultRosterOpen />
          </div>
        ),
        // The pending state (⑤): the badge dims while the write settles and the control is held.
        Pending: (
          <div className={CARD}>
            <EventAnswerRow {...args} defaultAttnOpen myState="ATTENDING" pending />
          </div>
        ),
        // Both open, opened roster-first: the attendance panel must still sit ABOVE the roster panel
        // (①), whichever order they were opened in.
        'Both panels open': (
          <div className={CARD}>
            <EventAnswerRow {...args} defaultAttnOpen defaultRosterOpen />
          </div>
        ),
        // The social is a disclosure now (#324 cause 3): with a panel handed in, tracking-off stops
        // being the one card whose verdict silently navigates — the same screen position expands,
        // like every other card. The events list always hands one in.
        'Social expands': (
          <div className={CARD}>
            <EventAnswerRow
              {...args}
              roster={makeRoster({ ...NO_ROSTER, totalAttending: 8 })}
              rosterPanel={<p>Sanne, Sofia, Lars</p>}
              defaultRosterOpen
            />
          </div>
        ),
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Attending').getByText("You're in")).toBeInTheDocument()

    await expect(
      region('Set by teammate').getByText("Tim de Vries said you're out"),
    ).toBeInTheDocument()
    await expect(
      region('Set by teammate').getByRole('button', { name: /Change your answer/ }),
    ).toBeInTheDocument()

    await expect(region('Long name').getByText(/said you're in/)).toBeInTheDocument()
    // The verdict on the right survives — the row never wraps or scrolls.
    await expect(
      region('Long name').getByRole('button', { name: /Show lineup/ }),
    ).toBeInTheDocument()

    await expect(region('Headcount fallback — off').getByText('8 going')).toBeInTheDocument()
    await expect(
      region('Headcount fallback — off').queryByRole('button', { name: /Show lineup/ }),
    ).not.toBeInTheDocument()

    await expect(region('Headcount fallback — tally only').getByText('5 going')).toBeInTheDocument()

    await expect(region('Roster expanded by default').getByText('Positions')).toBeInTheDocument()
    await expect(
      region('Roster expanded by default').getByRole('button', { name: /Hide lineup/ }),
    ).toBeInTheDocument()

    await expect(region('Pending').getByText('1 spot open')).toHaveAttribute('aria-busy', 'true')
    await expect(region('Pending').getByRole('button', { name: /^Going$/ })).toBeDisabled()

    const going = region('Both panels open').getByRole('button', { name: /^Going$/ })
    const positions = region('Both panels open').getByText('Positions')
    await expect(going).toBeInTheDocument()
    await expect(positions).toBeInTheDocument()
    // Attendance renders above the roster panel regardless of which was opened first.
    await expect(going.getBoundingClientRect().top).toBeLessThan(positions.getBoundingClientRect().top)

    await expect(region('Social expands').getByText('8 going')).toBeInTheDocument()
    await expect(region('Social expands').getByText('Sanne, Sofia, Lars')).toBeInTheDocument()
  },
}

// Collapse-on-pick (④): picking closes the attendance panel and flips the pill, while an open roster
// panel is left untouched. The harness models the container's optimistic update.
function CollapseOnPickHarness(args: Parameters<typeof EventAnswerRow>[0]) {
  const [state, setState] = useState<AttendanceState>('NOT_RESPONDED')
  return (
    <EventAnswerRow
      {...args}
      myState={state}
      onRespond={(s) => {
        args.onRespond(s)
        setState(s)
      }}
    />
  )
}

// Picture owned by Data and Shells — behavioural only (ADR-0031 §1). Several fresh instances because
// several steps need a state the shared default is never in, or must not carry a click another
// step's assertion depends on staying unclicked.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        'Attendance trigger': (
          <div className={CARD}>
            <EventAnswerRow {...args} onRespond={fn()} />
          </div>
        ),
        'Roster trigger': (
          <div className={CARD}>
            <EventAnswerRow {...args} onRespond={fn()} />
          </div>
        ),
        // A setter the event's rows cannot name — one who has since left the team — still gets a
        // subject.
        'Unnamed teammate': (
          <div className={CARD}>
            <EventAnswerRow {...args} myState="ATTENDING" setBy="a teammate" />
          </div>
        ),
        // The negative is the design: an answer you gave yourself is simply yours, in the first
        // person.
        'Self-set': (
          <div className={CARD}>
            <EventAnswerRow {...args} myState="ATTENDING" />
          </div>
        ),
        'Answer reported': (
          <div className={CARD}>
            <EventAnswerRow {...args} defaultAttnOpen myState="ATTENDING" />
          </div>
        ),
        'Collapse on pick': <CollapseOnPickHarness {...args} defaultAttnOpen defaultRosterOpen />,
        // The interaction half of the two headcount-fallback shells: answering still works whichever
        // side the badge falls back to.
        'Headcount off answer': (
          <div className={CARD}>
            <EventAnswerRow {...args} roster={makeRoster({ ...NO_ROSTER, totalAttending: 8 })} onRespond={fn()} />
          </div>
        ),
        'Headcount tally answer': (
          <div className={CARD}>
            <EventAnswerRow
              {...args}
              roster={makeRoster({ state: 'TALLY_ONLY', openSlots: 0, totalAttending: 5, positions: [] })}
            />
          </div>
        ),
        // `Keep open` off — the resting state, and the only one before this preference existed.
        'Roster collapsed': (
          <div className={CARD}>
            <EventAnswerRow {...args} defaultRosterOpen={false} />
          </div>
        ),
        // Still a disclosure, not a permanently open panel: `Keep open` on does not stop a member
        // from closing this one card by hand.
        'Roster expanded — collapse': (
          <div className={CARD}>
            <EventAnswerRow {...args} defaultRosterOpen />
          </div>
        ),
        // A caller may still say there is nothing to open, which is what the plain headcount is for.
        'No panel': (
          <div className={CARD}>
            <EventAnswerRow {...args} roster={makeRoster({ ...NO_ROSTER, totalAttending: 8 })} rosterPanel={null} />
          </div>
        ),
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await userEvent.click(region('Attendance trigger').getByRole('button', { name: /Change your answer/ }))
    // The three-way control is shown…
    await expect(region('Attendance trigger').getByRole('button', { name: /^Going$/ })).toBeInTheDocument()
    // …and the roster panel stays closed.
    await expect(region('Attendance trigger').queryByText('Positions')).not.toBeInTheDocument()

    await userEvent.click(region('Roster trigger').getByRole('button', { name: /Show lineup/ }))
    // The pips are shown…
    await expect(region('Roster trigger').getByText('Positions')).toBeInTheDocument()
    // …and the answer control stays closed.
    await expect(region('Roster trigger').queryByRole('button', { name: /^Going$/ })).not.toBeInTheDocument()

    await expect(
      region('Unnamed teammate').getByText("a teammate said you're in"),
    ).toBeInTheDocument()

    await expect(region('Self-set').getByText("You're in")).toBeInTheDocument()
    await expect(region('Self-set').queryByText(/ said /)).not.toBeInTheDocument()

    await expect(
      region('Answer reported').getByRole('button', { name: /^Going$/ }),
    ).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(region('Answer reported').getByRole('button', { name: /^Maybe$/ }))
    await expect(args.onRespond).toHaveBeenLastCalledWith('MAYBE')

    await expect(region('Collapse on pick').getByText('Respond')).toBeInTheDocument()
    await userEvent.click(region('Collapse on pick').getByRole('button', { name: /^Going$/ }))
    // Attendance panel collapsed…
    await expect(region('Collapse on pick').queryByRole('button', { name: /^Going$/ })).not.toBeInTheDocument()
    // …the pill flipped optimistically…
    await expect(region('Collapse on pick').getByText("You're in")).toBeInTheDocument()
    // …the roster panel stayed open…
    await expect(region('Collapse on pick').getByText('Positions')).toBeInTheDocument()
    // …and the answer was reported.
    await expect(args.onRespond).toHaveBeenLastCalledWith('ATTENDING')

    // Answering still works.
    await userEvent.click(region('Headcount off answer').getByRole('button', { name: /Change your answer/ }))
    await expect(region('Headcount off answer').getByRole('button', { name: /^Going$/ })).toBeInTheDocument()

    await userEvent.click(region('Headcount tally answer').getByRole('button', { name: /Show lineup/ }))
    await expect(region('Headcount tally answer').getByText('Positions')).toBeInTheDocument()

    await expect(region('Roster collapsed').queryByText('Positions')).not.toBeInTheDocument()
    await expect(
      region('Roster collapsed').getByRole('button', { name: /Show lineup/ }),
    ).toBeInTheDocument()

    await userEvent.click(region('Roster expanded — collapse').getByRole('button', { name: /Hide lineup/ }))
    await expect(region('Roster expanded — collapse').queryByText('Positions')).not.toBeInTheDocument()

    await expect(region('No panel').getByText('8 going')).toBeInTheDocument()
    await expect(region('No panel').queryByRole('button', { name: /Show/ })).not.toBeInTheDocument()
  },
}
