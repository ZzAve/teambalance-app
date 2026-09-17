import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { expect, fn, within } from 'storybook/test'
import type { Event } from '@shared/api/events'
import { Button } from '@shared/ui/button'
import { makeAttendee, makeEvent, makeEventType, makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { Stack } from '@shared/testing/stack'
import { selectHeroEvent } from '@entities/event/lib/next-event'
import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import { ALL_ATTENDANCE_STATES } from '@features/filter-event-types/model/attendance-states'
import { ALL_TURNOUT_BUCKETS, type TurnoutBucket } from '@features/filter-event-types/model/turnout'
import { filterEvents } from '@features/filter-event-types/model/filter-events'
import { emptyEventsMessage } from '@features/filter-event-types/model/empty-message'
import type { PanelView } from '@features/event-panel-view/model/panel-preferences'
import { BulkAttendBarView } from '@features/bulk-attend/ui/BulkAttendBarView'
import { groupByType } from '@features/bulk-attend/lib/group-by-type'
import { eligibleEvents } from '@features/bulk-attend/lib/eligible-event-ids'
import { NextEventHeroView } from '@widgets/next-event-hero/ui/NextEventHeroView'
import { EventRosterPanel } from '@widgets/event-panel/ui/EventRosterPanel'
import { appShell, SHELL_ROUTES } from '../../../../.storybook/app-shell-decorator'
import { pageModes } from '../../../../.storybook/modes'
import { EventsPageView } from './EventsPageView'

// The events page as a phone shows it (ADR-0031 §3): header, filter trigger, view menu, the Next Up
// hero, the bulk-attend bar and the card list, inside the real app shell. This composite owns the
// pixels for every piece it shows — EventFiltersView, PanelViewMenu, NextEventHeroView,
// BulkAttendBarView, EventListView, EventCard and the roster panel keep their own snapshots only
// for states this frame cannot show (a popover open, a shell).
//
// The Data and Interactions stories render through a small state harness (§6) so a person can
// actually use the page in Storybook — filters narrow the list, the hero re-picks itself, an RSVP
// flips the card — while the `play` still proves the callbacks fired.
const NOW = new Date(2026, 7, 10, 9, 0) // Monday 10 August 2026, 09:00 local
const at = (day: number, month = 7, hour = 20) => new Date(2026, month, day, hour, 0).toISOString()

const TRAINING = makeEventType({ id: 'et-1', name: 'Training', color: '#249E6C' })
const MATCH = makeEventType({ id: 'et-2', name: 'Match', color: '#225C9C' })
const SOCIAL = makeEventType({ id: 'et-3', name: 'Social', color: '#D9A23B' })
const TOURNAMENT = makeEventType({ id: 'et-4', name: 'Tournament', color: '#7B5EA7' })
const EVENT_TYPES = [TRAINING, MATCH, SOCIAL, TOURNAMENT]
const summary = (type: typeof TRAINING) => ({ id: type.id, name: type.name, color: type.color })

const TEAM = [
  makeAttendee('u-me', 'Julius', 'Setter'),
  makeAttendee('u-2', 'Sanne', 'Setter'),
  makeAttendee('u-3', 'Lars', 'Libero'),
  makeAttendee('u-4', 'Sofia', 'Middle', { state: 'MAYBE' }),
  makeAttendee('u-5', 'Tim', 'Middle', { state: 'ABSENT' }),
  makeAttendee('u-6', 'Noor', 'Unassigned', { state: 'NOT_RESPONDED' }),
]

// Within the hero window, unanswered → the Next Up hero, and one of the two trainings to bulk-attend.
const HERO_EVENT = makeEvent({
  id: 'evt-hero',
  eventType: summary(TRAINING),
  title: 'Training — Court 2',
  startTime: at(12),
  endTime: at(12, 7, 22),
  location: 'Sporthal De Toekomst',
  attendances: TEAM,
  attendanceSummary: { attending: 3, maybe: 1, absent: 1, notResponded: 1, roleBreakdown: [] },
  roster: makeRoster(),
})

const EVENTS: Event[] = [
  HERO_EVENT,
  makeEvent({
    id: 'evt-match',
    eventType: summary(MATCH),
    title: 'League Match vs Smash United',
    startTime: at(15),
    endTime: at(15, 7, 22),
    location: 'Sporthal Oost',
    myState: 'ATTENDING',
    attendances: TEAM,
    roster: makeRoster({
      state: 'LINEUP_SET',
      totalAttending: 5,
      positions: [
        { id: 'pos-setter', label: 'Setter', required: 2, attending: 2, kind: 'PLAYING' },
        { id: 'pos-libero', label: 'Libero', required: 1, attending: 1, kind: 'PLAYING' },
        { id: 'pos-middle', label: 'Middle', required: 2, attending: 2, kind: 'PLAYING' },
      ],
    }),
  }),
  makeEvent({
    id: 'evt-training-2',
    eventType: summary(TRAINING),
    title: 'Training — Court 1',
    startTime: at(19),
    endTime: at(19, 7, 22),
    attendances: TEAM,
    roster: makeRoster({
      state: 'CRITICAL',
      totalAttending: 3,
      positions: [
        { id: 'pos-setter', label: 'Setter', required: 2, attending: 2, kind: 'PLAYING' },
        { id: 'pos-libero', label: 'Libero', required: 1, attending: 0, kind: 'PLAYING' },
        { id: 'pos-middle', label: 'Middle', required: 2, attending: 1, kind: 'PLAYING' },
      ],
    }),
  }),
  makeEvent({
    id: 'evt-social',
    eventType: summary(SOCIAL),
    title: 'Season kick-off drinks',
    startTime: at(22),
    endTime: at(22, 7, 23),
    location: 'Café De Zon',
    attendances: TEAM,
    attendanceSummary: { attending: 8, maybe: 0, absent: 0, notResponded: 3, roleBreakdown: [] },
    roster: { ...NO_ROSTER, totalAttending: 8 },
  }),
  makeEvent({
    id: 'evt-tournament',
    eventType: summary(TOURNAMENT),
    title: 'Beach tournament Scheveningen',
    startTime: at(5, 8, 10),
    endTime: at(5, 8, 18),
    myState: 'MAYBE',
    attendances: TEAM,
    roster: makeRoster(),
  }),
]

const ALL_TYPE_IDS = EVENT_TYPES.map((t) => t.id)

interface HarnessArgs {
  events: Event[]
  isAdmin: boolean
  onToggleType: (typeId: string) => void
  onToggleState: (state: AttendanceState) => void
  onToggleShowPast: (showPast: boolean) => void
  onViewChange: (view: PanelView) => void
  onHeroRespond: (state: AttendanceState) => void
  onRespond: (eventId: string, state: AttendanceState) => void
  onAttend: (typeId: string) => void
}

function toggled<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  return next
}

