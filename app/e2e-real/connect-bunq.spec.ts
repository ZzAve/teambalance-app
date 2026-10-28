import { test, expect, type Page } from '@playwright/test'
import { authenticateViaApi, csrfHeader } from './helpers'

// Real e2e: the Money pool through Bunq (ADR-0042) — an Admin connects the team through the fake Bunq
// authorize page, picks the account and disconnects, and a member reads the pool in between.
//
// Seam uniquely covered: a new external integration. The Admin's browser leaves the SPA for Bunq and
// comes back through the API's OAuth callback (a cross-tenant write keyed by a single-use state, not by
// the session's team), and the pool is read only after the pick. The fake page stands in for Bunq.
//
// Runs as the seeded admin (shared storageState); the member is the seeded E2E Teammate. Idempotent on
// a warm DB: the first step deletes whatever connection a previous run left behind.

const TEAM = 'e2e-test-team'
const SETTINGS = `/t/${TEAM}/team/settings`
const MONEY = `/t/${TEAM}/money`
const MEMBER_EMAIL = 'e2e-teammate@example.com'
const BASE_URL = 'http://localhost:5173'

async function disconnectViaApi(page: Page) {
  const attempt = async () =>
    page.request.delete('/api/team/money-pool/connection', { headers: await csrfHeader(page.context()) })
  // The shared session's first tenant-scoped write can collide with another spec's (see helpers.ts).
  const first = await attempt()
  const response = first.status() === 500 ? await attempt() : first
  expect(response.status()).toBe(204)
}

