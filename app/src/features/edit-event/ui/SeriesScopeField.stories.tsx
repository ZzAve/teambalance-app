import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Event, EventSeriesScope } from '@shared/api/events'
import { makeEvent } from '@shared/testing/event-fixtures'
import { Stack } from '@shared/testing/stack'
import { SeriesScopeField } from './SeriesScopeField'

// Four weekly occurrences sharing a group; the 2nd ('b') is the one being edited/deleted.
const SIBLINGS: Event[] = [
  makeEvent({ id: 'a', startTime: '2026-09-01T18:30:00Z', recurringGroup: 'g1' }),
  makeEvent({ id: 'b', startTime: '2026-09-08T18:30:00Z', recurringGroup: 'g1' }),
  makeEvent({ id: 'c', startTime: '2026-09-15T18:30:00Z', recurringGroup: 'g1' }),
  makeEvent({ id: 'd', startTime: '2026-09-22T18:30:00Z', recurringGroup: 'g1' }),
]

// Stateful harness: `scope` is owned by the parent dialog in production, so the harness holds it to
// make the segmented control interactive. `onScopeChange` is forwarded before the local state update
// so a story can assert the prop-contract — that a scope button fires onScopeChange with the picked
// value — while the live preview still reacts to the click.
function Harness({
  variant,
  initialScope,
  onScopeChange,
}: {
  variant: 'edit' | 'delete'
  initialScope: EventSeriesScope
  onScopeChange?: (scope: EventSeriesScope) => void
}) {
  const [scope, setScope] = useState<EventSeriesScope>(initialScope)
  return (
    <div className="max-w-md">
      <SeriesScopeField
        siblings={SIBLINGS}
        currentId="b"
        scope={scope}
        onScopeChange={(next) => {
          onScopeChange?.(next)
          setScope(next)
        }}
        variant={variant}
      />
    </div>
  )
}

const meta = {
  title: 'features/edit-event/SeriesScopeField',
  component: Harness,
  args: { onScopeChange: fn() },
} satisfies Meta<typeof Harness>

export default meta

type Story = StoryObj<typeof meta>

// One gallery story (ADR-0031 §2): all six scope variants stacked — the edit/delete axis crossed
// with THIS / THIS_AND_FOLLOWING / ALL — one snapshot, every branch asserted. Each variant starts
// already at the scope it names (`initialScope`), so the picture needs no click to reach it.
export const Gallery: Story = {
  // Unused by render below — every Stack item supplies its own `variant`/`initialScope` — but
  // required to satisfy the story's prop contract.
  args: { variant: 'edit', initialScope: 'THIS' },
  render: (args) => (
    <Stack
      items={{
        'Edit / This': <Harness {...args} variant="edit" initialScope="THIS" />,
        'Edit / This & following': <Harness {...args} variant="edit" initialScope="THIS_AND_FOLLOWING" />,
        'Edit / All': <Harness {...args} variant="edit" initialScope="ALL" />,
        'Delete / This': <Harness {...args} variant="delete" initialScope="THIS" />,
        'Delete / This & following': (
          <Harness {...args} variant="delete" initialScope="THIS_AND_FOLLOWING" />
        ),
        'Delete / All': <Harness {...args} variant="delete" initialScope="ALL" />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Edit / This').getByText('Affects 1 of 4 events')).toBeInTheDocument()
    await expect(
      region('Edit / This').getByRole('button', { name: 'This event' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(region('Edit / This').getByText(/Splits the series into three/)).toBeInTheDocument()
    // THIS keeps the date free, so no lock note.
    await expect(region('Edit / This').queryByText(/keeps its own date/)).not.toBeInTheDocument()

    await expect(region('Edit / This & following').getByText('Affects 3 of 4 events')).toBeInTheDocument()
    await expect(
      region('Edit / This & following').getByRole('button', { name: 'This & following' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(
      region('Edit / This & following').getByText(/Splits the series in two/),
    ).toBeInTheDocument()
    // A bulk scope locks the per-occurrence date.
    await expect(region('Edit / This & following').getByText(/keeps its own date/)).toBeInTheDocument()

    await expect(region('Edit / All').getByText('Affects 4 of 4 events')).toBeInTheDocument()
    await expect(
      region('Edit / All').getByRole('button', { name: 'All events' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(region('Edit / All').getByText(/No split/)).toBeInTheDocument()
    await expect(region('Edit / All').getByText(/keeps its own date/)).toBeInTheDocument()

    await expect(region('Delete / This').getByText('Removes 1 of 4 events')).toBeInTheDocument()
    await expect(region('Delete / This').getByText(/Removes just this occurrence/)).toBeInTheDocument()
    // Delete never locks a date — that note is edit-only.
    await expect(region('Delete / This').queryByText(/keeps its own date/)).not.toBeInTheDocument()

    await expect(region('Delete / This & following').getByText('Removes 3 of 4 events')).toBeInTheDocument()
    await expect(region('Delete / This & following').getByText(/every later one/)).toBeInTheDocument()

    await expect(region('Delete / All').getByText('Removes 4 of 4 events')).toBeInTheDocument()
    await expect(region('Delete / All').getByText(/Removes the entire series/)).toBeInTheDocument()
  },
}

// Picture owned by Gallery — behavioural only (ADR-0031 §1). Two instances so the edit and delete
// prop-contract (picking a scope reports it up) is proven for both variants; the resulting picture
// is already Gallery's static "This & following" frame, so nothing here needs a snapshot.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  // Unused by render below — every Stack item supplies its own `variant`/`initialScope` — but
  // required to satisfy the story's prop contract.
  args: { variant: 'edit', initialScope: 'THIS' },
  render: (args) => (
    <Stack
      items={{
        Edit: <Harness {...args} variant="edit" initialScope="THIS" />,
        Delete: <Harness {...args} variant="delete" initialScope="THIS" />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await userEvent.click(region('Edit').getByRole('button', { name: 'This & following' }))
    await expect(args.onScopeChange).toHaveBeenLastCalledWith('THIS_AND_FOLLOWING')

    // Same scope-report contract holds for the delete variant.
    await userEvent.click(region('Delete').getByRole('button', { name: 'This & following' }))
    await expect(args.onScopeChange).toHaveBeenLastCalledWith('THIS_AND_FOLLOWING')
  },
}
