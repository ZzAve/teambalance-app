import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { SubstituteError } from '@shared/api/substitutes'
import { makeSubstitute } from '@shared/testing/event-fixtures'
import { SubstitutePickerView } from './SubstitutePickerView'

// The picker for calling Substitutes in (ADR-0033). A sheet, so no page composite shows it open and
// this View owns its own picture. Three stories (ADR-0032 §1): Data is the picker opened for one
// Position, with the people who play it first and people in each state; Shells the unfiltered picker
// when the list and the Positions could not be loaded; Interactions every spy, from a Position's
// open spot.
const POSITIONS = [
  { id: 'pos-setter', label: 'Setter' },
  { id: 'pos-libero', label: 'Libero' },
]

const LIBERO = { id: 'pos-libero', label: 'Libero' }

const TEAM_LIST = [
  { id: 'sub-1', name: 'Jan de Vries', position: LIBERO, shirtNumber: undefined },
  { id: 'sub-2', name: 'Mila Jansen', position: undefined, shirtNumber: undefined },
  { id: 'sub-3', name: 'Kees Bakker', position: { id: 'pos-setter', label: 'Setter' }, shirtNumber: undefined },
  { id: 'sub-4', name: 'Pieter Smit', position: { id: 'pos-setter', label: 'Setter' }, shirtNumber: undefined },
]

const ON_EVENT = [
  makeSubstitute('sub-1', 'Jan de Vries', { position: LIBERO }),
  makeSubstitute('sub-2', 'Mila Jansen', { state: 'MAYBE' }),
  makeSubstitute('sub-4', 'Pieter Smit', { state: 'ABSENT' }),
]

const meta = {
  title: 'features/call-in-substitutes/SubstitutePickerView',
  component: SubstitutePickerView,
  args: {
    open: true,
    eventTitle: 'League Match vs Smash United',
    positions: POSITIONS,
    substitutes: TEAM_LIST,
    onEvent: ON_EVENT,
    onSetState: fn(),
    onCreate: fn(),
    onClose: fn(),
    onRetry: fn(),
    onRetryPositions: fn(),
  },
} satisfies Meta<typeof SubstitutePickerView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  args: { position: LIBERO },
  play: async () => {
    const sheet = within(await within(document.body).findByRole('dialog', { name: 'Find a Libero' }))
    // Who plays the Position comes first, the rest after (#359 decision 9).
    const plays = within(sheet.getByRole('group', { name: 'Plays Libero' }))
    await expect(plays.getAllByRole('group').map((g) => g.getAttribute('aria-label'))).toEqual(['Jan de Vries'])
    const others = within(sheet.getByRole('group', { name: 'Others' }))
    await expect(others.getAllByRole('group').map((g) => g.getAttribute('aria-label'))).toEqual([
      'Mila Jansen',
      'Kees Bakker',
      'Pieter Smit',
    ])
    const jan = within(sheet.getByRole('group', { name: 'Jan de Vries' }))
    await expect(jan.getByRole('button', { name: 'Going' })).toHaveAttribute('aria-pressed', 'true')
    await expect(jan.getByText('Libero')).toBeInTheDocument()
    const mila = within(sheet.getByRole('group', { name: 'Mila Jansen' }))
    await expect(mila.getByRole('button', { name: 'Maybe' })).toHaveAttribute('aria-pressed', 'true')
    // Asked and said no: kept on the event as declined, not deleted.
    const pieter = within(sheet.getByRole('group', { name: 'Pieter Smit' }))
    await expect(pieter.getByRole('button', { name: "Can't" })).toHaveAttribute('aria-pressed', 'true')
    // Not on this event yet: nothing pressed.
    const kees = within(sheet.getByRole('group', { name: 'Kees Bakker' }))
    await expect(kees.getByRole('button', { name: 'Going' })).toHaveAttribute('aria-pressed', 'false')
    // Deleting someone from the event is not a picker action; it lives in their sheet on the page.
    await expect(sheet.queryByRole('button', { name: /take off/i })).not.toBeInTheDocument()
  },
}

