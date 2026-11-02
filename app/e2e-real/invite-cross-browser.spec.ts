import { test, expect, request as playwrightRequest } from '@playwright/test'
import { STORAGE_STATE, postAsSharedAdmin } from './helpers'

// Real e2e: joining a team when the invite page and the emailed link are opened in *different*
// browsers (#342).
//
// Seam uniquely covered (vs login, attendance, and onboarding-join): the invite now travels with the
// magic-link request and is applied server-side on verification, so the join no longer depends on the
// two page loads sharing a browser profile. That is exactly what could not be proven below this
// layer — the failure was never server-side, and a jsdom test mounting two routers still shares one
// localStorage, so it cannot express "a different browser" at all.
//
// The two halves run in two separate browser contexts. The second starts with empty cookies, empty
// localStorage and empty sessionStorage, so the ONLY thing crossing between them is the emailed
// token — the same thing, and the only thing, that reaches a phone's mail app or a laptop. Before
// this change the second context found no pending invite and dropped the joiner, signed in, on the
// teamless onboarding hub.
//
// Idempotent across warm-DB re-runs: a fresh invite is minted every run, and the per-run-unique
// joiner email is always freshly teamless (magic-link verify creates the user).

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'
const BASE_URL = 'http://localhost:5173'
const RUN = Date.now()
const JOINER_EMAIL = `cross-browser-joiner-${RUN}@example.com`

test.use({ storageState: { cookies: [], origins: [] } })

test('an invite survives the emailed link being opened in a different browser', async ({ page, request, browser }) => {
  // 1. As the seeded admin: mint a fresh invite link.
  const admin = await playwrightRequest.newContext({ baseURL: BASE_URL, storageState: STORAGE_STATE })
  const inviteRes = await postAsSharedAdmin(admin, '/api/invitations')
  expect(inviteRes.status()).toBe(201)
  const { token: inviteToken } = await inviteRes.json()
  await admin.dispose()

  // 2. Browser one — the group chat. Tap the invite link and ask for a magic link.
  await page.goto(`/invite/${inviteToken}`)
  await expect(page.getByRole('heading', { name: "You're invited" })).toBeVisible()
  await page.getByLabel('Email').fill(JOINER_EMAIL)
  await page.getByRole('button', { name: 'Send magic link' }).click()
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible()

  const tokenResponse = await request.get(`${BACKEND_URL}/internal/e2e/magic-link-token`, {
    params: { email: JOINER_EMAIL },
  })
  expect(tokenResponse.ok()).toBeTruthy()
  const { token } = await tokenResponse.json()

  // 3. Browser two — the mail app. A separate context: nothing browser one wrote is readable here.
  const mailApp = await browser.newContext({ storageState: { cookies: [], origins: [] } })
  const mailPage = await mailApp.newPage()

  // Prove the premise rather than assume it: the old carry lived under these keys, and this context
  // genuinely cannot see them. Without this the test could pass for the wrong reason.
  await mailPage.goto('/login')
  const carried = await mailPage.evaluate(() => localStorage.getItem('tb-pending-invite-token'))
  expect(carried).toBeNull()

  await mailPage.goto(`/auth/verify?token=${token}`)

  // 4. Joined. /get-started is the not-yet-onboarded member's landing, and is what distinguishes a
  //    real join from the teamless hub at /onboarding, which is where the lost invite used to land.
  await expect(mailPage).toHaveURL(/\/get-started\/?$/, { timeout: 10_000 })
  await expect(mailPage).not.toHaveURL(/\/onboarding/)

  await mailApp.close()
})