/** The route's deciding, in miniature: filters, hero pick, bulk eligibility and an optimistic RSVP. */
function EventsPageHarness(args: HarnessArgs) {
  const [activeTypeIds, setActiveTypeIds] = useState(new Set(ALL_TYPE_IDS))
  const [activeStates, setActiveStates] = useState(new Set(ALL_ATTENDANCE_STATES))
  const [activeTurnouts, setActiveTurnouts] = useState(new Set<TurnoutBucket>(ALL_TURNOUT_BUCKETS))
  const [showPast, setShowPast] = useState(false)
  const [view, setView] = useState<PanelView>('pips')
  const [defaultExpanded, setDefaultExpanded] = useState(false)
  const [answers, setAnswers] = useState<Record<string, AttendanceState>>({})

  const events = args.events.map((e) => (answers[e.id] ? { ...e, myState: answers[e.id] } : e))
  const sorted = [...filterEvents(events, activeTypeIds, activeStates, activeTurnouts)].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  )
  const hero = selectHeroEvent(sorted, NOW)
  const listEvents = hero ? sorted.filter((e) => e.id !== hero.id) : sorted
  const groups = groupByType(eligibleEvents(sorted, activeTypeIds, NOW))

  return (
    <EventsPageView
      createAction={
        args.isAdmin && (
          <Button>
            <Plus size={16} />
            New Event
          </Button>
        )
      }
      filters={{
        eventTypes: EVENT_TYPES,
        activeTypeIds,
        activeStates,
        activeTurnouts,
        showTurnout: true,
        showPast,
        resultCount: sorted.length,
        onToggleType: (id) => {
          args.onToggleType(id)
          setActiveTypeIds((s) => toggled(s, id))
        },
        onToggleState: (state) => {
          args.onToggleState(state)
          setActiveStates((s) => toggled(s, state))
        },
        onToggleTurnout: (bucket) => setActiveTurnouts((s) => toggled(s, bucket)),
        onToggleShowPast: (next) => {
          args.onToggleShowPast(next)
          setShowPast(next)
        },
        onClearFilters: () => {
          setActiveTypeIds(new Set(ALL_TYPE_IDS))
          setActiveStates(new Set(ALL_ATTENDANCE_STATES))
          setActiveTurnouts(new Set(ALL_TURNOUT_BUCKETS))
          setShowPast(false)
        },
      }}
      panelMenu={{
        view,
        onViewChange: (next) => {
          args.onViewChange(next)
          setView(next)
        },
        defaultExpanded,
        onDefaultExpandedChange: setDefaultExpanded,
      }}
      hero={
        hero && (
          <NextEventHeroView
            event={hero}
            myState={hero.myState}
            now={NOW}
            onRespond={(state) => {
              args.onHeroRespond(state)
              setAnswers((a) => ({ ...a, [hero.id]: state }))
            }}
          />
        )
      }
      bulkBar={<BulkAttendBarView groups={groups} onAttend={args.onAttend} />}
      list={{
        events: listEvents,
        now: NOW,
        currentUserId: 'u-me',
        defaultRosterOpen: defaultExpanded,
        onRespond: (eventId, state) => {
          args.onRespond(eventId, state)
          setAnswers((a) => ({ ...a, [eventId]: state }))
        },
        rosterPanel: (event) => (
          <EventRosterPanel
            event={event}
            view={view}
            currentUserId="u-me"
            detailHref={`${SHELL_ROUTES.events}/events/${event.id}`}
          />
        ),
        emptyMessage: emptyEventsMessage({
          hasHero: hero !== null,
          showPast,
          activeTypeIds,
          allTypeIds: ALL_TYPE_IDS,
          activeStates,
          activeTurnouts,
        }),
      }}
    />
  )
}

