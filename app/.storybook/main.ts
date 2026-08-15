import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-vitest'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // Storybook's Vite builder loads the app's vite.config.ts, which registers vite-plugin-pwa (F2).
  // A component catalog must not ship a service worker:
  //   - `build-storybook` fails outright — workbox refuses to precache Storybook's >2 MB manager
  //     runtime;
  //   - the emitted registerSW.js would register /sw.js at scope "/" on storybook.teambalance.nl,
  //     so one visit to the canonical Storybook would take over every PR preview on that origin
  //     (they share it under /pr-preview/pr-<n>/) and serve them the wrong shell.
  // The SPA build is the only place the PWA plugin belongs, so strip it here.
  viteFinal: async (viteConfig) => {
    const plugins = await Promise.all(((viteConfig.plugins ?? []) as unknown[]).flat(Infinity))
    return {
      ...viteConfig,
      plugins: plugins.filter(
        (plugin) => !(plugin as { name?: string } | null)?.name?.startsWith('vite-plugin-pwa'),
      ) as typeof viteConfig.plugins,
    }
  },
}

export default config
