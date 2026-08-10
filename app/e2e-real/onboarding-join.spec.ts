import { test, expect, request as playwrightRequest } from '@playwright/test'
import { STORAGE_STATE, postAsSharedAdmin } from './helpers'

// Real e2e: the join-via-paste entry path introduced by the onboarding fork. Seam uniquely covered
// (vs login/attendance/the existing magic-link invite flow): a teamless user lands on /onboarding,
// chooses "I have an invite", pastes a full invite URL (not clicking the link directly) on
// /onboarding/join, and the accept-and-continue wiring carries them onward exactly like the direct
// /invite/$token click-through does.
//
// Idempotent across warm-DB re-runs: a fresh invite is minted every run, and a per-run-unique joiner
// email is always freshly teamless (the magic-link verify creates the user).

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'
const BASE_URL = 'http://localhost:5173'
const RUN = Date.now()
const JOINER_EMAIL = `joiner-${RUN}@example.com`

test.use({ storageState: { cookies: [], origins: [] } })

test('a teamless user joins by pasting an invite link on /onboarding/join', async ({ page, request }) => {
  // 1. As the seeded admin: mint a fresh invite link.
  const admin = await playwrightRequest.newContext({ baseURL: BASE_URL, storageState: STORAGE_STATE })
  const inviteRes = await postAsSharedAdmin(admin, '/api/invitations')
  expect(inviteRes.status()).toBe(201)
  const { token: inviteToken } = await inviteRes.json()
  await admin.dispose()

  // 2. The joiner signs in as a brand-new, teamless user via the ordinary login/magic-link path —
  //    NOT via /invite/$token — so the has-a-team gate sends them to the /onboarding fork.
  await page.goto('/login')
  await page.getByLabel('Email').fill(JOINER_EMAIL)
  await page.getByRole('button', { name: 'Send magic link' }).click()
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible()

  const tokenResponse = await request.get(`${BACKEND_URL}/internal/e2e/magic-link-token`, {
    params: { email: JOINER_EMAIL },
  })
  expect(tokenResponse.ok()).toBeTruthy()
  const { token } = await tokenResponse.json()

  await page.goto(`/auth/verify?token=${token}`)
  await expect(page.getByRole('heading', { name: /Welcome to TeamBalance/ })).toBeVisible({ timeout: 10_000 })

  // 3. Choose the join path and paste the full invite URL (not the bare token).
  await page.getByRole('button', { name: 'I have an invite' }).click()
  await expect(page).toHaveURL(/\/onboarding\/join\/?$/)
  await page.getByLabel('Invite link').fill(`${BASE_URL}/invite/${inviteToken}`)
  await page.getByRole('button', { name: 'Join' }).click()

  // 4. Joining hands them to a team; the onboarding gate then carries the not-yet-onboarded member
  //    on to /get-started — the same landing the direct-click invite flow reaches.
  await expect(page.getByRole('heading', { name: 'Welcome to TeamBalance' })).toBeVisible({ timeout: 10_000 })
  await expect(page).toHaveURL(/\/get-started\/?$/)
})
