import { test, expect, type Page } from '@playwright/test'

/**
 * Real e2e: the **memberless-team handover** (ADR-0024 §5, issue #240). A Platform Admin creates a
 * team with no members, enters it via act-as, and hands it over with a single-use ADMIN invite link;
 * the recipient clicks the link and lands as **Admin** of the prepared team.
 *
 * Justified under the PR gate as a genuinely new seam: **acceptance grants ADMIN**. The login,
 * attendance and existing invite flows only ever add a plain User — a link that makes the accepter an
 * Admin of a team they had no prior relationship to is a new auth path, and it is the only path by
 * which a memberless team gets its first Admin. (The act-as write itself is already covered by
 * act-as.spec.ts; this spec exercises the create-memberless → handover-link → accept-as-admin chain
 * around it.)
 *
 * Idempotent across warm-DB re-runs: the team slug and the recipient email are per-run unique, so each
 * run provisions a fresh team and a freshly-teamless recipient (magic-link verify creates the user).
 * Runs as platform2@example.com so it never races act-as.spec.ts for platform@example.com's token.
 */

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'
const RUN = Date.now()
const PLATFORM_EMAIL = 'platform2@example.com'
const TEAM_NAME = `E2E Handover ${RUN}`
const TEAM_SLUG = `e2e-handover-${RUN}`
const RECIPIENT_EMAIL = `handover-recipient-${RUN}@example.com`

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

test('a Platform Admin creates a memberless team, preps it, and hands it over as Admin by link', async ({
  page,
  browser,
}) => {
  // 1. Teamless Platform Admin lands on the console.
  await signIn(page, PLATFORM_EMAIL)
  await expect(page).toHaveURL(/\/admin\/teams/, { timeout: 15_000 })

  // 2. Create a team with NO members — the /admin form, no creation code.
  await page.getByLabel('Team name').fill(TEAM_NAME)
  await page.getByLabel('Team address').fill(TEAM_SLUG)
  await page.getByRole('button', { name: 'Create team' }).click()
  await expect(page.getByRole('status')).toContainText(TEAM_NAME, { timeout: 15_000 })

  // 3. The new team shows up in the console list; enter it via act-as.
  const teamRow = page.getByRole('listitem').filter({ hasText: TEAM_NAME })
  await expect(teamRow).toBeVisible({ timeout: 15_000 })
  await teamRow.getByRole('button', { name: 'Enter' }).click()
  await expect(page).toHaveURL(new RegExp(`/t/${TEAM_SLUG}`), { timeout: 15_000 })

  // 4. The zero-member state is real: the roster says so rather than showing an empty box.
  await page.goto(`/t/${TEAM_SLUG}/team`)
  await expect(page.getByText('No members yet.')).toBeVisible({ timeout: 15_000 })

  // 5. Mint the single-use ADMIN handover link from the admin settings page (Virtual Member = ADMIN).
  await page.goto(`/t/${TEAM_SLUG}/team/settings`)
  await page.getByRole('button', { name: 'Create admin handover link' }).click()
  const handoverUrl = await page.getByLabel('Admin handover link').inputValue()
  expect(handoverUrl).toContain('/invite/')

  // 6. The recipient — a brand-new, teamless user in their own browser context — signs in and clicks
  //    the handover link. The direct /invite/$token visit auto-accepts for an authenticated visitor.
  const recipientContext = await browser.newContext({ storageState: { cookies: [], origins: [] } })
  const recipient = await recipientContext.newPage()
  try {
    await signIn(recipient, RECIPIENT_EMAIL)
    await recipient.goto(handoverUrl)

    // 7. They land as ADMIN of the prepared team — the whole point: one link, and control is handed over.
    await expect(async () => {
      const me = await recipient.request.get('/api/auth/me')
      expect(me.ok()).toBeTruthy()
      const body = await me.json()
      expect(body.role).toBe('ADMIN')
      expect(body.activeTeam?.slug).toBe(TEAM_SLUG)
    }).toPass({ timeout: 15_000 })

    // 8. Single-use: a second person opening the same link gets nothing.
    const secondContext = await browser.newContext({ storageState: { cookies: [], origins: [] } })
    const second = await secondContext.newPage()
    try {
      await signIn(second, `handover-second-${RUN}@example.com`)
      await second.goto(handoverUrl)
      await expect(second.getByText('Invite link invalid')).toBeVisible({ timeout: 15_000 })
      const me = await second.request.get('/api/auth/me')
      const body = await me.json()
      // Never became a member of the team.
      expect((body.teams ?? []).some((t: { slug: string }) => t.slug === TEAM_SLUG)).toBe(false)
    } finally {
      await secondContext.close()
    }
  } finally {
    await recipientContext.close()
  }
})
