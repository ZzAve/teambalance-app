import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { GenerateInviteContent } from './GenerateInviteContent'

// GenerateInviteContent is the presentational body split out of the GenerateInviteDialog container
// (the RTL render test it used to have is deleted — its coverage lives here). Each read and mutation
// state is a plain render arg. The copied flag is a prop, so the "copied" label is its own story;
// the click interactions just prove the callbacks fire (the container owns the state in the app).
const LINK = 'https://app.teambalance.nl/invite/abc123'

const meta = {
  title: 'features/generate-invite/GenerateInviteContent',
  component: GenerateInviteContent,
  args: {
    isLoading: false,
    isError: false,
    link: null,
    copied: false,
    justExpired: false,
    isGenerating: false,
    isRotating: false,
    isExpiring: false,
    actionError: false,
    onCopy: fn(),
    onGenerate: fn(),
    onRotate: fn(),
    onExpire: fn(),
  },
} satisfies Meta<typeof GenerateInviteContent>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {
  args: { isLoading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Loading...')).toBeInTheDocument()
  },
}

export const Error: Story = {
  args: { isError: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Failed to load the invite link.')).toBeInTheDocument()
  },
}

// The state that used to be impossible to reach: opening the dialog minted a link on the way in, so
// "this team has no link" never rendered. Generating is now something the admin asks for.
export const NoLink: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText("This team doesn't have an invite link yet.")).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Generate link' }))
    await expect(args.onGenerate).toHaveBeenCalled()
  },
}

export const Generating: Story = {
  args: { isGenerating: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Generating...' })).toBeDisabled()
  },
}

// The point of ADR-0025: an admin who reopens the dialog sees the link they already shared.
export const ActiveLink: Story = {
  args: { link: LINK },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByDisplayValue(LINK)).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Copy' }))
    await expect(args.onCopy).toHaveBeenCalled()
  },
}

export const Copied: Story = {
  args: { link: LINK, copied: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Copied!' })).toBeInTheDocument()
  },
}

export const RotateLink: Story = {
  // Behavioural twin of ActiveLink — onRotate fires while the active-link picture is unchanged
  // (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  args: { link: LINK },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Rotate link' }))
    await expect(args.onRotate).toHaveBeenCalled()
  },
}

export const RevokeLink: Story = {
  // Behavioural twin of ActiveLink — onExpire fires while the active-link picture is unchanged
  // (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  args: { link: LINK },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Revoke link' }))
    await expect(args.onExpire).toHaveBeenCalled()
  },
}

export const Rotating: Story = {
  args: { link: LINK, isRotating: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Rotating...' })).toBeDisabled()
  },
}

export const Revoking: Story = {
  args: { link: LINK, isExpiring: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Revoking...' })).toBeDisabled()
  },
}

// Confirmation after a revoke, before the admin decides whether to make a new one.
export const JustExpired: Story = {
  args: { justExpired: true },
  play: async ({ canvas, userEvent, args }) => {
    await expect(
      canvas.getByText('The link has been revoked. New joiners can no longer use it.'),
    ).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Generate new link' }))
    await expect(args.onGenerate).toHaveBeenCalled()
  },
}

export const ActionError: Story = {
  args: { link: LINK, actionError: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Something went wrong. Please try again.')).toBeInTheDocument()
  },
}
