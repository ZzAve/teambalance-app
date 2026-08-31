import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import type { Event } from '@shared/api/events'
import { makeEvent } from '@shared/testing/event-fixtures'
import { DeleteEventDialogView } from './DeleteEventDialogView'

// DeleteEventDialogView is the presentational body behind the DeleteEventDialog container. It owns
// the local scope state and hands the chosen scope up via onDelete; the mutation + navigation stay
// in the container, so every state renders purely from props (ADR-0017). The pending/error shells
// that used to live in the container are now the isPending/isError args, and the confirm stories
// prove the wiring with a prop-contract spy.

// A three-occurrence series; the middle one ('evt-1') is the one being deleted.
const SIBLINGS: Event[] = [
  makeEvent({ id: 'evt-0', startTime: '2026-08-25T18:30:00+02:00', recurringGroup: 'g1' }),
  makeEvent({ id: 'evt-1', startTime: '2026-09-01T18:30:00+02:00', recurringGroup: 'g1' }),
  makeEvent({ id: 'evt-2', startTime: '2026-09-08T18:30:00+02:00', recurringGroup: 'g1' }),
]

const meta = {
  title: 'features/edit-event/DeleteEventDialogView',
  component: DeleteEventDialogView,
  args: { eventId: 'evt-1', onDelete: fn(), onCancel: fn() },
} satisfies Meta<typeof DeleteEventDialogView>

export default meta

type Story = StoryObj<typeof meta>

// A standalone event (no siblings) shows no scope prompt and confirms with the default THIS scope.
export const Standalone: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.queryByRole('group', { name: 'Scope' })).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Delete event' }))
    await expect(args.onDelete).toHaveBeenCalledWith('THIS')
  },
}

export const Cancel: Story = {
  // Behavioural twin of Standalone — onCancel fires; the confirm picture is unchanged (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }))
    await expect(args.onCancel).toHaveBeenCalled()
  },
}

// A series occurrence surfaces the scope selector; picking a bulk scope both relabels the confirm
// button and hands the chosen scope up.
export const Series: Story = {
  args: { siblings: SIBLINGS },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole('group', { name: 'Scope' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Delete event' })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'All events' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Delete events' }))
    await expect(args.onDelete).toHaveBeenCalledWith('ALL')
  },
}

export const Deleting: Story = {
  args: { isPending: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Deleting…' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  },
}

export const ErrorState: Story = {
  args: { isError: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Could not delete the event. Please try again.')).toBeInTheDocument()
  },
}