// Opened without a Position, and the list could not be loaded: an error with a retry, never "Nobody on
// the list yet" over a list that exists (#389). Try again re-requests, so the frame ends on the loading
// copy; the play then opens the form, where the Positions carry their own error, and leaves it open —
// the one frame of either.
export const Shells: Story = {
  args: { substitutes: [], onEvent: [], positions: [], positionsError: true },
  render: function Render(args) {
    const [retried, setRetried] = useState(false)
    return (
      <SubstitutePickerView
        {...args}
        isError={!retried}
        isLoading={retried}
        onRetry={() => {
          args.onRetry?.()
          setRetried(true)
        }}
      />
    )
  },
  play: async ({ userEvent, args }) => {
    const sheet = within(await within(document.body).findByRole('dialog', { name: 'Call in substitutes' }))
    await expect(sheet.getByRole('alert')).toHaveTextContent("Couldn't load the list.")
    await expect(sheet.queryByText('Nobody on the list yet.')).not.toBeInTheDocument()
    await expect(sheet.queryByRole('group', { name: 'Others' })).not.toBeInTheDocument()

    await userEvent.click(sheet.getByRole('button', { name: 'Try again' }))
    await expect(args.onRetry).toHaveBeenCalled()
    await expect(await sheet.findByText('Loading the list…')).toBeInTheDocument()
    await expect(sheet.queryByText('Nobody on the list yet.')).not.toBeInTheDocument()

    // Opened without a Position, so none is chosen yet; the Positions failed to load, so None is the
    // only chip, next to its own Try again.
    await userEvent.click(sheet.getByRole('button', { name: /New substitute/ }))
    await expect(sheet.getByLabelText('Name')).toBeInTheDocument()
    await expect(sheet.getByRole('button', { name: 'None' })).toHaveAttribute('aria-pressed', 'true')
    await expect(sheet.queryByRole('button', { name: 'Setter' })).not.toBeInTheDocument()
    await expect(sheet.getByRole('alert')).toHaveTextContent("Couldn't load the positions.")
    await userEvent.click(sheet.getByRole('button', { name: 'Try again' }))
    await expect(args.onRetryPositions).toHaveBeenCalled()
    await expect(sheet.getByRole('button', { name: 'Add as Maybe' })).toBeDisabled()
  },
}

