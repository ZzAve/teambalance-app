import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import type { Substitute } from '@shared/api/substitutes'
import { Stack } from '@shared/testing/stack'
import { withRouter } from '@shared/testing/router-decorator'
import { SubstituteRosterView } from './SubstituteRosterView'

// SubstituteRosterView is the Team's Substitutes (ADR-0033) as faces under the Roster. The populated
// grid is what pages/team/TeamPageView pictures, so this file keeps only the states that composite
// can't show (ADR-0032): loading, error and an empty list, stacked in one Shells frame.
const SUBSTITUTES: Substitute[] = [
  { id: 's1', name: 'Jan de Vries', position: { id: 'p2', label: 'Libero' }, shirtNumber: 14 },
  // null, as the API sends "no number" (the generated type says undefined).
  { id: 's2', name: 'Sam Bakker', position: undefined, shirtNumber: null as unknown as undefined },
]

const meta = {
  title: 'features/manage-substitutes/SubstituteRosterView',
  component: SubstituteRosterView,
  // Each face links to the Substitute's page, built from the Team in the URL.
  decorators: [withRouter],
  parameters: { router: { initialEntries: ['/t/setpoint-vt/team'] } },
  args: { substitutes: SUBSTITUTES },
} satisfies Meta<typeof SubstituteRosterView>

export default meta

type Story = StoryObj<typeof meta>

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <SubstituteRosterView {...args} substitutes={undefined} isLoading />,
        Error: <SubstituteRosterView {...args} substitutes={undefined} isError />,
        Empty: <SubstituteRosterView {...args} substitutes={[]} />,
        // Behavioural only: TeamPageView's Data owns the picture of the populated grid.
        Faces: <SubstituteRosterView {...args} />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    await expect(region('Error').getByText(/couldn't load substitutes/i)).toBeInTheDocument()
    await expect(region('Empty').getByText('No substitutes yet.')).toBeInTheDocument()
    // Each face opens that Substitute's page and says they are one.
    await expect(region('Faces').getByRole('link', { name: 'Jan de Vries, substitute' })).toHaveAttribute(
      'href',
      '/t/setpoint-vt/team/sub/s1',
    )
    await expect(region('Faces').getAllByText('Substitute')).toHaveLength(2)
    await expect(region('Faces').getByLabelText('Shirt number 14')).toBeInTheDocument()
    await expect(region('Faces').queryAllByLabelText(/^Shirt number/)).toHaveLength(1)
  },
}
