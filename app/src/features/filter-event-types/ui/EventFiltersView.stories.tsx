import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import type { EventTypeItem } from '@shared/api/event-types'
import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import { makeEventType } from '@shared/testing/event-fixtures'
import { ALL_ATTENDANCE_STATES } from '../model/attendance-states'
import { ALL_TURNOUT_BUCKETS, type TurnoutBucket } from '../model/turnout'
import { EventFiltersView } from './EventFiltersView'

// EventFiltersView is the events page's single filter control — the icon button plus the popover
// holding the type chips, the answer chips, the Turnout chips and the "Show past events" switch. It
// replaces the old Upcoming/Past tab bar. Prop-only apart from the popover's open/closed state; the
// three selections and the show-past flag live in the route, so every state here renders from props
// with no network (ADR-0017).
const EVENT_TYPES: EventTypeItem[] = [
  makeEventType({ id: 'et-1', name: 'Training', color: '#249E6C' }),
  makeEventType({ id: 'et-2', name: 'Match', color: '#225C9C' }),
  makeEventType({ id: 'et-3', name: 'Tournament', color: '#7B5EA7' }),
]

const ALL = new Set(EVENT_TYPES.map((t) => t.id))
const ALL_STATES = new Set(ALL_ATTENDANCE_STATES)
const ALL_TURNOUTS = new Set(ALL_TURNOUT_BUCKETS)

const meta = {
  title: 'features/filter-event-types/EventFiltersView',
  component: EventFiltersView,
  args: {
    eventTypes: EVENT_TYPES,
    activeTypeIds: ALL,
    activeStates: ALL_STATES,
    activeTurnouts: ALL_TURNOUTS,
    showTurnout: true,
    showPast: false,
    resultCount: 7,
    onToggleType: fn(),
    onToggleState: fn(),
    onToggleTurnout: fn(),
    onToggleShowPast: fn(),
    onClearFilters: fn(),
  },
} satisfies Meta<typeof EventFiltersView>

export default meta

type Story = StoryObj<typeof meta>

export const Closed: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Filters' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument()
    // Nothing is filtered, so there is nothing to undo — the header stays as narrow as it was.
    await expect(canvas.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument()
  },
}

// Filter state now survives navigation and reopening (ADR-0030 §1), so a member can arrive at a
// narrowed list they did not narrow this visit. `Clear filters` is therefore visible whenever any
// dimension is in effect — not only once the filter has emptied the list, which is where it used to
// live (ADR-0030 §2).
export const ClearFiltersVisible: Story = {
  args: { activeTypeIds: new Set(['et-2']), resultCount: 2 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument()
    // Both signals, side by side: the dot says *that* something is filtered, the button says undo.
    await expect(canvas.getByTestId('active-filter-dot')).toBeInTheDocument()
  },
}

// Prop-contract spy: the reset itself lives in the route (it owns all four dimensions), so this
// view's whole job is to report the tap.
export const ClearsFilters: Story = {
  // Behavioural twin of ClearFiltersVisible — the same picture, only onClearFilters fires
  // (ADR-0027 §2).
  args: { activeTypeIds: new Set(['et-2']), resultCount: 2 },
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }))
    await expect(args.onClearFilters).toHaveBeenCalled()
  },
}

// Every dimension counts, not just the chips: past events on is a filter too, and reaching the
// switch that turned it on means opening the popover first.
export const ClearFiltersVisibleForShowPastAlone: Story = {
  args: { showPast: true },
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }))
    await expect(args.onClearFilters).toHaveBeenCalled()
  },
}

export const Open: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await expect(canvas.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument()
    // All four parts of the popover: the type chips, the answer chips, the Turnout chips and the
    // past-events switch.
    await expect(canvas.getByRole('button', { name: 'Training' })).toBeInTheDocument()
    await expect(canvas.getByRole('group', { name: 'Your answer' })).toBeInTheDocument()
    await expect(canvas.getByRole('group', { name: 'Turnout' })).toBeInTheDocument()
    await expect(canvas.getByRole('switch', { name: 'Show past events' })).toHaveAttribute(
      'aria-checked',
      'false',
    )
    await expect(canvas.getByText('Off — upcoming only')).toBeInTheDocument()
    // The unfiltered default: every chip in every group is on, so nothing is hidden
    // (ADR-0029 §1), and the trigger carries no dot.
    const allChips = ['Going', 'Maybe', "Can't", 'Not responded',
      'Missing a position', 'Spots open', 'Covered', 'No target set']
    for (const label of allChips) {
      await expect(canvas.getByRole('button', { name: label })).toHaveAttribute(
        'aria-pressed',
        'true',
      )
    }
    await expect(canvas.queryByTestId('active-filter-dot')).not.toBeInTheDocument()
  },
}

// Prop-contract spy: a chip tap must report the tapped type id up to the route, which owns the
// isolate-first selection rule (toggleTypeSelection).
export const TogglesType: Story = {
  // Behavioural twin of Open — the open popover is the same picture; only onToggleType fires
  // (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Match' }))
    await expect(args.onToggleType).toHaveBeenCalledWith('et-2')
  },
}

// Prop-contract spy: the switch reports the value it is moving *to*, which is what drives
// useEvents(showPast).
export const TogglesShowPast: Story = {
  // Behavioural twin of Open — the open popover is the same picture; only onToggleShowPast fires
  // (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await userEvent.click(canvas.getByRole('switch', { name: 'Show past events' }))
    await expect(args.onToggleShowPast).toHaveBeenCalledWith(true)
  },
}

