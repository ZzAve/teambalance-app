import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { BottomNav } from './BottomNav'

// BottomNav renders TanStack Router <Link>s, so it needs a router in context — supplied by the
// shared withRouter decorator. It is stateless: Events is the active tab, Money Pool and Team are
// disabled (rendered but non-interactive). One story pins that fixed layout.
const meta = {
  title: 'shared/ui/BottomNav',
  component: BottomNav,
  decorators: [withRouter],
} satisfies Meta<typeof BottomNav>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    // Every tab points at "/" (the other sections don't exist yet), so the router marks them all
    // aria-current — the active/disabled split lives in the styling instead: Events is the live
    // blue tab; Money Pool and Team are rendered but non-interactive.
    await expect(canvas.getByRole('link', { name: 'Events' })).toHaveClass('text-blue')
    await expect(canvas.getByRole('link', { name: 'Money Pool' })).toHaveClass('pointer-events-none')
    await expect(canvas.getByRole('link', { name: 'Team' })).toHaveClass('pointer-events-none')
  },
}