// Picture owned by Data — behavioural only (ADR-0032 §1). Rendered with `isError` on top of a loaded
// list: a transient refetch error keeps the data on screen rather than replacing it with the shell.
export const Interactions: Story = {
  args: { position: LIBERO, isError: true },
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ userEvent, args }) => {
    const sheet = within(await within(document.body).findByRole('dialog', { name: 'Find a Libero' }))
    await expect(sheet.getByRole('group', { name: 'Plays Libero' })).toBeInTheDocument()
    await expect(sheet.queryByRole('alert')).not.toBeInTheDocument()

    // Several people can be called in before Done: one confirmed, one only asked.
    await userEvent.click(within(sheet.getByRole('group', { name: 'Kees Bakker' })).getByRole('button', { name: 'Going' }))
    await expect(args.onSetState).toHaveBeenCalledWith('sub-3', 'ATTENDING')
    await userEvent.click(within(sheet.getByRole('group', { name: 'Jan de Vries' })).getByRole('button', { name: 'Maybe' }))
    await expect(args.onSetState).toHaveBeenCalledWith('sub-1', 'MAYBE')
    // Mila answered no: recorded as declined, so the team still sees she was asked.
    await userEvent.click(within(sheet.getByRole('group', { name: 'Mila Jansen' })).getByRole('button', { name: "Can't" }))
    await expect(args.onSetState).toHaveBeenCalledWith('sub-2', 'ABSENT')

    // The pill stays small, but a tap anywhere in a 44px band around it lands on it (F7).
    const pill = within(sheet.getByRole('group', { name: 'Kees Bakker' })).getByRole('button', { name: 'Maybe' })
    const box = pill.getBoundingClientRect()
    const reach = (44 - box.height) / 2 - 1
    for (const y of [box.top - reach, box.bottom + reach]) {
      await expect(document.elementFromPoint(box.left + box.width / 2, y)).toBe(pill)
    }

    // Someone not on the list yet: a name and an optional Position, added as Maybe. Opened for
    // Libero, so Libero is already chosen.
    await userEvent.click(sheet.getByRole('button', { name: /New substitute/ }))
    const add = sheet.getByRole('button', { name: 'Add as Maybe' })
    await expect(add).toBeDisabled()
    await expect(sheet.getByRole('button', { name: 'Libero' })).toHaveAttribute('aria-pressed', 'true')
    // A Position chip is a full 44px target itself: the chip is the box, no band around it (#388).
    for (const label of ['Setter', 'Libero', 'None']) {
      const chip = sheet.getByRole('button', { name: label })
      chip.scrollIntoView({ block: 'center' })
      const box = chip.getBoundingClientRect()
      await expect(box.height).toBeGreaterThanOrEqual(44)
      for (const y of [box.top + 1, box.bottom - 1]) {
        await expect(document.elementFromPoint(box.left + box.width / 2, y)).toBe(chip)
      }
    }
    await userEvent.type(sheet.getByLabelText('Name'), 'Anouk de Boer')
    await userEvent.click(add)
    await expect(args.onCreate).toHaveBeenCalledWith('Anouk de Boer', 'pos-libero')
    // Added: the form closes and the picker stays open for the next one.
    await expect(await sheet.findByRole('button', { name: /New substitute/ })).toBeInTheDocument()

    // The form starts from the Position again; None is a choice.
    await userEvent.click(sheet.getByRole('button', { name: /New substitute/ }))
    await userEvent.type(sheet.getByLabelText('Name'), 'Sanne Vos')
    await userEvent.click(sheet.getByRole('button', { name: 'None' }))
    await userEvent.click(sheet.getByRole('button', { name: 'Add as Maybe' }))
    await expect(args.onCreate).toHaveBeenCalledWith('Sanne Vos', null)
    await expect(await sheet.findByRole('button', { name: /New substitute/ })).toBeInTheDocument()

    // Someone already on the list, in another case: caught before any request, with a pointer to
    // where they are (#389). The hint goes once the name differs.
    await userEvent.click(sheet.getByRole('button', { name: /New substitute/ }))
    await userEvent.type(sheet.getByLabelText('Name'), ' kees BAKKER ')
    await expect(sheet.getByRole('alert')).toHaveTextContent('Kees Bakker is already on the list — find them above.')
    await expect(sheet.getByRole('button', { name: 'Add as Maybe' })).toBeDisabled()
    await userEvent.type(sheet.getByLabelText('Name'), 'jr')
    await expect(sheet.queryByRole('alert')).not.toBeInTheDocument()
    await expect(args.onCreate).not.toHaveBeenCalledWith(expect.stringMatching(/kees/i), expect.anything())

    // The request is refused (someone else added them meanwhile), then fails outright: each time the
    // form stays open with the name, and says why under the field (#389).
    args.onCreate.mockRejectedValueOnce(new SubstituteError('Kees Bakker jr is already on the list.'))
    await userEvent.click(sheet.getByRole('button', { name: 'Add as Maybe' }))
    await expect(args.onCreate).toHaveBeenCalledWith('kees BAKKER jr', 'pos-libero')
    await expect(await sheet.findByRole('alert')).toHaveTextContent('Kees Bakker jr is already on the list.')
    await expect(sheet.getByLabelText('Name')).toHaveValue(' kees BAKKER jr')
    args.onCreate.mockRejectedValueOnce(new Error('offline'))
    await userEvent.click(sheet.getByRole('button', { name: 'Add as Maybe' }))
    await expect(await sheet.findByRole('alert')).toHaveTextContent("Couldn't add the substitute — please try again.")
    await expect(sheet.getByLabelText('Name')).toHaveValue(' kees BAKKER jr')
    // Third time lucky: the same name goes through and the form closes.
    await userEvent.click(sheet.getByRole('button', { name: 'Add as Maybe' }))
    await expect(await sheet.findByRole('button', { name: /New substitute/ })).toBeInTheDocument()

    // Closing drops a half-typed name, so the next open starts fresh.
    await userEvent.click(sheet.getByRole('button', { name: /New substitute/ }))
    await userEvent.type(sheet.getByLabelText('Name'), 'Half')
    await userEvent.click(sheet.getByRole('button', { name: 'Done' }))
    await expect(args.onClose).toHaveBeenCalled()
    await expect(sheet.queryByLabelText('Name')).not.toBeInTheDocument()

    // While the request is out, the button says so and holds, and the name stays put.
    let settle = () => {}
    args.onCreate.mockReturnValueOnce(new Promise<void>((resolve) => (settle = resolve)))
    await userEvent.click(sheet.getByRole('button', { name: /New substitute/ }))
    await expect(sheet.getByLabelText('Name')).toHaveValue('')
    await userEvent.type(sheet.getByLabelText('Name'), 'Sanne Vos')
    await userEvent.click(sheet.getByRole('button', { name: 'Add as Maybe' }))
    await expect(await sheet.findByRole('button', { name: 'Adding…' })).toBeDisabled()
    await expect(sheet.getByLabelText('Name')).toHaveValue('Sanne Vos')

    // Closed and reopened while that request is still out: the fresh form is not held by it, and
    // its settling later leaves the fresh form alone.
    await userEvent.click(sheet.getByRole('button', { name: 'Done' }))
    await userEvent.click(sheet.getByRole('button', { name: /New substitute/ }))
    await userEvent.type(sheet.getByLabelText('Name'), 'Bram Visser')
    await expect(sheet.getByRole('button', { name: 'Add as Maybe' })).toBeEnabled()
    settle()
    await new Promise((resolve) => setTimeout(resolve, 0))
    await expect(sheet.getByLabelText('Name')).toHaveValue('Bram Visser')
  },
}
