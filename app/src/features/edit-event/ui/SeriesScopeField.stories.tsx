import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import type { Event, EventSeriesScope } from '@shared/api/events'
import { makeEvent } from '@shared/testing/event-fixtures'
import { SeriesScopeField } from './SeriesScopeField'

// Four weekly occurrences sharing a group; the 2nd ('b') is the one being edited/deleted.
const SIBLINGS: Event[] = [
  makeEvent({ id: 'a', startTime: '2026-09-01T18:30:00Z', recurringGroup: 'g1' }),
  makeEvent({ id: 'b', startTime: '2026-09-08T18:30:00Z', recurringGroup: 'g1' }),
  makeEvent({ id: 'c', startTime: '2026-09-15T18:30:00Z', recurringGroup: 'g1' }),
  makeEvent({ id: 'd', startTime: '2026-09-22T18:30:00Z', recurringGroup: 'g1' }),
]

// Stateful harness: `scope` is owned by the parent dialog in production, so the story holds it to
// make the segmented control interactive. The story's args drive the variant + starting scope.
function Harness({ variant, initialScope }: { variant: 'edit' | 'delete'; initialScope: EventSeriesScope }) {
  const [scope, setScope] = useState<EventSeriesScope>(initialScope)
  return (
    <div className="max-w-md">
      <SeriesScopeField siblings={SIBLINGS} currentId="b" scope={scope} onScopeChange={setScope} variant={variant} />
    </div>
  )
}

const meta = {
  title: 'features/edit-event/SeriesScopeField',
  component: Harness,
} satisfies Meta<typeof Harness>

export default meta

type Story = StoryObj<typeof meta>

export const EditThis: Story = {
  args: { variant: 'edit', initialScope: 'THIS' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Affects 1 of 4 events')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'This event' })).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByText(/Splits the series into three/)).toBeInTheDocument()
    // THIS keeps the date free, so no lock note.
    await expect(canvas.queryByText(/keeps its own date/)).not.toBeInTheDocument()
  },
}

export const EditThisAndFollowing: Story = {
  args: { variant: 'edit', initialScope: 'THIS' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'This & following' }))
    await expect(canvas.getByText('Affects 3 of 4 events')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'This & following' })).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByText(/Splits the series in two/)).toBeInTheDocument()
    // A bulk scope locks the per-occurrence date.
    await expect(canvas.getByText(/keeps its own date/)).toBeInTheDocument()
  },
}

export const EditAll: Story = {
  args: { variant: 'edit', initialScope: 'ALL' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Affects 4 of 4 events')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'All events' })).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByText(/No split/)).toBeInTheDocument()
    await expect(canvas.getByText(/keeps its own date/)).toBeInTheDocument()
  },
}

export const DeleteThis: Story = {
  args: { variant: 'delete', initialScope: 'THIS' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Removes 1 of 4 events')).toBeInTheDocument()
    await expect(canvas.getByText(/Removes just this occurrence/)).toBeInTheDocument()
    // Delete never locks a date — that note is edit-only.
    await expect(canvas.queryByText(/keeps its own date/)).not.toBeInTheDocument()
  },
}

export const DeleteThisAndFollowing: Story = {
  args: { variant: 'delete', initialScope: 'THIS' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'This & following' }))
    await expect(canvas.getByText('Removes 3 of 4 events')).toBeInTheDocument()
    await expect(canvas.getByText(/every later one/)).toBeInTheDocument()
  },
}

export const DeleteAll: Story = {
  args: { variant: 'delete', initialScope: 'ALL' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Removes 4 of 4 events')).toBeInTheDocument()
    await expect(canvas.getByText(/Removes the entire series/)).toBeInTheDocument()
  },
}
