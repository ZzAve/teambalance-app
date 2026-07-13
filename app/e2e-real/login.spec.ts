import { test, expect } from '@playwright/test'

// Real e2e: login via magic link across the whole seam — browser → API → DB.
// Seam coverage: auth handshake (request → verify), session cookie, tenant-schema resolution.
//
// The user is seeded by the backend's `e2e` profile (db/e2e/seed.sql); the plaintext token is
// fetched from the e2e-profile-only support endpoint (the DB stores only the SHA-256 hash).

const TEST_EMAIL = 'e2e@example.com'
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'

// This spec IS the login flow — start unauthenticated, overriding the project-wide storageState.
test.use({ storageState: { cookies: [], origins: [] } })

test('magic-link login: request → verify → lands on events', async ({ page, request }) => {
  // 1. Request a magic link from the login page
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'TeamBalance' })).toBeVisible()
  await page.getByLabel('Email').fill(TEST_EMAIL)
  await page.getByRole('button', { name: 'Send magic link' }).click()
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible()

  // 2. Fetch the plaintext token the backend just generated (recorded at send time)
  const tokenResponse = await request.get(`${BACKEND_URL}/internal/e2e/magic-link-token`, {
    params: { email: TEST_EMAIL },
  })
  expect(tokenResponse.ok()).toBeTruthy()
  const { token } = await tokenResponse.json()

  // 3. Simulate clicking the emailed link → verify establishes the session
  await page.goto(`/auth/verify?token=${token}`)

  // 4. Verified session lands on the events list (tenant schema resolved from membership)
  await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible({ timeout: 10_000 })
})
