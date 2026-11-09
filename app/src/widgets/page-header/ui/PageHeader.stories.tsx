import { useState, type ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { Stack } from '@shared/testing/stack'
import { AppShellFrame } from '@shared/ui/AppShellFrame'
import { Button } from '@shared/ui/button'
import { TeamSwitcherView } from '@features/switch-team/ui/TeamSwitcherView'
import { PageHeader } from './PageHeader'

// PageHeader fills the app header (the context bar, #505): it renders nothing in place and portals
// its title, back link and actions into AppShellFrame's header. A page without `backTo` is a
// top-level (tab) page: the bar keeps the monogram and the team chip around its title. A page with
// `backTo` is nested: the bar shows back + title + actions, and the monogram and team chip leave.
//
// Each case below gets its own frame (no tab bar), so the play can read the bar the page produced.
// Behavioural only: the pixels are owned by the page composites under the app shell (ADR-0032 §3).
const onEdit = fn()
const TEAM = { id: 't1', name: 'Setpoint VT', slug: 'setpoint-vt' }

function Frame({ children }: { children: ReactNode }) {
  return (
    <AppShellFrame teamSwitcher={<TeamSwitcherView teams={[TEAM]} activeTeam={TEAM} onSelect={() => {}} />} nav={null}>
      {children}
    </AppShellFrame>
  )
}

// Leaving a nested page must hand the bar back: monogram and team chip return.
function LeaveNested() {
  const [nested, setNested] = useState(true)
  return (
    <Frame>
      {nested ? <PageHeader title="Training — Tuesday" backTo="/t/setpoint-vt" backLabel="Back to events" /> : <PageHeader title="Events" />}
      <Button variant="outline" onClick={() => setNested(false)}>
        Leave
      </Button>
    </Frame>
  )
}

const meta = {
  title: 'widgets/page-header/PageHeader',
  component: PageHeader,
  decorators: [withRouter],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PageHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  // title is required on PageHeader; unused by render below — each Stack instance sets its own.
  args: { title: 'Events' },
  render: () => (
    <Stack
      items={{
        'Top level': (
          <Frame>
            <PageHeader title="Events" />
          </Frame>
        ),
        'Nested with action': (
          <Frame>
            <PageHeader
              title="Training — Tuesday"
              backTo="/t/setpoint-vt"
              backLabel="Back to events"
              actions={
                <Button variant="ghost" size="sm" onClick={() => onEdit('event-1')}>
                  Edit
                </Button>
              }
            />
          </Frame>
        ),
        // Event titles are user-authored and unbounded: the title must cut off on one line so the
        // back link and the action keep their space.
        'Long title': (
          <Frame>
            <PageHeader
              title="Volleybalvereniging Heren 3 — thuiswedstrijd tegen de allerlangste clubnaam"
              backTo="/t/setpoint-vt"
              backLabel="Back to events"
              actions={<Button variant="ghost" size="sm">Edit</Button>}
            />
          </Frame>
        ),
        'Leave nested': <LeaveNested />,
      }}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const bar = (name: string) => within(within(canvas.getByRole('region', { name })).getByRole('banner'))

    // Top level: monogram home link, the title as the page's h1, the team chip; no back link.
    const top = bar('Top level')
    await expect(top.getByRole('link', { name: 'TeamBalance' })).toHaveAttribute('href', '/')
    await expect(top.getByRole('heading', { level: 1, name: 'Events' })).toBeInTheDocument()
    await expect(top.getByText('Setpoint VT')).toBeInTheDocument()
    await expect(top.queryByRole('link', { name: 'Back to events' })).not.toBeInTheDocument()

    // Nested: back link to the parent, the title, the caller's action wired to its handler; the
    // monogram and the team chip are gone.
    const nested = bar('Nested with action')
    await expect(nested.getByRole('link', { name: 'Back to events' })).toHaveAttribute('href', '/t/setpoint-vt')
    await expect(nested.getByRole('heading', { name: 'Training — Tuesday' })).toBeInTheDocument()
    await expect(nested.queryByRole('link', { name: 'TeamBalance' })).not.toBeInTheDocument()
    await expect(nested.queryByText('Setpoint VT')).not.toBeInTheDocument()
    onEdit.mockClear()
    await userEvent.click(nested.getByRole('button', { name: 'Edit' }))
    await expect(onEdit).toHaveBeenCalledWith('event-1')

    // Long title: actually cut off (wider than its box), with back and action still in the bar.
    const long = bar('Long title')
    const title = long.getByRole('heading')
    await expect(title).toHaveClass('truncate')
    await expect(title.scrollWidth).toBeGreaterThan(title.clientWidth)
    await expect(long.getByRole('button', { name: 'Edit' })).toBeVisible()

    // Leaving the nested page restores the top-level bar.
    const region = within(canvas.getByRole('region', { name: 'Leave nested' }))
    await userEvent.click(region.getByRole('button', { name: 'Leave' }))
    const left = bar('Leave nested')
    await expect(left.getByRole('heading', { level: 1, name: 'Events' })).toBeInTheDocument()
    await expect(left.getByRole('link', { name: 'TeamBalance' })).toBeInTheDocument()
    await expect(left.getByText('Setpoint VT')).toBeInTheDocument()
    await expect(left.queryByRole('link', { name: 'Back to events' })).not.toBeInTheDocument()
  },
}
