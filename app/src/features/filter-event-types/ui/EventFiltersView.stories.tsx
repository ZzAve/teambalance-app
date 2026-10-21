import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ComponentProps } from 'react'
import { expect, fn, within } from 'storybook/test'
import type { EventTypeItem } from '@shared/api/event-types'
import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import { makeEventType } from '@shared/testing/event-fixtures'
import { Stack } from '@shared/testing/stack'
import { ALL_ATTENDANCE_STATES } from '@entities/event/lib/attendance-states'
import { KeepPanelsOpenRow } from '@features/event-panel-view/ui/KeepPanelsOpenRow'
import { ALL_TURNOUT_BUCKETS, type TurnoutBucket } from '../model/turnout'
import { EventFiltersView } from './EventFiltersView'

// EventFiltersView is the events page's single filter control — the icon button plus the inline
// section, below the header, holding the type chips, the answer chips, the Turnout chips, the "Show
// past events" switch and the page's view switch as the last row. It replaces the old Upcoming/Past
// tab bar. Prop-only apart from the section's open/closed state; the three selections and the
// show-past flag live in the route, so every state here renders from props with no network
// (ADR-0017).
//
// Three stories (ADR-0032 §1, §3): this View is rendered inside the events page composite, which owns
// the closed picture, so Data is `disableSnapshot`. Shells stacks the closed-but-filtered states —
// clear filters visible, the announced result count, and the two configurations with a whole group
// missing — plus the open section, which the page composite never shows open. Interactions walks
// every toggle/close/announce assertion in sequence (open, act, assert, close).
const EVENT_TYPES: EventTypeItem[] = [
  makeEventType({ id: 'et-1', name: 'Training', color: '#249E6C' }),
  makeEventType({ id: 'et-2', name: 'Match', color: '#225C9C' }),
  makeEventType({ id: 'et-3', name: 'Tournament', color: '#7B5EA7' }),
]

const ALL = new Set(EVENT_TYPES.map((t) => t.id))
const ALL_STATES = new Set(ALL_ATTENDANCE_STATES)
const ALL_TURNOUTS = new Set(ALL_TURNOUT_BUCKETS)

/** The page's layout in miniature: the trigger at the right of a header row, the slot below it. */
function WithSlot(props: ComponentProps<typeof EventFiltersView>) {
  const [slot, setSlot] = useState<HTMLElement | null>(null)
  return (
    <div>
      <div className="flex justify-end">
        <EventFiltersView {...props} inlineSlot={slot} />
      </div>
      <div ref={setSlot} />
    </div>
  )
}

const meta = {
  title: 'features/filter-event-types/EventFiltersView',
  component: EventFiltersView,
  render: (args) => <WithSlot {...args} />,
  args: {
    inlineSlot: null,
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

// Picture owned by the page composite (pages/EventsPageView) — behavioural only (ADR-0032 §3).
export const Data: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Filters' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await expect(canvas.queryByRole('region', { name: 'Filters' })).not.toBeInTheDocument()
    // Nothing is filtered, so there is nothing to undo — the header stays as narrow as it was.
    await expect(canvas.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        // Filter state now survives navigation and reopening (ADR-0030 §1), so a member can arrive
        // at a narrowed list they did not narrow this visit. `Clear filters` is therefore visible
        // whenever any dimension is in effect — not only once the filter has emptied the list, which
        // is where it used to live (ADR-0030 §2).
        'Clear filters visible': (
          <WithSlot {...args} activeTypeIds={new Set(['et-2'])} resultCount={2} />
        ),
        // The result count is announced, not shown — a chip tap gives no other sign that the list
        // below moved. Rendered here closed: the sr-only region sits outside the section, so it
        // needs no interaction to read.
        'Announces result count': <WithSlot {...args} resultCount={1} />,
        // A fresh tenant, or a types request that failed, still renders closed exactly like the
        // unfiltered default — the difference only shows once the section opens (Interactions).
        'Without event types': <WithSlot {...args} eventTypes={[]} activeTypeIds={new Set<string>()} />,
        // A team that sets no targets also renders closed exactly like the unfiltered default.
        'Without turnout': <WithSlot {...args} showTurnout={false} />,
        // Opened by the play below: the page composite only ever shows the section closed.
        Open: (
          <WithSlot
            {...args}
            viewRow={<KeepPanelsOpenRow defaultExpanded={false} onDefaultExpandedChange={() => {}} />}
          />
        ),
      }}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(
      region('Clear filters visible').getByRole('button', { name: 'Clear filters' }),
    ).toBeInTheDocument()
    // Both signals, side by side: the dot says *that* something is filtered, the button says undo.
    await expect(region('Clear filters visible').getByTestId('active-filter-dot')).toBeInTheDocument()

    await expect(
      region('Announces result count').getByText('1 event matches these filters'),
    ).toBeInTheDocument()

    await expect(region('Without event types').queryByRole('region', { name: 'Filters' })).not.toBeInTheDocument()
    await expect(region('Without turnout').queryByRole('region', { name: 'Filters' })).not.toBeInTheDocument()

    await userEvent.click(region('Open').getByRole('button', { name: 'Filters' }))
    const open = within(region('Open').getByRole('region', { name: 'Filters' }))
    // All five parts of the section: the type chips, the answer chips, the Turnout chips, the
    // past-events switch and, last, the view switch the page hands in.
    await expect(open.getByRole('button', { name: 'Training' })).toBeInTheDocument()
    await expect(open.getByRole('group', { name: 'Your answer' })).toBeInTheDocument()
    await expect(open.getByRole('group', { name: 'Turnout' })).toBeInTheDocument()
    await expect(open.getByRole('switch', { name: 'Show past events' })).toHaveAttribute(
      'aria-checked',
      'false',
    )
    await expect(open.getByText('Off — upcoming only')).toBeInTheDocument()
    const switches = open.getAllByRole('switch')
    await expect(switches[switches.length - 1]).toHaveAccessibleName('Keep panels open')
    // The unfiltered default: every chip in every group is on, so nothing is hidden
    // (ADR-0029 §1), and the trigger carries no dot.
    const allChips = ['Going', 'Maybe', "Can't", 'Not responded',
      'Missing a position', 'Spots open', 'Covered', 'No target set']
    for (const label of allChips) {
      await expect(open.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true')
    }
    await expect(region('Open').queryByTestId('active-filter-dot')).not.toBeInTheDocument()
  },
}

