import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { darkMode } from '../../../../.storybook/modes'
import { ThemeToggleView } from './ThemeToggleView'

// The appearance control (F11, #159). It is prop-only and network-free, so every state is provable
// without a network: the three selectable preferences, and the prop-contract spies proving a click
// reaches onChange with the right preference.
//
// Three stories (ADR-0032 §1):
//   1. Data — System selected (the default a user who never chose sits at), and the picture of this
//      View. Carries the dark-mode baseline too (`darkMode`): the tokens are what this slice mostly
//      ships, so a light-only picture would leave them unwatched.
//   2. Shells — the other two selectable preferences stacked in one frame, one picture, each state's
//      assertions scoped to its labelled region.
//   3. Interactions — no picture; one play drives the control from each direction (into Dark, back to
//      System) and keeps every prop-contract spy assertion. The control is controlled, so a click
//      reports to onChange without moving the checked radio — the picture doesn't change and doesn't
//      need to.
const meta = {
  title: 'features/theme-toggle/ThemeToggleView',
  component: ThemeToggleView,
  args: { value: 'system', onChange: fn() },
} satisfies Meta<typeof ThemeToggleView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  parameters: { chromatic: { modes: darkMode } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio', { name: 'System' })).toBeChecked()
    await expect(canvas.getByRole('radio', { name: 'Light' })).not.toBeChecked()
    await expect(canvas.getByRole('radio', { name: 'Dark' })).not.toBeChecked()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Light: <ThemeToggleView {...args} value="light" />,
        Dark: <ThemeToggleView {...args} value="dark" />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Light').getByRole('radio', { name: 'Light' })).toBeChecked()
    await expect(region('Light').getByRole('radio', { name: 'System' })).not.toBeChecked()

    await expect(region('Dark').getByRole('radio', { name: 'Dark' })).toBeChecked()
    await expect(region('Dark').getByRole('radio', { name: 'System' })).not.toBeChecked()
  },
}

// Picture owned by Data — behavioural only (ADR-0032 §1). Runs under the dark token layer, opted in
// via the preview's `theme` global — the exact mechanism the toolbar switcher and the app itself use
// (`.dark` on the document root) — so it also fails if that switcher ever stops applying the layer.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  globals: { theme: 'dark' },
  render: (args) => (
    <Stack
      items={{
        'From system': <ThemeToggleView {...args} />,
        'From dark': <ThemeToggleView {...args} value="dark" />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    // Prove the layer is live rather than merely requested: the control's surface must resolve to
    // the dark card token, not the cream one.
    const surface = region('From dark').getByRole('radiogroup')
    await expect(getComputedStyle(surface).backgroundColor).toBe('rgb(29, 27, 23)')
    await expect(document.documentElement.classList.contains('dark')).toBe(true)

    await userEvent.click(region('From system').getByRole('radio', { name: 'Dark' }))
    await expect(args.onChange).toHaveBeenLastCalledWith('dark')

    // Reachable in the other direction too — back to the default.
    await userEvent.click(region('From dark').getByRole('radio', { name: 'System' }))
    await expect(args.onChange).toHaveBeenLastCalledWith('system')
  },
}
