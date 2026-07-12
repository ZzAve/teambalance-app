import { test, expect } from '@playwright/test'
import * as fs from 'fs'

// End-to-end demo of the real magic-link login flow — hits the actual backend.
// Run with: VITE_DISABLE_MSW=true npx playwright test e2e/magic-link-real.spec.ts --headed
//
// Requires: backend on :8080 (logging to /tmp/api-backend.log), Postgres on :5432.
// Token is extracted from the backend's ConsoleEmailSender log entry because
// the DB only stores the SHA-256 hash, not the plaintext token.

const BACKEND_LOG = '/tmp/api-backend.log'
const TEST_EMAIL = 'jan@example.com'

function extractTokenFromLog(afterByte: number): string {
  const log = fs.readFileSync(BACKEND_LOG, 'utf8')
  const tail = log.slice(afterByte)
  const match = tail.match(/Magic link for[^:]+:\s+token=([A-Za-z0-9_-]+)/)
  if (!match) throw new Error(`Token not found in backend log (searched ${tail.length} new bytes)`)
  return match[1]
}

test.use({ baseURL: 'http://localhost:5173', video: 'on', viewport: { width: 390, height: 844 } })

test('magic-link login flow — real backend', async ({ page }) => {
  test.skip(!process.env.VITE_DISABLE_MSW, 'Requires real backend — run with VITE_DISABLE_MSW=true')
  // Record log position before the request so we only scan new output.
  const logSizeBefore = fs.statSync(BACKEND_LOG).size

  // 1. Navigate to login
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'TeamBalance' })).toBeVisible()

  // 2. Enter email and request the magic link
  await page.getByLabel('Email').fill(TEST_EMAIL)
  await page.getByRole('button', { name: 'Send magic link' }).click()

  // 3. Confirmation screen
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible({ timeout: 5000 })

  // 4. Extract token from the backend log (ConsoleEmailSender logged it)
  await page.waitForTimeout(300)
  const token = extractTokenFromLog(logSizeBefore)

  // 5. Simulate clicking the link in the email → verify route
  await page.goto(`/auth/verify?token=${token}`)

  // 6. Successful verify redirects to the events list
  await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible({ timeout: 8000 })
})