// Picture owned by Data and Shells — behavioural only (ADR-0032 §1). Several instances because some
// steps need a state the default one is never in (no event types, no Turnout group, a narrowed
// selection already in effect). Each cycle below opens, acts, asserts, then closes (Escape) before
// the next opens, so a query never meets two open sections.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        Default: <WithSlot {...args} />,
        'Filtered to one type': <WithSlot {...args} activeTypeIds={new Set(['et-2'])} />,
        'Show past already on': <WithSlot {...args} showPast />,
        'Without event types': (
          <WithSlot {...args} eventTypes={[]} activeTypeIds={new Set<string>()} />
        ),
        'Filtered to not responded': (
          <WithSlot
            {...args}
            activeStates={new Set<AttendanceState>(['NOT_RESPONDED'])}
            resultCount={3}
          />
        ),
        'Filtered to missing a position': (
          <WithSlot
            {...args}
            activeTurnouts={new Set<TurnoutBucket>(['missing-position'])}
            resultCount={2}
          />
        ),
        'Without turnout': <WithSlot {...args} showTurnout={false} />,
        'Clear filters': <WithSlot {...args} activeTypeIds={new Set(['et-2'])} resultCount={2} />,
        'Clear filters, show past alone': <WithSlot {...args} showPast />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    const openFilters = async (name: string) =>
      userEvent.click(region(name).getByRole('button', { name: 'Filters' }))
    const closeFilters = () => userEvent.keyboard('{Escape}')

    // Every dimension counts: a chip tap reports its state/type/turnout id up to the route, which
    // runs it through the same isolate-first toggler as the other groups (ADR-0029 §3).
    await openFilters('Default')
    await userEvent.click(region('Default').getByRole('button', { name: 'Match' }))
    await expect(args.onToggleType).toHaveBeenCalledWith('et-2')
    await userEvent.click(region('Default').getByRole('switch', { name: 'Show past events' }))
    await expect(args.onToggleShowPast).toHaveBeenCalledWith(true)
    await userEvent.click(region('Default').getByRole('button', { name: 'Not responded' }))
    await expect(args.onToggleState).toHaveBeenCalledWith('NOT_RESPONDED')
    await userEvent.click(region('Default').getByRole('button', { name: 'Spots open' }))
    await expect(args.onToggleTurnout).toHaveBeenCalledWith('spots-open')
    // The section closes on a second tap of the trigger and on Escape — the Escape handler is on
    // the document, so it works wherever focus is.
    const trigger = region('Default').getByRole('button', { name: 'Filters' })
    await expect(region('Default').getByRole('region', { name: 'Filters' })).toBeInTheDocument()
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(region('Default').queryByRole('region', { name: 'Filters' })).not.toBeInTheDocument()
    await openFilters('Default')
    await closeFilters()
    await expect(region('Default').queryByRole('region', { name: 'Filters' })).not.toBeInTheDocument()

    // A narrowed selection is visible with the section open too: Match is pressed, Training is not.
    await openFilters('Filtered to one type')
    await expect(
      region('Filtered to one type').getByRole('button', { name: 'Match' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(
      region('Filtered to one type').getByRole('button', { name: 'Training' }),
    ).toHaveAttribute('aria-pressed', 'false')
    await closeFilters()

    // Switching back off is the same callback with the opposite value.
    await openFilters('Show past already on')
    await expect(
      region('Show past already on').getByRole('switch', { name: 'Show past events' }),
    ).toHaveAttribute('aria-checked', 'true')
    await expect(
      region('Show past already on').getByText('On — past events included'),
    ).toBeInTheDocument()
    await userEvent.click(region('Show past already on').getByRole('switch', { name: 'Show past events' }))
    await expect(args.onToggleShowPast).toHaveBeenLastCalledWith(false)
    await closeFilters()

    // With no event types to show — a fresh tenant, or a types request that failed — the section
    // still has to open and still has to offer the past toggle: it is the only route to past events
    // now.
    await openFilters('Without event types')
    await expect(region('Without event types').queryByText('Event types')).not.toBeInTheDocument()
    await userEvent.click(
      region('Without event types').getByRole('switch', { name: 'Show past events' }),
    )
    await expect(args.onToggleShowPast).toHaveBeenLastCalledWith(true)
    await closeFilters()

    // The isolated result: only what needs an answer. The other three chips are off. Adding a second
    // chip back is the OR case (ADR-0029 §2): "unanswered or maybe" — tapping from a subset toggles
    // rather than isolating.
    // The dot shows with the section shut too — an answer-only filter narrows the list just as
    // invisibly as a type filter does.
    await expect(
      region('Filtered to not responded').getByTestId('active-filter-dot'),
    ).toBeInTheDocument()
    await openFilters('Filtered to not responded')
    await expect(
      region('Filtered to not responded').getByRole('button', { name: 'Not responded' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(
      region('Filtered to not responded').getByRole('button', { name: 'Going' }),
    ).toHaveAttribute('aria-pressed', 'false')
    // Every type chip is still on — the dot on the trigger is the answer group's doing alone.
    await expect(
      region('Filtered to not responded').getByRole('button', { name: 'Training' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(region('Filtered to not responded').getByRole('button', { name: 'Maybe' }))
    await expect(args.onToggleState).toHaveBeenLastCalledWith('MAYBE')
    await closeFilters()

    // The isolated result: only the events short a whole position. The OR case again: "missing a
    // position or short of a few" — everything worth turning up for.
    // The dot shows with the section shut too, even though every event type is still selected — a
    // turnout-only filter narrows the list just as invisibly as a type filter does.
    await expect(
      region('Filtered to missing a position').getByTestId('active-filter-dot'),
    ).toBeInTheDocument()
    await openFilters('Filtered to missing a position')
    await expect(
      region('Filtered to missing a position').getByRole('button', { name: 'Missing a position' }),
    ).toHaveAttribute('aria-pressed', 'true')
    for (const label of ['Spots open', 'Covered', 'No target set']) {
      await expect(
        region('Filtered to missing a position').getByRole('button', { name: label }),
      ).toHaveAttribute('aria-pressed', 'false')
    }
    // Every answer chip is still on — the dot is the Turnout group's doing.
    await expect(
      region('Filtered to missing a position').getByRole('button', { name: 'Going' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(
      region('Filtered to missing a position').getByRole('button', { name: 'Spots open' }),
    )
    await expect(args.onToggleTurnout).toHaveBeenLastCalledWith('spots-open')
    await closeFilters()

    // A team that sets no targets gets TALLY_ONLY on every event, so the list spans one band and the
    // Turnout group is four chips that provably filter nothing. It is not rendered at all
    // (ADR-0029 §5) — the other groups, and the past toggle, carry on as before.
    await openFilters('Without turnout')
    await expect(region('Without turnout').queryByRole('group', { name: 'Turnout' })).not.toBeInTheDocument()
    await expect(
      region('Without turnout').queryByRole('button', { name: 'Spots open' }),
    ).not.toBeInTheDocument()
    await expect(region('Without turnout').getByRole('group', { name: 'Your answer' })).toBeInTheDocument()
    await expect(
      region('Without turnout').getByRole('switch', { name: 'Show past events' }),
    ).toBeInTheDocument()
    await closeFilters()

    // Prop-contract spy: the reset itself lives in the route (it owns all four dimensions), so this
    // view's whole job is to report the tap — from a narrowed type selection, and from "past events
    // on" alone, since every dimension counts as a filter (ADR-0030 §2).
    await userEvent.click(region('Clear filters').getByRole('button', { name: 'Clear filters' }))
    await expect(args.onClearFilters).toHaveBeenCalled()
    await userEvent.click(
      region('Clear filters, show past alone').getByRole('button', { name: 'Clear filters' }),
    )
    await expect(args.onClearFilters).toHaveBeenCalledTimes(2)
  },
}
