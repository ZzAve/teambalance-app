import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { HandoverAdminView } from './HandoverAdminView'

const LINK = 'https://app.teambalance.nl/invite/handover-token-abc'

// The admin handover control (ADR-0024 §5). Prop-only, so loading / no-link / minted / copied /
// revoked / error all render from props with no network — the read + mutations live in the container.
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

export const Loading: Story = {
  args: { isLoading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Loading…')).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Create admin handover link' })).not.toBeInTheDocument()
  },
}

export const LoadError: Story = {
  args: { isError: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Failed to load the admin link.')).toBeInTheDocument()
  },
}

export const NoLinkYet: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Create admin handover link' })).toBeInTheDocument()
    // The single-use / grants-admin warning is present so an admin can't misread it as the player link.
    await expect(canvas.getByText(/single-use link/)).toBeInTheDocument()
  },
}

export const Creating: Story = {
  args: { isCreating: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Creating…' })).toBeDisabled()
  },
}

export const LinkMinted: Story = {
  args: { link: LINK },
  play: async ({ canvas }) => {
    await expect(canvas.getByDisplayValue(LINK)).toBeInTheDocument()
    await expect(canvas.getByText(/grants admin and can be used once/)).toBeInTheDocument()
    // Once a link exists, the create prompt is replaced by copy + rotate + revoke.
    await expect(canvas.queryByRole('button', { name: 'Create admin handover link' })).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Rotate link' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Revoke link' })).toBeInTheDocument()
  },
}

export const Copied: Story = {
  args: { link: LINK, copied: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Copied!' })).toBeInTheDocument()
  },
}

export const JustRevoked: Story = {
  args: { justRevoked: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/The link has been revoked/)).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Create new admin link' })).toBeInTheDocument()
  },
}

export const ActionError: Story = {
  args: { link: LINK, actionError: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Something went wrong. Please try again.')).toBeInTheDocument()
  },
}

// Prop-contract: each control fires its callback — proving the wiring survives a dependency bump.
export const CreateContract: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Create admin handover link' }))
    await expect(args.onCreate).toHaveBeenCalled()
  },
}

export const RotateContract: Story = {
  args: { link: LINK },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Rotate link' }))
    await expect(args.onRotate).toHaveBeenCalled()
  },
}

export const RevokeContract: Story = {
  args: { link: LINK },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Revoke link' }))
    await expect(args.onRevoke).toHaveBeenCalled()
  },
}

export const CopyContract: Story = {
  args: { link: LINK },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Copy' }))
    await expect(args.onCopy).toHaveBeenCalled()
  },
}
