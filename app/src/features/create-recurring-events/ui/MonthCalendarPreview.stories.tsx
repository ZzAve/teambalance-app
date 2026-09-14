import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { buildCalendarPreview } from '../model/recurrence'
import { MonthCalendarPreview } from './MonthCalendarPreview'

// The month-calendar preview (prototype B). Purely presentational — it renders a CalendarPreview
// model (built here by buildCalendarPreview) into month grids with the season band, occurrence
// highlights, a running count, and cap / out-of-season warnings.
const SEASON = { start: '2026-09-01', end: '2027-05-31' }

// One gallery story (ADR-0031 §2): every variant stacked, one snapshot, every branch asserted.
const meta = {
  title: 'features/create-recurring-events/MonthCalendarPreview',
  component: MonthCalendarPreview,
  args: { accentColor: '#225C9C' },
} satisfies Meta<typeof MonthCalendarPreview>

export default meta

type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  // Unused by render below — every Stack item supplies its own `preview` — but required to satisfy
  // the story's prop contract (`preview` is required on MonthCalendarPreview).
  args: {
    preview: buildCalendarPreview(
      { frequency: 'WEEKLY', weekdays: ['TUESDAY'], startDate: '2026-09-01', endDate: '2026-09-30' },
      SEASON,
    ),
  },
  render: (args) => (
    <Stack
      items={{
        // In-season Tue+Thu weekly across two months.
        'In season': (
          <MonthCalendarPreview
            {...args}
            preview={buildCalendarPreview(
              { frequency: 'WEEKLY', weekdays: ['TUESDAY', 'THURSDAY'], startDate: '2026-09-01', endDate: '2026-10-31' },
              SEASON,
            )}
          />
        ),
        // Some occurrences fall past a short season window — flagged red with a warning.
        'Out of season': (
          <MonthCalendarPreview
            {...args}
            preview={buildCalendarPreview(
              { frequency: 'WEEKLY', weekdays: ['TUESDAY'], startDate: '2026-09-01', endDate: '2026-09-30' },
              { start: '2026-09-01', end: '2026-09-05' },
            )}
          />
        ),
        // Generation exceeds the 200 cap — the preview warns instead of silently truncating.
        'Over cap': (
          <MonthCalendarPreview
            {...args}
            preview={buildCalendarPreview(
              {
                frequency: 'WEEKLY',
                weekdays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
                startDate: '2026-01-01',
                endDate: '2027-12-31',
              },
              undefined,
            )}
          />
        ),
        // Nothing selected yet — the empty prompt.
        Empty: (
          <MonthCalendarPreview
            {...args}
            preview={buildCalendarPreview(
              { frequency: 'WEEKLY', weekdays: [], startDate: '2026-09-01', endDate: '2026-09-30' },
              SEASON,
            )}
          />
        ),
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('In season').getByTestId('occurrence-count')).toBeInTheDocument()
    await expect(region('In season').queryByText(/outside the season/i)).not.toBeInTheDocument()

    await expect(region('Out of season').getByText(/outside the season/i)).toBeInTheDocument()

    await expect(region('Over cap').getByText(/over 200 events/i)).toBeInTheDocument()

    await expect(region('Empty').getByText(/No dates yet/i)).toBeInTheDocument()
  },
}
