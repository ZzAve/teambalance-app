import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { MoneySettingsView } from './MoneySettingsView'

// MoneySettingsView is the presentational money pool settings behind the MoneySettings container. It
// owns only local draft state; the query and the PUT stay in the container, so every state renders
// purely from props.
//
// Three stories (ADR-0032 §1):
//   1. Data — the one populated live instance (a configured, pristine pool), the picture of this View.
//   2. Shells — loading, error and a switched-off pool without price or link, stacked in one frame.
//   3. Interactions — no picture; one play edits the fields and asserts what Save hands to onSave,
//      plus the blocking validation of a bad price and a foreign link.
const meta = {
  title: 'features/money-settings/MoneySettingsView',
  component: MoneySettingsView,
  args: {
    settings: { enabled: true, beerPrice: 270, bunqMeLink: 'https://bunq.me/setpointvt' },
    onSave: fn(),
  },
} satisfies Meta<typeof MoneySettingsView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('switch', { name: 'Show the money pool to the team' })).toBeChecked()
    await expect(canvas.getByLabelText('Beer price (€)')).toHaveValue('2,70')
    await expect(canvas.getByLabelText('bunq.me link')).toHaveValue('https://bunq.me/setpointvt')
    await expect(canvas.getByRole('button', { name: 'Save money pool' })).toBeDisabled()
  },
}

// Live instances share static ids, so Shells stacks only one form (the cleared one); loading and
// error render no fields.
export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <MoneySettingsView {...args} settings={undefined} isLoading />,
        Error: <MoneySettingsView {...args} settings={undefined} isError />,
        'Off without price': <MoneySettingsView {...args} settings={{ enabled: false, beerPrice: undefined, bunqMeLink: undefined }} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    await expect(region('Loading').queryByRole('button', { name: 'Save money pool' })).not.toBeInTheDocument()

    await expect(region('Error').getByText("Couldn't load the money pool settings. Please try again.")).toBeInTheDocument()
    await expect(region('Error').queryByRole('button', { name: 'Save money pool' })).not.toBeInTheDocument()

    await expect(region('Off without price').getByRole('switch')).not.toBeChecked()
    await expect(region('Off without price').getByLabelText('Beer price (€)')).toHaveValue('')
    await expect(region('Off without price').getByRole('button', { name: 'Save money pool' })).toBeDisabled()
  },
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    const price = canvas.getByLabelText('Beer price (€)')
    const link = canvas.getByLabelText('bunq.me link')
    const save = canvas.getByRole('button', { name: 'Save money pool' })

    await userEvent.clear(price)
    await userEvent.type(price, '0')
    await waitFor(() => expect(canvas.getByText('Enter a price between €0,01 and €100,00.')).toBeInTheDocument())
    await expect(save).toBeDisabled()

    await userEvent.clear(price)
    await userEvent.type(price, '3,10')
    await userEvent.clear(link)
    await userEvent.type(link, 'https://evil.example/x')
    await waitFor(() => expect(canvas.getByText('Use a link like https://bunq.me/yourteam.')).toBeInTheDocument())
    await expect(save).toBeDisabled()

    await userEvent.clear(link)
    await userEvent.type(link, 'bunq.me/newteam')
    await userEvent.click(canvas.getByRole('switch', { name: 'Show the money pool to the team' }))
    await expect(save).toBeEnabled()
    await userEvent.click(save)
    await expect(args.onSave).toHaveBeenCalledWith({ enabled: false, beerPrice: 310, bunqMeLink: 'bunq.me/newteam' })
  },
}