const shell = appShell('events')

const meta = {
  title: 'pages/events/EventsPageView',
  component: EventsPageHarness,
  decorators: shell.decorators,
  parameters: shell.parameters,
  args: {
    events: EVENTS,
    isAdmin: true,
    onToggleType: fn(),
    onToggleState: fn(),
    onToggleShowPast: fn(),
    onViewChange: fn(),
    onHeroRespond: fn(),
    onRespond: fn(),
    onAttend: fn(),
  },
} satisfies Meta<typeof EventsPageHarness>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  // The page's picture, in dark and once at desktop width too (ADR-0031 §4-§5).
  parameters: { chromatic: { modes: pageModes } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Events' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'New Event' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Filters' })).toHaveAttribute('aria-expanded', 'false')
    // The hero holds the one event within the window, and the list does not repeat it.
    await expect(canvas.getByText('Next up')).toBeInTheDocument()
    await expect(canvas.getAllByText('Training — Court 2')).toHaveLength(1)
    await expect(canvas.getByRole('button', { name: /I'm in/ })).toHaveAttribute('aria-pressed', 'false')
    // Bulk Attend reads the same list the page shows: two unanswered trainings, one social.
    await expect(canvas.getByRole('button', { name: 'Attend 2 trainings' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Attend 1 social' })).toBeInTheDocument()
    for (const title of [
      'League Match vs Smash United',
      'Training — Court 1',
      'Season kick-off drinks',
      'Beach tournament Scheveningen',
    ]) {
      await expect(canvas.getByText(title)).toBeInTheDocument()
    }
    // The shell around it: the team is named up top and the Events tab is the current one.
    await expect(canvas.getByText('Setpoint VT')).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'Events' })).toHaveAttribute('aria-current', 'page')
  },
}

const noop = () => {}
const STATIC = {
  filters: {
    eventTypes: EVENT_TYPES,
    activeTypeIds: new Set(ALL_TYPE_IDS),
    activeStates: new Set(ALL_ATTENDANCE_STATES),
    activeTurnouts: new Set<TurnoutBucket>(ALL_TURNOUT_BUCKETS),
    showTurnout: true,
    showPast: false,
    resultCount: 0,
    onToggleType: noop,
    onToggleState: noop,
    onToggleTurnout: noop,
    onToggleShowPast: noop,
    onClearFilters: noop,
  },
  panelMenu: { view: 'pips' as const, onViewChange: noop, defaultExpanded: false, onDefaultExpandedChange: noop },
}

// The page's non-data frames, stacked: no hero in any of them, so the list carries the page.
export const Shells: Story = {
  render: () => (
    <Stack
      items={{
        Loading: <EventsPageView {...STATIC} list={{ events: [], isLoading: true, now: NOW }} />,
        Error: <EventsPageView {...STATIC} list={{ events: [], error: new Error('boom'), now: NOW }} />,
        Empty: <EventsPageView {...STATIC} list={{ events: [], now: NOW }} />,
        'Filtered to nothing': (
          <EventsPageView
            {...STATIC}
            filters={{ ...STATIC.filters, activeTypeIds: new Set([SOCIAL.id]) }}
            list={{ events: [], now: NOW, emptyMessage: 'No events for this type.' }}
          />
        ),
        'Nothing within the week': (
          <EventsPageView
            {...STATIC}
            bulkBar={<BulkAttendBarView groups={groupByType([EVENTS[4]])} onAttend={noop} />}
            list={{ events: [EVENTS[4]], now: NOW, currentUserId: 'u-me' }}
          />
        ),
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    await expect(region('Loading').getByRole('status', { name: /loading events/i })).toBeInTheDocument()
    await expect(region('Error').getByText(/couldn't load events/i)).toBeInTheDocument()
    await expect(region('Empty').getByText('No upcoming events.')).toBeInTheDocument()
    await expect(region('Filtered to nothing').getByText('No events for this type.')).toBeInTheDocument()
    // A filter in effect is never invisible (ADR-0030 §2): the undo sits beside the trigger.
    await expect(
      region('Filtered to nothing').getByRole('button', { name: 'Clear filters' }),
    ).toBeInTheDocument()
    await expect(region('Nothing within the week').queryByText('Next up')).not.toBeInTheDocument()
    await expect(region('Nothing within the week').getByText('Beach tournament Scheveningen')).toBeInTheDocument()
    await expect(canvas.queryByText('Next up')).not.toBeInTheDocument()
  },
}

// Picture owned by Data — behavioural only (ADR-0031 §1). Every slot's wiring, in one walk.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    // RSVP from the hero: the callback fires and the harness flips the hero's own state.
    await userEvent.click(canvas.getByRole('button', { name: /I'm in/ }))
    await expect(args.onHeroRespond).toHaveBeenCalledWith('ATTENDING')
    await expect(canvas.getByRole('button', { name: /I'm in/ })).toHaveAttribute('aria-pressed', 'true')
    // …and Bulk Attend no longer counts that training.
    await expect(canvas.getByRole('button', { name: 'Attend 1 training' })).toBeInTheDocument()

    // Hide trainings: the callback fires, the hero re-picks the next event in the window.
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Training' }))
    await expect(args.onToggleType).toHaveBeenCalledWith(TRAINING.id)
    await userEvent.keyboard('{Escape}')
    await expect(canvas.queryByText('Training — Court 1')).not.toBeInTheDocument()
    await expect(canvas.getAllByText('League Match vs Smash United')).toHaveLength(1)
    await expect(canvas.getByRole('button', { name: /Can't make it/ })).toBeInTheDocument()
    // Undo it so the list below is whole again.
    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }))
    await expect(canvas.getByText('Training — Court 1')).toBeInTheDocument()

    // The view menu re-draws every card's roster panel.
    await userEvent.click(canvas.getByRole('button', { name: 'View options' }))
    await userEvent.click(canvas.getByRole('button', { name: 'People' }))
    await expect(args.onViewChange).toHaveBeenCalledWith('members')
    await userEvent.keyboard('{Escape}')

    // Answering from a card: the match and the tournament are already answered, so their rows read
    // "Change your answer"; the list is chronological, so the first is the match. Picking Maybe
    // reports the event and the state.
    await userEvent.click(canvas.getAllByRole('button', { name: /Change your answer/ })[0])
    await userEvent.click(canvas.getByRole('button', { name: /^Maybe$/ }))
    await expect(args.onRespond).toHaveBeenCalledWith('evt-match', 'MAYBE')

    // Bulk Attend reports the type it stands for.
    await userEvent.click(canvas.getByRole('button', { name: 'Attend 1 social' }))
    await expect(args.onAttend).toHaveBeenCalledWith(SOCIAL.id)
  },
}
