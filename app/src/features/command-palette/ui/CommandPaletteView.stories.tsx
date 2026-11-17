import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import type { PaletteItem } from '../model/palette-items'
import { CommandPaletteView } from './CommandPaletteView'

// The sidebar search field and the Cmd/Ctrl+K palette it opens (desktop only, from `lg`). The
// container builds the items from React Query and runs them; this View filters, moves the active
// option and reports the chosen item through onRun. Three stories per ADR-0032.
const ITEMS: PaletteItem[] = [
  { id: 'event:e1', group: 'events', label: 'Training', hint: 'Wed 18 Nov, 20:00', action: { kind: 'navigate', to: '/t/setpoint/events/e1' } },
  { id: 'event:e2', group: 'events', label: 'Match vs Dynamo', hint: 'Sat 21 Nov, 14:00', keywords: 'Sporthal Oost', action: { kind: 'navigate', to: '/t/setpoint/events/e2' } },
  { id: 'member:u1', group: 'members', label: 'Lisa de Vries', hint: '#7', action: { kind: 'navigate', to: '/t/setpoint/team/u1' } },
  { id: 'member:u2', group: 'members', label: 'Lisanne Bakker', action: { kind: 'navigate', to: '/t/setpoint/team/u2' } },
  { id: 'goto:events', group: 'goto', label: 'Events', action: { kind: 'navigate', to: '/t/setpoint' } },
  { id: 'goto:team', group: 'goto', label: 'Team', action: { kind: 'navigate', to: '/t/setpoint/team' } },
  { id: 'answer:ATTENDING', group: 'actions', label: 'Going: Training', hint: 'Wed 18 Nov, 20:00', action: { kind: 'answer', eventId: 'e1', state: 'ATTENDING' } },
]

const meta = {
  title: 'features/command-palette/CommandPaletteView',
  component: CommandPaletteView,
  args: { shortcut: '⌘K', open: true, items: ITEMS, onOpenChange: fn(), onRun: fn() },
} satisfies Meta<typeof CommandPaletteView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async () => {
    const dialog = within(await screen.findByRole('dialog', { name: 'Search and go' }))
    for (const group of ['Events', 'Members', 'Go to', 'Actions']) {
      await expect(dialog.getByRole('group', { name: group })).toBeInTheDocument()
    }
    await expect(dialog.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true')
  },
}

// Load failure (Go to and Actions still listed), then a query with no match.
export const Shells: Story = {
  args: { isError: true, items: ITEMS.filter((i) => i.group === 'goto') },
  play: async () => {
    const dialog = within(await screen.findByRole('dialog'))
    await expect(dialog.getByRole('status')).toHaveTextContent('Events and members could not be loaded.')
    await expect(dialog.getAllByRole('option')).toHaveLength(2)
  },
}

export const Interactions: Story = {
  args: { open: false },
  parameters: { chromatic: { disableSnapshot: true } },
  render: function Render(args) {
    const [open, setOpen] = useState(args.open)
    return (
      <CommandPaletteView
        {...args}
        open={open}
        onOpenChange={(next) => {
          args.onOpenChange(next)
          setOpen(next)
        }}
      />
    )
  },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Search/ }))
    await expect(args.onOpenChange).toHaveBeenCalledWith(true)

    const input = await screen.findByRole('combobox', { name: 'Search and go' })
    await expect(input).toHaveFocus()
    await userEvent.type(input, 'lisa')
    await expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Lisa de Vries#7', 'Lisanne Bakker'])

    await userEvent.keyboard('{ArrowDown}')
    const second = screen.getByRole('option', { name: 'Lisanne Bakker' })
    await expect(second).toHaveAttribute('aria-selected', 'true')
    await expect(input).toHaveAttribute('aria-activedescendant', second.id)
    await userEvent.keyboard('{Enter}')
    await expect(args.onRun).toHaveBeenCalledWith(ITEMS[3])

    // Wraps from the last option to the first.
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await expect(args.onRun).toHaveBeenLastCalledWith(ITEMS[2])

    await userEvent.clear(input)
    await userEvent.type(input, 'zzz')
    await expect(screen.getByRole('status')).toHaveTextContent('Nothing matches “zzz”.')

    await userEvent.keyboard('{Escape}')
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}
