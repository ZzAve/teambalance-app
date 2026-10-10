import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { makeAttendee, makeSubstitute } from '@shared/testing/event-fixtures'
import { Stack } from '@shared/testing/stack'
import { SubstitutesBlock } from './SubstitutesBlock'

// The Substitutes block on the event page (ADR-0033). EventDetailView:Data owns the picture of it
// with people in it, so no Data story here (ADR-0032 §1): Shells pictures the two states the
// composite cannot show, and Interactions proves every spy through the inline controls, which are
// the controls #388 is about.
const MEMBERS = [makeAttendee('u-eva', 'Eva Smit', 'Outside'), makeAttendee('u-me', 'Sanne Vos', 'Setter')]

const SUBSTITUTES = [
  makeSubstitute('sub-1', 'Jan de Vries', { position: { id: 'pos-libero', label: 'Libero' }, changedBy: 'u-eva' }),
  makeSubstitute('sub-2', 'Mila Jansen', { state: 'MAYBE' }),
  makeSubstitute('sub-3', 'Pieter Smit', { state: 'ABSENT' }),
]

const meta = {
  title: 'features/call-in-substitutes/SubstitutesBlock',
  component: SubstitutesBlock,
  args: {
    substitutes: SUBSTITUTES,
    members: MEMBERS,
    onSetState: fn(),
    onOpen: fn(),
    onCallIn: fn(),
  },
} satisfies Meta<typeof SubstitutesBlock>

export default meta

type Story = StoryObj<typeof meta>

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Empty: <SubstitutesBlock {...args} substitutes={[]} />,
        Pending: <SubstitutesBlock {...args} pending />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    await expect(region('Empty').getByText('none yet')).toBeInTheDocument()
    await expect(region('Empty').getByText('Nobody called in yet.')).toBeInTheDocument()
    // A write in flight holds every state pill, but not the row or the call-in button.
    const pending = region('Pending')
    await expect(within(pending.getByRole('group', { name: 'Jan de Vries' })).getByRole('button', { name: 'Going' })).toBeDisabled()
    await expect(pending.getByRole('button', { name: /^Jan de Vries/ })).toBeEnabled()
    await expect(pending.getByRole('button', { name: 'Call in substitutes' })).toBeEnabled()
  },
}

// Picture owned by EventDetailView:Data — behavioural only (ADR-0032 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    const block = within(canvas.getByRole('region', { name: 'Substitutes' }))
    await expect(block.getByText('1 going')).toBeInTheDocument()
    await expect(block.getByText('1 asked')).toBeInTheDocument()
    await expect(block.getByText("1 can't")).toBeInTheDocument()
    await expect(block.getByText('Libero · set by Eva Smit')).toBeInTheDocument()

    // Each pill reports its own row: a mis-tap here records the wrong person for the whole team
    // (ADR-0003), which is why the target has to be the full 44px (#388).
    const row = (name: string) => within(block.getByRole('group', { name }))
    await userEvent.click(row('Mila Jansen').getByRole('button', { name: 'Going' }))
    await expect(args.onSetState).toHaveBeenCalledWith('sub-2', 'ATTENDING')
    await userEvent.click(row('Jan de Vries').getByRole('button', { name: 'Asked' }))
    await expect(args.onSetState).toHaveBeenCalledWith('sub-1', 'MAYBE')
    await userEvent.click(row('Pieter Smit').getByRole('button', { name: "Can't" }))
    await expect(args.onSetState).toHaveBeenCalledWith('sub-3', 'ABSENT')
    await expect(args.onSetState).toHaveBeenCalledTimes(3)

    // The pill stays small, but a tap anywhere in a 44px band around it lands on it (F7), and never
    // on the neighbouring row's pill.
    for (const name of ['Jan de Vries', 'Mila Jansen', 'Pieter Smit']) {
      for (const label of ['Going', 'Asked', "Can't"]) {
        const pill = row(name).getByRole('button', { name: label })
        pill.scrollIntoView({ block: 'center' })
        const box = pill.getBoundingClientRect()
        const reach = (44 - box.height) / 2 - 1
        for (const y of [box.top - reach, box.bottom + reach]) {
          await expect(document.elementFromPoint(box.left + box.width / 2, y)).toBe(pill)
        }
      }
    }

    // The name opens the Substitute's sheet; the footer opens the picker.
    await userEvent.click(block.getByRole('button', { name: /^Mila Jansen/ }))
    await expect(args.onOpen).toHaveBeenCalledWith('sub-2')
    await userEvent.click(block.getByRole('button', { name: 'Call in substitutes' }))
    await expect(args.onCallIn).toHaveBeenCalled()
  },
}
