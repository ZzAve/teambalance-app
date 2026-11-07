import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { DemoTopUpView } from './DemoTopUpView'

// The page the demo build's Top up button opens. One static View, so one story (ADR-0032): the notice, and the way back.
const meta = {
  title: 'pages/demo/DemoTopUpView',
  component: DemoTopUpView,
  args: { onBack: fn() },
} satisfies Meta<typeof DemoTopUpView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole('heading')).toHaveTextContent('This is a demo — nothing is paid')
    await userEvent.click(canvas.getByRole('button', { name: 'Back to TeamBalance' }))
    await expect(args.onBack).toHaveBeenCalled()
  },
}
