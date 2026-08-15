import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import type { Event, EventDetail } from '@shared/api/events'
import type { EventTypeItem } from '@shared/api/event-types'
import { makeEvent } from '@shared/testing/event-fixtures'
import { EditEventDialogView } from './EditEventDialogView'

// EditEventDialogView is the presentational edit-event form behind the EditEventDialog container.
// It owns all local form state and hands a fully-assembled update request up via onSubmit; the query
// + mutation stay in the container, so every state renders purely from props (ADR-0017): the
// pending/error shells that used to live in the container are now the isPending/isError args, and
// the submit story proves the wiring with a prop-contract spy.
const EVENT_TYPES: EventTypeItem[] = [
  { id: 'et-1', name: 'Training', color: '#22c55e' },
  { id: 'et-2', name: 'Match', color: '#3b82f6' },
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
