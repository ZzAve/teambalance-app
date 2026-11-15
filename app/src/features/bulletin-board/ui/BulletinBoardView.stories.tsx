import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { dateFromShowUntil, showUntilFromDate } from '@shared/lib/show-until'
import { BulletinBoardView, type BoardPost } from './BulletinBoardView'

// The Bulletin Board (ADR-0048). The Team page composite (pages/team/TeamPageView) owns the picture
// of a populated board; this file keeps the states that page does not show, the Markdown safety
// rules, and the compose wiring.
const POSTS: BoardPost[] = [
  {
    id: 'b2',
    authorName: 'Grace Hopper',
    postedAt: '2026-11-12T09:00:00Z',
    pinned: true,
    showUntil: '2026-11-30T22:59:59.000Z',
    edits: [
      { editorName: 'Ada Lovelace', editedAt: '2026-11-12T15:30:00Z' },
      { editorName: 'Grace Hopper', editedAt: '2026-11-13T08:05:00Z' },
    ],
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
    pinned: false,
    // Past the story's clock: Members no longer see it; Admins see it last, dimmed.
    showUntil: '2026-11-13T22:59:59.000Z',
    edits: [],
    markdown: 'Raw HTML stays text: <script>alert(1)</script> and [a bad link](javascript:alert(1)).',
  },
  {
    id: 'b1',
    authorName: 'Ada Lovelace',
    postedAt: '2026-11-01T09:00:00Z',
    pinned: false,
    edits: [],
    deletedAt: '2026-11-11T09:00:00Z',
    removedAt: '2026-11-25T09:00:00Z',
    markdown: '### Old training times\nTraining moves to 19:00.',
  },
]

// The clock every story reads, so the show-until chips do not change with the day the tests run.
const NOW = new Date('2026-11-14T12:00:00Z')

const meta = {
  title: 'features/bulletin-board/BulletinBoardView',
  component: BulletinBoardView,
  args: { posts: POSTS, isAdmin: true, now: NOW, onCreate: fn(), onUpdate: fn(), onDelete: fn(), onRestore: fn() },
} satisfies Meta<typeof BulletinBoardView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Clubhouse closes at 22:30')).toBeInTheDocument()
    await expect(canvas.getByText('Grace Hopper')).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'gemeente notice' })).toHaveAttribute('rel', 'noopener noreferrer')
    await expect(canvas.getAllByText('Pinned')).toHaveLength(1)
    await expect(canvas.getByText('until 30 Nov')).toBeInTheDocument()
    await expect(canvas.getByText('Ended 13 Nov')).toBeInTheDocument()
    // The ended Post comes after the live ones.
    const articles = canvas.getAllByRole('article')
    await expect(articles.at(-1)).toHaveTextContent('Ended 13 Nov')
    // Only the edited Post says so, with its history behind the info button.
    await expect(canvas.getAllByText(/edited/)).toHaveLength(1)
    await expect(canvas.getAllByRole('button', { name: 'Edit history' })).toHaveLength(1)
    await expect(canvas.getAllByRole('button', { name: 'Post actions' })).toHaveLength(2)
    // A deleted Post is not on the board; Admins find it under the closed deleted list.
    await expect(canvas.getByText('1 deleted post')).toBeInTheDocument()
    await expect(canvas.getByText('Old training times')).not.toBeVisible()
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
        Member: <BulletinBoardView {...args} isAdmin={false} />,
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
    // A Member reads the edit history too, but gets no actions.
    await expect(region('Member').getByRole('button', { name: 'Edit history' })).toBeInTheDocument()
    await expect(region('Member').queryByRole('button', { name: 'Post actions' })).not.toBeInTheDocument()
    await expect(region('Member').queryByText(/deleted post/)).not.toBeInTheDocument()
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

    await userEvent.click(body.getByRole('switch', { name: 'Pin this post' }))
    await userEvent.click(post)
    await expect(args.onCreate).toHaveBeenCalledWith({ markdown: '**Balls** go home with Tom', pinned: true, showUntil: null })
    await waitFor(() => expect(body.queryByRole('button', { name: 'Post' })).not.toBeInTheDocument())

    // Edit starts from the Post's own text and saves it under that Post's id.
    await userEvent.click(canvas.getAllByRole('button', { name: 'Post actions' })[0])
    await userEvent.click(await body.findByRole('menuitem', { name: 'Edit' }))
    const text = await body.findByLabelText('Post text (Markdown)')
    await expect(text).toHaveValue(POSTS[0].markdown)
    // The pin starts from the Post's own state, and is saved with the text.
    await expect(body.getByRole('switch', { name: 'Pin this post' })).toBeChecked()
    await userEvent.clear(text)
    await userEvent.type(text, 'Closed on Friday')
    await userEvent.click(body.getByRole('button', { name: 'Save' }))
    // The pin and the show-until are kept: the edit saves the Post's whole content.
    await expect(args.onUpdate).toHaveBeenCalledWith('b2', {
      markdown: 'Closed on Friday',
      pinned: true,
      showUntil: showUntilFromDate(dateFromShowUntil(POSTS[0].showUntil)),
    })
    await waitFor(() => expect(body.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument())

    // The history lists every edit, newest first, then who posted it.
    await userEvent.click(canvas.getByRole('button', { name: 'Edit history' }))
    const rows = within(await body.findByRole('dialog')).getAllByRole('listitem').map((row) => row.textContent)
    await expect(rows[0]).toMatch(/^Edited by Grace Hopper/)
    await expect(rows[1]).toMatch(/^Edited by Ada Lovelace/)
    await expect(rows[2]).toMatch(/^Posted by Grace Hopper/)
    await userEvent.keyboard('{Escape}')

    // Delete needs no confirm: it can be restored, from the deleted list, for 14 days.
    await userEvent.click(canvas.getAllByRole('button', { name: 'Post actions' })[1])
    await userEvent.click(await body.findByRole('menuitem', { name: 'Delete' }))
    await expect(args.onDelete).toHaveBeenCalledWith('b3')

    await userEvent.click(canvas.getByText('1 deleted post'))
    await expect(canvas.getByText('Removed for good on 25 Nov')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Restore' }))
    await expect(args.onRestore).toHaveBeenCalledWith('b1')
  },
}
