import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { authenticatedUser, withAuthMe } from '@shared/testing/auth-decorator'
import { SideNav } from './SideNav'

// The wide-screen twin of BottomNav: same tabs, same active rule, same teamless and money-off rules
// (both read useNavTabs), laid out as a vertical list for the sidebar AppShellFrame shows from `lg`.
// The BottomNav stories pin each route's active tab; these only prove the sidebar renders that same
// tab set.
const meta = {
  title: 'shared/ui/SideNav',
  component: SideNav,
  decorators: [withAuthMe, withRouter],
  // Picture owned by the page composites' `xl` mode (ADR-0032 §3).
  parameters: { chromatic: { disableSnapshot: true } },
} satisfies Meta<typeof SideNav>

export default meta

type Story = StoryObj<typeof meta>

export const TeamActive: Story = {
  parameters: { router: { initialEntries: ['/t/setpoint-vt/team/settings'] } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Events' })).toHaveAttribute('href', '/t/setpoint-vt')
    await expect(canvas.getByRole('link', { name: 'Team' })).toHaveAttribute('href', '/t/setpoint-vt/team')
    await expect(canvas.getByRole('link', { name: 'Money' })).toHaveAttribute('href', '/t/setpoint-vt/money')
    await expect(canvas.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/account')
    await expect(canvas.getByRole('link', { name: 'Team' })).toHaveAttribute('aria-current', 'page')
    // Not aria-current: TanStack's Link sets that on every prefix of the path, Events included.
    await expect(canvas.getByRole('link', { name: 'Events' })).not.toHaveClass('text-blue')
  },
}

// Teamless: Profile alone, as in the bottom bar (ADR-0027).
export const Teamless: Story = {
  parameters: {
    router: { initialEntries: ['/onboarding'] },
    authMe: authenticatedUser(undefined),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('link')).toHaveLength(1)
    await expect(canvas.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/account')
  },
}
