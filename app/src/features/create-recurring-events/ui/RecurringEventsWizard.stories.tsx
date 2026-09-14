import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { EventTypeItem } from '@shared/api/event-types'
import { makeEventType } from '@shared/testing/event-fixtures'
import { Stack } from '@shared/testing/stack'
import { RecurringEventsWizard } from './RecurringEventsWizard'

// The guided wizard is the presentational shell of the recurring-create flow: ① details →
// ② recurrence (with the live calendar preview) → ③ confirm. Data, the mutation, and the dialog
// open/close live in the container.
//
// The wizard has no `step` (or field-value) prop — its step and every field are local state — so no
// step past the first is reachable from props alone. Three stories (ADR-0031 §1, adapted for a
// wizard):
//   1. Data — step 1, populated: picking a type (the only click needed to reach it) auto-fills the
//      title and unlocks Next. The picture of this View.
//   2. Shells — the other *props-reachable* step-1 state (nothing chosen yet, Next blocked) — the
//      over-cap and submitting states live on steps 2/3, which only a click can reach, so they move
//      to Interactions instead (per this file's rubric note).
//   3. Interactions — no picture; three fresh instances (one per starting args) each walked to the
//      state its old story exercised, keeping every assertion.
const EVENT_TYPES: EventTypeItem[] = [
  makeEventType({ id: 'et-1', name: 'Training', color: '#225C9C' }),
  makeEventType({ id: 'et-2', name: 'Match', color: '#249E6C' }),
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

export const Data: Story = {
  play: async ({ canvas, userEvent }) => {
    // A type picked auto-suggests the title and unlocks Next.
    await chooseTraining(canvas, userEvent)
    await expect(canvas.getByLabelText('Title')).toHaveValue('Training')
    await expect(canvas.getByRole('button', { name: /Next/ })).toBeEnabled()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        // Nothing chosen yet — Next is blocked until a type + title exist.
        Empty: <RecurringEventsWizard {...args} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Empty').getByText('Details')).toBeInTheDocument()
    await expect(region('Empty').getByRole('button', { name: /Next/ })).toBeDisabled()
  },
}

// No picture — every step past the first is behind a click, so this is the only place they render
// (this file's rubric note). Three fresh instances, one per old story's starting args, each walked to
// the state that story asserted.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        Series: <RecurringEventsWizard {...args} />,
        // Over-cap: a two-season-wide window blows past the 200 cap.
        OverCap: <RecurringEventsWizard {...args} season={{ start: '2026-01-01', end: '2027-12-31' }} today="2025-12-01" />,
        Submitting: <RecurringEventsWizard {...args} isPending />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    // Step 2 with the live preview — the default Tue+Thu weekly series renders a running count.
    await chooseTraining(region('Series'), userEvent)
    await userEvent.click(region('Series').getByRole('button', { name: /Next/ }))
    await expect(region('Series').getByText('On')).toBeInTheDocument()
    const count = region('Series').getByTestId('occurrence-count')
    await expect(count).toBeInTheDocument()
    await expect(count).not.toHaveTextContent('0 events')

    // Prop-contract: walking the wizard to the end and confirming fires onSubmit with the assembled
    // request — the chosen type + auto-filled title carry through the three steps to the mutation.
    await userEvent.click(region('Series').getByRole('button', { name: /Next/ }))
    await userEvent.click(region('Series').getByRole('button', { name: /Create/ }))
    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ eventTypeId: 'et-1', title: 'Training' }),
    )

    // Over-cap: the preview warns and Next stays blocked.
    await chooseTraining(region('OverCap'), userEvent)
    await userEvent.click(region('OverCap').getByRole('button', { name: /Next/ }))
    await expect(region('OverCap').getByText(/over 200 events/i)).toBeInTheDocument()
    await expect(region('OverCap').getByRole('button', { name: /Next/ })).toBeDisabled()

    // Submitting — the confirm button reflects the pending mutation.
    await chooseTraining(region('Submitting'), userEvent)
    await userEvent.click(region('Submitting').getByRole('button', { name: /Next/ }))
    await userEvent.click(region('Submitting').getByRole('button', { name: /Next/ }))
    await expect(region('Submitting').getByRole('button', { name: /Creating/ })).toBeDisabled()
  },
}
