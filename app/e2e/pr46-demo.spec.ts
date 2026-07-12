import { test, expect } from '@playwright/test'
import * as fs from 'fs'

// Demo script for PR #46 — runs against the real backend.
// Shows: magic-link login → tenant-resolved events list → attendance update (changedBy).
//
// Run: VITE_DISABLE_MSW=true npx playwright test e2e/pr46-demo.spec.ts --headed
// Requires: backend on :8080, Postgres, /tmp/api-backend.log

const BACKEND_LOG = '/tmp/api-backend.log'
const DEMO_EMAIL = 'jan@example.com'

function extractTokenFromLog(afterByte: number): string {
  const log = fs.readFileSync(BACKEND_LOG, 'utf8')
  const tail = log.slice(afterByte)
  const match = tail.match(/Magic link for[^:]+:\s+token=([A-Za-z0-9_-]+)/)
  if (!match) throw new Error(`Token not found in backend log (searched ${tail.length} new bytes)`)
  return match[1]
}

test.use({
  baseURL: 'http://localhost:5173',
  video: 'on',
  viewport: { width: 390, height: 844 },
  actionTimeout: 8000,
})

test('PR #46 demo — login → events → attendance', async ({ page }) => {
  test.skip(!process.env.VITE_DISABLE_MSW, 'Requires real backend — run with VITE_DISABLE_MSW=true')

  // ── Step 1: Login page ─────────────────────────────────────────────────────
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'TeamBalance' })).toBeVisible()
  await page.waitForTimeout(600)

  // ── Step 2: Request magic link ─────────────────────────────────────────────
  const logSizeBefore = fs.statSync(BACKEND_LOG).size
  await page.getByLabel('Email').fill(DEMO_EMAIL)
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: 'Send magic link' }).click()

  // ── Step 3: Confirmation screen ────────────────────────────────────────────
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible({ timeout: 6000 })
  await page.waitForTimeout(800)

  // ── Step 4: Verify (simulate clicking the email link) ─────────────────────
  await page.waitForTimeout(400)
  const token = extractTokenFromLog(logSizeBefore)
  await page.goto(`/auth/verify?token=${token}`)

  // ── Step 5: Events list — proves session + tenant context resolved ─────────
  await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible({ timeout: 8000 })
  await page.waitForTimeout(1000)

  // ── Step 6: Open an event detail ──────────────────────────────────────────
  const firstCard = page.locator('a[href^="/events/"]').first()
  await expect(firstCard).toBeVisible()
  await firstCard.click()
  const eventTitle = page.getByRole('heading', { level: 1 })
  await expect(eventTitle).toBeVisible({ timeout: 6000 })
  await page.waitForTimeout(800)

  // ── Step 7: Mark attendance ────────────────────────────────────────────────
  // Find our user's attendance toggle and set to ATTENDING
  const attendingBtn = page.getByRole('button', { name: /attending|going|yes/i }).first()
  if (await attendingBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await attendingBtn.click()
    await page.waitForTimeout(600)
  }

  // ── Step 8: Linger on the result ──────────────────────────────────────────
  await page.waitForTimeout(1200)
})
