import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { CreationCode } from '@shared/api/creation-codes'
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

const meta = {
  title: 'features/manage-creation-codes/ManageCreationCodesView',
  component: ManageCreationCodesView,
  args: { codes: CODES, now: NOW, onCreate: fn(), onRevoke: fn() },
} satisfies Meta<typeof ManageCreationCodesView>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {
  args: { isLoading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Loading…')).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Generate code' })).not.toBeInTheDocument()
  },
}

export const ErrorState: Story = {
  args: { isError: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Couldn't load creation codes. Please try again.")).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Generate code' })).not.toBeInTheDocument()
  },
}

export const Forbidden: Story = {
  args: { isForbidden: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("You don't have access to creation codes.")).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Generate code' })).not.toBeInTheDocument()
  },
}

export const Empty: Story = {
  args: { codes: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No creation codes yet. Generate one above.')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Generate code' })).toBeEnabled()
  },
}

export const WithItems: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('AAAA-BBBB-CCCC')).toBeInTheDocument()
    await expect(canvas.getByText('Active')).toBeInTheDocument()
    await expect(canvas.getByText('Expired')).toBeInTheDocument()
    await expect(canvas.getByText('Used')).toBeInTheDocument()
    // Only the two unconsumed codes (active + expired) expose a Revoke button.
    await expect(canvas.getAllByRole('button', { name: 'Revoke' })).toHaveLength(2)
  },
}

export const GenerateCode: Story = {
  // Behavioural twin of Empty — onCreate fires with `codes: []`, so the picture stays the Empty
  // state (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  args: { codes: [] },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Generate code' }))
    await expect(args.onCreate).toHaveBeenCalled()
  },
}

export const RevokeConfirm: Story = {
  // Behavioural twin of WithItems — the confirm dialog closes on confirm and settles back to the
  // items picture; the open-dialog frame keeps its own baseline via RevokeConfirmOpen below
  // (#263, ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    // Open the confirm dialog from the first (active) code's Revoke button.
    await userEvent.click(canvas.getAllByRole('button', { name: 'Revoke' })[0])
    const dialog = within(document.body)
    await expect(await dialog.findByText(/can no longer be used to create a team/)).toBeInTheDocument()
    // While the modal is open the list buttons are aria-hidden, so only the dialog's Revoke resolves.
    await userEvent.click(dialog.getByRole('button', { name: 'Revoke' }))
    await expect(args.onRevoke).toHaveBeenCalledWith(CODES[0])
  },
}

// Open-dialog baseline: the first (active) code's Revoke opens the confirm dialog (a portal); we
// stop with it open — no confirm click — so the open dialog frame gets its own keep-baseline
// snapshot. The RevokeConfirm spy above closes on confirm, so it never pictures the open dialog.
export const RevokeConfirmOpen: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getAllByRole('button', { name: 'Revoke' })[0])
    const dialog = within(document.body)
    await expect(await dialog.findByText(/can no longer be used to create a team/)).toBeInTheDocument()
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  },
}

export const RevokeConsumedBlocked: Story = {
  args: { errorCode: 'CONSUMED' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('That code was already used and cannot be revoked.')).toBeInTheDocument()
  },
}
