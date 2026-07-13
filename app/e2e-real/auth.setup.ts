import { test as setup, expect } from '@playwright/test'

const TEST_EMAIL = 'e2e@example.com'
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'

// Where the authenticated session is saved; the chromium project points storageState here.
export const STORAGE_STATE = 'e2e-real/.auth/user.json'

// Logs in ONCE via the API and saves the session as storageState, so authed specs skip the
// login UI (which login.spec.ts already covers). The request/verify calls go through the
// Vite origin (baseURL + /api proxy) so the session cookie lands on the frontend origin the
// browser will use; only the token fetch talks to the backend directly.
setup('authenticate as the seeded e2e user', async ({ request }) => {
  const requested = await request.post('/api/auth/magic-link/request', {
    data: { email: TEST_EMAIL },
  })
  expect(requested.status()).toBe(202)

  const tokenResponse = await request.get(`${BACKEND_URL}/internal/e2e/magic-link-token`, {
    params: { email: TEST_EMAIL },
  })
  expect(tokenResponse.ok()).toBeTruthy()
  const { token } = await tokenResponse.json()

  const verified = await request.post('/api/auth/magic-link/verify', { data: { token } })
  expect(verified.ok()).toBeTruthy()

  await request.storageState({ path: STORAGE_STATE })
})
