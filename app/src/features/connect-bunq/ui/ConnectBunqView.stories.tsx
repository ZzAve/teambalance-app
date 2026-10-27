import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { darkMode } from '../../../../.storybook/modes'
import { ConnectBunqView } from './ConnectBunqView'

// ConnectBunqView is the presentational "connect Bunq" section behind the ConnectBunq container. It
// owns only the acknowledgement tick; the status read and the start request stay in the container, so
// every state renders purely from props.
//
// Three stories (ADR-0032 §1):
//   1. Data — the section as an Admin first meets it: not connected, nothing ticked, Connect disabled.
//   2. Shells — already connected, the request in flight, a failed start, and the three results Bunq's
//      return can carry, stacked in one frame.
//   3. Interactions — no picture; one play ticks the acknowledgement, sees Connect enable and asserts
//      the click reaches onConnect.
const meta = {
  title: 'features/connect-bunq/ConnectBunqView',
  component: ConnectBunqView,
  args: {
    connected: false,
    onConnect: fn(),
  },
} satisfies Meta<typeof ConnectBunqView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Connect Bunq' })).toBeInTheDocument()
    await expect(canvas.getByLabelText(/Connecting gives TeamBalance bunq's standard app access/)).not.toBeChecked()
    await expect(canvas.getByText(/bunq's default grant also allows creating payments and draft payments/)).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Connect Bunq' })).toBeDisabled()
  },
}

export const Shells: Story = {
  parameters: { chromatic: { modes: darkMode } },
  render: (args) => (
    <Stack
      items={{
        Connected: <ConnectBunqView {...args} connected result="connected" />,
        Connecting: <ConnectBunqView {...args} isConnecting />,
        'Start failed': <ConnectBunqView {...args} error="Couldn't open Bunq. Please try again." />,
        Declined: <ConnectBunqView {...args} result="declined" />,
        Failed: <ConnectBunqView {...args} result="error" />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Connected').getByRole('status')).toHaveTextContent('Bunq connected')
    await expect(region('Connected').getByRole('button', { name: 'Connect again' })).toBeDisabled()
    await expect(region('Connected').getByText(/Connecting again replaces the current connection/)).toBeInTheDocument()

    await expect(region('Connecting').getByRole('button', { name: 'Opening Bunq…' })).toBeDisabled()

    await expect(region('Start failed').getByRole('alert')).toHaveTextContent("Couldn't open Bunq. Please try again.")

    await expect(region('Declined').getByRole('status')).toHaveTextContent('You declined at Bunq, so nothing was connected.')
    await expect(region('Failed').getByRole('status')).toHaveTextContent("Couldn't connect Bunq. Please try again.")
  },
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    const acknowledge = canvas.getByRole('checkbox', { name: /Connecting gives TeamBalance bunq's standard app access/ })
    const connect = canvas.getByRole('button', { name: 'Connect Bunq' })
    const status = canvas.getByRole('status')

    // The status line is mounted before it has anything to say, so a result is announced when it appears.
    await expect(status).toBeEmptyDOMElement()

    // A disabled button takes no pointer events, so there is no click to try before the tick.
    await expect(connect).toBeDisabled()
    await expect(args.onConnect).not.toHaveBeenCalled()

    await userEvent.click(acknowledge)
    await expect(acknowledge).toBeChecked()
    await expect(connect).toBeEnabled()
    await userEvent.click(connect)
    await expect(args.onConnect).toHaveBeenCalledTimes(1)

    await userEvent.click(acknowledge)
    await expect(connect).toBeDisabled()
  },
}
