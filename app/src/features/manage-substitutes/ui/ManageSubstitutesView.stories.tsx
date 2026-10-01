import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { Position } from '@shared/api/positions'
import type { Substitute } from '@shared/api/substitutes'
import { ManageSubstitutesView } from './ManageSubstitutesView'

// ManageSubstitutesView is the Admin's list of the Team's Substitutes (ADR-0033) on /team/settings.
// It owns only local view state (the inline rename field); the query and mutations stay in the
// ManageSubstitutes container, so every state renders from props.
//
// Three-story shape (ADR-0032): Data is the picture, Interactions drives every edit without one.
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter', kind: 'PLAYING' },
  { id: 'p2', label: 'Libero', kind: 'PLAYING' },
]

const SUBSTITUTES: Substitute[] = [
  { id: 's1', name: 'Jan de Vries', position: { id: 'p2', label: 'Libero' } },
  { id: 's2', name: 'Sam Bakker', position: undefined },
]

const meta = {
  title: 'features/manage-substitutes/ManageSubstitutesView',
  component: ManageSubstitutesView,
  args: {
    substitutes: SUBSTITUTES,
    positions: POSITIONS,
    onRename: fn(),
  },
} satisfies Meta<typeof ManageSubstitutesView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Substitutes' })).toBeInTheDocument()
    await expect(canvas.getByText('Jan de Vries')).toBeInTheDocument()
    await expect(canvas.getByText('Sam Bakker')).toBeInTheDocument()
    // The rename field only appears once Rename is picked from the row's menu.
    await expect(canvas.queryByLabelText('Name for Jan de Vries')).not.toBeInTheDocument()
    await expect(canvas.getAllByLabelText(/^Actions for /)).toHaveLength(2)
  },
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    const portal = within(document.body)

    await userEvent.click(canvas.getByLabelText('Actions for Jan de Vries'))
    await userEvent.click(await portal.findByRole('menuitem', { name: 'Rename' }))
    const field = canvas.getByLabelText('Name for Jan de Vries')
    await expect(field).toHaveValue('Jan de Vries')
    await userEvent.clear(field)
    await userEvent.type(field, '  Jan Visser  ')
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(args.onRename).toHaveBeenCalledWith(SUBSTITUTES[0], 'Jan Visser')
  },
}
