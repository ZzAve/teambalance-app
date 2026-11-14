import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, waitFor, within } from 'storybook/test'
import { DeleteExpenseView } from './DeleteExpenseView'

// The delete control on one out-of-pocket expense, prop-only (ADR-0017). One story (ADR-0032 §1): the
// button has no states of its own to picture, and MoneyPageView's Data shows it in the payment list.
const meta = {
  title: 'features/delete-expense/DeleteExpenseView',
  component: DeleteExpenseView,
  args: { name: 'Match balls', amount: '€12.50', onDelete: fn() },
} satisfies Meta<typeof DeleteExpenseView>

export default meta

type Story = StoryObj<typeof meta>

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole('button', { name: 'Delete expense Match balls' })

    // Cancel deletes nothing and hands focus back to the button.
    await userEvent.click(button)
    const question = within(await screen.findByRole('dialog'))
    await expect(question.getByText(/Match balls, €12\.50\./)).toBeInTheDocument()
    await userEvent.click(question.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(args.onDelete).not.toHaveBeenCalled()
    await waitFor(() => expect(button).toHaveFocus())

    await userEvent.click(button)
    await userEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Delete' }))
    await expect(args.onDelete).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  },
}
