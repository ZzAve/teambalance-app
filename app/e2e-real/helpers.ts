import { type APIRequestContext, expect } from '@playwright/test'

const TEST_EMAIL = 'e2e@example.com'
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'

// The shared authenticated session other authed specs reuse.
export const STORAGE_STATE = 'e2e-real/.auth/user.json'
// A separate, disposable session for the logout spec: logging it out invalidates only THIS
// session server-side, never the shared one above. Both are minted in the serial setup phase
// (auth.setup.ts), so neither races the other — nor login.spec.ts — for the single seeded
// user's magic-link token (the recorder keeps only the last token per email).
export const STORAGE_STATE_LOGOUT = 'e2e-real/.auth/logout-user.json'

// Logs the seeded e2e user in over the API, leaving the session cookie on `request` so the
// caller can persist it as storageState. The plaintext token is fetched from the e2e-profile
// support endpoint (the DB stores only the SHA-256 hash).
export async function authenticateViaApi(request: APIRequestContext): Promise<void> {
  const requested = await request.post('/api/auth/magic-link/request', { data: { email: TEST_EMAIL } })
  expect(requested.status()).toBe(202)

  const tokenResponse = await request.get(`${BACKEND_URL}/internal/e2e/magic-link-token`, {
    params: { email: TEST_EMAIL },
  })
  expect(tokenResponse.ok()).toBeTruthy()
  const { token } = await tokenResponse.json()

  const verified = await request.post('/api/auth/magic-link/verify', { data: { token } })
  expect(verified.ok()).toBeTruthy()
}
