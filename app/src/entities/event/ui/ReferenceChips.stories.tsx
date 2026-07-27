import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { ReferenceChips } from './ReferenceChips'

// Reference chips with the card's 2-visible cap. Stories cover the states that matter: none (renders
// nothing), a titled link, the host fallback when a title is blank, and overflow collapsing to "+N".
const meta = {
  title: 'entities/event/ReferenceChips',
  component: ReferenceChips,
} satisfies Meta<typeof ReferenceChips>

export default meta

type Story = StoryObj<typeof meta>

export const None: Story = {
  args: { references: [] },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument()
  },
}

export const OneTitled: Story = {
  args: { references: [{ title: 'Nevobo', url: 'https://api.nevobo.nl/permalink/wedstrijd/2018133' }] },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: /Nevobo/ })
    await expect(link).toHaveAttribute('href', 'https://api.nevobo.nl/permalink/wedstrijd/2018133')
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  },
}

export const HostFallbackWhenTitleBlank: Story = {
  args: { references: [{ title: undefined, url: 'https://dwf.volleybal.nl/match/42' }] },
  play: async ({ canvas }) => {
    // No title → the host stands in as the label.
    await expect(canvas.getByRole('link', { name: /dwf\.volleybal\.nl/ })).toBeInTheDocument()
  },
}

export const OverflowCollapsesToPlusN: Story = {
  args: {
    references: [
      { title: 'Nevobo', url: 'https://api.nevobo.nl/a' },
      { title: 'Match form', url: 'https://dwf.volleybal.nl/b' },
      { title: 'Route', url: 'https://maps.example.com/c' },
      { title: 'Roster', url: 'https://roster.example.com/d' },
    ],
  },
  play: async ({ canvas }) => {
    // Two chips visible, the remaining two collapsed into "+2".
    await expect(canvas.getAllByRole('link')).toHaveLength(2)
    await expect(canvas.getByText('+2')).toBeInTheDocument()
  },
}
