import { type Page, expect } from '@playwright/test'

// Signs in through the magic-link verify flow against the MSW mock (token 'valid-token'). The mock
// persists the session in sessionStorage, so it survives the hard navigations the specs perform
// after logging in. Lands on the events list.
export async function login(page: Page): Promise<void> {
  await page.goto('/auth/verify?token=valid-token')
  await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible()
}
