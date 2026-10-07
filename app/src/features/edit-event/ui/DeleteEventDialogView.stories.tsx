import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Event } from '@shared/api/events'
import { makeEvent } from '@shared/testing/event-fixtures'
import { Stack } from '@shared/testing/stack'
import { DeleteEventDialogView } from './DeleteEventDialogView'

// DeleteEventDialogView is the presentational body behind the DeleteEventDialog container. It owns
// the local scope state and hands the chosen scope up via onDelete; the mutation + navigation stay
// in the container, so every state renders purely from props (ADR-0017). The pending/error shells
// that used to live in the container are now the isPending/isError args, and the confirm stories
// prove the wiring with a prop-contract spy.
//
// Three stories (ADR-0032 §1): Data is the standalone delete — no siblings, no scope prompt — and
// carries the snapshot, because it is a dialog's content: the page composite can never show it open,
// so nothing else owns this picture. Shells stacks the series / pending / error states in one frame.
// Interactions keeps every onDelete/onCancel spy assertion in a multi-step play.

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
export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('group', { name: 'Scope' })).not.toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        // A series occurrence surfaces the scope selector; the confirm button still reads singular
        // until a bulk scope is picked.
        Series: <DeleteEventDialogView {...args} siblings={SIBLINGS} />,
        Deleting: <DeleteEventDialogView {...args} isPending />,
        Error: <DeleteEventDialogView {...args} isError />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Series').getByRole('group', { name: 'Scope' })).toBeInTheDocument()
    await expect(region('Series').getByRole('button', { name: 'Delete event' })).toBeInTheDocument()

    await expect(region('Deleting').getByRole('button', { name: 'Deleting…' })).toBeDisabled()
    await expect(region('Deleting').getByRole('button', { name: 'Cancel' })).toBeDisabled()

    await expect(
      region('Error').getByText('Could not delete the event. Please try again.'),
    ).toBeInTheDocument()
  },
}

// Picture owned by Data — behavioural only (ADR-0032 §1). Two instances: the standalone confirm/cancel
// wiring, and a series occurrence where picking a bulk scope both relabels the confirm button and
// hands the chosen scope up.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        Standalone: <DeleteEventDialogView {...args} />,
        Series: <DeleteEventDialogView {...args} siblings={SIBLINGS} />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await userEvent.click(region('Standalone').getByRole('button', { name: 'Cancel' }))
    await expect(args.onCancel).toHaveBeenCalled()

    await userEvent.click(region('Standalone').getByRole('button', { name: 'Delete event' }))
    await expect(args.onDelete).toHaveBeenCalledWith('THIS')

    await userEvent.click(region('Series').getByRole('button', { name: 'All events' }))
    await userEvent.click(region('Series').getByRole('button', { name: 'Delete events' }))
    await expect(args.onDelete).toHaveBeenLastCalledWith('ALL')
  },
}
