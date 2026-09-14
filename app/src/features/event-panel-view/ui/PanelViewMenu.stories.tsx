import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { darkMode } from '../../../../.storybook/modes'
import { PanelViewMenu } from './PanelViewMenu'

/**
 * The events page's view control, beside `Filters` in the header: which view a card's roster panel
 * opens onto, and whether it starts open.
 *
 * It moved here from inside the panel (ADR-0030 §5, amended). Both settings are one global choice,
 * and a control drawn once per open card read as a per-card one however the state was actually held
 * — which is exactly how it was read. The stories below pin the two things that made the move worth
 * it: one control, and a popover that reports the choice rather than holding it.
 */
const meta = {
  title: 'features/event-panel-view/PanelViewMenu',
  component: PanelViewMenu,
  args: {
    view: 'pips',
    onViewChange: fn(),
    defaultExpanded: false,
    onDefaultExpandedChange: fn(),
  },
  // The popover opens downward from the trigger, so the frame needs room beneath it.
  decorators: [
    (Story) => (
      <div className="flex min-h-[320px] justify-end p-4">
        <Story />
      </div>
    ),
  ],
  parameters: { chromatic: { modes: darkMode } },
} satisfies Meta<typeof PanelViewMenu>

export default meta

type Story = StoryObj<typeof meta>

// Closed: one icon button, and — unlike Filters — no dot. A dot there warns the list may be hiding
// events; a non-default view hides nothing.
export const Closed: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'View options' })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument()
  },
}

export const Open: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'View options' }))
    await expect(canvas.getByRole('dialog', { name: 'View options' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Positions' })).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByRole('switch', { name: 'Keep panels open' })).toHaveAttribute(
      'aria-checked',
      'false',
    )
  },
}

export const OnTheMemberView: Story = {
  args: { view: 'members', defaultExpanded: true },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'View options' }))
    await expect(canvas.getByRole('button', { name: 'People' })).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByRole('switch', { name: 'Keep panels open' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await expect(canvas.getByText('On — every card starts open')).toBeInTheDocument()
  },
}

// ── Wiring — the control reports the choice, it does not hold it ─────────────────────────────────

export const PickingAViewIsReported: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'View options' }))
    await userEvent.click(canvas.getByRole('button', { name: 'People' }))
    await expect(args.onViewChange).toHaveBeenCalledWith('members')
  },
}

export const SwitchingBackIsReported: Story = {
  args: { view: 'members' },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'View options' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Positions' }))
    await expect(args.onViewChange).toHaveBeenCalledWith('pips')
  },
}

export const KeepOpenIsReported: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'View options' }))
    await userEvent.click(canvas.getByRole('switch', { name: 'Keep panels open' }))
    await expect(args.onDefaultExpandedChange).toHaveBeenCalledWith(true)
  },
}

// The popover closes on Escape and on a click outside, the same two paths Filters offers — the
// handler lives on the document because focus stays on the trigger, a sibling of the panel.
export const ClosesOnEscape: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'View options' }))
    await expect(canvas.getByRole('dialog')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument()
  },
}
