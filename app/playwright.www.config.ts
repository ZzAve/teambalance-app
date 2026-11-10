import { defineConfig, devices } from '@playwright/test'

// Smoke test for the static landing page in www/ (built by www/build.mjs, served as plain files).
const PORT = 4173

export default defineConfig({
  testDir: './e2e-www',
  retries: 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [
    { name: 'phone-390', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } } },
    { name: 'desktop-1440', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    // The copies make dist/ self-contained until build.mjs copies static files itself.
    command: [
      'node ../www/build.mjs',
      'cp ../www/style.css ../www/landing.js ../www/landing-state.mjs ../www/dist/',
      'mkdir -p ../www/dist/design-tokens',
      'cp ../design-tokens/tokens.css ../www/dist/design-tokens/',
      `python3 -m http.server ${PORT} -d ../www/dist`,
    ].join(' && '),
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
  },
})
