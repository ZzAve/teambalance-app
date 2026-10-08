import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { makeSubstitute } from '@entities/event/testing/event-fixtures'
import { SubstitutePickerView } from './SubstitutePickerView'

// The picker for calling Substitutes in (ADR-0033). A sheet, so no page composite shows it open and
// this View owns its own picture. Three stories (ADR-0032 §1): Data is the picker opened for one
// Position, with the people who play it first and people in each state; Shells the unfiltered picker
// with nobody on the list yet; Interactions every spy, from a Position's open spot.
const POSITIONS = [
  { id: 'pos-setter', label: 'Setter' },
  { id: 'pos-libero', label: 'Libero' },
]

const LIBERO = { id: 'pos-libero', label: 'Libero' }

const TEAM_LIST = [
  { id: 'sub-1', name: 'Jan de Vries', position: LIBERO },
  { id: 'sub-2', name: 'Mila Jansen', position: undefined },
  { id: 'sub-3', name: 'Kees Bakker', position: { id: 'pos-setter', label: 'Setter' } },
  { id: 'sub-4', name: 'Pieter Smit', position: { id: 'pos-setter', label: 'Setter' } },
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
    await expect(mila.getByRole('button', { name: 'Asked' })).toHaveAttribute('aria-pressed', 'true')
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

// Opened without a Position, and nobody on the list yet: the only way forward is a new one. The play
// leaves that form open, the one frame of it — Data pictures the closed "New substitute" button, and
// Interactions takes no picture.
export const Shells: Story = {
  args: { substitutes: [], onEvent: [] },
  play: async ({ userEvent }) => {
    const sheet = within(await within(document.body).findByRole('dialog', { name: 'Call in substitutes' }))
    await expect(sheet.getByText('Nobody on the list yet.')).toBeInTheDocument()
    await expect(sheet.queryByRole('group', { name: 'Others' })).not.toBeInTheDocument()

    // Opened without a Position, so none is chosen yet.
    await userEvent.click(sheet.getByRole('button', { name: /New substitute/ }))
    await expect(sheet.getByLabelText('Name')).toBeInTheDocument()
    await expect(sheet.getByRole('button', { name: 'None' })).toHaveAttribute('aria-pressed', 'true')
    await expect(sheet.getByRole('button', { name: 'Add as asked' })).toBeDisabled()
  },
}

// Picture owned by Data — behavioural only (ADR-0032 §1).
export const Interactions: Story = {
  args: { position: LIBERO },
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ userEvent, args }) => {
    const sheet = within(await within(document.body).findByRole('dialog', { name: 'Find a Libero' }))

    // Several people can be called in before Done: one confirmed, one only asked.
    await userEvent.click(within(sheet.getByRole('group', { name: 'Kees Bakker' })).getByRole('button', { name: 'Going' }))
    await expect(args.onSetState).toHaveBeenCalledWith('sub-3', 'ATTENDING')
    await userEvent.click(within(sheet.getByRole('group', { name: 'Jan de Vries' })).getByRole('button', { name: 'Asked' }))
    await expect(args.onSetState).toHaveBeenCalledWith('sub-1', 'MAYBE')
    // Mila answered no: recorded as declined, so the team still sees she was asked.
    await userEvent.click(within(sheet.getByRole('group', { name: 'Mila Jansen' })).getByRole('button', { name: "Can't" }))
    await expect(args.onSetState).toHaveBeenCalledWith('sub-2', 'ABSENT')

    // The pill stays small, but a tap anywhere in a 44px band around it lands on it (F7).
    const pill = within(sheet.getByRole('group', { name: 'Kees Bakker' })).getByRole('button', { name: 'Asked' })
    const box = pill.getBoundingClientRect()
    const reach = (44 - box.height) / 2 - 1
    for (const y of [box.top - reach, box.bottom + reach]) {
      await expect(document.elementFromPoint(box.left + box.width / 2, y)).toBe(pill)
    }

    // Someone not on the list yet: a name and an optional Position, added as Asked. Opened for
    // Libero, so Libero is already chosen.
    await userEvent.click(sheet.getByRole('button', { name: /New substitute/ }))
    const add = sheet.getByRole('button', { name: 'Add as asked' })
    await expect(add).toBeDisabled()
    await expect(sheet.getByRole('button', { name: 'Libero' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.type(sheet.getByLabelText('Name'), 'Anouk de Boer')
    await userEvent.click(add)
    await expect(args.onCreate).toHaveBeenCalledWith('Anouk de Boer', 'pos-libero')

    // The picker stays open for the next one, and the form starts from the Position again.
    await userEvent.click(sheet.getByRole('button', { name: /New substitute/ }))
    await userEvent.type(sheet.getByLabelText('Name'), 'Sanne Vos')
    await userEvent.click(sheet.getByRole('button', { name: 'None' }))
    await userEvent.click(sheet.getByRole('button', { name: 'Add as asked' }))
    await expect(args.onCreate).toHaveBeenCalledWith('Sanne Vos', null)

    // Closing drops a half-typed name, so the next open starts fresh.
    await userEvent.click(sheet.getByRole('button', { name: /New substitute/ }))
    await userEvent.type(sheet.getByLabelText('Name'), 'Half')
    await userEvent.click(sheet.getByRole('button', { name: 'Done' }))
    await expect(args.onClose).toHaveBeenCalled()
    await expect(sheet.queryByLabelText('Name')).not.toBeInTheDocument()
  },
}
