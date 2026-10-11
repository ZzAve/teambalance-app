import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { AnswerSheet, type AnswerTarget } from './AnswerSheet'

// The one way to change anyone's answer (both the lineup panel and the attendee list open this same
// sheet) — see AnswerSheet's own doc comment. Prop-only, driven entirely by `target`: null closes it,
// so there is no interesting closed picture to show. One snapshotted story (ADR-0032 §1): the open
// sheet is a frame no composite shows on its own — EventDetailView and EventsPageView only ever catch
// it mid-interaction, disableSnapshot — so it keeps this one picture, same convention as
// TeamSwitcherView:MenuOpen and PanelViewMenu:MenuOpen.
const TARGET: AnswerTarget = {
  userId: 'u-4',
  displayName: 'Sofia',
  state: 'MAYBE',
  isSelf: false,
  position: 'Middle',
}

const meta = {
  title: 'features/attendance-toggle/AnswerSheet',
  component: AnswerSheet,
  args: { target: TARGET, onRespond: fn(), onClose: fn() },
} satisfies Meta<typeof AnswerSheet>

export default meta

type Story = StoryObj<typeof meta>

export const Open: Story = {
  play: async ({ userEvent, args }) => {
    // The sheet is a portal: queried from the document, not the canvas (same as EventDetailView and
    // EventLineupPanel's Interactions).
    const sheet = within(await within(document.body).findByRole('dialog'))
    await expect(sheet.getByText('Sofia')).toBeInTheDocument()
    // A teammate's row, not the viewer's own: the sheet says so plainly (ADR-0003).
    await expect(sheet.getByText('Middle · currently maybe · you are answering for them')).toBeInTheDocument()
    await expect(sheet.getByRole('button', { name: 'Maybe' })).toHaveAttribute('aria-pressed', 'true')

    // Picking an option reports the *target* member's id, never the viewer's, and closes the sheet.
    await userEvent.click(sheet.getByRole('button', { name: "Can't" }))
    await expect(args.onRespond).toHaveBeenCalledWith('u-4', 'ABSENT')
    await expect(args.onClose).toHaveBeenCalled()
    // The click left focus on the button; its ring would read as a second selection in the picture.
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
