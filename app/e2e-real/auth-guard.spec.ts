import { test, expect } from '@playwright/test'
import { STORAGE_STATE_LOGOUT } from './helpers'

// Real e2e: the auth render-gate across the whole seam — browser → API → DB.
// Seam uniquely covered (vs login/attendance): a COLD unauthenticated visit fails closed to
// login before any protected route renders, and logout tears the session down server-side so
// protected routes stay unreachable. The backend's real 401-on-/me drives the guard; no mock.

test.describe('cold unauthenticated visit', () => {
  // Start with no session, overriding the project-wide storageState.
  test.use({ storageState: { cookies: [], origins: [] } })

  test('is redirected to login before events render', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveURL('/login')
    await expect(page.getByRole('heading', { name: 'TeamBalance' })).toBeVisible()
    // Gated: the protected events screen never rendered.
    await expect(page.getByRole('heading', { name: 'Events' })).toHaveCount(0)
  })
})

test.describe('logout', () => {
  // A disposable session (minted in auth.setup.ts) — tearing it down never touches the shared
  // session the attendance spec reuses.
  test.use({ storageState: STORAGE_STATE_LOGOUT })

  test('returns to login and blocks protected routes', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible()

    // Log out lives on the team-independent Account tab now (ADR-0027 §1): the BottomNav Profile
    // tab points at the constant /account regardless of team slug, so logout is reachable from
    // every signed-in state — not only a fully-onboarded /t/:slug screen.
    await page.getByRole('link', { name: 'Profile' }).click()
    await expect(page).toHaveURL('/account')
    await page.getByRole('button', { name: 'Log out' }).click()
    await expect(page).toHaveURL('/login')
    await expect(page.getByRole('heading', { name: 'TeamBalance' })).toBeVisible()

    // The session was invalidated server-side, so revisiting a protected route is bounced to
    // login — not rendered from a stale cookie.
    await page.goto('/')
    await expect(page).toHaveURL('/login')
    await expect(page.getByRole('heading', { name: 'Events' })).toHaveCount(0)
  })
})
