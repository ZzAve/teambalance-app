import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import type { Event, EventDetail } from '@shared/api/events'
import type { EventTypeItem } from '@shared/api/event-types'
import { makeEvent, makeEventType, NO_ROSTER } from '@shared/testing/event-fixtures'
import { EditEventDialogView } from './EditEventDialogView'

// EditEventDialogView is the presentational edit-event form behind the EditEventDialog container.
// It owns all local form state and hands a fully-assembled update request up via onSubmit; the query
// + mutation stay in the container, so every state renders purely from props (ADR-0017): the
// pending/error shells that used to live in the container are now the isPending/isError args, and
// the submit story proves the wiring with a prop-contract spy.
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
export const Standalone: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByLabelText('Title')).toHaveValue('Tuesday Training')
    await expect(canvas.queryByRole('group', { name: 'Scope' })).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }))
    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'evt-1', scope: 'THIS', eventTypeId: 'et-1', title: 'Tuesday Training' }),
    )
  },
}

// A series occurrence surfaces the scope selector so the admin can choose how far the edit reaches.
export const Series: Story = {
  args: { siblings: SIBLINGS },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: 'Scope' })).toBeInTheDocument()
    await expect(canvas.getByText('Affects 1 of 3 events')).toBeInTheDocument()
  },
}

// The update is a whole replacement, so an omitted rosterOverride reads server-side as "drop back to
// inheriting the type default". This form never edits the override, which is exactly why it has to
// carry it: renaming an event must not silently erase its lineup. A prop-contract spy is the only
// layer that can catch the omission — a getByText would not see it.
export const CarriesRosterOverrideThroughAnUnrelatedEdit: Story = {
  // Behavioural twin of Standalone — the roster-override carry is a callback assertion; the filled
  // edit-form picture ≈ Standalone (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  args: {
    event: {
      ...EVENT,
      rosterOverride: {
        trackRoster: true,
        totalTarget: 12,
        positionTargets: [{ positionId: 'pos-setter', count: 2 }],
      },
    },
  },
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

// The mirror case: an inheriting event stays inheriting, rather than acquiring an override.
export const KeepsAnInheritingEventInheriting: Story = {
  // Behavioural twin of Standalone — asserts onSave gets `rosterOverride: undefined`; the picture
  // settles back to Standalone (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }))

    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ rosterOverride: undefined }),
    )
  },
}

export const Saving: Story = {
  args: { isPending: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Saving…' })).toBeDisabled()
  },
}

export const ErrorState: Story = {
  args: { isError: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Could not save changes. Please try again.')).toBeInTheDocument()
  },
}
