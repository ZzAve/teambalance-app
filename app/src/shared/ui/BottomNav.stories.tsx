import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { BottomNav } from './BottomNav'

// BottomNav renders TanStack Router <Link>s, so it needs a router in context — supplied by the
// shared withRouter decorator. It is now a live three-tab bar (Events · Team · Profile) with no
// disabled tabs; the active tab is derived from the current route. Each story starts the router at
// a different path (via parameters.router.initialEntries) to pin the active-state wiring.
const meta = {
  title: 'shared/ui/BottomNav',
  component: BottomNav,
  decorators: [withRouter],
} satisfies Meta<typeof BottomNav>

export default meta

type Story = StoryObj<typeof meta>

// Every tab routes to a real destination — assert the href wiring holds regardless of which is active.
async function expectTabTargets(canvas: Parameters<NonNullable<Story['play']>>[0]['canvas']) {
  await expect(canvas.getByRole('link', { name: 'Events' })).toHaveAttribute('href', '/')
  await expect(canvas.getByRole('link', { name: 'Team' })).toHaveAttribute('href', '/team')
  await expect(canvas.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/profile')
  // No dead tabs: nothing is disabled/non-interactive anymore.
  await expect(canvas.getByRole('link', { name: 'Events' })).not.toHaveClass('pointer-events-none')
  await expect(canvas.getByRole('link', { name: 'Team' })).not.toHaveClass('pointer-events-none')
  await expect(canvas.getByRole('link', { name: 'Profile' })).not.toHaveClass('pointer-events-none')
  // Money Pool is gone entirely.
  await expect(canvas.queryByRole('link', { name: 'Money Pool' })).not.toBeInTheDocument()
}

export const EventsActive: Story = {
  parameters: { router: { initialEntries: ['/'] } },
  play: async ({ canvas }) => {
    await expectTabTargets(canvas)
    await expect(canvas.getByRole('link', { name: 'Events' })).toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Events' })).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByRole('link', { name: 'Team' })).not.toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Profile' })).not.toHaveClass('text-blue')
  },
}

export const TeamActive: Story = {
  parameters: { router: { initialEntries: ['/team'] } },
  play: async ({ canvas }) => {
    await expectTabTargets(canvas)
    await expect(canvas.getByRole('link', { name: 'Team' })).toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Team' })).toHaveAttribute('aria-current', 'page')
    // Events must not stay active on a nested route — an exact-match seam, not a prefix match.
    await expect(canvas.getByRole('link', { name: 'Events' })).not.toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Profile' })).not.toHaveClass('text-blue')
  },
}

// The Team tab stays active on nested team routes (e.g. the admin settings sub-page).
export const TeamSettingsActive: Story = {
  parameters: { router: { initialEntries: ['/team/settings'] } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Team' })).toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Events' })).not.toHaveClass('text-blue')
  },
}

export const ProfileActive: Story = {
  parameters: { router: { initialEntries: ['/profile'] } },
  play: async ({ canvas }) => {
    await expectTabTargets(canvas)
    await expect(canvas.getByRole('link', { name: 'Profile' })).toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Profile' })).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByRole('link', { name: 'Events' })).not.toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Team' })).not.toHaveClass('text-blue')
  },
}
