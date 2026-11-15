import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { PinnedPostsStripView, type StripPost } from './PinnedPostsStripView'

// The pinned-posts strip under the app header (ADR-0048). One picture of the closed line; the
// Interactions story opens it and proves the close wiring.
const POSTS: StripPost[] = [
  {
    id: 'b2',
    title: 'Clubhouse closes at 22:30',
    markdown: '### Clubhouse closes at 22:30\n1. Last drinks at 22:15\n2. No music outside after 22:00',
  },
  { id: 'b1', title: 'Ball bag rotation', markdown: '### Ball bag rotation\n- Week 46 — Lisa\n- Week 47 — Tom' },
]

const meta = {
  title: 'widgets/pinned-posts-strip/PinnedPostsStripView',
  component: PinnedPostsStripView,
  args: { posts: POSTS, onClose: fn() },
} satisfies Meta<typeof PinnedPostsStripView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    // Closed: the newest pin's title and how many more there are, nothing of the text.
    const line = canvas.getByRole('button', { name: 'Show pinned posts' })
    await expect(line).toHaveTextContent('Clubhouse closes at 22:30+1 more')
    await expect(line).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByText('Week 46 — Lisa')).not.toBeVisible()
  },
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show pinned posts' }))
    await expect(canvas.getByText('Week 46 — Lisa')).toBeVisible()
    await expect(canvas.getByText('Last drinks at 22:15')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Close pinned posts' }))
    await expect(args.onClose).toHaveBeenCalled()
  },
}
