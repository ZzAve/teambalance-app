import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import type { Event } from '@shared/api/events'
import { makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { EventAnswerRow } from './EventAnswerRow'

type AttendanceState = Event['myState']

// The card's bottom row: the viewer's own answer + the readiness verdict, the whole row one tap
// target opening a panel with the three-way control above the pips. Prop-only apart from the open
// state (ADR-0017), so answer state × roster state × open/collapsed are all just props.
const meta = {
  title: 'entities/event/EventAnswerRow',
  component: EventAnswerRow,
  args: { roster: makeRoster(), myState: 'NOT_RESPONDED', onRespond: fn() },
  decorators: [
    (Story) => (
      <div className="max-w-md rounded-xl border border-border bg-card p-3.5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EventAnswerRow>

export default meta

type Story = StoryObj<typeof meta>

// ── Collapsed answer states — the pill says what I answered, in words ────────────────────────────

// The one state that asks for something, drawn as a prompt.
export const Unanswered: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Going?')).toBeInTheDocument()
    // Collapsed: the three-way control is not on the row until asked.
    await expect(canvas.queryByRole('button', { name: 'Going' })).not.toBeInTheDocument()
    await expect(canvas.getByText('1 spot open')).toBeInTheDocument()
  },
}

export const Attending: Story = {
  args: { myState: 'ATTENDING' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("You're in")).toBeInTheDocument()
  },
}

export const SaidMaybe: Story = {
  args: { myState: 'MAYBE' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('You said maybe')).toBeInTheDocument()
  },
}

export const Out: Story = {
  args: { myState: 'ABSENT' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("You're out")).toBeInTheDocument()
  },
}

// ── Headcount fallback (⑥) — two roster states carry no verdict, so the right slot shows who's coming

export const HeadcountFallbackOff: Story = {
  args: { roster: { ...NO_ROSTER, totalAttending: 8 } },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('8 going')).toBeInTheDocument()
    // A social still opens to an answer control — the row is one tap target for every event (③).
    await userEvent.click(canvas.getByRole('button', { name: /Change your answer/ }))
    await expect(canvas.getByRole('button', { name: 'Going' })).toBeInTheDocument()
    // …but with no targets there are no pips to show.
    await expect(canvas.queryByText('Positions')).not.toBeInTheDocument()
  },
}

export const HeadcountFallbackTallyOnly: Story = {
  args: { roster: makeRoster({ state: 'TALLY_ONLY', openSlots: 0, totalAttending: 5, positions: [] }) },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('5 going')).toBeInTheDocument()
  },
}

// ── Expanded — the panel holds the control above the pips, and the control is wired ──────────────

export const Expanded: Story = {
  args: { defaultOpen: true, myState: 'ATTENDING' },
  play: async ({ canvas, userEvent, args }) => {
    // The control sits above the position pips, both visible at once (the whole point of ③).
    await expect(canvas.getByRole('button', { name: 'Going' })).toBeInTheDocument()
    await expect(canvas.getByText('Positions')).toBeInTheDocument()
    // The current answer is the pressed segment.
    await expect(canvas.getByRole('button', { name: 'Going' })).toHaveAttribute('aria-pressed', 'true')

    // Prove the wiring, not just the render.
    await userEvent.click(canvas.getByRole('button', { name: 'Maybe' }))
    await expect(args.onRespond).toHaveBeenCalledWith('MAYBE')
  },
}

// Collapse-on-pick (④) as its own story: the harness models the container's optimistic update so the
// end-to-end behaviour — panel closes AND the pill flips — can be asserted.
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

export const CollapseOnPick: Story = {
  args: { defaultOpen: true },
  render: (args) => <CollapseOnPickHarness {...args} />,
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText('Going?')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Going' }))

    // The panel collapsed…
    await expect(canvas.queryByRole('button', { name: 'Going' })).not.toBeInTheDocument()
    // …the pill flipped optimistically…
    await expect(canvas.getByText("You're in")).toBeInTheDocument()
    // …and the answer was reported.
    await expect(args.onRespond).toHaveBeenCalledWith('ATTENDING')
  },
}

// The pending state (⑤): the badge dims while the write settles and the control is held.
export const Pending: Story = {
  args: { defaultOpen: true, myState: 'ATTENDING', pending: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('1 spot open')).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getByRole('button', { name: 'Going' })).toBeDisabled()
  },
}
