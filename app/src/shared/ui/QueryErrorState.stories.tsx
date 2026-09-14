import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { Link } from '@tanstack/react-router'
import { withRouter } from '@shared/testing/router-decorator'
import { Stack } from '@shared/testing/stack'
import { Button } from '@shared/ui/button'
import { QueryErrorState } from './QueryErrorState'

// QueryErrorState is the reusable "we couldn't load this" shell: a heading, an optional line of
// context, a Retry button that re-runs the failed query, and an optional actions slot (e.g. a Back
// link). It is distinct from an empty state — a failure is never rendered as "nothing here".
//
// One gallery story (ADR-0031 §2) stacks both variants; the Retry click-through is behavioural only
// and lives in Interactions.
const meta = {
  title: 'shared/ui/QueryErrorState',
  component: QueryErrorState,
  decorators: [withRouter],
} satisfies Meta<typeof QueryErrorState>

export default meta

type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  // Unused by render below — Stack supplies each instance's own props — but required to satisfy
  // the story's prop contract (title/onRetry are required on QueryErrorState).
  args: { title: "Couldn't load this event", onRetry: fn() },
  render: () => (
    <Stack
      items={{
        Default: (
          <QueryErrorState
            title="Couldn't load this event"
            description="Something went wrong on our end."
            onRetry={fn()}
          />
        ),
        WithBackAction: (
          <QueryErrorState title="Couldn't load this event" onRetry={fn()}>
            <Button asChild variant="ghost">
              <Link to="/">Back to events</Link>
            </Button>
          </QueryErrorState>
        ),
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Default').getByText("Couldn't load this event")).toBeInTheDocument()

    await expect(region('WithBackAction').getByRole('button', { name: /retry/i })).toBeInTheDocument()
    await expect(
      region('WithBackAction').getByRole('link', { name: /back to events/i }),
    ).toBeInTheDocument()
  },
}

// Picture owned by Gallery — behavioural only (ADR-0031 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  args: {
    title: "Couldn't load this event",
    description: 'Something went wrong on our end.',
    onRetry: fn(),
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /retry/i }))
    await expect(args.onRetry).toHaveBeenCalled()
  },
}
