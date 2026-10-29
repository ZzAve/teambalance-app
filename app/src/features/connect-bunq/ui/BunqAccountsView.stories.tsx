import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor, within } from 'storybook/test'
import type { BunqAccount } from '@shared/api/bunq-connection'
import { Stack } from '@shared/testing/stack'
import { darkMode } from '../../../../.storybook/modes'
import { BunqAccountsView } from './BunqAccountsView'

// BunqAccountsView is the presentational account picker and Disconnect behind the BunqAccounts
// container. It owns only the choice that has not been saved yet and the Disconnect confirmation; the
// reads and the mutations stay in the container, so every state renders purely from props.
//
// Three stories (ADR-0032 §1):
//   1. Data — a team that picked its account: Teamkas checked, "Use this account" waiting for a change.
//   2. Shells — no pick yet, loading, a failed read, saving, a saved pick (announced, focus on the
//      announcement), and a rejected grant, stacked in one frame.
//   3. Interactions — no picture; one play picks Privé and checks onPick, then walks Disconnect through
//      its confirmation: cancel calls nothing and returns focus to Disconnect, confirm calls onDisconnect
//      once. The instance first ends its pick rejected and then fails its disconnect, so the alert that
//      takes focus after each is asserted too.
const ACCOUNTS: BunqAccount[] = [
  { id: 'fake-account-1', name: 'Teamkas' },
  { id: 'fake-account-2', name: 'Privé' },
]

