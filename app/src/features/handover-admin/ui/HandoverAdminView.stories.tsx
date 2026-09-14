import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { HandoverAdminView } from './HandoverAdminView'

const LINK = 'https://app.teambalance.nl/invite/handover-token-abc'

// The admin handover control (ADR-0024 §5). Prop-only, so loading / no-link / minted / copied /
// revoked / error all render from props with no network — the read + mutations live in the container.
//
// Three stories (ADR-0031 §1): Data is the minted-link instance and carries the snapshot. Shells
// stacks every non-data state — loading / load-error / no-link-yet / creating / copied / just-revoked
// / action-error — in one frame. Interactions has no picture; one play walks create / copy / rotate /
// revoke and keeps every onCreate/onCopy/onRotate/onRevoke prop-contract spy assertion.
const meta = {
  title: 'features/handover-admin/HandoverAdminView',
  component: HandoverAdminView,
  args: {
    isLoading: false,
    isError: false,
    link: null,
    copied: false,
    justRevoked: false,
    isCreating: false,
    isRotating: false,
    isRevoking: false,
    actionError: false,
    onCopy: fn(),
    onCreate: fn(),
    onRotate: fn(),
    onRevoke: fn(),
  },
} satisfies Meta<typeof HandoverAdminView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  args: { link: LINK },
  play: async ({ canvas }) => {
    await expect(canvas.getByDisplayValue(LINK)).toBeInTheDocument()
    await expect(canvas.getByText(/grants admin and can be used once/)).toBeInTheDocument()
    // Once a link exists, the create prompt is replaced by copy + rotate + revoke.
    await expect(
      canvas.queryByRole('button', { name: 'Create admin handover link' }),
    ).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Rotate link' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Revoke link' })).toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <HandoverAdminView {...args} isLoading />,
        'Load error': <HandoverAdminView {...args} isError />,
        'No link yet': <HandoverAdminView {...args} />,
        Creating: <HandoverAdminView {...args} isCreating />,
        Copied: <HandoverAdminView {...args} link={LINK} copied />,
        'Just revoked': <HandoverAdminView {...args} justRevoked />,
        'Action error': <HandoverAdminView {...args} link={LINK} actionError />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    await expect(
      region('Loading').queryByRole('button', { name: 'Create admin handover link' }),
    ).not.toBeInTheDocument()

    await expect(
      region('Load error').getByText('Failed to load the admin link.'),
    ).toBeInTheDocument()

    await expect(
      region('No link yet').getByRole('button', { name: 'Create admin handover link' }),
    ).toBeInTheDocument()
    // The single-use / grants-admin warning is present so an admin can't misread it as the player link.
    await expect(region('No link yet').getByText(/single-use link/)).toBeInTheDocument()

    await expect(region('Creating').getByRole('button', { name: 'Creating…' })).toBeDisabled()

    await expect(region('Copied').getByRole('button', { name: 'Copied!' })).toBeInTheDocument()

    await expect(region('Just revoked').getByText(/The link has been revoked/)).toBeInTheDocument()
    await expect(
      region('Just revoked').getByRole('button', { name: 'Create new admin link' }),
    ).toBeInTheDocument()

    await expect(
      region('Action error').getByText('Something went wrong. Please try again.'),
    ).toBeInTheDocument()
  },
}

// Picture owned by Data — behavioural only (ADR-0031 §1). Prop-contract: each control fires its
// callback, proving the wiring survives a dependency bump.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        'No link': <HandoverAdminView {...args} />,
        'Active link': <HandoverAdminView {...args} link={LINK} />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await userEvent.click(
      region('No link').getByRole('button', { name: 'Create admin handover link' }),
    )
    await expect(args.onCreate).toHaveBeenCalled()

    await userEvent.click(region('Active link').getByRole('button', { name: 'Copy' }))
    await expect(args.onCopy).toHaveBeenCalled()

    await userEvent.click(region('Active link').getByRole('button', { name: 'Rotate link' }))
    await expect(args.onRotate).toHaveBeenCalled()

    await userEvent.click(region('Active link').getByRole('button', { name: 'Revoke link' }))
    await expect(args.onRevoke).toHaveBeenCalled()
  },
}
