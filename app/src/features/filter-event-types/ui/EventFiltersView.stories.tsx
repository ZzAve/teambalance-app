import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import type { EventTypeItem } from '@shared/api/event-types'
import { EventFiltersView } from './EventFiltersView'

// EventFiltersView is the events page's single filter control — the icon button plus the popover
// holding the type chips and the "Show past events" switch. It replaces the old Upcoming/Past tab
// bar. Prop-only apart from the popover's open/closed state; the selection and the show-past flag
// live in the route, so every state here renders from props with no network (ADR-0017).
const EVENT_TYPES: EventTypeItem[] = [
  { id: 'et-1', name: 'Training', color: '#249E6C' },
  { id: 'et-2', name: 'Match', color: '#225C9C' },
  { id: 'et-3', name: 'Tournament', color: '#7B5EA7' },
]

const ALL = new Set(EVENT_TYPES.map((t) => t.id))

const meta = {
  title: 'features/filter-event-types/EventFiltersView',
  component: EventFiltersView,
  args: {
    eventTypes: EVENT_TYPES,
    activeTypeIds: ALL,
    showPast: false,
    onToggleType: fn(),
    onToggleShowPast: fn(),
  },
} satisfies Meta<typeof EventFiltersView>

export default meta

type Story = StoryObj<typeof meta>

export const Closed: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Filters' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument()
  },
}

export const Open: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await expect(canvas.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument()
    // Both halves of the popover: the type chips and the past-events switch.
    await expect(canvas.getByRole('button', { name: 'Training' })).toBeInTheDocument()
    await expect(canvas.getByRole('switch', { name: 'Show past events' })).toHaveAttribute(
      'aria-checked',
      'false',
    )
    await expect(canvas.getByText('Off — upcoming only')).toBeInTheDocument()
  },
}

// Prop-contract spy: a chip tap must report the tapped type id up to the route, which owns the
// isolate-first selection rule (toggleTypeSelection).
export const TogglesType: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Match' }))
    await expect(args.onToggleType).toHaveBeenCalledWith('et-2')
  },
}

// Prop-contract spy: the switch reports the value it is moving *to*, which is what drives
// useEvents(showPast).
export const TogglesShowPast: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await userEvent.click(canvas.getByRole('switch', { name: 'Show past events' }))
    await expect(args.onToggleShowPast).toHaveBeenCalledWith(true)
  },
}

export const ShowingPast: Story = {
  args: { showPast: true },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await expect(canvas.getByRole('switch', { name: 'Show past events' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await expect(canvas.getByText('On — past events included')).toBeInTheDocument()
    // Switching back off is the same callback with the opposite value.
    await userEvent.click(canvas.getByRole('switch', { name: 'Show past events' }))
    await expect(args.onToggleShowPast).toHaveBeenCalledWith(false)
  },
}

export const ClosesOnEscape: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await expect(canvas.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument()
    // Focus is still on the trigger, which is a sibling of the panel — Escape is caught on the
    // document, so it has to work from there.
    await userEvent.keyboard('{Escape}')
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument()
  },
}

// With no event types to show — a fresh tenant, or a types request that failed — the popover still
// has to open and still has to offer the past toggle: it is the only route to past events now.
export const WithoutEventTypes: Story = {
  args: { eventTypes: [], activeTypeIds: new Set<string>() },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await expect(canvas.queryByText('Event types')).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('switch', { name: 'Show past events' }))
    await expect(args.onToggleShowPast).toHaveBeenCalledWith(true)
  },
}

// A narrowed selection has to be visible with the popover shut, or a filtered list reads as an
// empty one.
export const FilteredToOneType: Story = {
  args: { activeTypeIds: new Set(['et-2']) },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }))
    await expect(canvas.getByRole('button', { name: 'Match' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(canvas.getByRole('button', { name: 'Training' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  },
}
