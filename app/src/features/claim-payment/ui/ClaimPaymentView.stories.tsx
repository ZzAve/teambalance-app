import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { ClaimPaymentView } from './ClaimPaymentView'

// "That's mine" / "Assign to…" on one payment row, prop-only (ADR-0017): the container passes the
// claim call and the error. The IBAN never reaches the client, so the sheet only shows a switch for it.
//
// Three-story shape (ADR-0032 §1):
//   1. Data — the member variant's sheet, both switches on.
//   2. Shells — the Admin variant with its picker, while saving, and with each error.
//   3. Interactions — member: switch the IBAN off, confirm; Admin: pick a member, confirm.
const MEMBERS = [
  { userId: 'u-lisa', displayName: 'Lisa de Vries' },
  { userId: 'u-tom', displayName: 'Tom Bakker' },
]

const meta = {
  title: 'features/claim-payment/ClaimPaymentView',
  component: ClaimPaymentView,
  args: {
    variant: 'member',
    userId: 'u-me',
    members: MEMBERS,
    name: 'I.M. Visser',
    amount: '€ 20,00',
    isSaving: false,
    onDismissError: fn(),
    onClaim: fn(() => Promise.resolve()),
  },
} satisfies Meta<typeof ClaimPaymentView>

export default meta

type Story = StoryObj<typeof meta>

const open = async (canvas: ReturnType<typeof within>, name: string) => {
  await userEvent.click(canvas.getByRole('button', { name }))
  return within(await screen.findByRole('dialog'))
}
const close = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
}
const MINE = "That's mine: I.M. Visser"
const ASSIGN = 'Assign I.M. Visser to a member'

export const Data: Story = {
  play: async ({ canvas }) => {
    const sheet = await open(canvas, MINE)
    await expect(sheet.getByText('Is this payment yours?')).toBeInTheDocument()
    await expect(sheet.getByRole('switch', { name: 'Name: I.M. Visser' })).toBeChecked()
    await expect(sheet.getByRole('switch', { name: 'The IBAN of this payment' })).toBeChecked()
    await expect(sheet.queryByRole('combobox')).not.toBeInTheDocument()
    await expect(sheet.getByRole('button', { name: 'Link payment' })).toBeEnabled()
  },
}

export const Shells: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        'Admin picker': <ClaimPaymentView {...args} variant="admin" />,
        Saving: <ClaimPaymentView {...args} isSaving />,
        'Already linked': <ClaimPaymentView {...args} error="NOT_CLAIMABLE" />,
        'Name or IBAN taken': <ClaimPaymentView {...args} error="ALIAS_TAKEN" />,
        'Pool unavailable': <ClaimPaymentView {...args} error="POOL_UNAVAILABLE" />,
        'Nothing to store': <ClaimPaymentView {...args} error="INVALID" />,
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const region = (name: string) => within(within(canvasElement).getByRole('region', { name }))
    const alertFor = async (name: string) => (await open(region(name), MINE)).getByRole('alert')

    const admin = await open(region('Admin picker'), ASSIGN)
    await expect(admin.getByText('Assign this payment')).toBeInTheDocument()
    await expect(admin.getByRole('combobox', { name: 'Member' })).toHaveValue('')
    await expect(admin.getByRole('option', { name: 'Tom Bakker' })).toBeInTheDocument()
    // Nobody picked yet: nothing to confirm.
    await expect(admin.getByRole('button', { name: 'Link payment' })).toBeDisabled()
    await expect(admin.getByRole('button', { name: 'Link payment' })).toHaveAccessibleDescription('Choose a member first.')
    await close()

    await expect(await alertFor('Already linked')).toHaveTextContent('already linked')
    await close()
    await expect(await alertFor('Name or IBAN taken')).toHaveTextContent('Another member already uses this name or IBAN')
    await close()
    await expect(await alertFor('Pool unavailable')).toHaveTextContent('unavailable')
    await close()
    await expect(await alertFor('Nothing to store')).toHaveTextContent('Nothing to store')
    await close()

    // Last: a sheet that is saving ignores Escape, so it stays open.
    const saving = await open(region('Saving'), MINE)
    await expect(saving.getByRole('button', { name: 'Linking…' })).toBeDisabled()
    await expect(saving.getByRole('button', { name: 'Cancel' })).toBeDisabled()
    await userEvent.keyboard('{Escape}')
    await expect(screen.getByRole('dialog')).toBeInTheDocument()
  },
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        // The row stays after a claim, as in the pool list; focus goes back to it.
        Member: (
          <ul>
            <li tabIndex={-1} data-testid="row">
              <ClaimPaymentView {...args} />
            </li>
          </ul>
        ),
        Admin: <ClaimPaymentView {...args} variant="admin" />,
        'Shown error': <ClaimPaymentView {...args} error="ALIAS_TAKEN" />,
      }}
    />
  ),
  play: async ({ canvasElement, args }) => {
    const region = (name: string) => within(within(canvasElement).getByRole('region', { name }))

    // Cancel clears a shown error, and a reopened sheet starts with both switches on again.
    const stale = await open(region('Shown error'), MINE)
    await expect(stale.getByRole('alert')).toBeInTheDocument()
    await userEvent.click(stale.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(args.onDismissError).toHaveBeenCalled()

    const first = await open(region('Member'), MINE)
    await userEvent.click(first.getByRole('switch', { name: 'The IBAN of this payment' }))
    await userEvent.click(first.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

    const member = await open(region('Member'), MINE)
    await expect(member.getByRole('switch', { name: 'The IBAN of this payment' })).toBeChecked()
    await userEvent.click(member.getByRole('switch', { name: 'The IBAN of this payment' }))
    await expect(member.getByRole('switch', { name: 'The IBAN of this payment' })).not.toBeChecked()
    await userEvent.click(member.getByRole('button', { name: 'Link payment' }))
    await expect(args.onClaim).toHaveBeenLastCalledWith({ userId: 'u-me', useName: true, useIban: false })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    // After a claim focus lands on the row, not on the page.
    await waitFor(() => expect(within(canvasElement).getByTestId('row')).toHaveFocus())

    const admin = await open(region('Admin'), ASSIGN)
    await userEvent.selectOptions(admin.getByRole('combobox', { name: 'Member' }), 'u-tom')
    await userEvent.click(admin.getByRole('button', { name: 'Link payment' }))
    await expect(args.onClaim).toHaveBeenLastCalledWith({ userId: 'u-tom', useName: true, useIban: true })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(args.onClaim).toHaveBeenCalledTimes(2)
  },
}
