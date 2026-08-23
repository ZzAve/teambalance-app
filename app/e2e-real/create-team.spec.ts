import { test, expect } from '@playwright/test'

// Real e2e (#158): self-service create-team across the whole seam — browser → API → DB. A teamless,
// authenticated user lands on the /onboarding fork, clicks through to /create-team, enters a creation
// code + name + slug, becomes founding ADMIN, and lands inside their new team. This is the create-team
// seam #154 Slice 3 justified (cross-tenant provisioning + the code gate — not covered by the login or
// attendance flows); it lives here because #158 replaces the throwaway Slice-3 tracer, so the net e2e
// count is unchanged.
//
// Idempotent across warm-DB re-runs: a per-run-unique founder email is always freshly teamless (the
// magic-link verify creates the user), and the seeded code is reset to unconsumed on every backend
// boot (db/e2e/seed.sql). So this spec needs no DB wipe between runs.

const RUN = Date.now()
const FOUNDER_EMAIL = `founder-${RUN}@example.com`
// A per-run-unique team name/slug so a warm DB (with teams from earlier runs) never hits the unique
// slug constraint. suggestSlug lowercases + hyphenates the name, so this is the slug the form fills.
const TEAM_NAME = `E2E Founders ${RUN}`
const EXPECTED_SLUG = `e2e-founders-${RUN}`
const CREATION_CODE = 'E2E-CREATE-TEAM'
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'

// Start unauthenticated — a brand-new, teamless founder — overriding the project-wide storageState.
test.use({ storageState: { cookies: [], origins: [] } })

test('create-team: a teamless founder enters code + name + slug and lands in the new team', async ({
  page,
  request,
}) => {
  // 1. Request a magic link for a brand-new email — verify will create the user teamless.
  await page.goto('/login')
  await page.getByLabel('Email').fill(FOUNDER_EMAIL)
  await page.getByRole('button', { name: 'Send magic link' }).click()
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible()

  const tokenResponse = await request.get(`${BACKEND_URL}/internal/e2e/magic-link-token`, {
    params: { email: FOUNDER_EMAIL },
  })
  expect(tokenResponse.ok()).toBeTruthy()
  const { token } = await tokenResponse.json()

  // 2. Click the emailed link → session established. The has-any-team gate routes the teamless
  //    founder to /onboarding (proving they are NOT bounced to /login by the old teamless-user
  //    behaviour), from where they click through to /create-team — the rare, code-gated path.
  await page.goto(`/auth/verify?token=${token}`)
  await expect(page.getByRole('heading', { name: /Welcome to TeamBalance/ })).toBeVisible({ timeout: 10_000 })
  await page.getByRole('button', { name: 'Create a team' }).click()
  await expect(page.getByRole('heading', { name: 'Create your team' })).toBeVisible()

  // 3. Fill the form — the slug auto-suggests from the name; the code is the seeded creation code.
  await page.getByLabel('Team name').fill(TEAM_NAME)
  await expect(page.getByLabel('Team address')).toHaveValue(EXPECTED_SLUG)
  await page.getByLabel('Creation code').fill(CREATION_CODE)

  // 4. Create → provisions the tenant schema + Flyway migrate in-request (allow for cold start),
  //    makes the founder ADMIN, makes the new team their Active Team, and lands on its roster. The
  //    URL carries the new team's slug (ADR-0023 §2), which is also the proof the Active Team moved.
  await page.getByRole('button', { name: 'Create team' }).click()
  await expect(page).toHaveURL(new RegExp(`/t/${EXPECTED_SLUG}/team/?$`), { timeout: 20_000 })
  await expect(page.getByRole('heading', { name: 'Team' })).toBeVisible()
})
