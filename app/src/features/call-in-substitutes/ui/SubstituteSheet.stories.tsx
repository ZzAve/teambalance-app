import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { makeSubstitute } from '@shared/testing/event-fixtures'
import { SubstituteSheet } from './SubstituteSheet'

// One Substitute on one event (ADR-0033), opened from their chip in the lineup or their row in the
// Substitutes block. Prop-only, driven by `substitute`: null closes it, so there is no interesting
// closed picture. One snapshotted story (ADR-0032 §1): EventDetailView and EventLineupPanel only open
// it inside their disableSnapshot Interactions, so this is the one picture of it — same convention as
// AnswerSheet:Open.
const meta = {
  title: 'features/call-in-substitutes/SubstituteSheet',
  component: SubstituteSheet,
  args: {
    substitute: makeSubstitute('sub-1', 'Jan de Vries', { position: { id: 'pos-libero', label: 'Libero' }, state: 'MAYBE' }),
    setBy: 'Sanne',
    onSetState: fn(),
    onTakeOff: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof SubstituteSheet>

export default meta

type Story = StoryObj<typeof meta>

export const Open: Story = {
  play: async ({ userEvent, args }) => {
    const sheet = within(await within(document.body).findByRole('dialog', { name: 'Jan de Vries' }))
    await expect(sheet.getByText('Substitute · Libero · set by Sanne')).toBeInTheDocument()
    await expect(sheet.getByRole('button', { name: 'Maybe' })).toHaveAttribute('aria-pressed', 'true')
    await expect(sheet.getByRole('button', { name: 'Take off this event' })).toBeInTheDocument()

    // Picking an answer reports the Substitute's id and closes the sheet. `substitute` is a fixed
    // arg, so the sheet stays open for the picture.
    await userEvent.click(sheet.getByRole('button', { name: 'Going' }))
    await expect(args.onSetState).toHaveBeenCalledWith('sub-1', 'ATTENDING')
    await expect(args.onClose).toHaveBeenCalled()
    // The click left focus on the button; its ring would read as a second selection in the picture.
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
