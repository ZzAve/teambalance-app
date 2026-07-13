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
}

export default preview
