import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { EventTypeItem } from '@shared/api/event-types'
import { makeEventType } from '@shared/testing/event-fixtures'
import { Stack } from '@shared/testing/stack'
import { CreateEventForm } from './CreateEventForm'

// CreateEventForm is the presentational form extracted from the CreateEventDialog container. It
// owns local form state (type selection, title auto-suggest, link rows) and hands a fully-assembled
// input up via onSubmit; data fetching + the mutation stay in the container.
//
// Three stories (ADR-0031 §1):
//   1. Data — the one populated live instance, and the picture of this View.
//   2. Shells — every non-data state (submitting / no types loaded / create failed) stacked in one
//      frame, one picture, each state's assertions scoped to its labelled region.
//   3. Interactions — no picture; one play walks every interaction (type auto-suggest, the link-row
//      editor, and the duration → endTime derivation) and keeps every prop-contract spy assertion.
const EVENT_TYPES: EventTypeItem[] = [
  makeEventType({ id: 'et-1', name: 'Match', color: '#3b82f6' }),
  makeEventType({ id: 'et-2', name: 'Training', color: '#22c55e' }),
]

const meta = {
  title: 'features/create-event/CreateEventForm',
  component: CreateEventForm,
  args: { eventTypes: EVENT_TYPES, isPending: false, onSubmit: fn() },
} satisfies Meta<typeof CreateEventForm>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Type')).toBeInTheDocument()
    await expect(canvas.getByLabelText('Title')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Create Event' })).toBeEnabled()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Submitting: <CreateEventForm {...args} isPending />,
        'No event types': <CreateEventForm {...args} eventTypes={[]} />,
        'Create failed': (
          <CreateEventForm {...args} error="Could not create the event. Please try again." />
        ),
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    const submit = region('Submitting').getByRole('button', { name: 'Creating...' })
    await expect(submit).toBeInTheDocument()
    await expect(submit).toBeDisabled()

    // With no types loaded, the selector shows its placeholder and the form is still rendered.
    await expect(region('No event types').getByText('Select type')).toBeInTheDocument()
    await expect(region('No event types').getByRole('button', { name: 'Create Event' })).toBeInTheDocument()

    // A failed create must surface feedback (regression: the dialog previously stayed open silently
    // on a 500). The message is exposed as an alert so assistive tech announces it.
    await expect(region('Create failed').getByRole('alert')).toHaveTextContent(
      'Could not create the event. Please try again.',
    )
  },
}

// Picture owned by Data — behavioural only (ADR-0031 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    // Selecting a type auto-suggests the title (until the user edits it themselves).
    // Two comboboxes now (Type, Duration); Type is first in DOM order.
    await userEvent.click(canvas.getAllByRole('combobox')[0])
    await userEvent.click(await within(document.body).findByRole('option', { name: /Match/ }))
    await expect(canvas.getByLabelText('Title')).toHaveValue('Match')

    // No link rows until "Add link" is clicked.
    await expect(canvas.queryByLabelText('Link 1 URL')).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: /Add link/ }))
    await expect(canvas.getByLabelText('Link 1 URL')).toBeInTheDocument()
    await expect(canvas.getByLabelText('Link 1 label')).toBeInTheDocument()

    // A second row is independent.
    await userEvent.click(canvas.getByRole('button', { name: /Add link/ }))
    await expect(canvas.getByLabelText('Link 2 URL')).toBeInTheDocument()

    // Removing the first row collapses the list back to one.
    await userEvent.click(canvas.getByRole('button', { name: 'Remove link 1' }))
    await expect(canvas.queryByLabelText('Link 2 URL')).not.toBeInTheDocument()
    await expect(canvas.getByLabelText('Link 1 URL')).toBeInTheDocument()

    // endTime is required by the contract; the form derives it from startTime + the (default 2h)
    // duration so a valid end is always sent — the fix for "create without endTime → 500".
    await userEvent.type(canvas.getByLabelText('Start time'), '2026-08-01T20:00')
    await userEvent.click(canvas.getByRole('button', { name: 'Create Event' }))

    await expect(args.onSubmit).toHaveBeenCalledTimes(1)
    const submitted = (args.onSubmit as ReturnType<typeof fn>).mock.calls[0][0]
    // Default duration is 2h — assert the span rather than an absolute UTC value so the test is
    // independent of the runner's timezone.
    const spanMinutes =
      (new Date(submitted.endTime).getTime() - new Date(submitted.startTime).getTime()) / 60_000
    await expect(spanMinutes).toBe(120)
  },
}
