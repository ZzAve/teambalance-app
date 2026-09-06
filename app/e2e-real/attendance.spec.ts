import { test, expect } from '@playwright/test'

// Real e2e: change attendance — starts authenticated via the storageState fixture
// (auth.setup.ts), so the spec stays focused on attendance.
// Seams uniquely covered: authenticated-session reuse, a tenant-schema WRITE
// (attendance mutation), and read-back persistence. List→detail navigation rides along.
//
// Mutation-tolerant: asserts a TRANSITION from whatever the current state is, never an
// absolute state — re-runs against a warm local DB stay green.

test('change attendance: toggle a response and it persists across a reload', async ({ page }) => {
  // 1. Authenticated user lands on the events list directly (no login UI)
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible()

  // 2. Open the seeded event (list → detail navigation). Scope to the primary "Your response"
  //    control — every attendee row (the viewer's own included) now carries its own Going/Maybe/Can't,
  //    so an unscoped name would be ambiguous.
  await page.getByText('E2E Training').first().click()
  const response = page.getByRole('group', { name: 'Your response' })
  const going = response.getByRole('button', { name: 'Going', exact: true })
  const maybe = response.getByRole('button', { name: 'Maybe', exact: true })
  await expect(going).toBeVisible()

  // 3. Toggle to a state different from the current one
  const goingIsActive = (await going.getAttribute('aria-pressed')) === 'true'
  const target = goingIsActive ? maybe : going
  const targetName = goingIsActive ? 'Maybe' : 'Going'
  await target.click()
  await expect(target).toHaveAttribute('aria-pressed', 'true')

  // 4. The transition survives a full reload — i.e. it was persisted, not just local state
  await page.reload()
  await expect(
    page.getByRole('group', { name: 'Your response' }).getByRole('button', { name: targetName, exact: true }),
  ).toHaveAttribute('aria-pressed', 'true', { timeout: 10_000 })
})
