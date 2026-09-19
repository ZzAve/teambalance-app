import type { Decorator } from '@storybook/react-vite'
import { APP_COLUMN } from '@shared/ui/AppShellFrame'

/**
 * Hosts a story in the app's centred content column (ADR-0032 §4). A component that is `w-full`
 * inside a card has no width of its own: what it gets is the column's. Without this, a story's
 * ad-hoc `max-w-*` wrapper caps the picture at an arbitrary width and the viewport switcher has
 * nothing to show; with it, xs renders the phone width and md and up render the column's real cap
 * (`max-w-2xl`), which is as wide as the product ever draws the component.
 *
 * Spread `appColumn` into the meta rather than listing the decorator alone: it also switches the
 * story to Storybook's `fullscreen` layout, dropping the preview's own 1rem root padding so the
 * column's edge padding is the only one — the same 16px the app's main column has, not 32.
 */
export const withAppColumn: Decorator = (Story) => (
  <div className={`${APP_COLUMN} py-4`}>
    <Story />
  </div>
)

export const appColumn = {
  decorators: [withAppColumn] as Decorator[],
  parameters: { layout: 'fullscreen' },
}

/**
 * Hosts a story in the width a dialog gives its content: the shadcn `DialogContent` is `w-full
 * max-w-lg p-6`, so a dialog child is 312px wide on a phone and 464px from `sm` up, never the app
 * column. For the prop-only content of a dialog (a scope field, a form) this is the honest host.
 */
export const withDialogContent: Decorator = (Story) => (
  <div className="mx-auto w-full max-w-lg p-6">
    <Story />
  </div>
)

export const appDialog = {
  decorators: [withDialogContent] as Decorator[],
  parameters: { layout: 'fullscreen' },
}