test('money pool: an admin connects Bunq, picks an account, a member reads it, the admin disconnects', async ({
  page,
  browser,
  playwright,
}) => {
  // Many page loads against a cold dev server, two trips through Bunq's page and the callback among them.
  test.setTimeout(90_000)
  await page.goto('/')
  await disconnectViaApi(page)

  // 1. Not connected: the Money page is a preview, and the settings offer Connect behind the tick.
  await page.goto(MONEY)
  await expect(page.getByRole('region', { name: 'Money pool preview' })).toBeVisible()
  await page.goto(SETTINGS)
  await expect(page.getByRole('heading', { name: 'Connect Bunq' })).toBeVisible()
  const connect = page.getByRole('button', { name: 'Connect Bunq' })
  await expect(connect).toBeDisabled()
  await page.getByRole('checkbox', { name: /Connecting gives TeamBalance/ }).check()
  await connect.click()

  // 2. The fake Bunq page, then the API's callback sends the browser back to the settings.
  await page.getByRole('button', { name: 'Approve' }).click()
  await expect(page).toHaveURL(new RegExp(`${SETTINGS}\\?bunq=connected`))
  await expect(page.getByRole('status').filter({ hasText: 'Connected, pick an account below.' })).toBeVisible()

  // 3. Connected but nothing picked: the pool still reads as not connected, and says what is left to do.
  await expect(page.getByRole('radio', { name: 'Teamkas' })).not.toBeChecked()
  await expect(page.getByRole('radio', { name: 'Privé' })).not.toBeChecked()
  await page.goto(MONEY)
  await expect(page.getByText('Pick the account in the team settings')).toBeVisible()

  // 4. Pick Teamkas: the Money page now shows its balance and payments.
  await page.goto(SETTINGS)
  await page.getByRole('radio', { name: 'Teamkas' }).check()
  await page.getByRole('button', { name: 'Use this account' }).click()
  await expect(page.getByRole('status').filter({ hasText: 'The Money page now shows Teamkas.' })).toBeFocused()
  await expect(page.getByRole('button', { name: 'Use this account' })).toBeDisabled()
  await expect(page.getByRole('radio', { name: 'Teamkas' })).toBeChecked()
  await page.goto(MONEY)
  await expect(page.getByText('187,50')).toBeVisible()
  await expect(page.getByText('Lisa de Vries')).toBeVisible()

  // 5. Picking Privé changes what the Money page reads, and picking Teamkas again restores it.
  await page.goto(SETTINGS)
  await page.getByRole('radio', { name: 'Privé' }).check()
  await page.getByRole('button', { name: 'Use this account' }).click()
  await expect(page.getByRole('status').filter({ hasText: 'The Money page now shows Privé.' })).toBeFocused()
  await page.goto(MONEY)
  await expect(page.getByText('42,35')).toBeVisible()
  await expect(page.getByText('Albert Heijn')).toBeVisible()
  await expect(page.getByText('Lisa de Vries')).toHaveCount(0)
  await page.goto(SETTINGS)
  await page.getByRole('radio', { name: 'Teamkas' }).check()
  await page.getByRole('button', { name: 'Use this account' }).click()
  await expect(page.getByRole('status').filter({ hasText: 'The Money page now shows Teamkas.' })).toBeFocused()
  await page.goto(MONEY)
  await expect(page.getByText('187,50')).toBeVisible()

  // 6. Connecting a different login replaces the access and keeps the pick, since the new access still
  //    covers it.
  await page.goto(SETTINGS)
  await page.getByRole('button', { name: 'Connect a different bunq login' }).click()
  await page.getByRole('checkbox', { name: /Connecting gives TeamBalance/ }).check()
  await page.getByRole('button', { name: 'Connect again' }).click()
  await page.getByRole('button', { name: 'Approve' }).click()
  await expect(page).toHaveURL(new RegExp(`${SETTINGS}\\?bunq=connected`))
  await expect(page.getByRole('status').filter({ hasText: 'Connected to bunq.' })).toBeVisible()
  await expect(page.getByRole('radio', { name: 'Teamkas' })).toBeChecked()

  // 7. A member reads the same pool, and the settings (and the Connect section) are not theirs.
  // Explicitly empty: a context made from `playwright.request` would inherit the admin's storageState from the
  // project config, and signing in with the admin's cookie replaces (invalidates) the admin's session.
  const memberRequest = await playwright.request.newContext({
    baseURL: BASE_URL,
    storageState: { cookies: [], origins: [] },
  })
  await authenticateViaApi(memberRequest, MEMBER_EMAIL)
  const member = await browser.newContext({ baseURL: BASE_URL, storageState: await memberRequest.storageState() })
  await memberRequest.dispose()
  try {
    const memberPage = await member.newPage()
    await memberPage.goto(MONEY)
    await expect(memberPage.getByText('187,50')).toBeVisible()
    await expect(memberPage.getByText('Lisa de Vries')).toBeVisible()
    expect((await member.request.get('/api/team/money-pool/connection')).status()).toBe(403)

    // 8. Disconnect, behind its confirmation: the pool is a preview again for the admin and the member.
    await page.goto(SETTINGS)
    await page.getByRole('button', { name: 'Disconnect' }).click()
    // The accounts read is a 404 once disconnected; it must never show as a failure on the way out.
    await page.evaluate(() => {
      const seen = window as unknown as { sawAccountsError?: boolean }
      new MutationObserver(() => {
        if (document.body.textContent?.includes('load the bunq accounts')) seen.sawAccountsError = true
      }).observe(document.body, { subtree: true, childList: true, characterData: true })
    })
    await page.getByRole('dialog').getByRole('button', { name: 'Disconnect' }).click()
    await expect(page.getByRole('button', { name: 'Connect Bunq' })).toBeVisible()
    await expect(page.getByRole('status').filter({ hasText: 'Disconnected from bunq.' })).toBeFocused()
    expect(await page.evaluate(() => (window as unknown as { sawAccountsError?: boolean }).sawAccountsError)).toBeUndefined()
    await page.goto(MONEY)
    await expect(page.getByRole('region', { name: 'Money pool preview' })).toBeVisible()
    await memberPage.reload()
    await expect(memberPage.getByRole('region', { name: 'Money pool preview' })).toBeVisible()
  } finally {
    await member.close()
  }
})
