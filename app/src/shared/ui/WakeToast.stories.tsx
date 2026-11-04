import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { WakeToast } from './WakeToast'

// The cold-start notice. Prop-only: visibility and elapsed time are props, so it renders with no
// query client. One gallery story (ADR-0032 §2) stacks hidden, waking and escalated; there are no
// callbacks, so no Interactions story. `contain-layout` makes each box the containing block for the
// `fixed` toast, as in UpdateToast.stories.
const meta = {
  title: 'shared/ui/WakeToast',
  component: WakeToast,
  args: { show: true, elapsedMs: 3_000 },
} satisfies Meta<typeof WakeToast>

export default meta

type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  render: () => (
    <Stack
      items={{
        Hidden: <WakeToast show={false} elapsedMs={3_000} />,
        Waking: (
          <div className="relative h-40 contain-layout">
            <WakeToast show elapsedMs={3_000} />
          </div>
        ),
        Escalated: (
          <div className="relative h-40 contain-layout">
            <WakeToast show elapsedMs={9_000} />
          </div>
        ),
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Hidden').queryByRole('status')).not.toBeInTheDocument()

    await expect(region('Waking').getByRole('status', { name: 'Server status' })).toHaveTextContent(
      'Waking the server back up…',
    )
    await expect(region('Escalated').getByRole('status', { name: 'Server status' })).toHaveTextContent(
      'Still on it — thanks for hanging in there',
    )
  },
}
