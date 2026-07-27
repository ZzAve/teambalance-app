import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { EventTypeItem } from '@shared/api/event-types'
import { CreateEventForm } from './CreateEventForm'

// CreateEventForm is the presentational form extracted from the CreateEventDialog container. It
// owns local form state (type selection, title auto-suggest) and hands a fully-assembled input up
// via onSubmit; data fetching + the mutation stay in the container. Its states are stories.
const EVENT_TYPES: EventTypeItem[] = [
  { id: 'et-1', name: 'Match', color: '#3b82f6' },
  { id: 'et-2', name: 'Training', color: '#22c55e' },
]

const meta = {
  title: 'features/create-event/CreateEventForm',
  component: CreateEventForm,
  args: { onSubmit: () => {} },
} satisfies Meta<typeof CreateEventForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { eventTypes: EVENT_TYPES, isPending: false },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Type')).toBeInTheDocument()
    await expect(canvas.getByLabelText('Title')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Create Event' })).toBeEnabled()
  },
}

export const Submitting: Story = {
  args: { eventTypes: EVENT_TYPES, isPending: true },
  play: async ({ canvas }) => {
    const submit = canvas.getByRole('button', { name: 'Creating...' })
    await expect(submit).toBeInTheDocument()
    await expect(submit).toBeDisabled()
  },
}

export const TypeSelected: Story = {
  args: { eventTypes: EVENT_TYPES, isPending: false },
  play: async ({ canvas, userEvent }) => {
    // Selecting a type auto-suggests the title (until the user edits it themselves).
    // Two comboboxes now (Type, Duration); Type is first in DOM order.
    await userEvent.click(canvas.getAllByRole('combobox')[0])
    await userEvent.click(await within(document.body).findByRole('option', { name: /Match/ }))
    await expect(canvas.getByLabelText('Title')).toHaveValue('Match')
  },
}

export const NoEventTypes: Story = {
  args: { eventTypes: [], isPending: false },
  play: async ({ canvas }) => {
    // With no types loaded, the selector shows its placeholder and the form is still rendered.
    await expect(canvas.getByText('Select type')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Create Event' })).toBeInTheDocument()
  },
}

export const AddingLinks: Story = {
  args: { eventTypes: EVENT_TYPES, isPending: false },
  play: async ({ canvas, userEvent }) => {
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
  },
}

export const CreateFailed: Story = {
  args: { eventTypes: EVENT_TYPES, isPending: false, error: 'Could not create the event. Please try again.' },
  play: async ({ canvas }) => {
    // A failed create must surface feedback (regression: the dialog previously stayed open silently
    // on a 500). The message is exposed as an alert so assistive tech announces it.
    const alert = canvas.getByRole('alert')
    await expect(alert).toHaveTextContent('Could not create the event. Please try again.')
  },
}

export const DerivesEndTimeFromDuration: Story = {
  args: { eventTypes: EVENT_TYPES, isPending: false, onSubmit: fn() },
  play: async ({ args, canvas, userEvent }) => {
    // endTime is required by the contract; the form derives it from startTime + the (default 2h)
    // duration so a valid end is always sent — the fix for "create without endTime → 500".
    await userEvent.click(canvas.getAllByRole('combobox')[0])
    await userEvent.click(await within(document.body).findByRole('option', { name: /Match/ }))

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
