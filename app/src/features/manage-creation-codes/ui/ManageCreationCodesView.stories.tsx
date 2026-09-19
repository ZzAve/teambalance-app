import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { CreationCode } from '@shared/api/creation-codes'
import { Stack } from '@shared/testing/stack'
import { ManageCreationCodesView } from './ManageCreationCodesView'

// `now` is pinned so status derivation (active / expired / used) is deterministic across the run.
const NOW = new Date('2026-08-03T12:00:00Z')

const CODES: CreationCode[] = [
  // Active: no expiry, unconsumed.
  { code: 'AAAA-BBBB-CCCC', createdAt: '2026-08-01T00:00:00Z', expiresAt: undefined, consumedAt: undefined, consumedByUserId: undefined, createdTeamId: undefined },
  // Expired: expiry already in the past, unconsumed → still revocable.
  { code: 'DDDD-EEEE-FFFF', createdAt: '2026-07-01T00:00:00Z', expiresAt: '2026-07-15T00:00:00Z', consumedAt: undefined, consumedByUserId: undefined, createdTeamId: undefined },
  // Used: redeemed → not revocable.
  { code: 'GGGG-HHHH-JJJJ', createdAt: '2026-07-20T00:00:00Z', expiresAt: undefined, consumedAt: '2026-07-21T00:00:00Z', consumedByUserId: 'u1', createdTeamId: 't1' },
]

// Three stories (ADR-0032 §1): Data is the populated list and carries the snapshot. Shells stacks
// every non-data state — loading / error / forbidden / empty / revoke-blocked — in one frame.
// Interactions has no picture; one play generates a code and drives the confirm-and-revoke flow to
// its close, keeping every onCreate/onRevoke assertion. Plus one extra picture, RevokeConfirmOpen,
// for the frame no composite shows: the confirm dialog left open (#263).
const meta = {
  title: 'features/manage-creation-codes/ManageCreationCodesView',
  component: ManageCreationCodesView,
  args: { codes: CODES, now: NOW, onCreate: fn(), onRevoke: fn() },
} satisfies Meta<typeof ManageCreationCodesView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('AAAA-BBBB-CCCC')).toBeInTheDocument()
    await expect(canvas.getByText('Active')).toBeInTheDocument()
    await expect(canvas.getByText('Expired')).toBeInTheDocument()
    await expect(canvas.getByText('Used')).toBeInTheDocument()
    // Only the two unconsumed codes (active + expired) expose a Revoke button.
    await expect(canvas.getAllByRole('button', { name: 'Revoke' })).toHaveLength(2)
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <ManageCreationCodesView {...args} isLoading />,
        Error: <ManageCreationCodesView {...args} isError />,
        Forbidden: <ManageCreationCodesView {...args} isForbidden />,
        Empty: <ManageCreationCodesView {...args} codes={[]} />,
        'Revoke blocked': <ManageCreationCodesView {...args} errorCode="CONSUMED" />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    await expect(
      region('Loading').queryByRole('button', { name: 'Generate code' }),
    ).not.toBeInTheDocument()

    await expect(
      region('Error').getByText("Couldn't load creation codes. Please try again."),
    ).toBeInTheDocument()
    await expect(
      region('Error').queryByRole('button', { name: 'Generate code' }),
    ).not.toBeInTheDocument()

    await expect(
      region('Forbidden').getByText("You don't have access to creation codes."),
    ).toBeInTheDocument()
    await expect(
      region('Forbidden').queryByRole('button', { name: 'Generate code' }),
    ).not.toBeInTheDocument()

    await expect(
      region('Empty').getByText('No creation codes yet. Generate one above.'),
    ).toBeInTheDocument()
    await expect(region('Empty').getByRole('button', { name: 'Generate code' })).toBeEnabled()

    await expect(
      region('Revoke blocked').getByText('That code was already used and cannot be revoked.'),
    ).toBeInTheDocument()
  },
}

// Picture owned by Data — behavioural only (ADR-0032 §1). Two instances because generating needs an
// empty list to stay the Empty picture (ADR-0027 §2) while revoking needs the populated list.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        Empty: <ManageCreationCodesView {...args} codes={[]} />,
        'With items': <ManageCreationCodesView {...args} />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    const dialog = within(document.body)

    await userEvent.click(region('Empty').getByRole('button', { name: 'Generate code' }))
    await expect(args.onCreate).toHaveBeenCalled()

    // Open the confirm dialog from the first (active) code's Revoke button.
    await userEvent.click(region('With items').getAllByRole('button', { name: 'Revoke' })[0])
    await expect(
      await dialog.findByText(/can no longer be used to create a team/),
    ).toBeInTheDocument()
    // While the modal is open the list buttons are aria-hidden, so only the dialog's Revoke resolves.
    await userEvent.click(dialog.getByRole('button', { name: 'Revoke' }))
    await expect(args.onRevoke).toHaveBeenCalledWith(CODES[0])
  },
}

// Open-dialog baseline: the first (active) code's Revoke opens the confirm dialog (a portal); we
// stop with it open — no confirm click — so the open dialog frame gets its own keep-baseline
// snapshot. Interactions above closes on confirm, so it never pictures the open dialog.
export const RevokeConfirmOpen: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getAllByRole('button', { name: 'Revoke' })[0])
    const dialog = within(document.body)
    await expect(await dialog.findByText(/can no longer be used to create a team/)).toBeInTheDocument()
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  },
}
