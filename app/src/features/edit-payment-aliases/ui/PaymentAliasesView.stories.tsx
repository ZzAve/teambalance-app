import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, waitFor, within } from 'storybook/test'
import type { Payment } from '@shared/api/money-pool'
import type { PaymentAlias } from '@shared/api/payment-aliases'
import { Stack } from '@shared/testing/stack'
import { PaymentAliasesView } from './PaymentAliasesView'

// PaymentAliasesView is the prop-only alias editor on the member page (ADR-0045), behind the
// PaymentAliases container. It owns only the form fields and the "adding" toggle; the queries and
// mutations stay in the container, so every state renders purely from props. Three stories, ADR-0032:
// Data is the picture, Shells stacks every other state, Interactions walks the wiring with fn() spies.
const ALIASES: PaymentAlias[] = [
  { id: 'a1', name: 'I.M. VISSER', ibanMasked: undefined, hasIban: false },
  { id: 'a2', name: 'FAM VISSER-DE JONG', ibanMasked: undefined, hasIban: false },
  { id: 'a3', name: undefined, ibanMasked: 'NL91 •••• •••• ••43 00', hasIban: true },
]

const pay = (id: string, name: string): Payment => ({
  id,
  date: '2026-02-01',
  name,
  amount: 12.5,
  direction: 'In',
  receiptVersion: undefined,
  memberId: undefined,
  counterpartyName: undefined,
})
// p1-p4 are unmatched (what the form preview counts). p5-p7 were attributed to u1 by the saved aliases,
// which is what the saved rows count.
const mine = (id: string, counterpartyName: string): Payment => ({ ...pay(id, 'Ada Lovelace'), memberId: 'u1', counterpartyName })
const PAYMENTS = [
  pay('p1', 'I.M. VISSER'),
  pay('p2', 'i.m.  visser'),
  pay('p3', 'FAM VISSER-DE JONG'),
  pay('p4', 'Someone else'),
  mine('p5', 'I.M. VISSER'),
  mine('p6', 'i.m. visser'),
  mine('p7', 'FAM VISSER-DE JONG'),
]

// Holds the container's error the way the real one does: editing a field clears it.
function RejectedIban(props: React.ComponentProps<typeof PaymentAliasesView>) {
  const [code, setCode] = useState<'INVALID_IBAN' | null>('INVALID_IBAN')
  return (
    <PaymentAliasesView
      {...props}
      aliases={[]}
      errorCode={code}
      onDismissError={() => {
        props.onDismissError?.()
        setCode(null)
      }}
    />
  )
}

const meta = {
  title: 'features/edit-payment-aliases/PaymentAliasesView',
  component: PaymentAliasesView,
  args: { userId: 'u1', aliases: ALIASES, payments: PAYMENTS, onCreate: fn(), onDelete: fn(), onRetry: fn(), onDismissError: fn() },
} satisfies Meta<typeof PaymentAliasesView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('I.M. VISSER')).toBeInTheDocument()
    // A saved row counts the payments it has attributed to this member, case and extra spaces ignored.
    await expect(canvas.getByText('matches 2 payments')).toBeInTheDocument()
    await expect(canvas.getByText('matches 1 payment')).toBeInTheDocument()
    // The IBAN is only ever the masked form, read out by its last four characters.
    // Screen readers get "IBAN ending in 4300"; the dotted mask is hidden from them.
    await expect(canvas.getByText('IBAN ending in 4300')).toBeInTheDocument()
    await expect(canvas.getByText('NL91 •••• •••• ••43 00')).toHaveAttribute('aria-hidden', 'true')
    await expect(canvas.getByRole('button', { name: 'Add a name or IBAN' })).toBeInTheDocument()
    await expect(canvas.queryByLabelText('Name on the payment')).not.toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <PaymentAliasesView {...args} isLoading />,
        Error: <PaymentAliasesView {...args} isError />,
        'First time': <PaymentAliasesView {...args} aliases={[]} />,
        'Name taken': <PaymentAliasesView {...args} aliases={[]} errorCode="ALIAS_TAKEN" />,
        'IBAN rejected': <PaymentAliasesView {...args} aliases={[]} errorCode="INVALID_IBAN" />,
        'Not allowed': <PaymentAliasesView {...args} errorCode="FORBIDDEN" />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Loading').getByText('Loading payment matching')).toBeInTheDocument()
    await expect(region('Loading').queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()

    await expect(region('Error').getByText("Couldn't load your payment matching")).toBeInTheDocument()
    await expect(region('Error').getByRole('button', { name: 'Retry' })).toBeInTheDocument()

    // First time: two fields and a Save that waits for something to save.
    await expect(region('First time').getByLabelText('Name on the payment')).toBeInTheDocument()
    await expect(region('First time').getByLabelText('IBAN')).toBeInTheDocument()
    await expect(region('First time').getByRole('button', { name: 'Save' })).toBeDisabled()

    await expect(region('Name taken').getByRole('alert')).toHaveTextContent(/Another member already uses this name or IBAN/)
    await expect(region('IBAN rejected').getByLabelText('IBAN')).toBeInvalid()
    await expect(region('IBAN rejected').getByText("This IBAN doesn't add up. Check it for a typo.")).toBeInTheDocument()
    await expect(region('Not allowed').getByRole('alert')).toHaveTextContent('You are not allowed to change this.')
  },
}

