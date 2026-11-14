import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { BulletinBoardView, type BoardPost } from './BulletinBoardView'

// The Bulletin Board (ADR-0048). The Team page composite (pages/team/TeamPageView) owns the picture
// of a populated board; this file keeps the states that page does not show, the Markdown safety
// rules, and the compose wiring.
const POSTS: BoardPost[] = [
  {
    id: 'b2',
    authorName: 'Grace Hopper',
    postedAt: '2026-11-12T09:00:00Z',
    markdown: [
      '### Clubhouse closes at 22:30',
      'New closing times from the municipality, until the end of November:',
      '',
      '1. Last drinks at 22:15',
      '2. No music outside after 22:00',
      '',
      'Details: [gemeente notice](https://example.com/notice)',
    ].join('\n'),
  },
  {
    id: 'b3',
    authorName: 'Ada Lovelace',
    postedAt: '2026-11-10T09:00:00Z',
    markdown: 'Raw HTML stays text: <script>alert(1)</script> and [a bad link](javascript:alert(1)).',
  },
]

const meta = {
  title: 'features/bulletin-board/BulletinBoardView',
  component: BulletinBoardView,
  args: { posts: POSTS, isAdmin: true, onCreate: fn() },
} satisfies Meta<typeof BulletinBoardView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Clubhouse closes at 22:30')).toBeInTheDocument()
    await expect(canvas.getByText('Grace Hopper')).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'gemeente notice' })).toHaveAttribute('rel', 'noopener noreferrer')
    // ADR-0048: no HTML from a Post reaches the page, and only http(s) links become links.
    await expect(canvasElement.querySelector('script')).toBeNull()
    await expect(canvas.getByText(/<script>alert\(1\)<\/script>/)).toBeInTheDocument()
    await expect(canvas.queryByRole('link', { name: 'a bad link' })).not.toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <BulletinBoardView {...args} posts={[]} isLoading />,
        Error: <BulletinBoardView {...args} posts={[]} isError />,
        'Empty, admin': <BulletinBoardView {...args} posts={[]} />,
        'Empty, member': <BulletinBoardView {...args} posts={[]} isAdmin={false} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    await expect(region('Error').getByText(/couldn't load the bulletin board/i)).toBeInTheDocument()
    await expect(region('Empty, admin').getByText(/no posts yet/i)).toBeInTheDocument()
    // A Member sees no board at all until an Admin posts.
    await expect(region('Empty, member').queryByRole('heading', { name: 'Bulletin board' })).not.toBeInTheDocument()
  },
}

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ args, canvas, userEvent }) => {
    const body = within(document.body)
    await userEvent.click(canvas.getByRole('button', { name: 'New post' }))
    const post = await body.findByRole('button', { name: 'Post' })
    await expect(post).toBeDisabled()

    await userEvent.type(body.getByLabelText('Post text (Markdown)'), '**Balls** go home with Tom')
    await userEvent.click(body.getByRole('tab', { name: 'Preview' }))
    await expect(body.getByText('Balls').tagName).toBe('STRONG')

    await userEvent.click(post)
    await expect(args.onCreate).toHaveBeenCalledWith('**Balls** go home with Tom')
    await waitFor(() => expect(body.queryByRole('button', { name: 'Post' })).not.toBeInTheDocument())
  },
}
