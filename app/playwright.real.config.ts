import { defineConfig, devices } from '@playwright/test'

// Real full-stack e2e: Vite → real backend (:8080, `e2e` profile) → real Postgres/Redis.
// Orchestrated by `make e2e`, which starts infra + the backend health-gated before running this.
//
// Locally you can leave a dev server running (`make app`) and re-run specs against it
// (reuseExistingServer). The dev app talks to the real backend directly — there is no mock
// runtime to disable anymore.
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
  },
})
