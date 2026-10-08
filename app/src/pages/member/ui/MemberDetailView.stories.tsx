import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import type { Member } from '@entities/member/api/members'
import type { Position } from '@entities/position/api/positions'
import { Stack } from '@shared/testing/stack'
import { appShell } from '../../../../.storybook/app-shell-decorator'
import { MemberDetailView } from './MemberDetailView'

// One Member's page as a phone shows it (ADR-0038): face with Shirt Number, then number, Position
// and Role, inside the real app shell on the Team tab. Editing is a controlled flag owned by the
// route container, so both the read and the edit frame render from props.
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter', kind: 'PLAYING' },
  { id: 'p2', label: 'Libero', kind: 'PLAYING' },
]

const ADA: Member = {
  userId: 'u1',
  displayName: 'Ada Lovelace',
  role: 'ADMIN',
  position: POSITIONS[0],
  onboarded: true,
  shirtNumber: 12,
  photoVersion: undefined,
}

const shell = appShell('team')

const meta = {
  title: 'pages/member/MemberDetailView',
  component: MemberDetailView,
  decorators: shell.decorators,
  parameters: shell.parameters,
  args: {
    member: ADA,
    positions: POSITIONS,
    canEdit: true,
    isEditing: false,
    isSaving: false,
    onEdit: fn(),
    onCancelEdit: fn(),
    onSubmit: fn(),
    canChangePhoto: true,
    canRemovePhoto: true,
    hasPersonalPhoto: true,
    isPhotoSaving: false,
    onUploadPhoto: fn(),
    onUsePersonalPhoto: fn(),
    onRemovePhoto: fn(),
  },
} satisfies Meta<typeof MemberDetailView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Ada Lovelace' })).toBeInTheDocument()
    await expect(canvas.getByLabelText('Shirt number 12')).toBeInTheDocument()
    await expect(canvas.getByText('Admin')).toBeInTheDocument()
    // Back to the roster, beside the shell's own Team tab.
    await expect(canvas.getAllByRole('link', { name: 'Team' })).toHaveLength(2)
    await expect(canvas.getByRole('button', { name: 'Edit profile' })).toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        // Somebody else's page, seen by a plain member: details only, no Edit.
        'Read only': (
          <MemberDetailView
            {...args}
            canEdit={false}
            canChangePhoto={false}
            canRemovePhoto={false}
            // shirtNumber null, as the API sends "no number" (the generated type says undefined).
            member={{ ...ADA, userId: 'u3', displayName: 'Alan Turing', role: 'USER', position: undefined, shirtNumber: null as unknown as undefined }}
          />
        ),
        // An Admin on someone else's page: the photo can only be removed. (No network in stories, so
        // the photo falls back to initials.)
        'Admin, their photo': (
          <MemberDetailView {...args} canEdit canChangePhoto={false} member={{ ...ADA, photoVersion: 'v1' }} />
        ),
        'Photo upload failed': (
          <MemberDetailView {...args} hasPersonalPhoto={false} photoErrorMessage="That photo is too large. Please pick another one." />
        ),
        Editing: <MemberDetailView {...args} isEditing errorCode="NUMBER_TAKEN" />,
        // A failure the form has no field for, e.g. the member was removed meanwhile.
        'Save failed': <MemberDetailView {...args} isEditing errorCode="NOT_FOUND" errorMessage="Member not found." />,
        Loading: <MemberDetailView {...args} member={undefined} isLoading />,
        Error: <MemberDetailView {...args} member={undefined} isError />,
        'Not on the team': <MemberDetailView {...args} member={undefined} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Read only').queryByRole('button', { name: 'Edit profile' })).not.toBeInTheDocument()
    await expect(region('Read only').getByText('None')).toBeInTheDocument()
    await expect(region('Read only').getAllByText('Unassigned').length).toBeGreaterThan(0)
    await expect(region('Read only').queryByLabelText(/^Shirt number/)).not.toBeInTheDocument()

    await expect(region('Read only').queryByRole('button', { name: /photo/i })).not.toBeInTheDocument()

    await expect(region('Admin, their photo').getByRole('button', { name: 'Remove photo' })).toBeInTheDocument()
    await expect(region('Admin, their photo').queryByRole('button', { name: /upload/i })).not.toBeInTheDocument()
    await expect(region('Admin, their photo').queryByRole('button', { name: 'Use my personal photo' })).not.toBeInTheDocument()

    // Nothing to copy and nothing to remove: only the upload.
    await expect(region('Photo upload failed').getByRole('button', { name: 'Upload photo' })).toBeInTheDocument()
    await expect(region('Photo upload failed').queryByRole('button', { name: 'Use my personal photo' })).not.toBeInTheDocument()
    await expect(region('Photo upload failed').queryByRole('button', { name: 'Remove photo' })).not.toBeInTheDocument()
    await expect(region('Photo upload failed').getByText('That photo is too large. Please pick another one.')).toBeInTheDocument()

    await expect(region('Editing').getByLabelText('Shirt number')).toHaveValue('12')
    await expect(region('Editing').getByText('That shirt number is already taken.')).toBeInTheDocument()

    await expect(region('Save failed').getByRole('alert')).toHaveTextContent('Member not found.')
    await expect(region('Editing').queryByRole('alert')).not.toBeInTheDocument()

    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    await expect(region('Error').getByText(/couldn't load this member/i)).toBeInTheDocument()
    await expect(region('Not on the team').getByText('This person is not on the team.')).toBeInTheDocument()
  },
}

// No picture: proves the photo buttons, the Edit button, the number field's validation and the submit/cancel wiring.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        Reading: <MemberDetailView {...args} member={{ ...ADA, photoVersion: 'v1' }} />,
        Editing: <MemberDetailView {...args} isEditing />,
      }}
    />
  ),
  play: async ({ canvas, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await userEvent.click(region('Reading').getByRole('button', { name: 'Use my personal photo' }))
    await expect(args.onUsePersonalPhoto).toHaveBeenCalledOnce()
    // Removing asks first; Cancel leaves the photo alone.
    await userEvent.click(region('Reading').getByRole('button', { name: 'Remove photo' }))
    await userEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Cancel' }))
    await expect(args.onRemovePhoto).not.toHaveBeenCalled()
    await userEvent.click(region('Reading').getByRole('button', { name: 'Remove photo' }))
    await userEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Remove' }))
    await expect(args.onRemovePhoto).toHaveBeenCalledOnce()
    await expect(region('Reading').getByRole('button', { name: 'Upload a different photo' })).toBeInTheDocument()

    await userEvent.click(region('Reading').getByRole('button', { name: 'Edit profile' }))
    await expect(args.onEdit).toHaveBeenCalledOnce()

    const editing = region('Editing')
    const number = editing.getByLabelText('Shirt number')
    await userEvent.clear(number)
    await userEvent.type(number, '1000')
    await expect(editing.getByText('Use a whole number from 0 to 999.')).toBeInTheDocument()
    await expect(editing.getByRole('button', { name: 'Save' })).toBeDisabled()

    await userEvent.clear(number)
    await userEvent.type(number, '07')
    await userEvent.click(editing.getByRole('button', { name: 'Save' }))
    await expect(args.onSubmit).toHaveBeenCalledWith('Ada Lovelace', 'p1', 7)

    // Emptying the field clears the number.
    await userEvent.clear(number)
    await userEvent.click(editing.getByRole('button', { name: 'Save' }))
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Ada Lovelace', 'p1', null)

    await userEvent.click(editing.getByRole('button', { name: 'Cancel' }))
    await expect(args.onCancelEdit).toHaveBeenCalledOnce()
  },
}
