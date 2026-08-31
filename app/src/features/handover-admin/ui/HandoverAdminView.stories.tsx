import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { HandoverAdminView } from './HandoverAdminView'

// The admin handover control (ADR-0024 §5). Prop-only, so the generate prompt / minted-link / copied /
// error states all render from props with no network — the mutation lives in the container.
const meta = {
  title: 'features/handover-admin/HandoverAdminView',
  component: HandoverAdminView,
  args: { isGenerating: false, isError: false, link: null, copied: false, onGenerate: fn(), onCopy: fn() },
} satisfies Meta<typeof HandoverAdminView>

export default meta

type Story = StoryObj<typeof meta>

export const NoLinkYet: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Create admin handover link' })).toBeInTheDocument()
    // The single-use / grants-admin warning is present so an admin can't misread it as the player link.
    await expect(canvas.getByText(/single-use link/)).toBeInTheDocument()
  },
}

export const Generating: Story = {
  args: { isGenerating: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Creating…' })).toBeDisabled()
  },
}

export const LinkMinted: Story = {
  args: { link: 'https://app.teambalance.nl/invite/handover-token-abc' },
  play: async ({ canvas }) => {
    await expect(canvas.getByDisplayValue('https://app.teambalance.nl/invite/handover-token-abc')).toBeInTheDocument()
    await expect(canvas.getByText(/grants admin and can be used once/)).toBeInTheDocument()
    // Once a link exists, the generate button is gone — you don't accidentally mint a second.
    await expect(canvas.queryByRole('button', { name: 'Create admin handover link' })).not.toBeInTheDocument()
  },
}

export const Copied: Story = {
  args: { link: 'https://app.teambalance.nl/invite/handover-token-abc', copied: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Copied!' })).toBeInTheDocument()
  },
}

export const ErrorState: Story = {
  args: { isError: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Something went wrong creating the link.')
  },
}

// Prop-contract: asking for a link fires onGenerate; copying a minted link fires onCopy.
export const GenerateContract: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Create admin handover link' }))
    await expect(args.onGenerate).toHaveBeenCalled()
  },
}

export const CopyContract: Story = {
  args: { link: 'https://app.teambalance.nl/invite/handover-token-abc' },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Copy' }))
    await expect(args.onCopy).toHaveBeenCalled()
  },
}
