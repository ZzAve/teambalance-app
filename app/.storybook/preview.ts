import type { Preview } from '@storybook/react-vite'
// Global styles (Tailwind + design tokens) so components render with real styling,
// both in the Storybook UI and under the Vitest browser runner.
import '../src/app/styles/global.css'
import { allModes, VIEWPORTS } from './modes'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    // ── Viewport switcher (ADR-0032 §4) ─────────────────────────────────────────────────────────
    // One entry per breakpoint, so any story can be inspected at every width from the toolbar. The
    // widths are the same constants the Chromatic modes use, so what a human sees at "xl" is what
    // Chromatic captures for the `xl` mode.
    viewport: {
      options: Object.fromEntries(
        Object.entries(VIEWPORTS).map(([key, { width, height, type }]) => [
          key,
          { name: `${key} (${width}px)`, type, styles: { width: `${width}px`, height: `${height}px` } },
        ]),
      ),
    },

    // Every story is captured at phone width unless it says otherwise: a story-level `modes` block
    // merges with this one, so a page composite that adds `pageModes` gets xs + xsDark + xl.
    chromatic: { modes: { xs: allModes.xs } },
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
  // whoever's runner took them. A story that wants dark opts in through a mode (see modes.ts), and
  // the toolbar overrides it live. The viewport default is the phone, for the same reason.
  initialGlobals: { theme: 'light', viewport: { value: 'xs', isRotated: false } },
  decorators: [
    (Story, context) => {
      document.documentElement.classList.toggle('dark', context.globals.theme === 'dark')
      return Story()
    },
  ],
}

export default preview
