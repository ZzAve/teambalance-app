import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { GenerateInviteContent } from './GenerateInviteContent'

// GenerateInviteContent is the presentational body split out of the GenerateInviteDialog container
// (the RTL render test it used to have is deleted — its coverage lives here). Each read and mutation
// state is a plain render arg; the click interactions just prove the callbacks fire (the container
// owns the state in the app).
//
// Three stories (ADR-0031 §1): Data is the active-link instance and keeps the snapshot — it renders
// inside a dialog the TeamPageView composite can't show open, so this file owns that picture
// (ADR-0031 §3). Shells stacks every non-data state — load / error / no-link / generating / copied /
// rotating / revoking / just-expired / action-error — in one frame. Interactions has no picture; one
// play walks every click and keeps every onCopy/onGenerate/onRotate/onExpire spy assertion.
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

// The point of ADR-0025: an admin who reopens the dialog sees the link they already shared.
export const Data: Story = {
  args: { link: LINK },
  play: async ({ canvas }) => {
    await expect(canvas.getByDisplayValue(LINK)).toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <GenerateInviteContent {...args} isLoading />,
        Error: <GenerateInviteContent {...args} isError />,
        // The state that used to be impossible to reach: opening the dialog minted a link on the way
        // in, so "this team has no link" never rendered. Generating is now something the admin asks
        // for (ADR-0025).
        'No link': <GenerateInviteContent {...args} />,
        Generating: <GenerateInviteContent {...args} isGenerating />,
        Copied: <GenerateInviteContent {...args} link={LINK} copied />,
        Rotating: <GenerateInviteContent {...args} link={LINK} isRotating />,
        Revoking: <GenerateInviteContent {...args} link={LINK} isExpiring />,
        // Confirmation after a revoke, before the admin decides whether to make a new one.
        'Just expired': <GenerateInviteContent {...args} justExpired />,
        'Action error': <GenerateInviteContent {...args} link={LINK} actionError />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Loading').getByText('Loading...')).toBeInTheDocument()
    await expect(region('Error').getByText('Failed to load the invite link.')).toBeInTheDocument()

    await expect(
      region('No link').getByText("This team doesn't have an invite link yet."),
    ).toBeInTheDocument()
    await expect(region('No link').queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument()

    await expect(
      region('Generating').getByRole('button', { name: 'Generating...' }),
    ).toBeDisabled()
    await expect(region('Copied').getByRole('button', { name: 'Copied!' })).toBeInTheDocument()
    await expect(region('Rotating').getByRole('button', { name: 'Rotating...' })).toBeDisabled()
    await expect(region('Revoking').getByRole('button', { name: 'Revoking...' })).toBeDisabled()

    await expect(
      region('Just expired').getByText(
        'The link has been revoked. New joiners can no longer use it.',
      ),
    ).toBeInTheDocument()
    await expect(
      region('Just expired').queryByRole('button', { name: 'Copy' }),
    ).not.toBeInTheDocument()

    await expect(
      region('Action error').getByText('Something went wrong. Please try again.'),
    ).toBeInTheDocument()
  },
}

// Picture owned by Data — behavioural only (ADR-0031 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        'Active link': <GenerateInviteContent {...args} link={LINK} />,
        'No link': <GenerateInviteContent {...args} />,
        'Just expired': <GenerateInviteContent {...args} justExpired />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await userEvent.click(region('Active link').getByRole('button', { name: 'Copy' }))
    await expect(args.onCopy).toHaveBeenCalled()
    await userEvent.click(region('Active link').getByRole('button', { name: 'Rotate link' }))
    await expect(args.onRotate).toHaveBeenCalled()
    await userEvent.click(region('Active link').getByRole('button', { name: 'Revoke link' }))
    await expect(args.onExpire).toHaveBeenCalled()

    // Both no-link and just-expired route through onGenerate — a running total proves each click
    // fired its own call rather than the spy's earlier state leaking through.
    await userEvent.click(region('No link').getByRole('button', { name: 'Generate link' }))
    await expect(args.onGenerate).toHaveBeenCalledTimes(1)

    await userEvent.click(region('Just expired').getByRole('button', { name: 'Generate new link' }))
    await expect(args.onGenerate).toHaveBeenCalledTimes(2)
  },
}
