import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { DemoLoginView } from './DemoLoginView'

// The demo entry page (ADR-0043): one button. Two stories under the ADR-0032 cap: Interactions proves the
// click reaches onPlay with the persona the server expects; Shells stacks the pending and error states.
const meta = {
  title: 'features/demo-login/DemoLoginView',
  component: DemoLoginView,
  args: { onPlay: fn() },
} satisfies Meta<typeof DemoLoginView>

export default meta

type Story = StoryObj<typeof meta>

export const Interactions: Story = {
  play: async ({ canvas, args }) => {
    await expect(canvas.getByText('Dit is een demo-team.')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Speel als Sanne' }))
    await expect(args.onPlay).toHaveBeenCalledWith('MEMBER')
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Pending: <DemoLoginView {...args} isPending />,
        Error: <DemoLoginView {...args} isError />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('button', { name: 'Speel als Sanne' })[0]).toBeDisabled()
    await expect(canvas.getByRole('alert')).toHaveTextContent('Inloggen is niet gelukt. Probeer het opnieuw.')
  },
}
