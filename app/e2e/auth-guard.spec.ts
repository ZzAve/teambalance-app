import { test, expect } from '@playwright/test'
import { login } from './helpers'

// The app boots unauthenticated (the MSW session starts empty), so the root beforeLoad guard must
// send a cold visitor to login before any protected route renders. After magic-link sign-in the
// member lands on events; logout returns to login and protected routes stay unreachable.

test('a cold unauthenticated visit is redirected to login before events render', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL('/login')
  await expect(page.getByRole('heading', { name: 'TeamBalance' })).toBeVisible()
  // Gated: the protected events screen never rendered.
  await expect(page.getByRole('heading', { name: 'Events' })).toHaveCount(0)
})

test('magic-link login lands on events; logout returns to login and blocks protected routes', async ({ page }) => {
  await login(page)
  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible()

  await page.getByRole('button', { name: 'Log out' }).click()
  await expect(page).toHaveURL('/login')
  await expect(page.getByRole('heading', { name: 'TeamBalance' })).toBeVisible()

  // Revisiting a protected route while logged out is redirected back to login, not rendered.
  await page.goto('/')
  await expect(page).toHaveURL('/login')
  await expect(page.getByRole('heading', { name: 'Events' })).toHaveCount(0)
})
