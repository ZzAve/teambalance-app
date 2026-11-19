import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import type { Position } from '@shared/api/positions'
import type { Substitute } from '@shared/api/substitutes'
import { Stack } from '@shared/testing/stack'
import { appShell } from '../../../../storybook-support/app-shell-decorator'
import { SubstituteDetailView } from './SubstituteDetailView'

// One Substitute's page as a phone shows it (ADR-0033), inside the real app shell on the Team tab.
// Three stories (ADR-0032): Data is the Admin's page, Shells the other states, Interactions the
// Admin group's wiring with no picture.
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter', kind: 'PLAYING' },
  { id: 'p2', label: 'Libero', kind: 'PLAYING' },
]

const JAN: Substitute = { id: 's1', name: 'Jan de Vries', position: { id: 'p2', label: 'Libero' }, shirtNumber: 14 }

const shell = appShell('team')

const meta = {
  title: 'pages/substitute/SubstituteDetailView',
  component: SubstituteDetailView,
  decorators: shell.decorators,
  parameters: shell.parameters,
  args: {
    substitute: JAN,
    positions: POSITIONS,
    canManage: true,
    onRemoveDialogChange: fn(),
    onChangePosition: fn(),
    onRename: fn(),
    onChangeShirtNumber: fn(),
    onRemove: fn(),
  },
} satisfies Meta<typeof SubstituteDetailView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: 'Jan de Vries' })).toBeInTheDocument()
    await expect(canvas.getByText('Libero · Substitute')).toBeInTheDocument()
    await expect(canvas.getByLabelText('Shirt number 14')).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'Back to team' })).toBeInTheDocument()
    await expect(canvas.getByRole('heading', { name: 'Admin' })).toBeInTheDocument()
    await expect(within(canvas.getByLabelText('Position for Jan de Vries')).getByText('Libero')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Rename' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /^Shirt number/ })).toHaveTextContent('14')
    await expect(canvas.getByRole('button', { name: 'Remove substitute' })).toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        // A member's view: the details, no Admin group.
        Member: <SubstituteDetailView {...args} canManage={false} substitute={{ ...JAN, position: undefined, shirtNumber: null as unknown as undefined }} />,
        'Name taken': <SubstituteDetailView {...args} errorMessage="Sam Bakker is already on the list." />,
        Loading: <SubstituteDetailView {...args} substitute={undefined} isLoading />,
        Error: <SubstituteDetailView {...args} substitute={undefined} isError />,
        'Not on the list': <SubstituteDetailView {...args} substitute={undefined} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    await expect(region('Member').queryByRole('heading', { name: 'Admin' })).not.toBeInTheDocument()
    await expect(region('Member').queryByRole('button', { name: 'Remove substitute' })).not.toBeInTheDocument()
    await expect(region('Member').getByText('None')).toBeInTheDocument()
    await expect(region('Member').getByText('Unassigned · Substitute')).toBeInTheDocument()
    await expect(region('Name taken').getByRole('alert')).toHaveTextContent('Sam Bakker is already on the list.')
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    await expect(region('Error').getByText(/couldn't load substitutes/i)).toBeInTheDocument()
    await expect(region('Not on the list').getByText('This substitute is not on the list.')).toBeInTheDocument()
  },
}

// One play through the Admin group: Position, Rename, Shirt number (with its validation), and Remove
// only after the confirm, whose line says how many Events it touches.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        Admin: <SubstituteDetailView {...args} />,
        'Count known': <SubstituteDetailView {...args} eventCount={3} />,
      }}
    />
  ),
  play: async ({ canvas, args }) => {
    const admin = within(canvas.getByRole('region', { name: 'Admin' }))

    await userEvent.click(admin.getByLabelText('Position for Jan de Vries'))
    await userEvent.click(await screen.findByRole('option', { name: 'Setter' }))
    await expect(args.onChangePosition).toHaveBeenCalledWith('p1')

    await userEvent.click(admin.getByRole('button', { name: 'Rename' }))
    const name = admin.getByLabelText('Name for Jan de Vries')
    await expect(name).toHaveValue('Jan de Vries')
    await userEvent.clear(name)
    await userEvent.type(name, '  Jan Visser {Enter}')
    await expect(args.onRename).toHaveBeenCalledWith('Jan Visser')

    await userEvent.click(admin.getByRole('button', { name: /^Shirt number/ }))
    const number = admin.getByLabelText('Shirt number for Jan de Vries')
    await userEvent.clear(number)
    await userEvent.type(number, '1000')
    await expect(admin.getByText('Use a whole number from 0 to 999.')).toBeInTheDocument()
    await expect(admin.getByRole('button', { name: 'Save' })).toBeDisabled()
    await userEvent.clear(number)
    await userEvent.click(admin.getByRole('button', { name: 'Save' }))
    await expect(args.onChangeShirtNumber).toHaveBeenCalledWith(null)

    await userEvent.click(admin.getByRole('button', { name: 'Remove substitute' }))
    await expect(args.onRemoveDialogChange).toHaveBeenLastCalledWith(true)
    let dialog = within(await screen.findByRole('dialog'))
    await expect(dialog.getByText('Checking which events Jan de Vries is on…')).toBeInTheDocument()
    await userEvent.click(dialog.getByRole('button', { name: 'Cancel' }))
    await expect(args.onRemoveDialogChange).toHaveBeenLastCalledWith(false)
    await expect(args.onRemove).not.toHaveBeenCalled()

    const known = within(canvas.getByRole('region', { name: 'Count known' }))
    await userEvent.click(known.getByRole('button', { name: 'Remove substitute' }))
    dialog = within(await screen.findByRole('dialog'))
    await expect(dialog.getByText('Jan de Vries is on 3 events.')).toBeInTheDocument()
    await userEvent.click(dialog.getByRole('button', { name: 'Remove' }))
    await expect(args.onRemove).toHaveBeenCalledOnce()
  },
}
