import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { PanelViewMenu } from './PanelViewMenu'

/**
 * The events page's view control, beside `Filters` in the header: whether a card's roster panel
 * starts open.
 *
 * It moved here from inside the panel (ADR-0030 §5, amended). Both settings are one global choice,
 * and a control drawn once per open card read as a per-card one however the state was actually held
 * — which is exactly how it was read. The stories below pin the two things that made the move worth
 * it: one control, and a popover that reports the choice rather than holding it.
 *
 * Four stories (ADR-0031 §3): this View is rendered inside the events page composite, which owns the
 * closed picture, so Data is `disableSnapshot`. Shells catalogues the member-view configuration —
 * pixel-identical closed, since the trigger carries no state — in one frame. `MenuOpen` is the one
 * extra snapshotted story: the open popover is a state the page composite can never show. Interactions
 * keeps every onViewChange/onDefaultExpandedChange spy plus the escape-close assertion.
 */
const meta = {
  title: 'features/event-panel-view/PanelViewMenu',
  component: PanelViewMenu,
  args: { defaultExpanded: false, onDefaultExpandedChange: fn() },
  // The popover opens downward from the trigger, so the frame needs room beneath it.
  decorators: [
    (Story) => (
      <div className="flex min-h-[320px] justify-end p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PanelViewMenu>

export default meta

type Story = StoryObj<typeof meta>

// Closed: one icon button, and — unlike Filters — no dot. A dot there warns the list may be hiding
// events; a non-default view hides nothing.
// Picture owned by the page composite (pages/EventsPageView) — behavioural only (ADR-0031 §3).
export const Data: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'View options' })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        // Closed, and pixel-identical to Data — the trigger carries no state of its own — but worth
        // cataloguing: neither the view nor the keep-open preference leaks into the closed a11y state.
        'On the member view': <PanelViewMenu {...args} view="members" defaultExpanded />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = within(canvas.getByRole('region', { name: 'On the member view' }))
    await expect(region.getByRole('button', { name: 'View options' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await expect(region.queryByRole('dialog')).not.toBeInTheDocument()
  },
}

// The open-dialog frame: none of the Interactions steps can picture it, because they close it again
// (Escape, a click elsewhere) once the wiring is proven.
export const MenuOpen: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'View options' }))
    await expect(canvas.getByRole('dialog', { name: 'View options' })).toBeInTheDocument()
    await expect(canvas.getByRole('switch', { name: 'Keep panels open' })).toHaveAttribute(
      'aria-checked',
      'false',
    )
    await expect(canvas.getByText('Off — tap to open a card')).toBeInTheDocument()
  },
}

// Picture owned by Data and MenuOpen — behavioural only (ADR-0031 §1). Two instances: the default
// control (pips, closed by default) and the member-view control (people, keep-open on) — the popover
// is not a portal but its click-outside catcher covers the full frame, so only one instance may be
// open at a time; each cycle closes before the next opens.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        Default: <PanelViewMenu {...args} />,
        'Member view': <PanelViewMenu {...args} view="members" defaultExpanded />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    // The gesture is reported, not held — picking a view.
    await userEvent.click(region('Default').getByRole('button', { name: 'View options' }))
    await userEvent.click(region('Default').getByRole('button', { name: 'People' }))
    await expect(args.onViewChange).toHaveBeenCalledWith('members')

    // The popover closes on Escape and on a click outside, the same two paths Filters offers — the
    // handler lives on the document because focus stays on the trigger, a sibling of the panel.
    await expect(region('Default').getByRole('dialog')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await expect(region('Default').queryByRole('dialog')).not.toBeInTheDocument()

    // Reopen to report the other setting — keep panels open — before closing again.
    await userEvent.click(region('Default').getByRole('button', { name: 'View options' }))
    await userEvent.click(region('Default').getByRole('switch', { name: 'Keep panels open' }))
    await expect(args.onDefaultExpandedChange).toHaveBeenCalledWith(true)
    await userEvent.keyboard('{Escape}')

    // On the member view: People is pressed, the switch reads on, and reclassifying is not one-way —
    // switching back to Positions is the same report in the other direction.
    await userEvent.click(region('Member view').getByRole('button', { name: 'View options' }))
    await expect(region('Member view').getByRole('button', { name: 'People' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(region('Member view').getByRole('switch', { name: 'Keep panels open' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await expect(region('Member view').getByText('On — every card starts open')).toBeInTheDocument()
    await userEvent.click(region('Member view').getByRole('button', { name: 'Positions' }))
    await expect(args.onViewChange).toHaveBeenCalledWith('pips')
  },
}
