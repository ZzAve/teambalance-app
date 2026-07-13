import { defineConfig, devices } from '@playwright/test'

// Real full-stack e2e: Vite (MSW disabled) → real backend (:8080, `e2e` profile) → real Postgres/Redis.
// Orchestrated by `make e2e-real`, which starts infra + the backend health-gated before running this.
//
// Locally you can leave a dev server running and re-run specs against it (reuseExistingServer),
// but it must have been started with MSW disabled — `VITE_DISABLE_MSW=true npm run dev` — or the
// mock worker swallows the API calls this suite exists to make real. (Footgun disappears in the
// demolition phase, when dev-runtime MSW is removed.)
export default defineConfig({
  testDir: './e2e-real',
  forbidOnly: !!process.env.CI,
  // Flake is a P1 bug, not a retry band-aid — no retries in the real suite.
  retries: 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
  },
  projects: [
    // Logs in once via the API and saves storageState (see auth.setup.ts).
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'e2e-real/.auth/user.json' },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { ...process.env, VITE_DISABLE_MSW: 'true' },
  },
})
