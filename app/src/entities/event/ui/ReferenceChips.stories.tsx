import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { ReferenceChips } from './ReferenceChips'

// Reference chips with the card's 2-visible cap. Variants cover the states that matter: none
// (renders nothing), a titled link, the host fallback when a title is blank, and overflow
// collapsing to "+N".
//
// One gallery story (ADR-0031 §2): every variant side by side, one picture, every branch asserted.
const VARIANTS = {
  none: { references: [] },
  oneTitled: { references: [{ title: 'Nevobo', url: 'https://api.nevobo.nl/permalink/wedstrijd/2018133' }] },
  hostFallbackWhenTitleBlank: { references: [{ title: undefined, url: 'https://dwf.volleybal.nl/match/42' }] },
  overflowCollapsesToPlusN: {
    references: [
      { title: 'Nevobo', url: 'https://api.nevobo.nl/a' },
      { title: 'Match form', url: 'https://dwf.volleybal.nl/b' },
      { title: 'Route', url: 'https://maps.example.com/c' },
      { title: 'Roster', url: 'https://roster.example.com/d' },
    ],
  },
}

const meta = {
  title: 'entities/event/ReferenceChips',
  component: ReferenceChips,
} satisfies Meta<typeof ReferenceChips>

export default meta

type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  args: VARIANTS.oneTitled,
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {Object.entries(VARIANTS).map(([name, props]) => (
        <div key={name} data-testid={`variant-${name}`}>
          <ReferenceChips {...props} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const variant = (name: keyof typeof VARIANTS) => within(canvas.getByTestId(`variant-${name}`))

    await expect(variant('none').queryByRole('link')).not.toBeInTheDocument()

    const link = variant('oneTitled').getByRole('link', { name: /Nevobo/ })
    await expect(link).toHaveAttribute('href', 'https://api.nevobo.nl/permalink/wedstrijd/2018133')
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer')

    // No title → the host stands in as the label.
    await expect(
      variant('hostFallbackWhenTitleBlank').getByRole('link', { name: /dwf\.volleybal\.nl/ }),
    ).toBeInTheDocument()

    // Two chips visible, the remaining two collapsed into "+2".
    await expect(variant('overflowCollapsesToPlusN').getAllByRole('link')).toHaveLength(2)
    await expect(variant('overflowCollapsesToPlusN').getByText('+2')).toBeInTheDocument()
  },
}
