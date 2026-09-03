import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import type { Event } from '@shared/api/events'
import { makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { EventAnswerRow } from './EventAnswerRow'

type AttendanceState = Event['myState']

// The card's bottom row: two independent disclosures — attendance (left) and roster (right). Each
// opens its own panel; both can be open at once, with the attendance panel always above. Prop-only
// apart from the two open states (ADR-0017), so every combination is just props.
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

// ── Collapsed — the row shows my answer (left) and the verdict (right), nothing expanded ─────────

export const Unanswered: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Going?')).toBeInTheDocument()
    await expect(canvas.getByText('1 spot open')).toBeInTheDocument()
    // Neither panel is open until asked.
    await expect(canvas.queryByRole('button', { name: /^Going$/ })).not.toBeInTheDocument()
    await expect(canvas.queryByText('Positions')).not.toBeInTheDocument()
    // Both sides are their own trigger.
    await expect(canvas.getByRole('button', { name: /Change your answer/ })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /Show lineup/ })).toBeInTheDocument()
  },
}

export const Attending: Story = {
  args: { myState: 'ATTENDING' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("You're in")).toBeInTheDocument()
  },
}

// ── One side at a time — tapping a trigger opens only its own panel ──────────────────────────────

export const OpenAttendanceOnly: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Change your answer/ }))
    // The three-way control is shown…
    await expect(canvas.getByRole('button', { name: /^Going$/ })).toBeInTheDocument()
    // …and the roster panel stays closed.
    await expect(canvas.queryByText('Positions')).not.toBeInTheDocument()
  },
}

export const OpenRosterOnly: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Show lineup/ }))
    // The pips are shown…
    await expect(canvas.getByText('Positions')).toBeInTheDocument()
    // …and the answer control stays closed.
    await expect(canvas.queryByRole('button', { name: /^Going$/ })).not.toBeInTheDocument()
  },
}

// Both open, opened roster-first: the attendance panel must still sit ABOVE the roster panel (①).
export const BothOpenAttendanceOnTop: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Show lineup/ }))
    await userEvent.click(canvas.getByRole('button', { name: /Change your answer/ }))

    const going = canvas.getByRole('button', { name: /^Going$/ })
    const positions = canvas.getByText('Positions')
    await expect(going).toBeInTheDocument()
    await expect(positions).toBeInTheDocument()
    // Attendance renders above the roster panel regardless of which was opened first.
    await expect(going.getBoundingClientRect().top).toBeLessThan(positions.getBoundingClientRect().top)
  },
}

// ── Wiring — prove the answer callback, not just the render ──────────────────────────────────────

export const AnswerIsReported: Story = {
  args: { defaultAttnOpen: true, myState: 'ATTENDING' },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole('button', { name: /^Going$/ })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(canvas.getByRole('button', { name: /^Maybe$/ }))
    await expect(args.onRespond).toHaveBeenCalledWith('MAYBE')
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

export const CollapseOnPick: Story = {
  args: { defaultAttnOpen: true, defaultRosterOpen: true },
  render: (args) => <CollapseOnPickHarness {...args} />,
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText('Going?')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: /^Going$/ }))

    // Attendance panel collapsed…
    await expect(canvas.queryByRole('button', { name: /^Going$/ })).not.toBeInTheDocument()
    // …the pill flipped optimistically…
    await expect(canvas.getByText("You're in")).toBeInTheDocument()
    // …the roster panel stayed open…
    await expect(canvas.getByText('Positions')).toBeInTheDocument()
    // …and the answer was reported.
    await expect(args.onRespond).toHaveBeenCalledWith('ATTENDING')
  },
}

// The pending state (⑤): the badge dims while the write settles and the control is held.
export const Pending: Story = {
  args: { defaultAttnOpen: true, myState: 'ATTENDING', pending: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('1 spot open')).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getByRole('button', { name: /^Going$/ })).toBeDisabled()
  },
}

// ── Headcount fallback (⑥) — right side ────────────────────────────────────────────────────────

// A social: tracking off, so there is no lineup. The right side is a plain headcount, NOT a trigger.
export const HeadcountFallbackOff: Story = {
  args: { roster: { ...NO_ROSTER, totalAttending: 8 } },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('8 going')).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: /Show lineup/ })).not.toBeInTheDocument()
    // Answering still works.
    await userEvent.click(canvas.getByRole('button', { name: /Change your answer/ }))
    await expect(canvas.getByRole('button', { name: /^Going$/ })).toBeInTheDocument()
  },
}

// Tracking on but no targets — still no verdict, so the badge shows the headcount, but there ARE
// per-position rows to open.
export const HeadcountFallbackTallyOnly: Story = {
  args: { roster: makeRoster({ state: 'TALLY_ONLY', openSlots: 0, totalAttending: 5, positions: [] }) },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('5 going')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: /Show lineup/ }))
    await expect(canvas.getByText('Positions')).toBeInTheDocument()
  },
}
