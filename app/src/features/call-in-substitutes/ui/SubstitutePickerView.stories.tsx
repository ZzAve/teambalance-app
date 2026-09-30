import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { SubstitutePickerView } from './SubstitutePickerView'

// The picker for calling Substitutes in (ADR-0033). A sheet, so the event-page composite never shows
// it open and this View owns its own picture.
const POSITIONS = [
  { id: 'pos-setter', label: 'Setter' },
  { id: 'pos-libero', label: 'Libero' },
]

const meta = {
  title: 'features/call-in-substitutes/SubstitutePickerView',
  component: SubstitutePickerView,
  args: {
    open: true,
    eventTitle: 'League Match vs Smash United',
    positions: POSITIONS,
    onCreate: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof SubstitutePickerView>

export default meta

type Story = StoryObj<typeof meta>

// Picture owned by Data — behavioural only (ADR-0032 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ userEvent, args }) => {
    const sheet = within(await within(document.body).findByRole('dialog', { name: 'Call in substitutes' }))

    // Someone not on the list yet: a name and an optional Position, added as Asked.
    await userEvent.click(sheet.getByRole('button', { name: /New substitute/ }))
    const add = sheet.getByRole('button', { name: 'Add as asked' })
    await expect(add).toBeDisabled()
    await userEvent.type(sheet.getByLabelText('Name'), 'Pieter Smit')
    await userEvent.click(sheet.getByRole('button', { name: 'Libero' }))
    await userEvent.click(add)
    await expect(args.onCreate).toHaveBeenCalledWith('Pieter Smit', 'pos-libero')

    await userEvent.click(sheet.getByRole('button', { name: 'Done' }))
    await expect(args.onClose).toHaveBeenCalled()
  },
}
