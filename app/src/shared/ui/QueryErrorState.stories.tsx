import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { Link } from '@tanstack/react-router'
import { withRouter } from '@shared/testing/router-decorator'
import { Button } from '@shared/ui/button'
import { QueryErrorState } from './QueryErrorState'

// QueryErrorState is the reusable "we couldn't load this" shell: a heading, an optional line of
// context, a Retry button that re-runs the failed query, and an optional actions slot (e.g. a Back
// link). It is distinct from an empty state — a failure is never rendered as "nothing here".
const meta = {
  title: 'shared/ui/QueryErrorState',
  component: QueryErrorState,
  decorators: [withRouter],
} satisfies Meta<typeof QueryErrorState>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Couldn't load this event",
    description: 'Something went wrong on our end.',
    onRetry: fn(),
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText("Couldn't load this event")).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: /retry/i }))
    await expect(args.onRetry).toHaveBeenCalled()
  },
}

export const WithBackAction: Story = {
  args: {
    title: "Couldn't load this event",
    onRetry: fn(),
    children: (
      <Button asChild variant="ghost">
        <Link to="/">Back to events</Link>
      </Button>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: /back to events/i })).toBeInTheDocument()
  },
}
