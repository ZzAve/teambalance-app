import { test, expect } from '@playwright/test'

/**
 * Real e2e: the admin roster-config write path (#219).
 *
 * Justified as a new flow because it is a genuinely new seam, not a variation on an existing one:
 * an admin-gated write to a NEW resource (`/api/event-types`), behind an admin-only route guard,
 * persisted and read back. Nothing else in the suite touches it.
 *
 * Deliberately NOT covered here: the card's chip and slot-pips panel. Those ride the existing events
 * read, and every roster state is a Storybook story with a Chromatic baseline; the numbers behind
 * them are pinned by RosterFillTest and RosterFillIT. Asserting them again through a browser would
 * duplicate that coverage rather than add a seam. (It would also be awkward: the seeded e2e event is
 * within the 7-day window, so Phase 1 renders it as the hero — which carries no roster panel — and
 * the spec would have to manufacture a further-out event just to get a card on screen.)
 *
 * Starts authenticated as the seeded admin via the storageState fixture (auth.setup.ts).
 *
 * Mutation-tolerant: it drives the seeded Training type to a KNOWN configuration and asserts on
 * that, rather than assuming what it started as, and restores it at the end — so re-runs against a
 * warm local DB stay green and the other specs see Training as they expect it.
 */
// The seeded e2e team's slug. Team-scoped routes carry it since ADR-0023 made the Active Team
// explicit rather than inferred, so a settings URL without it no longer resolves to a team.
const TEAM_SLUG = 'e2e-test-team'

test('admin configures an event type roster default and it persists', async ({ page }) => {
  // 1. The admin-only settings screen — a route guard, not merely a hidden button.
  await page.goto(`/t/${TEAM_SLUG}/team/settings`)
  await expect(page.getByRole('heading', { name: 'Event types' })).toBeVisible()

  // 2. Open the seeded Training type's editor.
  await page.getByRole('button', { name: 'Edit Training' }).click()

  // 3. Switch tracking on if it is off, so the spec reaches the same state either way.
  const trackSwitch = page.getByRole('switch', { name: 'Track roster' })
  if ((await trackSwitch.getAttribute('aria-checked')) !== 'true') {
    await trackSwitch.click()
  }
  await expect(trackSwitch).toHaveAttribute('aria-checked', 'true')

  // 4. Set a headcount and save — the tenant-schema write this flow exists for.
  await page.getByLabel(/People needed in total/).fill('99')
  await page.getByRole('button', { name: 'Save', exact: true }).click()

  // 5. The row summarises the new default, so the write round-tripped through the API.
  await expect(page.getByText('99 total')).toBeVisible({ timeout: 10_000 })

  // 6. …and it survives a full reload, i.e. it was persisted rather than left in local state.
  await page.reload()
  await expect(page.getByText('99 total')).toBeVisible({ timeout: 10_000 })

  // 7. Restore: back to untracked, so a re-run starts clean and other specs see Training untouched.
  await page.getByRole('button', { name: 'Edit Training' }).click()
  await page.getByRole('switch', { name: 'Track roster' }).click()
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByText('No roster').first()).toBeVisible({ timeout: 10_000 })
})
