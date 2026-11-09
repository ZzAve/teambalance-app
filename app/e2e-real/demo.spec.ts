import { test, expect } from '@playwright/test'

// Real e2e: the demo guest login (ADR-0043) - browser -> API -> DB, with no prior session.
// Seams uniquely covered: the unauthenticated session-creating endpoint, the tenant pin it sets
// (the guest lands in the seeded demo team without any membership choice) and a tenant-schema write.
//
// The team is seeded by the backend's `e2e` profile (teambalance.demo.enabled in application-e2e.yml).
// Mutation-tolerant like attendance.spec.ts: asserts a transition, so re-runs on a warm DB stay green.

test.use({ storageState: { cookies: [], origins: [] } })

test('demo guest login: /demo -> Sanne -> answer Going -> the answer persists', async ({ page }) => {
  await page.goto('/demo')
  // No one is signed in on the picker (or the top-up page): no tab bar.
  await expect(page.getByRole('button', { name: 'Play as Sanne (player)' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Profile' })).toHaveCount(0)
  await page.goto('/demo-top-up')
  await expect(page.getByRole('link', { name: 'Profile' })).toHaveCount(0)
  await page.goto('/demo')
  await page.getByRole('button', { name: 'Play as Sanne (player)' }).click()

  await expect(page).toHaveURL(/\/t\/de-smashers/, { timeout: 10_000 })
  await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible()

  await page.getByRole('link', { name: 'Training' }).first().click()
  const response = page.getByRole('group', { name: 'Your response' })
  const going = response.getByRole('button', { name: 'Going', exact: true })
  const maybe = response.getByRole('button', { name: 'Maybe', exact: true })
  await expect(going).toBeVisible()

  const goingIsActive = (await going.getAttribute('aria-pressed')) === 'true'
  const target = goingIsActive ? maybe : going
  const targetName = goingIsActive ? 'Maybe' : 'Going'
  await target.click()
  await expect(target).toHaveAttribute('aria-pressed', 'true')

  await page.reload()
  await expect(
    page.getByRole('group', { name: 'Your response' }).getByRole('button', { name: targetName, exact: true }),
  ).toHaveAttribute('aria-pressed', 'true', { timeout: 10_000 })

  // The seeded Bunq connection reads the fake Bunq.
  await page.goto('/t/de-smashers/money')
  await expect(page.getByText('87.00')).toBeVisible()

  // The banner's role switch ends the session and lands on the picker; a protected page then bounces to /demo, not /login.
  await expect(page.getByRole('complementary', { name: 'Demo' })).toContainText('data is wiped every hour')
  await page.getByRole('button', { name: 'Switch role' }).click()
  await expect(page).toHaveURL(/\/demo$/, { timeout: 10_000 })
  await expect(page.getByRole('button', { name: 'Play as Kees (coach)' })).toBeVisible()
  await page.goto('/t/de-smashers/events')
  await expect(page).toHaveURL(/\/demo$/, { timeout: 10_000 })
  // The magic-link screen is never shown in the demo build.
  await page.goto('/login')
  await expect(page).toHaveURL(/\/demo$/, { timeout: 10_000 })
})

// Last in the file on purpose: the reset drops the whole database, `team_test` and the other specs' sessions
// included. The `demo` project therefore runs after the `chromium` project (playwright.real.config.ts).
// The backend clock moves through the e2e-only hook; the reset runs inside the next guest login.
test('demo reset: after an hour the next guest login finds the answer gone', async ({ page, request }) => {
  const backend = process.env.BACKEND_URL ?? 'http://localhost:8080'
  await page.goto('/demo')
  await page.getByRole('button', { name: 'Play as Sanne (player)' }).click()
  await expect(page).toHaveURL(/\/t\/de-smashers/, { timeout: 10_000 })
  await page.getByRole('link', { name: 'Training' }).first().click()
  const response = page.getByRole('group', { name: 'Your response' })
  const going = response.getByRole('button', { name: 'Going', exact: true })
  await going.click()
  await expect(going).toHaveAttribute('aria-pressed', 'true')

  await page.getByRole('button', { name: 'Switch role' }).click()
  await expect(page).toHaveURL(/\/demo$/, { timeout: 10_000 })

  try {
    expect((await request.get(`${backend}/internal/e2e/clock/advance?hours=2`)).status()).toBe(204)
    await page.getByRole('button', { name: 'Play as Sanne (player)' }).click()
    await expect(page).toHaveURL(/\/t\/de-smashers/, { timeout: 15_000 })
    await page.getByRole('link', { name: 'Training' }).first().click()
    await expect(going).toBeVisible()
    await expect(going).toHaveAttribute('aria-pressed', 'false')
    await expect(response.getByRole('button', { name: 'Maybe', exact: true })).toHaveAttribute('aria-pressed', 'false')
  } finally {
    await request.get(`${backend}/internal/e2e/clock/back`)
  }
})