// Behavioural only: Data and Shells own the pictures.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        First: <PaymentAliasesView {...args} aliases={[]} />,
        List: <PaymentAliasesView {...args} />,
        Last: <PaymentAliasesView {...args} aliases={[ALIASES[0]]} />,
        Rejected: <RejectedIban {...args} />,
        Error: <PaymentAliasesView {...args} isError />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    const first = region('First')

    // Live IBAN feedback: a typo blocks Save, the fixed IBAN is grouped and accepted.
    const iban = first.getByLabelText('IBAN')
    await userEvent.type(iban, 'nl92abna0417164300')
    await expect(iban).toHaveValue('NL92 ABNA 0417 1643 00')
    await expect(first.getByText("This IBAN doesn't add up. Check it for a typo.")).toBeInTheDocument()
    await expect(first.getByRole('button', { name: 'Save' })).toBeDisabled()
    await userEvent.clear(iban)
    await userEvent.type(iban, 'nl91abna0417164300')
    await expect(first.getByText('Valid IBAN')).toBeInTheDocument()

    // The name preview counts the visible payments for the typed name.
    await userEvent.type(first.getByLabelText('Name on the payment'), '  i.m. visser ')
    await expect(first.getByText('Payments with this name: 2')).toBeInTheDocument()
    await userEvent.click(first.getByRole('button', { name: 'Save' }))
    await expect(args.onCreate).toHaveBeenCalledWith({ name: 'i.m. visser', iban: 'NL91ABNA0417164300' })
    // Saved: the form is empty again.
    await expect(first.getByLabelText('Name on the payment')).toHaveValue('')

    const list = region('List')
    await userEvent.click(list.getByRole('button', { name: 'Remove I.M. VISSER' }))
    await expect(args.onDelete).toHaveBeenCalledWith(ALIASES[0])
    // Focus moves to the next row's Remove, since the pressed one goes away.
    await waitFor(() => expect(list.getByRole('button', { name: 'Remove FAM VISSER-DE JONG' })).toHaveFocus())

    // Removing the last row of the list lands on Add.
    await userEvent.click(region('Last').getByRole('button', { name: 'Remove I.M. VISSER' }))
    await waitFor(() => expect(region('Last').getByRole('button', { name: 'Add a name or IBAN' })).toHaveFocus())

    // Cancel closes the form, clears a stale error and returns focus to Add.
    await userEvent.click(list.getByRole('button', { name: 'Add a name or IBAN' }))
    await userEvent.click(list.getByRole('button', { name: 'Cancel' }))
    await expect(args.onDismissError).toHaveBeenCalled()
    await waitFor(() => expect(list.getByRole('button', { name: 'Add a name or IBAN' })).toHaveFocus())

    // Add another: a name alone is enough, the IBAN is left out of the request.
    await userEvent.click(list.getByRole('button', { name: 'Add a name or IBAN' }))
    await userEvent.type(list.getByLabelText('Name on the payment'), 'Tikkie 0391')
    await userEvent.click(list.getByRole('button', { name: 'Save' }))
    await expect(args.onCreate).toHaveBeenLastCalledWith({ name: 'Tikkie 0391', iban: undefined })
    await waitFor(() => expect(list.getByRole('button', { name: 'Add a name or IBAN' })).toHaveFocus())

    // A server IBAN rejection goes away once the field is edited: no longer red or aria-invalid.
    const rejected = region('Rejected')
    await expect(rejected.getByLabelText('IBAN')).toBeInvalid()
    await userEvent.type(rejected.getByLabelText('IBAN'), 'nl91abna0417164300')
    await expect(rejected.getByLabelText('IBAN')).toBeValid()
    await expect(rejected.queryByText("This IBAN doesn't add up. Check it for a typo.")).not.toBeInTheDocument()

    await userEvent.click(region('Error').getByRole('button', { name: 'Retry' }))
    await expect(args.onRetry).toHaveBeenCalled()
  },
}
