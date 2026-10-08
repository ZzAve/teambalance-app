import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { makeEvent } from '../testing/event-fixtures'
import { Stack } from '@shared/testing/stack'
import { buildSeriesPeek } from '../lib/series-peek'
import { SeriesPeek } from './SeriesPeek'

// SeriesPeek renders TanStack Router <Link>s to sibling occurrences, so it needs a router in context.
//
// Collapsed by default — series membership is usually incidental, so only the header shows. There is
// no `defaultOpen`-style prop, so the expanded picture can only be reached by a click: `Gallery`
// (one picture, ADR-0032 §2) stacks every collapsed variant and, via its own `play`, expands and
// leaves open the "Current in head" instance — the one whose expansion shows the "+N more" gap and
// the "This one" tag together. `Interactions` (disableSnapshot) re-covers the expand behaviour (and
// the short-series no-gap case) across every instance, click-by-click, with its assertions.
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

// A long series (with a "+N more" gap once expanded), the same series with the current occurrence in
// the head instead of the middle, and a short series (no gap once expanded, #onExpand covered in
// Interactions).
const LONG = buildSeriesPeek(series, 'c')!
const CURRENT_IN_HEAD = buildSeriesPeek(series, 'a')!
const SHORT = buildSeriesPeek(series.slice(0, 3), 'b')!

export const Gallery: Story = {
  args: { peek: LONG },
  render: () => (
    <Stack
      items={{
        'Long series': <SeriesPeek peek={LONG} />,
        'Current in head': <SeriesPeek peek={CURRENT_IN_HEAD} />,
        'Short series': <SeriesPeek peek={SHORT} />,
      }}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Long series').getByText('Part of a series')).toBeInTheDocument()
    await expect(region('Long series').getByText('Occurrence 3 of 5')).toBeInTheDocument()
    // The occurrence list stays hidden until expanded.
    await expect(region('Long series').queryByText(/\+1 more/)).not.toBeInTheDocument()
    await expect(region('Long series').getByRole('button')).toHaveAttribute('aria-expanded', 'false')

    await expect(region('Current in head').getByText('Occurrence 1 of 5')).toBeInTheDocument()

    await expect(region('Short series').getByText('Occurrence 2 of 3')).toBeInTheDocument()

    // Expand "Current in head" and leave it open: this instance's current occurrence falls in the
    // head, so one picture shows the first-two + last-two list, the "+N more" gap, and the "This one"
    // tag together — the state no collapsed story reaches.
    await userEvent.click(region('Current in head').getByRole('button'))
    await expect(region('Current in head').getByRole('button')).toHaveAttribute('aria-expanded', 'true')
    await expect(region('Current in head').getByText('This one')).toBeInTheDocument()
    await expect(region('Current in head').getByText(/\+1 more/)).toBeInTheDocument()
  },
}

// Picture owned by Gallery — behavioural only (ADR-0032 §1). Expanding reveals first-two + last-two
// with a "+N more" gap for a long series, the current occurrence highlighted with the "This one" tag
// when it falls in the head, and no gap at all once a short series is expanded.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  args: { peek: LONG },
  render: () => (
    <Stack
      items={{
        'Long series': <SeriesPeek peek={LONG} />,
        'Current in head': <SeriesPeek peek={CURRENT_IN_HEAD} />,
        'Short series': <SeriesPeek peek={SHORT} />,
      }}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await userEvent.click(region('Long series').getByRole('button'))
    await expect(region('Long series').getByRole('button')).toHaveAttribute('aria-expanded', 'true')
    await expect(region('Long series').getByText(/\+1 more/)).toBeInTheDocument()

    await userEvent.click(region('Current in head').getByRole('button'))
    await expect(region('Current in head').getByText('This one')).toBeInTheDocument()

    await userEvent.click(region('Short series').getByRole('button'))
    await expect(region('Short series').queryByText(/more/)).not.toBeInTheDocument()
  },
}
