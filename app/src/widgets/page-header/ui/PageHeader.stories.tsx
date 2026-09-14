import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { Stack } from '@shared/testing/stack'
import { Button } from '@shared/ui/button'
import { PageHeader } from './PageHeader'

// PageHeader is the shared sticky sub-header: it renders a back link, a title and an optional
// actions slot, and pins itself at `top: var(--header-height)` so it always lands flush under the
// app header (no magic pixel offset). It is prop-only — no store, no query — so every state below
// renders from args alone; the routes that use it stay thin wiring (ADR-0017).
//
// The back control is a real <Link>, so the story runs under the router decorator and asserts the
// resolved href (same contract as TeamHeader's gear).
//
// Covered by the event-detail page composite (EventDetailView, ADR-0031 §3): every shape this widget
// can take is folded into one disableSnapshot Gallery, including the sticky-offset derivation — the
// picture lives on the composite.
const onAction = fn()

const meta = {
  title: 'widgets/page-header/PageHeader',
  component: PageHeader,
  decorators: [
    // Mirrors the app's <main> gutter (max-w-2xl px-4) so the header's -mx-4 full-bleed edge
    // renders faithfully in context.
    (Story) => (
      <div className="mx-auto max-w-2xl px-4">
        <Story />
      </div>
    ),
    withRouter,
  ],
} satisfies Meta<typeof PageHeader>

export default meta

type Story = StoryObj<typeof meta>

// Picture owned by the event-detail page composite (EventDetailView) — behavioural only (ADR-0031 §3).
export const Gallery: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  // title is required on PageHeader; unused by render below — each Stack instance sets its own.
  args: { title: 'Training — Tuesday' },
  render: () => (
    <Stack
      items={{
        // Title only: no back target, no actions — the minimal shape a page can use.
        'Title only': <PageHeader title="Training — Tuesday" />,
        // The event-detail shape: back link into the parent list plus a title.
        'With back': <PageHeader title="Training — Tuesday" backTo="/" backLabel="Back to events" />,
        // Back link plus a trailing actions slot — the actions are the caller's nodes, so the play
        // proves a click reaches the caller's handler rather than being swallowed by the header.
        'With back and actions': (
          <PageHeader
            title="Training — Tuesday"
            backTo="/"
            backLabel="Back to events"
            actions={
              <Button variant="outline" size="sm" onClick={() => onAction()}>
                Edit
              </Button>
            }
          />
        ),
        // A title long enough to overrun the bar: it must truncate on one line so the back button
        // and the actions slot keep their space (real event titles are user-authored and unbounded).
        'Long title': (
          <PageHeader
            title="Volleybalvereniging Heren 3 — thuiswedstrijd tegen de allerlangste clubnaam"
            backTo="/"
            backLabel="Back to events"
          />
        ),
        // The sticky offset is the whole point of the widget: it must be *derived* from
        // --header-height, never a hardcoded pixel value that drifts when the app header changes
        // (the F12 defect). Overriding the variable to an off-token value and reading the resolved
        // `top` back proves the derivation end-to-end — a plain class assertion would still pass if
        // the offset were re-hardcoded to today's header height.
        'Sticky offset': (
          <div style={{ '--header-height': '80px' } as React.CSSProperties}>
            <PageHeader title="Training — Tuesday" />
          </div>
        ),
      }}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(
      region('Title only').getByRole('heading', { name: 'Training — Tuesday' }),
    ).toBeInTheDocument()
    await expect(region('Title only').queryByRole('link')).not.toBeInTheDocument()

    const back = region('With back').getByRole('link', { name: 'Back to events' })
    await expect(back).toHaveAttribute('href', '/')
    await expect(
      region('With back').getByRole('heading', { name: 'Training — Tuesday' }),
    ).toBeInTheDocument()

    await expect(
      region('With back and actions').getByRole('link', { name: 'Back to events' }),
    ).toBeInTheDocument()
    onAction.mockClear()
    await userEvent.click(region('With back and actions').getByRole('button', { name: 'Edit' }))
    await expect(onAction).toHaveBeenCalledTimes(1)

    await expect(region('Long title').getByRole('heading')).toHaveClass('truncate')

    const stickyHeading = region('Sticky offset').getByRole('heading').parentElement as HTMLElement
    await expect(getComputedStyle(stickyHeading).top).toBe('80px')
  },
}
