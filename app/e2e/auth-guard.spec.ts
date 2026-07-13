import { test, expect } from '@playwright/test'

// Exercises the auth guard (app/src/app/providers/index.tsx) against the now-stateful MSW
// /api/auth/me mock: logging out must clear the session and bounce protected routes back to
// login, even on a subsequent visit — not just as a one-off redirect.
test('logout blocks protected routes under the auth guard', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible()

  await page.getByRole('button', { name: 'Log out' }).click()
  await expect(page).toHaveURL('/login')
  await expect(page.getByRole('heading', { name: 'TeamBalance' })).toBeVisible()

  // Revisiting the protected route while logged out is redirected back to login, not rendered.
  await page.goBack()
  await expect(page).toHaveURL('/login')
})
