import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import type { Position } from '@shared/api/positions'
import { makeEventType } from '@shared/testing/event-fixtures'
import { RosterOverrideField } from './RosterOverrideField'

// "Inherit default / Customise" in the create and edit event forms. Prop-only: the value and the
// selected event type come from the form around it, so both branches render with no network.
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter' },
  { id: 'p2', label: 'Libero' },
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

// The default, and the one that needs explaining: inheriting is not a snapshot. It says so, and
// names what the type currently asks for so the choice is informed.
export const Inheriting: Story = {
  args: { value: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio', { name: 'Inherit default' })).toBeChecked()
    await expect(canvas.getByText(/Follows Match: 2 Setter · 12 total/)).toBeInTheDocument()
    await expect(canvas.getByText(/Changing the type's default changes this event too/)).toBeInTheDocument()
    // Nothing to edit while inheriting.
    await expect(canvas.queryByRole('switch', { name: 'Track roster' })).not.toBeInTheDocument()
  },
}

// Switching to Customise seeds from the type's current default, so the admin edits from where the
// event already is rather than from an empty form.
export const CustomiseSeedsFromTheTypeDefault: Story = {
  // Behavioural twin of Inheriting — the field is controlled, so clicking Customise fires
  // onChange without re-rendering: the post-play picture is still the inheriting one
  // (ADR-0027 §2). BackToInheriting deliberately KEEPS its baseline — its customised-with-no-
  // position-targets frame is a picture no sibling carries.
  parameters: { chromatic: { disableSnapshot: true } },
  args: { value: undefined },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('radio', { name: 'Customise' }))

    await expect(args.onChange).toHaveBeenCalledWith({
      trackRoster: true,
      totalTarget: 12,
      positionTargets: [{ positionId: 'p1', count: 2 }],
    })
  },
}

export const Customised: Story = {
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

// Going back to Inherit clears the override outright rather than keeping a stale copy of it.
export const BackToInheriting: Story = {
  args: { value: { trackRoster: true, totalTarget: 8, positionTargets: [] } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('radio', { name: 'Inherit default' }))
    await expect(args.onChange).toHaveBeenCalledWith(undefined)
  },
}

// A customised event may switch tracking OFF even when its type tracks — "no panel on this one
// occurrence" is a deliberate answer, not the absence of one.
export const CustomisedTrackingOff: Story = {
  args: { value: { trackRoster: false, totalTarget: undefined, positionTargets: [] } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('switch', { name: 'Track roster' })).toHaveAttribute('aria-checked', 'false')
    await expect(canvas.getByText(/no roster panel on the card/i)).toBeInTheDocument()
  },
}

// With no positions configured, per-position targets are impossible — so the editor says why rather
// than showing an empty list.
export const NoPositionsYet: Story = {
  args: {
    positions: [],
    value: { trackRoster: true, totalTarget: undefined, positionTargets: [] },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Add positions below to require a specific lineup/)).toBeInTheDocument()
  },
}
