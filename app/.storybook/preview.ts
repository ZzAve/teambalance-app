import type { Preview } from '@storybook/react-vite'
// Global styles (Tailwind + design tokens) so components render with real styling,
// both in the Storybook UI and under the Vitest browser runner.
import '../src/app/styles/global.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  // ── Theme switcher (F11, #159) ──────────────────────────────────────────────────────────────
  // A toolbar control that flips the whole preview between the light and dark token layers, so any
  // component can be inspected in either theme without a story per theme. It drives the *same*
  // mechanism the app does — the `.dark` class on the preview document's root element — rather than
  // a Storybook-only background swap, so what you see here is what the app renders: utilities,
  // inline `var(--color-…)` styles and the body ground all re-point together.
  globalTypes: {
    theme: {
      description: 'Render the light or the dark token layer',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  // Light on purpose, rather than following the machine's OS preference: Chromatic snapshots a
  // story at its effective globals, so a system-dependent default would make baselines depend on
  // whoever's runner took them. A story that wants dark opts in explicitly with
  // `globals: { theme: 'dark' }` (see features/theme-toggle), and the toolbar overrides it live.
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => {
      document.documentElement.classList.toggle('dark', context.globals.theme === 'dark')
      return Story()
    },
  ],
}

export default preview
