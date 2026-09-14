import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Event, EventDetail } from '@shared/api/events'
import type { EventTypeItem } from '@shared/api/event-types'
import { makeEvent, makeEventType, NO_ROSTER } from '@shared/testing/event-fixtures'
import { Stack } from '@shared/testing/stack'
import { EditEventDialogView } from './EditEventDialogView'

// EditEventDialogView is the presentational edit-event form behind the EditEventDialog container.
// It owns all local form state and hands a fully-assembled update request up via onSubmit; the query
// + mutation stay in the container, so every state renders purely from props (ADR-0017): the
// pending/error shells that used to live in the container are now the isPending/isError args, and
// the submit story proves the wiring with a prop-contract spy.
//
// Three stories (ADR-0031 §1): Data is the standalone edit — no siblings, no scope prompt — and
// carries the snapshot, because it is a dialog's content: the page composite can never show it open,
// so nothing else owns this picture. Shells stacks the series / saving / error states in one frame.
// Interactions keeps every onSubmit spy assertion — including the two roster-override carry cases,
// which are behavioural twins of Data rather than new pictures — in a multi-step play.
const EVENT_TYPES: EventTypeItem[] = [
  makeEventType({ id: 'et-1', name: 'Training', color: '#22c55e' }),
  makeEventType({ id: 'et-2', name: 'Match', color: '#3b82f6' }),
]

const EVENT: EventDetail = {
  id: 'evt-1',
  eventType: { id: 'et-1', name: 'Training', color: '#22c55e' },
  title: 'Tuesday Training',
  description: undefined,
  startTime: '2026-09-01T18:30:00+02:00',
  endTime: '2026-09-01T20:00:00+02:00',
  location: undefined,
  references: [],
  recurringGroup: undefined,
  attendanceSummary: { attending: 0, maybe: 0, absent: 0, notResponded: 0, roleBreakdown: [] },
  attendances: [],
  myState: 'NOT_RESPONDED',
  rosterOverride: undefined,
  roster: NO_ROSTER,
}

const EVENT_WITH_ROSTER_OVERRIDE: EventDetail = {
  ...EVENT,
  rosterOverride: {
    trackRoster: true,
    totalTarget: 12,
    positionTargets: [{ positionId: 'pos-setter', count: 2 }],
  },
}

// A three-occurrence series; the middle one ('evt-1') is the one being edited.
const SIBLINGS: Event[] = [
  makeEvent({ id: 'evt-0', startTime: '2026-08-25T18:30:00+02:00', recurringGroup: 'g1' }),
  makeEvent({ id: 'evt-1', startTime: '2026-09-01T18:30:00+02:00', recurringGroup: 'g1' }),
  makeEvent({ id: 'evt-2', startTime: '2026-09-08T18:30:00+02:00', recurringGroup: 'g1' }),
]

const meta = {
  title: 'features/edit-event/EditEventDialogView',
  component: EditEventDialogView,
  args: { event: EVENT, eventTypes: EVENT_TYPES, onSubmit: fn() },
} satisfies Meta<typeof EditEventDialogView>

export default meta

type Story = StoryObj<typeof meta>

// A standalone event (no siblings) shows no scope prompt and submits with the default THIS scope.
export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Title')).toHaveValue('Tuesday Training')
    await expect(canvas.queryByRole('group', { name: 'Scope' })).not.toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        // A series occurrence surfaces the scope selector so the admin can choose how far the edit
        // reaches.
        Series: <EditEventDialogView {...args} siblings={SIBLINGS} />,
        Saving: <EditEventDialogView {...args} isPending />,
        Error: <EditEventDialogView {...args} isError />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Series').getByRole('group', { name: 'Scope' })).toBeInTheDocument()
    await expect(region('Series').getByText('Affects 1 of 3 events')).toBeInTheDocument()

    await expect(region('Saving').getByRole('button', { name: 'Saving…' })).toBeDisabled()

    await expect(
      region('Error').getByText('Could not save changes. Please try again.'),
    ).toBeInTheDocument()
  },
}

// Picture owned by Data — behavioural only (ADR-0031 §1). Submits with the default THIS scope, and
// proves an inheriting event stays inheriting — the update is a whole replacement, so an omitted
// rosterOverride reads server-side as "drop back to the type default". A prop-contract spy is the
// only layer that can catch the omission — a getByText would not see it.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }))
    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'evt-1', scope: 'THIS', eventTypeId: 'et-1', title: 'Tuesday Training' }),
    )
    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ rosterOverride: undefined }),
    )
  },
}

// Behavioural twin of Interactions, in a separate story rather than a Stack instance: the form's
// fields carry static ids (#edit-title and friends), so two instances side by side would collide on
// them and mis-pair labels (ADR-0031 §1 "prefer the Stack" — except where a component's own ids rule
// it out). Renaming an event must not silently drop its customised roster.
export const InteractionsRosterOverride: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  args: { event: EVENT_WITH_ROSTER_OVERRIDE },
  play: async ({ canvas, userEvent, args }) => {
    const title = canvas.getByLabelText('Title')
    await userEvent.clear(title)
    await userEvent.type(title, 'Renamed Training')
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }))
    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Renamed Training',
        rosterOverride: {
          trackRoster: true,
          totalTarget: 12,
          positionTargets: [{ positionId: 'pos-setter', count: 2 }],
        },
      }),
    )
  },
}