const meta = {
  title: 'features/connect-bunq/BunqAccountsView',
  component: BunqAccountsView,
  args: {
    accounts: ACCOUNTS,
    selectedAccountId: 'fake-account-1',
    onPick: fn(),
    onDisconnect: fn(),
  },
} satisfies Meta<typeof BunqAccountsView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Choose the account the Money page shows')).toBeInTheDocument()
    await expect(canvas.getByRole('radio', { name: 'Teamkas' })).toBeChecked()
    await expect(canvas.getByRole('radio', { name: 'Privé' })).not.toBeChecked()
    // Nothing to save until the choice differs from the saved one.
    await expect(canvas.getByRole('button', { name: 'Use this account' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Disconnect' })).toBeEnabled()
  },
}

export const Shells: Story = {
  parameters: { chromatic: { modes: darkMode } },
  render: (args) => (
    <Stack
      items={{
        'Nothing picked': <BunqAccountsView {...args} selectedAccountId={undefined} />,
        Loading: <BunqAccountsView {...args} accounts={undefined} selectedAccountId={undefined} isLoading />,
        'Load failed': <BunqAccountsView {...args} accounts={undefined} selectedAccountId={undefined} isError />,
        Saving: <BunqAccountsView {...args} isSaving />,
        'Pick failed': <BunqAccountsView {...args} error="Couldn’t save the account. Please try again." />,
        Rejected: <BunqAccountsView {...args} accounts={undefined} selectedAccountId={undefined} isError rejected />,
        // Last, because a saved pick focuses its announcement on mount and the last frame to do so keeps focus.
        Saved: <BunqAccountsView {...args} saved />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    // Before a pick the list leads with what to do, and nothing is checked or savable.
    await expect(region('Nothing picked').getByText('Choose the account the Money page shows')).toBeInTheDocument()
    await expect(region('Nothing picked').getAllByRole('radio')).toHaveLength(2)
    await expect(region('Nothing picked').queryByRole('radio', { checked: true })).not.toBeInTheDocument()
    await expect(region('Nothing picked').getByRole('button', { name: 'Use this account' })).toBeDisabled()

    await expect(region('Loading').getByRole('status')).toHaveTextContent('Loading the bunq accounts…')
    await expect(region('Loading').queryByRole('radio')).not.toBeInTheDocument()

    await expect(region('Load failed').getByRole('alert')).toHaveTextContent('Couldn’t load the bunq accounts.')
    await expect(region('Load failed').queryByRole('radio')).not.toBeInTheDocument()
    // Disconnecting stays possible when the accounts cannot be read.
    await expect(region('Load failed').getByRole('button', { name: 'Disconnect' })).toBeEnabled()

    await expect(region('Saving').getByRole('button', { name: 'Saving…' })).toBeDisabled()
    await expect(region('Saving').getByRole('radio', { name: 'Privé' })).toBeDisabled()
    await expect(region('Saving').getByRole('button', { name: 'Disconnect' })).toBeDisabled()

    // A saved pick says what the Money page shows now, and the announcement takes focus from the disabled controls.
    await expect(region('Saved').getByRole('status')).toHaveTextContent('The Money page now shows Teamkas.')
    await expect(region('Saved').getByRole('status')).toHaveFocus()
    await expect(region('Nothing picked').getByRole('status')).toBeEmptyDOMElement()

    await expect(region('Pick failed').getByRole('alert')).toHaveTextContent('Couldn’t save the account.')

    // A rejected grant says how to get out, and does not also claim the read failed.
    const rejected = region('Rejected').getByRole('alert')
    await expect(rejected).toHaveTextContent('can’t use its stored bunq access any more')
    await expect(rejected).toHaveTextContent('Connect a different bunq login')
    await expect(region('Rejected').getAllByRole('alert')).toHaveLength(1)
    await expect(region('Rejected').getByRole('button', { name: 'Disconnect' })).toBeEnabled()
    // Opening the page on a connection that is already rejected leaves focus where it is.
    await expect(rejected).not.toHaveFocus()
  },
}

const DISCONNECT_FAILED = 'Couldn’t disconnect Bunq. Please try again.'

/**
 * A View whose pick ends rejected and whose disconnect fails, as the container reports them, so the alerts
 * and their focus can be played.
 */
function FailingActions(props: React.ComponentProps<typeof BunqAccountsView>) {
  const [error, setError] = useState<string | null>(null)
  const [rejected, setRejected] = useState(false)
  return (
    <BunqAccountsView
      {...props}
      error={error}
      rejected={rejected}
      onPick={(accountId) => {
        props.onPick(accountId)
        setRejected(true)
      }}
      onDisconnect={() => {
        props.onDisconnect()
        setError(DISCONNECT_FAILED)
      }}
    />
  )
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => <FailingActions {...args} />,
  play: async ({ canvas, userEvent, args }) => {
    const save = canvas.getByRole('button', { name: 'Use this account' })

    await userEvent.click(canvas.getByRole('radio', { name: 'Privé' }))
    await expect(canvas.getByRole('radio', { name: 'Privé' })).toBeChecked()
    await expect(args.onPick).not.toHaveBeenCalled()
    await expect(save).toBeEnabled()
    await userEvent.click(save)
    await expect(args.onPick).toHaveBeenCalledWith('fake-account-2')
    // A pick that ends rejected takes focus to the message: the button pressed is about to go.
    await waitFor(() => expect(canvas.getByRole('alert')).toHaveFocus())
    await expect(canvas.getByRole('alert')).toHaveTextContent('can’t use its stored bunq access any more')

    // Choosing the saved account again leaves nothing to save.
    await userEvent.click(canvas.getByRole('radio', { name: 'Teamkas' }))
    await expect(save).toBeDisabled()

    // The dialog is in a portal, outside the canvas. Cancel keeps the connection.
    const dialog = within(document.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Disconnect' }))
    await expect(await dialog.findByText(/This deletes the access TeamBalance stored/)).toBeInTheDocument()
    await expect(dialog.getByText(/remove TeamBalance under connected apps in the bunq app/)).toBeInTheDocument()
    await userEvent.click(dialog.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(dialog.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(args.onDisconnect).not.toHaveBeenCalled()
    // Focus is back on the button that opened the dialog, not on the page.
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Disconnect' })).toHaveFocus())

    await userEvent.click(canvas.getByRole('button', { name: 'Disconnect' }))
    await userEvent.click(within(await dialog.findByRole('dialog')).getByRole('button', { name: 'Disconnect' }))
    await expect(args.onDisconnect).toHaveBeenCalledTimes(1)
    // A failure takes focus to its alert, so it is read and the keyboard user is not left on the page.
    await waitFor(() => expect(canvas.getByText(DISCONNECT_FAILED)).toHaveFocus())
  },
}
