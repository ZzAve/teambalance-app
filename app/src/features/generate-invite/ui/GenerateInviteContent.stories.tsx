import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { GenerateInviteContent } from './GenerateInviteContent'

// GenerateInviteContent is the presentational body split out of the GenerateInviteDialog container
// (the RTL render test it used to have is deleted — its coverage lives here). Each mutation
// state is a plain render arg. The copied flag is a prop, so the "copied" label is its own story;
// the click interaction just proves the callback fires (the container flips the flag in the app).
const LINK = 'https://app.teambalance.nl/invite/abc123'

const meta = {
  title: 'features/generate-invite/GenerateInviteContent',
  component: GenerateInviteContent,
  args: {
    expired: false,
    isRotating: false,
    isExpiring: false,
    actionError: false,
    onCopy: fn(),
    onRotate: fn(),
    onExpire: fn(),
    onGenerateNew: fn(),
  },
} satisfies Meta<typeof GenerateInviteContent>

export default meta

type Story = StoryObj<typeof meta>

export const Idle: Story = {
  args: { isPending: false, isError: false, link: null, copied: false },
  play: async ({ canvas }) => {
    // Nothing generated yet and not loading → renders nothing.
    await expect(canvas.queryByText('Generating...')).not.toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument()
  },
}

export const Pending: Story = {
  args: { isPending: true, isError: false, link: null, copied: false },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Generating...')).toBeInTheDocument()
  },
}

export const Error: Story = {
  args: { isPending: false, isError: true, link: null, copied: false },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Failed to generate invite link.')).toBeInTheDocument()
  },
}

export const Generated: Story = {
  args: { isPending: false, isError: false, link: LINK, copied: false },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByDisplayValue(LINK)).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Copy' }))
    await expect(args.onCopy).toHaveBeenCalled()
  },
}

// Prop-contract: rotating the link fires onRotate — the container swaps in a fresh token.
export const RotateLink: Story = {
  args: { isPending: false, isError: false, link: LINK, copied: false },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Rotate link' }))
    await expect(args.onRotate).toHaveBeenCalled()
  },
}

// Prop-contract: expiring the link fires onExpire — the container invalidates the token.
export const ExpireLink: Story = {
  args: { isPending: false, isError: false, link: LINK, copied: false },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Expire link' }))
    await expect(args.onExpire).toHaveBeenCalled()
  },
}

export const Copied: Story = {
  args: { isPending: false, isError: false, link: LINK, copied: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Copied!' })).toBeInTheDocument()
  },
}

export const Rotating: Story = {
  args: { isPending: false, isError: false, link: LINK, copied: false, isRotating: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Rotating...' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Rotating...' })).toBeDisabled()
  },
}

export const Expiring: Story = {
  args: { isPending: false, isError: false, link: LINK, copied: false, isExpiring: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Expiring...' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Expiring...' })).toBeDisabled()
  },
}

export const Expired: Story = {
  args: { isPending: false, isError: false, link: LINK, copied: false, expired: true },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText(/this link has expired/i)).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Generate new link' }))
    await expect(args.onGenerateNew).toHaveBeenCalled()
  },
}

// A failed rotate/expire surfaces inline while the active link stays shown — so the admin isn't
// left believing a dead link is still valid.
export const ActionError: Story = {
  args: { isPending: false, isError: false, link: LINK, copied: false, actionError: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/something went wrong/i)).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Rotate link' })).toBeInTheDocument()
  },
}
