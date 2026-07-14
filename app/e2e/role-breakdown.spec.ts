import { test, expect } from '@playwright/test'
import { login } from './helpers'

// Renders the EventCard (list) and event-detail role-breakdown chips through the
// real generated Wirespec client against the MSW mocks, asserting both the
// populated and the empty (nobody-responded-yet) states.

// evt-002 "League Match" attending roles → 2 Outside Hitter, 1 Libero, 1 Opposite,
// 1 Setter (count desc, then name). evt-006 has no responses → no chips.
const POPULATED_CHIPS = ['2 Outside Hitter', '1 Libero', '1 Opposite', '1 Setter']
const ROLE_TEXT = /\d+\s+(Setter|Libero|Outside Hitter|Middle Blocker|Opposite)/

test('event list card renders attending-by-role chips for an event with responses', async ({ page }) => {
  await login(page)

  const matchCard = page.locator('a[href$="/events/evt-002"]')
  await expect(matchCard).toBeVisible()

  for (const chip of POPULATED_CHIPS) {
    await expect(matchCard.getByText(chip, { exact: true })).toBeVisible()
  }
})

test('event list card shows no role chips when nobody has responded yet', async ({ page }) => {
  await login(page)

  const emptyCard = page.locator('a[href$="/events/evt-006"]')
  await expect(emptyCard).toBeVisible()

  // Summary still renders, but with zero going and no role chips.
  await expect(emptyCard.getByText('0 going')).toBeVisible()
  await expect(emptyCard.getByText(ROLE_TEXT)).toHaveCount(0)
})

test('event detail renders the grouped role breakdown for an event with responses', async ({ page }) => {
  await login(page)
  await page.goto('/events/evt-002')
  await expect(
    page.getByRole('heading', { name: 'League Match vs Smash United', level: 1 }),
  ).toBeVisible()

  // Breakdown chips on the default (Going) tab, attending-only and grouped.
  for (const chip of POPULATED_CHIPS) {
    await expect(page.getByText(chip, { exact: true })).toBeVisible()
  }

  // Each attendee also shows their own role beneath their name (exact avoids the chips).
  await expect(page.getByText('Jan de Vries')).toBeVisible()
  await expect(page.getByText('Setter', { exact: true })).toBeVisible()
})

test('event detail shows an empty breakdown when nobody has responded yet', async ({ page }) => {
  await login(page)
  await page.goto('/events/evt-006')
  await expect(
    page.getByRole('heading', { name: 'Friendly (date TBC)', level: 1 }),
  ).toBeVisible()

  // No role-breakdown chips, and the Going tab reads as empty.
  await expect(page.getByText(ROLE_TEXT)).toHaveCount(0)
  await expect(page.getByText('No one')).toBeVisible()
})
