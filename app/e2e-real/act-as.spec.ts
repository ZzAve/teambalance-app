import { test, expect, request as playwrightRequest, type Page } from '@playwright/test'
import { STORAGE_STATE } from './helpers'

/**
 * Real e2e: **Act-as** (ADR-0024) — a Platform Admin enters a Team they are a Member of nothing in,
 * writes inside it, and leaves.
 *
 * Justified under the PR gate as a genuinely new seam: a **cross-tenant write by a caller with no
 * membership at all**. The login and attendance flows only ever exercise callers writing inside a
 * team they belong to, and the switch-team flow only exercises picking between memberships — neither
 * can reach a tenant the caller has no row for.
 *
 * Idempotent across warm-DB re-runs: the Position label is per-run unique and deleted at the end, and
 * the seed fixture closes any act-as episode a previous run left open.
 */

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'
const RUN = Date.now()
const PLATFORM_EMAIL = 'platform@example.com'
const OPERATOR_NAME = 'E2E Platform Operator'
const TEAM = { name: 'E2E Test Team', slug: 'e2e-test-team' }
const POSITION = `Platform Curated ${RUN}`

test.use({ storageState: { cookies: [], origins: [] } })

/** Signs an email in through the real magic-link flow, leaving the session on `page`. */
async function signIn(page: Page, email: string) {
  const requested = await page.request.post('/api/auth/magic-link/request', { data: { email } })
  expect(requested.status()).toBe(202)
  const tokenResponse = await page.request.get(`${BACKEND_URL}/internal/e2e/magic-link-token`, { params: { email } })
  expect(tokenResponse.ok()).toBeTruthy()
  const { token } = await tokenResponse.json()
  await page.goto(`/auth/verify?token=${token}`)
}

test('a Platform Admin enters a team, writes in it, and leaves without ever joining it', async ({ page }) => {
  // 1. Signing in teamless lands on the console, not on onboarding — the route gate's third branch.
  //    A Platform Admin has nothing to onboard into: they are staff, not a player (ADR-0024 §3).
  await signIn(page, PLATFORM_EMAIL)
  await expect(page).toHaveURL(/\/admin\/teams/, { timeout: 15_000 })
  await expect(page.getByRole('heading', { name: 'Teams' })).toBeVisible()

  // 2. The console lists every team, including ones nobody on the platform staff belongs to.
  const teamRow = page.getByRole('listitem').filter({ hasText: TEAM.name })
  await expect(teamRow).toBeVisible()
  await teamRow.getByRole('button', { name: 'Enter' }).click()

  // 3. Inside: the banner NAMES the team. That name is the guard against prepping a season into the
  //    wrong one of twelve near-identically-named squads (ADR-0024 §4).
  await expect(page).toHaveURL(new RegExp(`/t/${TEAM.slug}`), { timeout: 15_000 })
  await expect(page.getByRole('status', { name: 'Acting as the platform' })).toContainText(TEAM.name)

  // 4. Write, as an Admin of a team we are not in: curating Positions is admin-only, so this is the
  //    Virtual Member doing real work (ADR-0024 §1).
  await page.goto(`/t/${TEAM.slug}/team/settings`)
  await page.getByLabel('New position label').fill(POSITION)
  await page.getByRole('button', { name: 'Add', exact: true }).click()
  // The curated list renders each label in an editable field, so assert the value, not the text.
  await expect(page.getByLabel(`Label for ${POSITION}`)).toHaveValue(POSITION, { timeout: 15_000 })

  // 5. No membership was created on the way in: the roster does not list the operator — so neither
  //    does the attendance denominator, the Position breakdown, or the Hall of Shame (ADR-0024 §2).
  await page.goto(`/t/${TEAM.slug}/team`)
  await expect(page.getByText('E2E Tester')).toBeVisible({ timeout: 15_000 })
  await expect(page.getByText(OPERATOR_NAME)).toHaveCount(0)

  // 6. ...and the team's Admins can see the platform was here, attributed generically (ADR-0024 §4).
  //    The record lives on the Admin-only settings page, collapsed until asked for.
  await page.goto(`/t/${TEAM.slug}/team/settings`)
  const platformAccess = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Platform access' }) })
  await expect(platformAccess).toBeVisible({ timeout: 15_000 })
  await platformAccess.getByRole('button', { name: /The TeamBalance owner worked here/ }).click()
  // .first(): a warm DB carries earlier episodes, and this asserts the platform is IN the record,
  // not how many times it has been here.
  await expect(platformAccess.getByText('The TeamBalance owner worked in your team').first()).toBeVisible()
  await expect(platformAccess.getByText(OPERATOR_NAME)).toHaveCount(0)

  // 7. Exit: one click, and the banner is gone.
  await page.getByRole('button', { name: 'Exit' }).click()
  await expect(page).toHaveURL(/\/admin\/teams/, { timeout: 15_000 })
  await expect(page.getByRole('status', { name: 'Acting as the platform' })).toHaveCount(0)

  // 8. The write landed in THAT tenant, and is the team's now: its own admin sees the Position, and
  //    still does not see the operator on the roster.
  const teamAdmin = await playwrightRequest.newContext({ baseURL: 'http://localhost:5173', storageState: STORAGE_STATE })
  const positions = await teamAdmin.get('/api/positions')
  expect(positions.ok()).toBeTruthy()
  const curated: { id: string; label: string }[] = (await positions.json()).positions
  expect(curated.map((p) => p.label)).toContain(POSITION)

  const members = await teamAdmin.get('/api/members')
  expect(members.ok()).toBeTruthy()
  const names = (await members.json()).members.map((m: { displayName: string }) => m.displayName)
  expect(names).not.toContain(OPERATOR_NAME)

  // Leave the shared team as we found it, so warm-DB re-runs don't accumulate positions.
  const created = curated.find((p) => p.label === POSITION)!
  expect((await teamAdmin.delete(`/api/positions/${created.id}`)).status()).toBe(204)
  await teamAdmin.dispose()
})
