import { defineConfig, mergeConfig } from 'vitest/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { playwright } from '@vitest/browser-playwright'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import viteConfig from './vite.config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// One Vitest run, two projects:
//  - `unit`      : pure-logic units in jsdom (mappers, adapters, stores)
//  - `storybook` : every *.stories.tsx rendered + asserted in a headless browser
// `make test-app` (npm test -> vitest run) executes both in a single process.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            environment: 'jsdom',
            globals: true,
            setupFiles: ['./src/test/setup.ts'],
            include: ['src/**/*.test.{ts,tsx}'],
          },
        },
        {
          extends: true,
          plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              headless: true,
              provider: playwright(),
              instances: [{ browser: 'chromium' }],
            },
            // Preview annotations (global styles/decorators from .storybook/preview.ts)
            // are applied automatically by @storybook/addon-vitest since Storybook 10.3.
          },
        },
      ],
    },
  }),
)
