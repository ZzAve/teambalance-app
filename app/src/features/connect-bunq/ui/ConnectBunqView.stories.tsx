import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { darkMode } from '../../../../.storybook/modes'
import { ConnectBunqView } from './ConnectBunqView'

// ConnectBunqView is the presentational "connect Bunq" section behind the ConnectBunq container. It
// owns only the acknowledgement tick and whether a connected team opened the form; the status read and
// the start request stay in the container, so every state renders purely from props.
//
// Three stories (ADR-0032 §1):
//   1. Data — the section as an Admin first meets it: not connected, nothing ticked, Connect disabled
//      with its reason.
//   2. Shells — connected without and with a picked account (the accounts slot in place of the form),
//      the request in flight, a failed start, and the results Bunq's return can carry, stacked in one frame.
//   3. Interactions — no picture; one play opens the section as Bunq's return does (the result takes
//      focus), ticks the acknowledgement, sees Connect enable and asserts the click reaches onConnect;
//      a second instance does the same for a connected team, after opening the form.
const ACCOUNTS_SLOT = <p>Accounts and Disconnect</p>

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
    await expect(canvas.getByLabelText(/Connecting gives TeamBalance bunq’s standard app access/)).not.toBeChecked()
    await expect(canvas.getByText(/bunq’s default grant also allows creating payments and draft payments/)).toBeInTheDocument()
    await expect(canvas.getByText(/You can disconnect in TeamBalance at any time, which deletes the access it stored/)).toBeInTheDocument()
    const connect = canvas.getByRole('button', { name: 'Connect Bunq' })
    await expect(connect).toBeDisabled()
    // The reason is on the page and tied to the button.
    await expect(connect).toHaveAccessibleDescription('Tick the box above to continue.')
    // The status line is mounted before it has anything to say, so a result is announced when it appears.
    await expect(canvas.getByRole('status')).toBeEmptyDOMElement()
  },
}

export const Shells: Story = {
  parameters: { chromatic: { modes: darkMode } },
  render: (args) => (
    <Stack
      items={{
        'Connected, no pick': <ConnectBunqView {...args} connected accounts={ACCOUNTS_SLOT} result="connected" />,
        'Connected, picked': <ConnectBunqView {...args} connected accountPicked accounts={ACCOUNTS_SLOT} />,
        Connecting: <ConnectBunqView {...args} isConnecting />,
        'Start failed': <ConnectBunqView {...args} error="Couldn’t open Bunq. Please try again." />,
        Declined: <ConnectBunqView {...args} result="declined" />,
        Failed: <ConnectBunqView {...args} result="error" />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    // A connected team sees its status and the accounts slot, not the acknowledgement it already gave.
    await expect(region('Connected, no pick').getByRole('status')).toHaveTextContent('Connected, pick an account below.')
    await expect(region('Connected, picked').getByRole('status')).toHaveTextContent('Connected to bunq.')
    for (const name of ['Connected, no pick', 'Connected, picked']) {
      await expect(region(name).getByText('Accounts and Disconnect')).toBeInTheDocument()
      await expect(region(name).queryByRole('checkbox')).not.toBeInTheDocument()
      await expect(region(name).queryByRole('button', { name: 'Connect again' })).not.toBeInTheDocument()
      await expect(region(name).getByRole('button', { name: 'Connect a different bunq login' })).toBeEnabled()
    }

    // While the browser is on its way to Bunq the acknowledgement stays ticked and disabled, the button is
    // disabled, and the tick hint is not needed.
    await expect(region('Connecting').getByRole('button', { name: 'Opening Bunq…' })).toBeDisabled()
    await expect(region('Connecting').getByRole('checkbox')).toBeChecked()
    await expect(region('Connecting').getByRole('checkbox')).toBeDisabled()
    await expect(region('Connecting').queryByText('Tick the box above to continue.')).not.toBeInTheDocument()

    await expect(region('Start failed').getByRole('alert')).toHaveTextContent('Couldn’t open Bunq. Please try again.')

    // Declining is a choice: plain status, no alert, no error colour.
    const declined = region('Declined').getByRole('status')
    await expect(declined).toHaveTextContent('You declined at Bunq, so nothing was connected.')
    await expect(declined).not.toHaveClass('text-red-ink')
    await expect(region('Declined').queryByRole('alert')).not.toBeInTheDocument()

    // A failure is an alert in the error colour, and the status line stays mounted but empty.
    await expect(region('Failed').getByRole('alert')).toHaveTextContent('Couldn’t connect Bunq. Please try again.')
    await expect(region('Failed').getByRole('alert')).toHaveClass('text-red-ink')
    await expect(region('Failed').getByRole('status')).toBeEmptyDOMElement()
  },
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  // The section as the redirect from Bunq opens it, next to a connected team's.
  args: { result: 'declined' },
  render: (args) => (
    <Stack
      items={{
        'First connect': <ConnectBunqView {...args} focusResult />,
        Reconnect: <ConnectBunqView {...args} result={undefined} connected accountPicked accounts={ACCOUNTS_SLOT} />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const first = within(canvas.getByRole('region', { name: 'First connect' }))
    const acknowledge = first.getByRole('checkbox', { name: /Connecting gives TeamBalance bunq’s standard app access/ })
    const connect = first.getByRole('button', { name: 'Connect Bunq' })

    // The result takes focus, so a screen reader reads it although it arrived with the page.
    await expect(first.getByRole('status')).toHaveFocus()

    // A disabled button takes no pointer events, so there is no click to try before the tick.
    await expect(connect).toBeDisabled()
    await expect(args.onConnect).not.toHaveBeenCalled()

    await userEvent.click(acknowledge)
    await expect(acknowledge).toBeChecked()
    await expect(connect).toBeEnabled()
    // The reason goes away with the tick.
    await expect(first.queryByText('Tick the box above to continue.')).not.toBeInTheDocument()
    await userEvent.click(connect)
    await expect(args.onConnect).toHaveBeenCalledTimes(1)

    await userEvent.click(acknowledge)
    await expect(connect).toBeDisabled()
    await expect(connect).toHaveAccessibleDescription('Tick the box above to continue.')

    // A connected team opens the form first, and the tick is asked for again.
    const reconnect = within(canvas.getByRole('region', { name: 'Reconnect' }))
    await userEvent.click(reconnect.getByRole('button', { name: 'Connect a different bunq login' }))
    await expect(reconnect.queryByRole('button', { name: 'Connect a different bunq login' })).not.toBeInTheDocument()
    const connectAgain = reconnect.getByRole('button', { name: 'Connect again' })
    await expect(connectAgain).toBeDisabled()
    await expect(reconnect.getByRole('checkbox')).not.toBeChecked()
    await userEvent.click(reconnect.getByRole('checkbox'))
    await userEvent.click(connectAgain)
    await expect(args.onConnect).toHaveBeenCalledTimes(2)
  },
}
