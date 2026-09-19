import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Position } from '@shared/api/positions'
import { Stack } from '@shared/testing/stack'
import { makeEventType } from '@shared/testing/event-fixtures'
import { RosterOverrideField } from './RosterOverrideField'

// "Inherit default / Customise" in the create and edit event forms. Prop-only: the value and the
// selected event type come from the form around it, so both branches render with no network.
//
// Three-story shape (ADR-0032 §1):
//   1. Data — the one populated live instance (a customised override with real per-position
//      targets), and the picture of this View.
//   2. Shells — every other state (inheriting, the wire's literal null, tracking switched off, no
//      positions configured) stacked in one frame, each scoped to its labelled region.
//   3. Interactions — no picture; one play walks both radio transitions (seeding Customise from the
//      type default, and clearing back to Inherit) and keeps every onChange assertion.
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter', kind: 'PLAYING' },
  { id: 'p2', label: 'Libero', kind: 'PLAYING' },
]

const MATCH = makeEventType({
  id: 'et-1',
  name: 'Match',
  rosterDefault: {
    trackRoster: true,
    totalTarget: 12,
    positionTargets: [{ positionId: 'p1', count: 2 }],
  },
})

const meta = {
  title: 'features/manage-event-types/RosterOverrideField',
  component: RosterOverrideField,
  args: { eventType: MATCH, positions: POSITIONS, onChange: fn() },
} satisfies Meta<typeof RosterOverrideField>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  args: {
    value: { trackRoster: true, totalTarget: 8, positionTargets: [{ positionId: 'p2', count: 1 }] },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio', { name: 'Customise' })).toBeChecked()
    await expect(canvas.getByLabelText(/People needed in total/)).toHaveValue(8)
    await expect(canvas.getByLabelText('Libero')).toHaveValue(1)
    await expect(canvas.getByLabelText('Setter')).toHaveValue(null)
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        // The default, and the one that needs explaining: inheriting is not a snapshot. It says so,
        // and names what the type currently asks for so the choice is informed.
        Inheriting: <RosterOverrideField {...args} value={undefined} />,
        // The server puts a literal `null` on the wire for an inheriting event, while wirespec types
        // the field as `undefined`. Before this was guarded, a null slipped past the `=== undefined`
        // check, the editor rendered as "customised", and reading `value.trackRoster` crashed the
        // whole edit dialog. The cast proves TypeScript says this state is impossible and the wire
        // produces it anyway.
        'Null from the wire': <RosterOverrideField {...args} value={null as unknown as undefined} />,
        // A customised event may switch tracking OFF even when its type tracks — "no panel on this
        // one occurrence" is a deliberate answer, not the absence of one.
        'Tracking off': (
          <RosterOverrideField
            {...args}
            value={{ trackRoster: false, totalTarget: undefined, positionTargets: [] }}
          />
        ),
        // With no positions configured, per-position targets are impossible — so the editor says why
        // rather than showing an empty list.
        'No positions yet': (
          <RosterOverrideField
            {...args}
            positions={[]}
            value={{ trackRoster: true, totalTarget: undefined, positionTargets: [] }}
          />
        ),
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Inheriting').getByRole('radio', { name: 'Inherit default' })).toBeChecked()
    await expect(
      region('Inheriting').getByText(/Follows Match: 2 Setter · 12 total/),
    ).toBeInTheDocument()
    await expect(
      region('Inheriting').getByText(/Changing the type's default changes this event too/),
    ).toBeInTheDocument()
    // Nothing to edit while inheriting.
    await expect(
      region('Inheriting').queryByRole('switch', { name: 'Track roster' }),
    ).not.toBeInTheDocument()

    await expect(
      region('Null from the wire').getByRole('radio', { name: 'Inherit default' }),
    ).toBeChecked()
    await expect(
      region('Null from the wire').queryByRole('switch', { name: 'Track roster' }),
    ).not.toBeInTheDocument()

    await expect(
      region('Tracking off').getByRole('switch', { name: 'Track roster' }),
    ).toHaveAttribute('aria-checked', 'false')
    await expect(region('Tracking off').getByText(/no roster panel on the card/i)).toBeInTheDocument()

    await expect(
      region('No positions yet').getByText(/Add positions below to require a specific lineup/),
    ).toBeInTheDocument()
  },
}

// Picture owned by Data and Shells — behavioural only (ADR-0032 §1). Two instances because seeding
// Customise needs a starting value that is inheriting, while clearing back to Inherit needs one that
// is already customised.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        Inheriting: <RosterOverrideField {...args} value={undefined} />,
        Customised: (
          <RosterOverrideField
            {...args}
            value={{ trackRoster: true, totalTarget: 8, positionTargets: [] }}
          />
        ),
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    // Switching to Customise seeds from the type's current default, so the admin edits from where
    // the event already is rather than from an empty form.
    await userEvent.click(region('Inheriting').getByRole('radio', { name: 'Customise' }))
    await expect(args.onChange).toHaveBeenLastCalledWith({
      trackRoster: true,
      totalTarget: 12,
      positionTargets: [{ positionId: 'p1', count: 2 }],
    })

    // Going back to Inherit clears the override outright rather than keeping a stale copy of it.
    await userEvent.click(region('Customised').getByRole('radio', { name: 'Inherit default' }))
    await expect(args.onChange).toHaveBeenLastCalledWith(undefined)
  },
}
