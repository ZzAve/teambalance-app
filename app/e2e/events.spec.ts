import { test, expect } from '@playwright/test'
import { login } from './helpers'

// Drives the event list and event detail pages through real user interaction,
// exercising the generated Wirespec client end-to-end against the MSW mocks.
test('user can browse the event list and open an event detail', async ({ page }) => {
  await login(page)

  // The list page renders its heading and an upcoming event from the mocks.
  await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible()
  const matchCard = page.getByText('League Match vs Smash United')
  await expect(matchCard).toBeVisible()

  // The card shows the attending count from the event's attendance summary.
  await expect(page.getByText('5 going').first()).toBeVisible()

  // Opening the event navigates to its detail page.
  await matchCard.click()
  await expect(
    page.getByRole('heading', { name: 'League Match vs Smash United', level: 1 }),
  ).toBeVisible()

  // The detail page lists attendees who are going (default tab).
  await expect(page.getByText('Jan de Vries')).toBeVisible()

  // Each attendee shows their volleyball role beneath their name (exact match avoids the role-breakdown chip).
  await expect(page.getByText('Setter', { exact: true })).toBeVisible()
})
