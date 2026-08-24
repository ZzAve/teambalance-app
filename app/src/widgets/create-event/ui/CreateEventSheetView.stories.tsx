import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { Sheet } from '@shared/ui/sheet'
import type { EventTypeItem } from '@shared/api/event-types'
import { makeEventType } from '@shared/testing/event-fixtures'
import { CreateEventSheetView } from './CreateEventSheetView'

// CreateEventSheetView is the presentational body of the create-event sheet behind the
// CreateEventSheet widget. The mode navigation, data queries, and mutations stay in the widget, so
// each mode renders purely from props (ADR-0017). SheetTitle/SheetDescription are Radix Dialog
// primitives, so the stories mount the View under a controlled <Sheet open> to give them their
// context — no portal, no network. The child features (chooser/form/wizard) own their own state
// stories; here we cover the sheet's own header + navigation wiring with prop-contract spies.
const EVENT_TYPES: EventTypeItem[] = [
  makeEventType({ id: 'et-1', name: 'Training', color: '#22c55e' }),
  makeEventType({ id: 'et-2', name: 'Match', color: '#3b82f6' }),
]

const meta = {
  title: 'widgets/create-event/CreateEventSheetView',
  component: CreateEventSheetView,
  args: {
    eventTypes: EVENT_TYPES,
    today: '2026-09-01',
    onBack: fn(),
    onChooseSingle: fn(),
    onChooseRecurring: fn(),
    onSubmitSingle: fn(),
    onSubmitRecurring: fn(),
  },
  decorators: [(Story) => <Sheet open>{Story()}</Sheet>],
} satisfies Meta<typeof CreateEventSheetView>

export default meta

type Story = StoryObj<typeof meta>

// The first thing the sheet shows: pick single vs recurring. No back step yet.
export const Chooser: Story = {
  args: { mode: 'chooser' },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText('Create event')).toBeInTheDocument()
    await expect(canvas.getByText('Choose how you want to add events')).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Back to event type' })).not.toBeInTheDocument()
    await userEvent.click(canvas.getByText('Single event'))
    await expect(args.onChooseSingle).toHaveBeenCalled()
    await userEvent.click(canvas.getByText('Recurring series'))
    await expect(args.onChooseRecurring).toHaveBeenCalled()
  },
}

// The single-event form, with a back step to the chooser.
export const SingleForm: Story = {
  args: { mode: 'single' },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText('New event')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Create Event' })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Back to event type' }))
    await expect(args.onBack).toHaveBeenCalled()
  },
}

// A failed single-create surfaces inline in the form.
export const SingleError: Story = {
  args: { mode: 'single', singleError: 'Could not create the event. Please try again.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Could not create the event. Please try again.')).toBeInTheDocument()
  },
}

// The recurring-series wizard opens on its first step, with a back step to the chooser.
export const Recurring: Story = {
  args: { mode: 'recurring' },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText('New recurring series')).toBeInTheDocument()
    await expect(canvas.getByText('What are you scheduling?')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Back to event type' }))
    await expect(args.onBack).toHaveBeenCalled()
  },
}
