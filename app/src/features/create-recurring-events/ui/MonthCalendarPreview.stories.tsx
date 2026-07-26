import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { buildCalendarPreview } from '../model/recurrence'
import { MonthCalendarPreview } from './MonthCalendarPreview'

// The month-calendar preview (prototype B). Purely presentational — it renders a CalendarPreview
// model (built here by buildCalendarPreview) into month grids with the season band, occurrence
// highlights, a running count, and cap / out-of-season warnings.
const SEASON = { start: '2026-09-01', end: '2027-05-31' }

const meta = {
  title: 'features/create-recurring-events/MonthCalendarPreview',
  component: MonthCalendarPreview,
  args: { accentColor: '#225C9C' },
} satisfies Meta<typeof MonthCalendarPreview>

export default meta

type Story = StoryObj<typeof meta>

// In-season Tue+Thu weekly across two months.
export const InSeason: Story = {
  args: {
    preview: buildCalendarPreview(
      { frequency: 'WEEKLY', weekdays: ['TUESDAY', 'THURSDAY'], startDate: '2026-09-01', endDate: '2026-10-31' },
      SEASON,
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('occurrence-count')).toBeInTheDocument()
    await expect(canvas.queryByText(/outside the season/i)).not.toBeInTheDocument()
  },
}

// Some occurrences fall past a short season window — flagged red with a warning.
export const OutOfSeason: Story = {
  args: {
    preview: buildCalendarPreview(
      { frequency: 'WEEKLY', weekdays: ['TUESDAY'], startDate: '2026-09-01', endDate: '2026-09-30' },
      { start: '2026-09-01', end: '2026-09-05' },
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/outside the season/i)).toBeInTheDocument()
  },
}

// Generation exceeds the 200 cap — the preview warns instead of silently truncating.
export const OverCap: Story = {
  args: {
    preview: buildCalendarPreview(
      {
        frequency: 'WEEKLY',
        weekdays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        startDate: '2026-01-01',
        endDate: '2027-12-31',
      },
      undefined,
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/over 200 events/i)).toBeInTheDocument()
  },
}

// Nothing selected yet — the empty prompt.
export const Empty: Story = {
  args: {
    preview: buildCalendarPreview(
      { frequency: 'WEEKLY', weekdays: [], startDate: '2026-09-01', endDate: '2026-09-30' },
      SEASON,
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/No dates yet/i)).toBeInTheDocument()
  },
}
