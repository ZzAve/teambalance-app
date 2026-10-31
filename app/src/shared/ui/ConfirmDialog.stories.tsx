import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, waitFor, within } from 'storybook/test'
import { darkMode } from '../../../.storybook/modes'
import { ConfirmDialog } from './ConfirmDialog'

// ConfirmDialog is the shared confirmation behind most destructive actions. Each caller's story covers
// its own wording and wiring; this one owns the dialog itself: its picture at phone width, where it
// opens focus, and that Escape and the buttons reach the callbacks. The dialog is controlled and stays
// open, so one play walks all three.
//
// One story (ADR-0032 §1): Interactions, which also carries the baseline.
const meta = {
  title: 'shared/ui/ConfirmDialog',
  component: ConfirmDialog,
  args: {
    open: true,
    title: 'Disconnect Bunq?',
    description: 'This deletes the access TeamBalance stored. Members can still top up through the bunq.me link.',
    confirmLabel: 'Disconnect',
    onConfirm: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof ConfirmDialog>

export default meta

type Story = StoryObj<typeof meta>

const PHONE_GUTTER = 16
const SUBPIXEL = 0.5

export const Interactions: Story = {
  parameters: { chromatic: { modes: darkMode } },
  play: async ({ userEvent, args }) => {
    const dialog = await screen.findByRole('dialog', { name: 'Disconnect Bunq?' })
    const buttons = within(dialog)

    // On a phone the dialog keeps the same side gutter as the page and rounds its corners.
    const box = dialog.getBoundingClientRect()
    await expect(box.left).toBeGreaterThanOrEqual(PHONE_GUTTER - SUBPIXEL)
    await expect(window.innerWidth - box.right).toBeGreaterThanOrEqual(PHONE_GUTTER - SUBPIXEL)
    await expect(getComputedStyle(dialog).borderTopLeftRadius).not.toBe('0px')

    // The safe choice has focus when it opens.
    await waitFor(() => expect(buttons.getByRole('button', { name: 'Cancel' })).toHaveFocus())

    await userEvent.keyboard('{Escape}')
    await expect(args.onCancel).toHaveBeenCalledTimes(1)
    await userEvent.click(buttons.getByRole('button', { name: 'Cancel' }))
    await expect(args.onCancel).toHaveBeenCalledTimes(2)
    await expect(args.onConfirm).not.toHaveBeenCalled()

    await userEvent.click(buttons.getByRole('button', { name: 'Disconnect' }))
    await expect(args.onConfirm).toHaveBeenCalledTimes(1)
  },
}
