import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { LanguageSwitchView } from './LanguageSwitchView'

// The language control in Account (ADR-0043). Prop-only and network-free; the container stores the
// choice on the user and is covered by AccountLanguageIT plus the manual run.
//
// Two stories (ADR-0032 §1):
//   1. Data — English selected, the picture of this View.
//   2. Interactions — no picture; picking Nederlands reports 'nl', and the control is held while a
//      choice is being saved.
const meta = {
  title: 'features/language-switch/LanguageSwitchView',
  component: LanguageSwitchView,
  args: { value: 'en', onChange: fn() },
} satisfies Meta<typeof LanguageSwitchView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radiogroup', { name: 'Language' })).toBeVisible()
    await expect(canvas.getByRole('radio', { name: 'English' })).toBeChecked()
    await expect(canvas.getByRole('radio', { name: 'Nederlands' })).not.toBeChecked()
  },
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args, step }) => {
    await step('picking Nederlands reports nl', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Nederlands' }))
      await expect(args.onChange).toHaveBeenLastCalledWith('nl')
    })
  },
}

export const Saving: Story = {
  args: { isSaving: true },
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio', { name: 'Nederlands' })).toBeDisabled()
    await expect(canvas.getByRole('radio', { name: 'English' })).toBeDisabled()
  },
}
