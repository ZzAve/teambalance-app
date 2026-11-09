import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen } from 'storybook/test'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './sheet'

// The shared bottom sheet. Each caller's story covers its own content; this one owns the swipe-down
// gesture on the grab strip: a short drag springs back, a long one closes the sheet.
//
// One story (ADR-0032 §1): Interactions, no picture (the callers' stories carry the pixels).
const meta = {
  title: 'shared/ui/Sheet',
  component: Sheet,
  args: { open: true, onOpenChange: fn() },
  render: (args) => (
    <Sheet {...args}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Answer</SheetTitle>
          <SheetDescription>Pick one.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
} satisfies Meta<typeof Sheet>

export default meta

type Story = StoryObj<typeof meta>

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ userEvent, args }) => {
    const dialog = await screen.findByRole('dialog', { name: 'Answer' })
    const handle = dialog.querySelector<HTMLElement>('[data-slot="sheet-handle"]')!
    const { top } = handle.getBoundingClientRect()
    const drag = (dy: number) =>
      userEvent.pointer([
        { keys: '[MouseLeft>]', target: handle, coords: { clientX: 10, clientY: top } },
        { target: handle, coords: { clientX: 10, clientY: top + dy } },
        { keys: '[/MouseLeft]', target: handle, coords: { clientX: 10, clientY: top + dy } },
      ])

    // A short drag follows the finger while held, then springs back without closing.
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: handle, coords: { clientX: 10, clientY: top } },
      { target: handle, coords: { clientX: 10, clientY: top + 40 } },
    ])
    await expect(dialog.style.transform).toBe('translateY(40px)')
    await userEvent.pointer({ keys: '[/MouseLeft]', target: handle })
    await expect(dialog.style.transform).toBe('')
    await expect(args.onOpenChange).not.toHaveBeenCalled()

    // Dragging up does not lift the sheet.
    await drag(-60)
    await expect(args.onOpenChange).not.toHaveBeenCalled()

    // A long drag closes it.
    await drag(120)
    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
  },
}
