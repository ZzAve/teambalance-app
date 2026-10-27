import { useState, type ComponentProps } from 'react'
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
//   2. Shells — loading, error, a switched-off pool without price or link and a failed save, stacked in
//      one frame.
//   3. Interactions — no picture; one play edits the fields and asserts what Save hands to onSave,
//      plus the blocking validation of a bad price and a foreign link, and what the form shows once
//      the save comes back.
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

// Stands in for the container: a save comes back as the new saved settings, the link normalised by the
// server, and the form is told it was saved.
function SaveRoundTrip(args: ComponentProps<typeof MoneySettingsView>) {
  const [settings, setSettings] = useState(args.settings)
  const [saved, setSaved] = useState(false)
  return (
    <MoneySettingsView
      {...args}
      settings={settings}
      saved={saved}
      onSave={(next) => {
        args.onSave(next)
        setSettings({ ...next, bunqMeLink: `https://${next.bunqMeLink?.replace(/^https?:\/\//, '')}` })
        setSaved(true)
      }}
    />
  )
}

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('switch', { name: 'Show the money pool to the team' })).toBeChecked()
    await expect(canvas.getByLabelText('Beer price (€)')).toHaveValue('2,70')
    await expect(canvas.getByLabelText('bunq.me link')).toHaveValue('https://bunq.me/setpointvt')
    await expect(canvas.getByRole('button', { name: 'Save money pool' })).toBeDisabled()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <MoneySettingsView {...args} settings={undefined} isLoading />,
        Error: <MoneySettingsView {...args} settings={undefined} isError />,
        'Off without price': <MoneySettingsView {...args} settings={{ enabled: false, beerPrice: undefined, bunqMeLink: undefined }} />,
        'Save failed': <MoneySettingsView {...args} error="Could not save the money pool settings. Please try again." isSaving />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Loading').getByRole('status')).toHaveTextContent('Loading…')
    await expect(region('Loading').queryByRole('button', { name: 'Save money pool' })).not.toBeInTheDocument()

    await expect(region('Error').getByRole('alert')).toHaveTextContent("Couldn't load the money pool settings. Please try again.")
    await expect(region('Error').queryByRole('button', { name: 'Save money pool' })).not.toBeInTheDocument()

    await expect(region('Off without price').getByRole('switch')).not.toBeChecked()
    await expect(region('Off without price').getByLabelText('Beer price (€)')).toHaveValue('')
    await expect(region('Off without price').getByRole('button', { name: 'Save money pool' })).toBeDisabled()
    await expect(region('Off without price').getByText(/Money tab and page are hidden for everyone in the team/)).toBeInTheDocument()

    await expect(region('Save failed').getByRole('alert')).toHaveTextContent('Could not save the money pool settings. Please try again.')
    await expect(region('Save failed').getByRole('button', { name: 'Saving…' })).toBeDisabled()
  },
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => <SaveRoundTrip {...args} />,
  play: async ({ canvas, userEvent, args }) => {
    const price = canvas.getByLabelText('Beer price (€)')
    const link = canvas.getByLabelText('bunq.me link')
    const save = canvas.getByRole('button', { name: 'Save money pool' })

    await userEvent.clear(price)
    await userEvent.type(price, '0')
    await waitFor(() => expect(canvas.getByRole('alert')).toHaveTextContent('Enter a price between €0,01 and €100,00.'))
    await expect(price).toBeInvalid()
    await expect(price).toHaveAccessibleDescription('Enter a price between €0,01 and €100,00.')
    await expect(save).toBeDisabled()

    await userEvent.clear(price)
    await userEvent.type(price, '3,10')
    await userEvent.clear(link)
    await userEvent.type(link, 'https://evil.example/x')
    await waitFor(() => expect(canvas.getByRole('alert')).toHaveTextContent('Use a link like https://bunq.me/yourteam.'))
    await expect(link).toBeInvalid()
    await expect(link).toHaveAccessibleDescription('Use a link like https://bunq.me/yourteam.')
    await expect(price).toBeValid()
    await expect(save).toBeDisabled()

    await userEvent.clear(link)
    await userEvent.type(link, 'bunq.me/newteam')
    // The visible text is the switch's label: tapping it toggles the switch.
    await userEvent.click(canvas.getByText('Show the money pool to the team'))
    await expect(canvas.getByRole('switch', { name: 'Show the money pool to the team' })).not.toBeChecked()
    await expect(save).toBeEnabled()
    await userEvent.click(save)
    await expect(args.onSave).toHaveBeenCalledWith({ enabled: false, beerPrice: 310, bunqMeLink: 'bunq.me/newteam' })

    // The saved settings come back normalised: the form starts over from them instead of keeping the draft.
    await expect(canvas.getByLabelText('bunq.me link')).toHaveValue('https://bunq.me/newteam')
    await expect(canvas.getByRole('status')).toHaveTextContent('Saved')
    await expect(canvas.getByRole('button', { name: 'Save money pool' })).toBeDisabled()
  },
}
