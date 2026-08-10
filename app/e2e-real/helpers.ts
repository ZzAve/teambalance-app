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

// Several specs open their OWN admin APIRequestContext on the shared STORAGE_STATE session (rather
// than authenticating fresh) to act as the team's admin alongside a separately-authenticated actor.
// The first tenant-scoped call on that session caches the resolved tenant schema as a session
// attribute; Spring Session's JDBC store inserts (not upserts) that attribute, so two such contexts
// racing their first tenant-scoped write on the exact same session id can collide with a transient
// 500. One retry is sufficient: whichever request wins leaves the attribute in place, so the retry
// (or any other concurrent request) becomes a plain update, not a colliding insert.
export async function postAsSharedAdmin(
  context: APIRequestContext,
  url: string,
  options?: Parameters<APIRequestContext['post']>[1],
) {
  const first = await context.post(url, options)
  if (first.status() !== 500) return first
  return context.post(url, options)
}
