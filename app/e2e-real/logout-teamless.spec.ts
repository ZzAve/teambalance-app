import { test, expect } from '@playwright/test'

// Real e2e (ADR-0027, Slice 4): log out from a TEAMLESS session — the one logout seam the login and
// attendance flows never exercise, so it earns a single new flow (ADR-0017's bar).
//
// Before ADR-0027, Log out lived on `/t/:slug/profile`, reachable only once the URL carried a team
// slug — so a teamless (or mid-onboarding) user had no way out. This proves the gap is closed: the
// BottomNav Profile tab points at the team-independent `/account` even with no team, and Log out there
// tears the session down server-side. Spans browser → API → DB: verify creates a brand-new teamless
// user, `/account` renders without a tenant, and `/auth/me` stops resolving after logout.
//
// The existing onboarded-user logout (auth-guard.spec.ts) reaches Events first; this one never does.

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'
// A per-run-unique email so the magic-link verify always creates a FRESH, teamless user — a warm DB
// never carries a prior run's now-onboarded or team-joined identity past the has-any-team gate.
const RUN = Date.now()
const TEAMLESS_EMAIL = `logout-teamless-${RUN}@example.com`

// Start unauthenticated — this spec mints its own throwaway teamless session, overriding the
// project-wide storageState.
test.use({ storageState: { cookies: [], origins: [] } })

test('log out from a teamless session returns to login and ends the session', async ({ page, request }) => {
  // 1. Sign in a brand-new email → verify will create the user teamless (no invite, no team).
  await page.goto('/login')
  await page.getByLabel('Email').fill(TEAMLESS_EMAIL)
  await page.getByRole('button', { name: 'Send magic link' }).click()
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible()

  const tokenResponse = await request.get(`${BACKEND_URL}/internal/e2e/magic-link-token`, {
    params: { email: TEAMLESS_EMAIL },
  })
  expect(tokenResponse.ok()).toBeTruthy()
  const { token } = await tokenResponse.json()

  // 2. Click the emailed link → the has-any-team gate parks the teamless user on /onboarding (they
  //    are NOT bounced to /login — the teamless session is valid, it just has no team yet).
  await page.goto(`/auth/verify?token=${token}`)
  await expect(page.getByRole('heading', { name: /Welcome to TeamBalance/ })).toBeVisible({ timeout: 10_000 })

  // 3. The BottomNav Profile tab points at the team-independent /account even with no team (ADR-0027
  //    §1), so Log out is reachable from this teamless state — the gap this ADR closes.
  await page.getByRole('link', { name: 'Profile' }).click()
  await expect(page).toHaveURL('/account')

  // 4. Log out → a clean server-side teardown, then a hard-redirect to /login.
  await page.getByRole('button', { name: 'Log out' }).click()
  await expect(page).toHaveURL('/login')
  await expect(page.getByRole('heading', { name: 'TeamBalance' })).toBeVisible()

  // 5. The session is gone server-side: /auth/me no longer resolves to a user.
  const me = await page.request.get('/api/auth/me')
  expect(me.status()).toBe(401)
})
