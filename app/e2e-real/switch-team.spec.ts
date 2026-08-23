import { test, expect, request as playwrightRequest, type Page } from '@playwright/test'
import { STORAGE_STATE, postAsSharedAdmin } from './helpers'

// Real e2e: multi-Team membership and switching (ADR-0023). Justified under the PR gate as a new
// cross-tenant seam — every other spec runs as a caller with exactly one Team, where tenant
// resolution has only one possible answer.
//
// Idempotent across warm-DB re-runs: the joiner email is per-run unique (so always freshly teamless)
// and fresh invites are minted for both Teams every run.

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'
const BASE_URL = 'http://localhost:5173'
const RUN = Date.now()
const JOINER_EMAIL = `switcher-${RUN}@example.com`
const JOINER_NAME = `Switcher ${RUN}`
const SECOND_ADMIN_EMAIL = 'e2e-second@example.com'

const FIRST = { name: 'E2E Test Team', slug: 'e2e-test-team', event: 'E2E Training' }
const SECOND = { name: 'E2E Second Team', slug: 'e2e-second-team', event: 'E2E Second Team Match' }

test.use({ storageState: { cookies: [], origins: [] } })

/** Onboarding is per-Team (`team_members.onboarded_at`), so this runs once per Team entered. */
async function onboardInto(page: Page, slug: string, position?: string) {
  await expect(page).toHaveURL(new RegExp(`/t/${slug}/get-started`), { timeout: 15_000 })
  await expect(page.getByRole('heading', { name: 'Welcome to TeamBalance' })).toBeVisible()
  await page.getByLabel('Display name').fill(JOINER_NAME)
  if (position) {
    await page.getByRole('combobox', { name: 'Position' }).click()
    await page.getByRole('option', { name: position }).click()
  }
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page).toHaveURL(new RegExp(`/t/${slug}/?$`), { timeout: 15_000 })
}

/** Signs an email in over the API and returns a request context carrying that session. */
async function signIn(email: string) {
  const context = await playwrightRequest.newContext({ baseURL: BASE_URL })
  expect((await context.post('/api/auth/magic-link/request', { data: { email } })).status()).toBe(202)
  const tokenResponse = await context.get(`${BACKEND_URL}/internal/e2e/magic-link-token`, {
    params: { email },
  })
  expect(tokenResponse.ok()).toBeTruthy()
  const { token } = await tokenResponse.json()
  expect((await context.post('/api/auth/magic-link/verify', { data: { token } })).ok()).toBeTruthy()
  return context
}

test('a member of two teams switches, and the tenant data follows', async ({ page }) => {
  // 1. As each Team's own admin: ensure a Position exists (onboarding requires one when the Team has
  //    any, and this spec must not depend on another spec creating it) and mint a fresh invite.
  const firstAdmin = await playwrightRequest.newContext({ baseURL: BASE_URL, storageState: STORAGE_STATE })
  expect([201, 409]).toContain((await postAsSharedAdmin(firstAdmin, '/api/positions', { data: { label: 'Setter' } })).status())
  const firstInvite = await postAsSharedAdmin(firstAdmin, '/api/invitations')
  expect(firstInvite.status()).toBe(201)
  const { token: firstInviteToken } = await firstInvite.json()
  await firstAdmin.dispose()

  const secondAdmin = await signIn(SECOND_ADMIN_EMAIL)
  const secondInvite = await secondAdmin.post('/api/invitations')
  expect(secondInvite.status()).toBe(201)
  const { token: secondInviteToken } = await secondInvite.json()
  await secondAdmin.dispose()

  // 2. A brand-new user joins the FIRST Team through the ordinary invite → magic-link flow.
  await page.goto(`/invite/${firstInviteToken}`)
  await page.getByLabel('Email').fill(JOINER_EMAIL)
  await page.getByRole('button', { name: 'Send magic link' }).click()
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible()

  const tokenResponse = await page.request.get(`${BACKEND_URL}/internal/e2e/magic-link-token`, {
    params: { email: JOINER_EMAIL },
  })
  expect(tokenResponse.ok()).toBeTruthy()
  const { token } = await tokenResponse.json()
  await page.goto(`/auth/verify?token=${token}`)

  await onboardInto(page, FIRST.slug, 'Setter')

  // They land inside the first Team: the slug is in the URL, and the events are that Team's.
  await expect(page).toHaveURL(new RegExp(`/t/${FIRST.slug}/?$`), { timeout: 15_000 })
  await expect(page.getByText(FIRST.event).first()).toBeVisible({ timeout: 15_000 })

  // 3. Accept the SECOND Team's invite while already in a Team: two team_members rows for one user,
  //    and the joined Team becomes Active.
  await page.goto(`/invite/${secondInviteToken}`)
  // Onboarding is per-Team, so the second Team's own get-started runs here.
  await onboardInto(page, SECOND.slug)

  // The tenant followed: the second Team's event is here, the first Team's is not.
  await expect(page.getByText(SECOND.event).first()).toBeVisible({ timeout: 15_000 })
  await expect(page.getByText(FIRST.event)).toHaveCount(0)

  // 4. Switch back through the switcher, which names the Team it is in (ADR-0023 §3).
  await page.getByRole('button', { name: new RegExp(`Current team: ${SECOND.name}`) }).click()
  await page.getByRole('option', { name: new RegExp(FIRST.name) }).click()

  await expect(page).toHaveURL(new RegExp(`/t/${FIRST.slug}/?$`), { timeout: 15_000 })
  await expect(page.getByText(FIRST.event).first()).toBeVisible({ timeout: 15_000 })
  await expect(page.getByText(SECOND.event)).toHaveCount(0)

  // 5. Remembered across a full page load: `/` re-resolves the Active Team from the server.
  await page.goto('/')
  await expect(page).toHaveURL(new RegExp(`/t/${FIRST.slug}/?$`), { timeout: 15_000 })
  await expect(page.getByText(FIRST.event).first()).toBeVisible({ timeout: 15_000 })
})
