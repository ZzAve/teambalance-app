import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { appColumn } from '@shared/testing/app-column-decorator'
import { appShell } from '../../../../storybook-support/app-shell-decorator'
import { dutchMode, pageModes } from '../../../../.storybook/modes'
import { AccountSignInView } from './AccountSignInView'

// Account → "Account and sign-in", rendered as a page composite (ADR-0032 §3). Passkeys is a
// container that fetches, so every story turns it off (`showPasskeys: false`) to hold the network
// line; PasskeysView has its own stories. With no network the Personal Photo falls back to initials.
const shell = appShell('account', 'Account and sign-in')

const meta = {
  title: 'features/account/AccountSignInView',
  component: AccountSignInView,
  parameters: shell.parameters,
  args: {
    userId: 'u1',
    displayName: 'Alex',
    email: 'alex@example.com',
    showPasskeys: false,
    onUploadPersonalPhoto: fn(),
    onRemovePersonalPhoto: fn(),
    onCopyPhotoToTeam: fn(),
    onDismissCopyPhoto: fn(),
  },
} satisfies Meta<typeof AccountSignInView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  decorators: shell.decorators,
  parameters: { chromatic: { modes: { ...pageModes, ...dutchMode } } },
  play: async ({ canvas, globals }) => {
    if (globals.locale === 'nl') {
      await expect(canvas.getByText('Dit geldt voor je account, in elk team.')).toBeInTheDocument()
      await expect(canvas.getByText('Persoonlijke foto')).toBeInTheDocument()
      return
    }
    await expect(canvas.getByText('This applies to your account, in every team.')).toBeInTheDocument()
    await expect(canvas.getByText('alex@example.com')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Upload photo' })).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Remove photo' })).not.toBeInTheDocument()
  },
}

export const Shells: Story = {
  decorators: appColumn.decorators,
  render: (args) => (
    <Stack
      items={{
        // Just uploaded a Personal Photo while the Active Team has no Team Photo.
        'Photo copy offer': <AccountSignInView {...args} personalPhotoVersion="v1" copyPhotoTeamName="Setpoint VT" />,
        'Photo upload failed': (
          <AccountSignInView {...args} photoErrorMessage="That photo is too large. Please pick another one." />
        ),
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    const offer = region('Photo copy offer')
    await expect(offer.getByText('Use this photo in Setpoint VT too?')).toBeInTheDocument()
    await expect(offer.getByRole('button', { name: 'Change photo' })).toBeInTheDocument()
    await expect(offer.getByRole('button', { name: 'Remove photo' })).toBeInTheDocument()

    const failed = region('Photo upload failed')
    await expect(failed.getByText('That photo is too large. Please pick another one.')).toBeInTheDocument()
    await expect(failed.queryByText(/Use this photo in/)).not.toBeInTheDocument()
  },
}

// Picture owned by Data — behavioural only (ADR-0032 §1). The photo upload itself is PhotoPicker's
// story; here the copy offer and Remove hand their intent up.
export const Interactions: Story = {
  decorators: shell.decorators,
  parameters: { chromatic: { disableSnapshot: true } },
  args: { personalPhotoVersion: 'v1', copyPhotoTeamName: 'Setpoint VT' },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Use in Setpoint VT' }))
    await expect(args.onCopyPhotoToTeam).toHaveBeenCalledOnce()
    await userEvent.click(canvas.getByRole('button', { name: 'Not now' }))
    await expect(args.onDismissCopyPhoto).toHaveBeenCalledOnce()
    // Removing asks first; Cancel leaves the photo alone.
    await userEvent.click(canvas.getByRole('button', { name: 'Remove photo' }))
    await userEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Cancel' }))
    await expect(args.onRemovePersonalPhoto).not.toHaveBeenCalled()
    await userEvent.click(canvas.getByRole('button', { name: 'Remove photo' }))
    await userEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Remove' }))
    await expect(args.onRemovePersonalPhoto).toHaveBeenCalledOnce()
  },
}
