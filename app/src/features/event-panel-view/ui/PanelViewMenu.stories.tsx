import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { PanelViewMenu } from './PanelViewMenu'

/**
 * The events page's view control, beside `Filters` in the header: whether a card's roster panel
 * starts open.
 *
 * It moved here from inside the panel (ADR-0030 §5, amended), because a control drawn once per open
 * card read as a per-card one however the state was actually held — which is exactly how it was
 * read. It held a second setting until the lineup panel landed: §5's pips-or-people choice retired
 * with the either/or it selected. The stories below pin what is left — a popover that *reports* the
 * choice rather than holding it, and closes the two ways Filters does.
 *
 * Four stories (ADR-0032 §3): this View is rendered inside the events page composite, which owns the
 * closed picture, so Data is `disableSnapshot`. Shells catalogues the one remaining static
 * configuration — pixel-identical closed, since the trigger carries no state of its own — in one
 * frame. `MenuOpen` is the one extra snapshotted story: the open popover is a state the page
 * composite can never show. Interactions keeps every onDefaultExpandedChange spy assertion plus the
 * escape-close assertion.
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
// events; this setting hides nothing.
// Picture owned by the page composite (pages/EventsPageView) — behavioural only (ADR-0032 §3).
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
        // cataloguing: the keep-open preference does not leak into the closed a11y state either.
        'Kept open by default': <PanelViewMenu {...args} defaultExpanded />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = within(canvas.getByRole('region', { name: 'Kept open by default' }))
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

// Picture owned by Data and MenuOpen — behavioural only (ADR-0032 §1). Two instances: the default
// control (off, closed by default) and the kept-open-by-default control — the popover is not a
// portal but its click-outside catcher covers the full frame, so only one instance may be open at a
// time; each cycle closes before the next opens.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        Default: <PanelViewMenu {...args} />,
        'Kept open by default': <PanelViewMenu {...args} defaultExpanded />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    // The gesture is reported, not held — flipping the preference on.
    await userEvent.click(region('Default').getByRole('button', { name: 'View options' }))
    await userEvent.click(region('Default').getByRole('switch', { name: 'Keep panels open' }))
    await expect(args.onDefaultExpandedChange).toHaveBeenLastCalledWith(true)

    // The popover closes on Escape and on a click outside, the same two paths Filters offers — the
    // handler lives on the document because focus stays on the trigger, a sibling of the panel.
    await expect(region('Default').getByRole('dialog')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await expect(region('Default').queryByRole('dialog')).not.toBeInTheDocument()

    // On the kept-open-by-default control: the switch reads on and the caption says so, and
    // reclassifying is not one-way — switching back off is the same report in the other direction.
    await userEvent.click(region('Kept open by default').getByRole('button', { name: 'View options' }))
    await expect(
      region('Kept open by default').getByRole('switch', { name: 'Keep panels open' }),
    ).toHaveAttribute('aria-checked', 'true')
    await expect(region('Kept open by default').getByText('On — every card starts open')).toBeInTheDocument()
    await userEvent.click(region('Kept open by default').getByRole('switch', { name: 'Keep panels open' }))
    await expect(args.onDefaultExpandedChange).toHaveBeenLastCalledWith(false)
  },
}
