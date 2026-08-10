import { test, expect, request as playwrightRequest } from '@playwright/test'
import { STORAGE_STATE } from './helpers'

// Real e2e: a freshly-invited user completes onboarding — the seam this slice introduces.
// Seam uniquely covered (vs login/attendance/invite): a member with onboarded=false is routed to
// /get-started before any app screen, completes the one-time profile flow, is stamped onboarded, and
// only then reaches the events home. Spans browser → API → DB across a brand-new identity.
//
// The seeded admin (STORAGE_STATE) sets up the invite + a team position over the API; the newbie
// drives the actual onboarding through the UI on an unauthenticated browser.

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'
const BASE_URL = 'http://localhost:5173'
// A unique run id keys BOTH the email and the display name so the flow always exercises a FRESH,
// not-yet-onboarded user — otherwise a warm local DB carries a previous run's now-onboarded user
// past the /get-started gate (email), or trips the per-team display-name uniqueness check (name).
const RUN_ID = Date.now()
const NEWBIE_EMAIL = `newbie-${RUN_ID}@example.com`
const NEWBIE_NAME = `Newbie ${RUN_ID}`

// The newbie browser starts with no session — this spec IS the join+onboard flow.
test.use({ storageState: { cookies: [], origins: [] } })

test('an invited user is routed through /get-started and lands on events once onboarded', async ({ page }) => {
  // 1. As the seeded admin (separate API context, its own session): ensure the team has a position
  //    so the required-when-available picker has an option, then mint an invite link.
  const admin = await playwrightRequest.newContext({ baseURL: BASE_URL, storageState: STORAGE_STATE })
  const positionRes = await admin.post('/api/positions', { data: { label: 'Setter' } })
  // 201 on first run, 409 if a prior run already created it — both leave the team with a position.
  expect([201, 409]).toContain(positionRes.status())
  const inviteRes = await admin.post('/api/invitations')
  expect(inviteRes.status()).toBe(201)
  const { token: inviteToken } = await inviteRes.json()
  await admin.dispose()

  // 2. The newbie opens the invite link and requests a magic link with a fresh email.
  await page.goto(`/invite/${inviteToken}`)
  await page.getByLabel('Email').fill(NEWBIE_EMAIL)
  await page.getByRole('button', { name: 'Send magic link' }).click()
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible()

  // 3. Fetch the plaintext token the backend just generated for the newbie.
  const tokenResponse = await page.request.get(`${BACKEND_URL}/internal/e2e/magic-link-token`, {
    params: { email: NEWBIE_EMAIL },
  })
  expect(tokenResponse.ok()).toBeTruthy()
  const { token } = await tokenResponse.json()

  // 4. Click the emailed link → verify creates the user, accepts the pending invite, then the app
  //    tries home — but the onboarding gate bounces the not-yet-onboarded member to /get-started.
  await page.goto(`/auth/verify?token=${token}`)
  await expect(page.getByRole('heading', { name: 'Welcome to TeamBalance' })).toBeVisible({ timeout: 10_000 })

  // 5. Complete onboarding: set a display name and pick a position (required-when-available).
  await page.getByLabel('Display name').fill(NEWBIE_NAME)
  await page.getByRole('combobox', { name: 'Position' }).click()
  await page.getByRole('option', { name: 'Setter' }).click()
  await page.getByRole('button', { name: 'Save' }).click()

  // 6. Onboarded members land on the events home — the gate no longer bounces them.
  await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible({ timeout: 10_000 })

  // 7. And the persisted state agrees: /members/me now reports onboarded.
  const me = await page.request.get('/api/members/me')
  expect(me.ok()).toBeTruthy()
  const member = await me.json()
  expect(member.onboarded).toBe(true)
  expect(member.displayName).toBe(NEWBIE_NAME)
})
