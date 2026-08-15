import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { Button } from '@shared/ui/button'
import { PageHeader } from './PageHeader'

// PageHeader is the shared sticky sub-header: it renders a back link, a title and an optional
// actions slot, and pins itself at `top: var(--header-height)` so it always lands flush under the
// app header (no magic pixel offset). It is prop-only — no store, no query — so every state below
// renders from args alone; the routes that use it stay thin wiring (ADR-0017).
//
// The back control is a real <Link>, so the stories run under the router decorator and assert the
// resolved href (same contract as TeamHeader's gear). The actions slot is exercised with an fn()
// spy: a click in `play` must reach the caller's handler, proving the slot is genuinely interactive
// and not just rendered.
const onAction = fn()

const meta = {
  title: 'widgets/page-header/PageHeader',
  component: PageHeader,
  decorators: [
    // Mirrors the app's <main> gutter (max-w-2xl px-4) so the header's -mx-4 full-bleed edge
    // renders faithfully in the Chromatic snapshot instead of overflowing the bare canvas.
    (Story) => (
      <div className="mx-auto max-w-2xl px-4">
        <Story />
      </div>
    ),
    withRouter,
  ],
  args: { title: 'Training — Tuesday' },
} satisfies Meta<typeof PageHeader>

export default meta

type Story = StoryObj<typeof meta>

// Title only: no back target, no actions — the minimal shape a page can use.
export const TitleOnly: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Training — Tuesday' })).toBeInTheDocument()
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument()
  },
}

// The sticky offset is the whole point of the widget: it must be *derived* from --header-height,
// never a hardcoded pixel value that drifts when the app header changes (the F12 defect). Overriding
// the variable to an off-token value and reading the resolved `top` back proves the derivation
// end-to-end — a plain class assertion would still pass if the offset were re-hardcoded to today's
// header height.
export const StickyOffsetFollowsHeaderHeight: Story = {
  decorators: [
    (Story) => (
      <div style={{ '--header-height': '80px' } as React.CSSProperties}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas }) => {
    const header = canvas.getByRole('heading').parentElement as HTMLElement
    await expect(getComputedStyle(header).top).toBe('80px')
  },
}

// The event-detail shape: back link into the parent list plus a title.
export const WithBack: Story = {
  args: { backTo: '/', backLabel: 'Back to events' },
  play: async ({ canvas }) => {
    const back = canvas.getByRole('link', { name: 'Back to events' })
    await expect(back).toHaveAttribute('href', '/')
    await expect(canvas.getByRole('heading', { name: 'Training — Tuesday' })).toBeInTheDocument()
  },
}

// Back link plus a trailing actions slot — the actions are the caller's nodes, so the story proves
// a click reaches the caller's handler rather than being swallowed by the header.
export const WithBackAndActions: Story = {
  args: {
    backTo: '/',
    backLabel: 'Back to events',
    actions: (
      <Button variant="outline" size="sm" onClick={() => onAction()}>
        Edit
      </Button>
    ),
  },
  play: async ({ canvas, userEvent }) => {
    onAction.mockClear()
    await expect(canvas.getByRole('link', { name: 'Back to events' })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Edit' }))
    await expect(onAction).toHaveBeenCalledTimes(1)
  },
}

// A title long enough to overrun the bar: it must truncate on one line so the back button and the
// actions slot keep their space (the real event titles are user-authored and unbounded).
export const LongTitle: Story = {
  args: {
    title: 'Volleybalvereniging Heren 3 — thuiswedstrijd tegen de allerlangste clubnaam',
    backTo: '/',
    backLabel: 'Back to events',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading')).toHaveClass('truncate')
  },
}
