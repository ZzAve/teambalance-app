import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import type { Member } from '@entities/member/api/members'
import type { Position } from '@entities/position/api/positions'
import { appColumn } from '@shared/testing/app-column-decorator'
import { Stack } from '@shared/testing/stack'
import { GetStartedView } from './GetStartedView'

const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter', kind: 'PLAYING' },
  { id: 'p2', label: 'Libero', kind: 'PLAYING' },
]

// A new member whose Admin already handed out number 7.
const NEWCOMER: Member = {
  userId: 'u1',
  displayName: 'Alex',
  role: 'USER',
  position: POSITIONS[0],
  onboarded: false,
  shirtNumber: 7,
  photoVersion: undefined,
}

const meta = {
  title: 'pages/get-started/GetStartedView',
  component: GetStartedView,
  decorators: appColumn.decorators,
  args: {
    member: NEWCOMER,
    positions: POSITIONS,
    isLoading: false,
    isError: false,
    isSaving: false,
    hasPersonalPhoto: true,
    onSubmit: fn(),
  },
} satisfies Meta<typeof GetStartedView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Shirt number')).toHaveValue('7')
    await expect(canvas.getByRole('checkbox', { name: 'Use my personal photo in this team' })).toBeChecked()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        'No personal photo': <GetStartedView {...args} hasPersonalPhoto={false} />,
        'Number taken': <GetStartedView {...args} errorCode="NUMBER_TAKEN" />,
        Loading: <GetStartedView {...args} member={undefined} isLoading />,
        Error: <GetStartedView {...args} member={undefined} isError />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    await expect(region('No personal photo').queryByRole('checkbox')).not.toBeInTheDocument()
    await expect(region('Number taken').getByText('That shirt number is already taken.')).toBeInTheDocument()
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    await expect(region('Error').getByText("Couldn't load your profile. Please try again.")).toBeInTheDocument()
  },
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        'With photo': <GetStartedView {...args} />,
        'Without photo': <GetStartedView {...args} hasPersonalPhoto={false} />,
      }}
    />
  ),
  play: async ({ canvas, args }) => {
    const withPhoto = within(canvas.getByRole('region', { name: 'With photo' }))
    const number = withPhoto.getByLabelText('Shirt number')
    await userEvent.clear(number)
    await userEvent.type(number, '10')
    await userEvent.click(withPhoto.getByRole('button', { name: 'Save' }))
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Alex', 'p1', 10, true)

    await userEvent.click(withPhoto.getByRole('checkbox', { name: 'Use my personal photo in this team' }))
    await userEvent.click(withPhoto.getByRole('button', { name: 'Save' }))
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Alex', 'p1', 10, false)

    // Nothing to copy, so never asks for one.
    const withoutPhoto = within(canvas.getByRole('region', { name: 'Without photo' }))
    await userEvent.click(withoutPhoto.getByRole('button', { name: 'Save' }))
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Alex', 'p1', 7, false)
  },
}
