import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { ThemeToggleView } from './ThemeToggleView'

// The appearance control (F11, #159). It is prop-only and network-free, so every state is a story:
// the three selectable preferences, the prop-contract spies proving a click reaches onChange with
// the right preference, and a story rendered inside `.dark` so Chromatic holds a baseline of the
// dark token layer itself — the tokens are what this slice mostly ships, and a light-only story
// would leave them unwatched.
const meta = {
  title: 'features/theme-toggle/ThemeToggleView',
  component: ThemeToggleView,
  args: { value: 'system', onChange: fn() },
} satisfies Meta<typeof ThemeToggleView>

export default meta

type Story = StoryObj<typeof meta>

export const SystemSelected: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio', { name: 'System' })).toBeChecked()
    await expect(canvas.getByRole('radio', { name: 'Light' })).not.toBeChecked()
    await expect(canvas.getByRole('radio', { name: 'Dark' })).not.toBeChecked()
  },
}

export const LightSelected: Story = {
  args: { value: 'light' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio', { name: 'Light' })).toBeChecked()
    await expect(canvas.getByRole('radio', { name: 'System' })).not.toBeChecked()
  },
}

export const DarkSelected: Story = {
  args: { value: 'dark' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio', { name: 'Dark' })).toBeChecked()
    await expect(canvas.getByRole('radio', { name: 'System' })).not.toBeChecked()
  },
}

export const ChoosingDark: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('radio', { name: 'Dark' }))
    await expect(args.onChange).toHaveBeenCalledWith('dark')
  },
}

export const ReturningToSystem: Story = {
  args: { value: 'dark' },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('radio', { name: 'System' }))
    await expect(args.onChange).toHaveBeenCalledWith('system')
  },
}

/**
 * The same control under the dark token layer, opted in via the preview's `theme` global — the
 * exact mechanism the toolbar switcher and the app itself use (`.dark` on the document root), not a
 * story-local wrapper. So this is a real dark-mode render, it holds Chromatic's dark baseline, and
 * it fails if the global theme switcher ever stops applying the layer.
 */
export const Dark: Story = {
  args: { value: 'dark' },
  globals: { theme: 'dark' },
  decorators: [
    (Story) => (
      <div className="p-6">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    // Prove the layer is live rather than merely requested: the control's surface must resolve to
    // the dark card token, not the cream one.
    const surface = within(canvasElement).getByRole('radiogroup')
    await expect(getComputedStyle(surface).backgroundColor).toBe('rgb(29, 27, 23)')
    await expect(document.documentElement.classList.contains('dark')).toBe(true)
  },
}
