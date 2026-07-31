import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { EventTypeItem } from '@shared/api/event-types'
import { RecurringEventsWizard } from './RecurringEventsWizard'

// The guided wizard is the presentational shell of the recurring-create flow: ① details →
// ② recurrence (with the live calendar preview) → ③ confirm. Data, the mutation, and the dialog
// open/close live in the container; every step state is a story here.
const EVENT_TYPES: EventTypeItem[] = [
  { id: 'et-1', name: 'Training', color: '#225C9C' },
  { id: 'et-2', name: 'Match', color: '#249E6C' },
]

const SEASON = { start: '2026-09-01', end: '2027-05-31' }

const meta = {
  title: 'features/create-recurring-events/RecurringEventsWizard',
  component: RecurringEventsWizard,
  args: {
    eventTypes: EVENT_TYPES,
    season: SEASON,
    isPending: false,
    today: '2026-08-01',
    onSubmit: fn(),
  },
} satisfies Meta<typeof RecurringEventsWizard>

export default meta

type Story = StoryObj<typeof meta>

// Pick a type so the title auto-fills and step 1 becomes valid.
async function chooseTraining(canvas: ReturnType<typeof within>, userEvent: { click: (el: Element) => Promise<void> }) {
  await userEvent.click(canvas.getByRole('combobox'))
  await userEvent.click(await within(document.body).findByRole('option', { name: /Training/ }))
}

// Step 1, nothing chosen yet — the empty state. Next is blocked until a type + title exist.
export const DetailsEmpty: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Details')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /Next/ })).toBeDisabled()
  },
}

// Partially filled — a type picked auto-suggests the title and unlocks Next.
export const DetailsFilled: Story = {
  play: async ({ canvas, userEvent }) => {
    await chooseTraining(canvas, userEvent)
    await expect(canvas.getByLabelText('Title')).toHaveValue('Training')
    await expect(canvas.getByRole('button', { name: /Next/ })).toBeEnabled()
  },
}

// Step 2 with the live preview — the default Tue+Thu weekly series renders a running count.
export const RecurrencePreview: Story = {
  play: async ({ canvas, userEvent }) => {
    await chooseTraining(canvas, userEvent)
    await userEvent.click(canvas.getByRole('button', { name: /Next/ }))
    await expect(canvas.getByText('On')).toBeInTheDocument()
    const count = canvas.getByTestId('occurrence-count')
    await expect(count).toBeInTheDocument()
    await expect(count).not.toHaveTextContent('0 events')
  },
}

// Over-cap: a two-season-wide window blows past the 200 cap, so the preview warns and Next stays blocked.
export const OverCap: Story = {
  args: { season: { start: '2026-01-01', end: '2027-12-31' }, today: '2025-12-01' },
  play: async ({ canvas, userEvent }) => {
    await chooseTraining(canvas, userEvent)
    await userEvent.click(canvas.getByRole('button', { name: /Next/ }))
    await expect(canvas.getByText(/over 200 events/i)).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /Next/ })).toBeDisabled()
  },
}

// Prop-contract: walking the wizard to the end and confirming fires onSubmit with the assembled
// request — the chosen type + auto-filled title carry through the three steps to the mutation.
export const CreateSeries: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await chooseTraining(canvas, userEvent)
    await userEvent.click(canvas.getByRole('button', { name: /Next/ }))
    await userEvent.click(canvas.getByRole('button', { name: /Next/ }))
    await userEvent.click(canvas.getByRole('button', { name: /Create/ }))
    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ eventTypeId: 'et-1', title: 'Training' }),
    )
  },
}

// Submitting — the confirm button reflects the pending mutation.
export const Submitting: Story = {
  args: { isPending: true },
  play: async ({ canvas, userEvent }) => {
    await chooseTraining(canvas, userEvent)
    await userEvent.click(canvas.getByRole('button', { name: /Next/ }))
    await userEvent.click(canvas.getByRole('button', { name: /Next/ }))
    await expect(canvas.getByRole('button', { name: /Creating/ })).toBeDisabled()
  },
}