export const ShowingPast: Story = {
  args: { showPast: true },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await expect(canvas.getByRole('switch', { name: 'Show past events' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await expect(canvas.getByText('On — past events included')).toBeInTheDocument()
    // Switching back off is the same callback with the opposite value.
    await userEvent.click(canvas.getByRole('switch', { name: 'Show past events' }))
    await expect(args.onToggleShowPast).toHaveBeenCalledWith(false)
  },
}

export const ClosesOnEscape: Story = {
  // Behavioural twin of Closed — Escape settles back to the shut popover (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await expect(canvas.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument()
    // Focus is still on the trigger, which is a sibling of the panel — Escape is caught on the
    // document, so it has to work from there.
    await userEvent.keyboard('{Escape}')
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument()
  },
}

// With no event types to show — a fresh tenant, or a types request that failed — the popover still
// has to open and still has to offer the past toggle: it is the only route to past events now.
export const WithoutEventTypes: Story = {
  args: { eventTypes: [], activeTypeIds: new Set<string>() },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await expect(canvas.queryByText('Event types')).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('switch', { name: 'Show past events' }))
    await expect(args.onToggleShowPast).toHaveBeenCalledWith(true)
  },
}

// A narrowed selection has to be visible with the popover shut, or a filtered list reads as an
// empty one.
export const FilteredToOneType: Story = {
  args: { activeTypeIds: new Set(['et-2']) },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await expect(canvas.getByRole('button', { name: 'Match' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(canvas.getByRole('button', { name: 'Training' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  },
}

// Prop-contract spy: an answer chip reports its state up to the route, which runs it through the
// same isolate-first toggler as the type chips (ADR-0029 §3). From the all-on default that one tap
// isolates "Not responded" — a plain toggle would remove the very status the member wanted.
export const TogglesState: Story = {
  // Behavioural twin of Open — the open popover is the same picture; only onToggleState fires
  // (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Not responded' }))
    await expect(args.onToggleState).toHaveBeenCalledWith('NOT_RESPONDED')
  },
}

// The isolated result: only what needs an answer. The other three chips are off, and the trigger
// shows the dot even though every event type is still selected — an answer-only filter narrows the
// list just as invisibly as a type filter does.
export const FilteredToNotResponded: Story = {
  args: { activeStates: new Set<AttendanceState>(['NOT_RESPONDED']), resultCount: 3 },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByTestId('active-filter-dot')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await expect(canvas.getByRole('button', { name: 'Not responded' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(canvas.getByRole('button', { name: 'Going' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    // Every type chip is still on — the dot is the answer group's doing.
    await expect(canvas.getByRole('button', { name: 'Training' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  },
}

// Adding a second chip back is the OR case (ADR-0029 §2): "unanswered or maybe" — the two an
// organiser chases. Tapping from a subset toggles rather than isolating.
export const TogglesSecondStateBackOn: Story = {
  // Behavioural twin of FilteredToNotResponded — same picture, only onToggleState fires
  // (ADR-0027 §2).
  args: { activeStates: new Set<AttendanceState>(['NOT_RESPONDED']), resultCount: 3 },
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Maybe' }))
    await expect(args.onToggleState).toHaveBeenCalledWith('MAYBE')
  },
}

// The result count is announced, not shown — a chip tap inside the popover gives no other sign that
// the list behind it moved.
export const AnnouncesResultCount: Story = {
  // Behavioural twin of Open — the sr-only region is invisible (ADR-0027 §2).
  args: { resultCount: 1 },
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('1 event matches these filters')).toBeInTheDocument()
  },
}

// Prop-contract spy: a Turnout chip reports its band up to the route, which runs it through the
// same isolate-first toggler as the other two groups (ADR-0029 §3). One tap from the all-on default
// isolates "Spots open" — the events a member can actually do something about by turning up.
export const TogglesTurnout: Story = {
  // Behavioural twin of Open — the open popover is the same picture; only onToggleTurnout fires
  // (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Spots open' }))
    await expect(args.onToggleTurnout).toHaveBeenCalledWith('spots-open')
  },
}

// The isolated result: only the events short a whole position. The dot shows even though every type
// and every answer is still selected — turnout narrows the list just as invisibly.
export const FilteredToMissingAPosition: Story = {
  args: { activeTurnouts: new Set<TurnoutBucket>(['missing-position']), resultCount: 2 },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByTestId('active-filter-dot')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await expect(canvas.getByRole('button', { name: 'Missing a position' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    for (const label of ['Spots open', 'Covered', 'No target set']) {
      await expect(canvas.getByRole('button', { name: label })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
    }
    // Every answer chip is still on — the dot is the Turnout group's doing.
    await expect(canvas.getByRole('button', { name: 'Going' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  },
}

// The OR case (ADR-0029 §2): "missing a position or short of a few" — everything worth turning up
// for. Tapping from a subset toggles rather than isolating.
export const TogglesSecondTurnoutBackOn: Story = {
  // Behavioural twin of FilteredToMissingAPosition — same picture, only onToggleTurnout fires
  // (ADR-0027 §2).
  args: { activeTurnouts: new Set<TurnoutBucket>(['missing-position']), resultCount: 2 },
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Spots open' }))
    await expect(args.onToggleTurnout).toHaveBeenCalledWith('spots-open')
  },
}

// A team that sets no targets gets TALLY_ONLY on every event, so the list spans one band and the
// group is four chips that provably filter nothing. It is not rendered at all (ADR-0029 §5) — the
// other groups, and the past toggle, carry on as before.
export const WithoutTurnout: Story = {
  args: { showTurnout: false },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await expect(canvas.queryByRole('group', { name: 'Turnout' })).not.toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Spots open' })).not.toBeInTheDocument()
    await expect(canvas.getByRole('group', { name: 'Your answer' })).toBeInTheDocument()
    await expect(canvas.getByRole('switch', { name: 'Show past events' })).toBeInTheDocument()
  },
}
