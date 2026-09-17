import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pencil, Trash2 } from 'lucide-react'
import { expect, fn, within } from 'storybook/test'
import type { EventDetail } from '@shared/api/events'
import { Button } from '@shared/ui/button'
import { makeAttendee, makeEvent, makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { Stack } from '@shared/testing/stack'
import { buildSeriesPeek } from '@entities/event/lib/series-peek'
import { appShell, SHELL_ROUTES } from '../../../../.storybook/app-shell-decorator'
import { pageModes } from '../../../../.storybook/modes'
import { EventDetailView } from './EventDetailView'

// The event-detail page as a phone shows it (ADR-0031 §3): sticky sub-header, identity, roster bar,
// the viewer's response, description, references, the attendance list, the series peek and the
// admin actions, inside the real app shell. This composite owns the pixels for PageHeader,
// EventTypeBadge/Icon, RosterBar, AttendanceToggle, ReferenceChips, RoleBreakdown, AttendeeList and
// SeriesPeek in context; those keep their own snapshots only as galleries or for states this frame
// cannot show.
const TEAM = [
  makeAttendee('u-me', 'Julius', 'Setter'),
  makeAttendee('u-2', 'Sanne', 'Setter'),
  makeAttendee('u-3', 'Lars', 'Libero'),
  makeAttendee('u-4', 'Sofia', 'Middle', { state: 'MAYBE' }),
  makeAttendee('u-5', 'Tim', 'Middle', { state: 'ABSENT' }),
  makeAttendee('u-6', 'Noor', 'Unassigned', { state: 'NOT_RESPONDED' }),
]

const SERIES = 'rg-1'
const on = (day: number) => new Date(2026, 7, day, 20, 0).toISOString()
const SIBLINGS = [
  makeEvent({ id: 'evt-1', recurringGroup: SERIES, startTime: on(5) }),
  makeEvent({ id: 'evt-2', recurringGroup: SERIES, startTime: on(12) }),
  makeEvent({ id: 'evt-3', recurringGroup: SERIES, startTime: on(19) }),
  makeEvent({ id: 'evt-4', recurringGroup: SERIES, startTime: on(26) }),
]

const EVENT: EventDetail = makeEvent({
  id: 'evt-2',
  eventType: { id: 'et-1', name: 'Training', color: '#249E6C' },
  title: 'Training — Court 2',
  description: 'Serve-receive drills first, then six-on-six. Bring both kits.',
  startTime: on(12),
  endTime: new Date(2026, 7, 12, 22, 0).toISOString(),
  location: 'Sporthal De Toekomst',
  references: [
    { title: 'Nevobo', url: 'https://api.nevobo.nl/permalink/wedstrijd/2018133' },
    { title: 'Match form', url: 'https://dwf.volleybal.nl/match/42' },
  ],
  recurringGroup: SERIES,
  attendances: TEAM,
  myState: 'ATTENDING',
  roster: makeRoster(),
})

const SOCIAL: EventDetail = makeEvent({
  id: 'evt-social',
  eventType: { id: 'et-3', name: 'Social', color: '#D9A23B' },
  title: 'Season kick-off drinks',
  startTime: on(22),
  endTime: new Date(2026, 7, 22, 23, 0).toISOString(),
  location: 'Café De Zon',
  attendances: TEAM,
  myState: 'ABSENT',
  attendanceSummary: {
    attending: 3,
    maybe: 1,
    absent: 1,
    notResponded: 1,
    roleBreakdown: [
      { role: 'Setter', attending: 2 },
      { role: 'Libero', attending: 1 },
    ],
  },
  roster: { ...NO_ROSTER, totalAttending: 3 },
})

const ADMIN_ACTIONS = (
  <>
    <Button variant="outline" className="flex-1">
      <Pencil size={15} />
      Edit event
    </Button>
    <Button variant="outline" className="flex-1 border-red/30 text-red hover:bg-red/5 hover:text-red">
      <Trash2 size={15} />
      Delete
    </Button>
  </>
)

const shell = appShell('events')

const meta = {
  title: 'pages/event-detail/EventDetailView',
  component: EventDetailView,
  decorators: shell.decorators,
  parameters: shell.parameters,
  args: {
    backTo: SHELL_ROUTES.events,
    event: EVENT,
    currentUserId: 'u-me',
    myState: 'ATTENDING',
    myAttribution: null,
    seriesPeek: buildSeriesPeek(SIBLINGS, EVENT.id),
    adminActions: ADMIN_ACTIONS,
    onRetry: fn(),
    onToggleMine: fn(),
    onRespond: fn(),
  },
} satisfies Meta<typeof EventDetailView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  // The page's picture, in dark and once at desktop width too (ADR-0031 §4-§5).
  parameters: { chromatic: { modes: pageModes } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Back to events' })).toHaveAttribute('href', SHELL_ROUTES.events)
    await expect(canvas.getByRole('heading', { level: 1, name: 'Training — Court 2' })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: /Sporthal De Toekomst/ })).toHaveAttribute(
      'href',
      'https://maps.google.com/?q=Sporthal%20De%20Toekomst',
    )
    // The viewer's own answer is the pressed one in the primary control.
    const mine = within(canvas.getByRole('group', { name: 'Your response' }))
    await expect(mine.getByRole('button', { name: 'Going' })).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByText('Serve-receive drills first, then six-on-six. Bring both kits.')).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'Nevobo' })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'Match form' })).toBeInTheDocument()
    // Everyone is listed, non-responders included (ADR-0030 §8).
    for (const name of ['Julius', 'Sanne', 'Lars', 'Sofia', 'Tim', 'Noor']) {
      await expect(canvas.getByText(name)).toBeInTheDocument()
    }
    await expect(canvas.getByRole('button', { name: 'Edit event' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    // The shell around it: the Events tab stays current on a detail route under it.
    await expect(canvas.getByRole('link', { name: 'Events' })).toHaveAttribute('aria-current', 'page')
  },
}

// The page's other frames, stacked: the two shells, the missing event, and a member (no admin
// actions) on a social — no roster, so the per-role fallback shows — whose answer a teammate set.
export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <EventDetailView {...args} event={null} isLoading />,
        Error: <EventDetailView {...args} event={null} isError />,
        'Not found': <EventDetailView {...args} event={null} />,
        'Member on a social': (
          <EventDetailView
            {...args}
            event={SOCIAL}
            myState="ABSENT"
            myAttribution="Tim de Vries"
            seriesPeek={null}
            adminActions={undefined}
          />
        ),
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    await expect(region('Loading').queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    await expect(region('Error').getByText("Couldn't load this event")).toBeInTheDocument()
    await expect(region('Error').getByRole('link', { name: 'Back to events' })).toBeInTheDocument()
    await expect(region('Not found').getByText('Event not found.')).toBeInTheDocument()

    const social = region('Member on a social')
    await expect(social.getByRole('heading', { level: 1, name: 'Season kick-off drinks' })).toBeInTheDocument()
    await expect(social.getByText('set by Tim de Vries')).toBeInTheDocument()
    await expect(social.queryByRole('button', { name: 'Edit event' })).not.toBeInTheDocument()
    await expect(social.queryByText('Additional info')).not.toBeInTheDocument()
  },
}

// Picture owned by Data — behavioural only (ADR-0031 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        Event: <EventDetailView {...args} />,
        Error: <EventDetailView {...args} event={null} isError />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    const page = region('Event')

    // The viewer changing their own answer goes through the primary control.
    await userEvent.click(within(page.getByRole('group', { name: 'Your response' })).getByRole('button', { name: 'Maybe' }))
    await expect(args.onToggleMine).toHaveBeenCalledWith('MAYBE')

    // Changing a teammate's answer goes through their row and names them (ADR-0003, trust-based).
    await userEvent.click(page.getByRole('button', { name: /Change Sofia's answer/ }))
    await expect(page.getByText(/Changing/)).toBeInTheDocument()
    await userEvent.click(within(page.getByRole('group', { name: "Sofia's answer" })).getByRole('button', { name: "Can't go" }))
    await expect(args.onRespond).toHaveBeenCalledWith('u-4', 'ABSENT')

    // The error shell's retry reaches the query.
    await userEvent.click(region('Error').getByRole('button', { name: /try again|retry/i }))
    await expect(args.onRetry).toHaveBeenCalled()
  },
}
