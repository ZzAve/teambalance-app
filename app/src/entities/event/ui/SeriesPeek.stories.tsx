import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { makeEvent } from '@shared/testing/event-fixtures'
import { buildSeriesPeek } from '../lib/series-peek'
import { SeriesPeek } from './SeriesPeek'

// SeriesPeek renders TanStack Router <Link>s to sibling occurrences, so it needs a router in context.
const meta = {
  title: 'entities/event/SeriesPeek',
  component: SeriesPeek,
  decorators: [withRouter],
} satisfies Meta<typeof SeriesPeek>

export default meta

type Story = StoryObj<typeof meta>

const series = ['a', 'b', 'c', 'd', 'e'].map((id, i) =>
  makeEvent({ id, recurringGroup: 'g1', startTime: `2026-09-0${i + 1}T18:30:00Z` }),
)

// A long series: first-two + last-two with a "+N more" gap, current in the collapsed middle.
export const LongSeries: Story = {
  args: { peek: buildSeriesPeek(series, 'c')! },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Part of a series')).toBeInTheDocument()
    await expect(canvas.getByText('Occurrence 3 of 5')).toBeInTheDocument()
    await expect(canvas.getByText(/\+1 more/)).toBeInTheDocument()
  },
}

// Current occurrence visible in the head — highlighted with the "This one" tag.
export const CurrentInHead: Story = {
  args: { peek: buildSeriesPeek(series, 'a')! },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Occurrence 1 of 5')).toBeInTheDocument()
    await expect(canvas.getByText('This one')).toBeInTheDocument()
  },
}

// A short series shows every occurrence inline with no gap.
export const ShortSeries: Story = {
  args: { peek: buildSeriesPeek(series.slice(0, 3), 'b')! },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Occurrence 2 of 3')).toBeInTheDocument()
    await expect(canvas.queryByText(/more/)).not.toBeInTheDocument()
  },
}
