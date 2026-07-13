import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
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
    await userEvent.click(canvas.getByRole('combobox'))
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
