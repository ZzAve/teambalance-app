import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { BottomNav } from './BottomNav'

// BottomNav renders TanStack Router <Link>s, so it needs a router in context — supplied by the
// shared withRouter decorator. It is a live four-tab bar (Events · Team · Money · Profile) with no
// disabled tabs; the active tab is derived from the current route. Each story starts the router at a
// different path (via parameters.router.initialEntries) to pin the active-state wiring.
//
// The tab targets are built from the slug in the path the bar is rendered on (ADR-0023 §2), which is
// why starting the router at a path is enough to drive them — there is no store to prime.
//
// Covered entirely by the page composites (ADR-0031 §3): every page renders BottomNav in its real
// frame, so no story here carries a picture. `parameters.router.initialEntries` is a per-story
// parameter, and the active tab is derived from the router's current path, so one Stack frame can't
// hold all five router states at once — each path stays its own disableSnapshot story.
const meta = {
  title: 'shared/ui/BottomNav',
  component: BottomNav,
  decorators: [withRouter],
} satisfies Meta<typeof BottomNav>

export default meta

type Story = StoryObj<typeof meta>

// Every tab routes to a real destination — assert the href wiring holds regardless of which is active.
async function expectTabTargets(canvas: Parameters<NonNullable<Story['play']>>[0]['canvas']) {
  await expect(canvas.getByRole('link', { name: 'Events' })).toHaveAttribute('href', '/t/setpoint-vt')
  await expect(canvas.getByRole('link', { name: 'Team' })).toHaveAttribute('href', '/t/setpoint-vt/team')
  await expect(canvas.getByRole('link', { name: 'Money' })).toHaveAttribute('href', '/t/setpoint-vt/money')
  // Profile is the team-independent /account (ADR-0027 §1), not a slug-built destination.
  await expect(canvas.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/account')
  // No dead tabs: nothing is disabled/non-interactive. The Money tab is a live link to its
  // (coming-soon) placeholder page, not a greyed-out stub.
  await expect(canvas.getByRole('link', { name: 'Events' })).not.toHaveClass('pointer-events-none')
  await expect(canvas.getByRole('link', { name: 'Team' })).not.toHaveClass('pointer-events-none')
  await expect(canvas.getByRole('link', { name: 'Money' })).not.toHaveClass('pointer-events-none')
  await expect(canvas.getByRole('link', { name: 'Profile' })).not.toHaveClass('pointer-events-none')
}

// Picture owned by the page composites (ADR-0031 §3).
export const EventsActive: Story = {
  parameters: {
    router: { initialEntries: ['/t/setpoint-vt'] },
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvas }) => {
    await expectTabTargets(canvas)
    await expect(canvas.getByRole('link', { name: 'Events' })).toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Events' })).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByRole('link', { name: 'Team' })).not.toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Money' })).not.toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Profile' })).not.toHaveClass('text-blue')
  },
}

// Picture owned by the page composites (ADR-0031 §3).
export const TeamActive: Story = {
  parameters: {
    router: { initialEntries: ['/t/setpoint-vt/team'] },
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvas }) => {
    await expectTabTargets(canvas)
    await expect(canvas.getByRole('link', { name: 'Team' })).toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Team' })).toHaveAttribute('aria-current', 'page')
    // Events must not stay active on a nested route — an exact-match seam, not a prefix match.
    await expect(canvas.getByRole('link', { name: 'Events' })).not.toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Money' })).not.toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Profile' })).not.toHaveClass('text-blue')
  },
}

// Picture owned by the page composites (ADR-0031 §3).
export const MoneyActive: Story = {
  parameters: {
    router: { initialEntries: ['/t/setpoint-vt/money'] },
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvas }) => {
    await expectTabTargets(canvas)
    await expect(canvas.getByRole('link', { name: 'Money' })).toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Money' })).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByRole('link', { name: 'Events' })).not.toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Team' })).not.toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Profile' })).not.toHaveClass('text-blue')
  },
}

// The Team tab stays active on nested team routes (e.g. the admin settings sub-page). Behavioural
// twin of TeamActive — a nested route that keeps the Team tab active renders the same picture
// (ADR-0027 §2), and the picture itself is owned by the page composites (ADR-0031 §3).
export const TeamSettingsActive: Story = {
  parameters: {
    router: { initialEntries: ['/t/setpoint-vt/team/settings'] },
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Team' })).toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Events' })).not.toHaveClass('text-blue')
  },
}

// Profile is the team-independent /account (ADR-0027 §1), so it is active there regardless of slug.
// /account carries no slug, so the other tabs collapse to the dispatcher `/` — the accepted
// teamless-bar behaviour (ADR-0027 consequences) — while Profile still points at its constant.
// Picture owned by the page composites (ADR-0031 §3).
export const ProfileActive: Story = {
  parameters: {
    router: { initialEntries: ['/account'] },
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/account')
    await expect(canvas.getByRole('link', { name: 'Profile' })).toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Profile' })).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByRole('link', { name: 'Events' })).not.toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Team' })).not.toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Money' })).not.toHaveClass('text-blue')
    // With no slug in scope the non-Profile tabs point at the dispatcher.
    await expect(canvas.getByRole('link', { name: 'Events' })).toHaveAttribute('href', '/')
  },
}
