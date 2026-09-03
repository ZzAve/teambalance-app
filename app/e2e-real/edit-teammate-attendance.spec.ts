import { test, expect } from '@playwright/test'

// Real e2e: a member edits a *teammate's* attendance from the event detail page (#274, ⑫).
//
// Seam uniquely covered: a cross-member attendance WRITE driven from the UI. ADR-0003 has always
// made this trust-based at the API — any member may set a teammate's answer — but until now only the
// UI withheld it, so no flow exercised it end to end. The existing attendance flow only ever writes
// the viewer's OWN response; this is the new seam, per the PR gate.
//
// Runs as the seeded admin (shared storageState). The teammate is the second seeded member of
// team_test (db/e2e/seed.sql). Idempotent across warm-DB re-runs: the precondition below pins the
// teammate to a known state each run, so the UI transition is deterministic regardless of prior runs.

const EVENT_ID = 'e2e00000-0000-0000-0000-000000000004' // seeded "E2E Training"
const TEAMMATE_ID = 'e2e00000-0000-0000-0000-000000000006' // seeded "E2E Teammate"

test("a member changes a teammate's attendance from the detail page, and it persists", async ({ page }) => {
  // 0. Precondition (a cross-member write in itself): as the admin, pin the teammate to ATTENDING so
  //    they start on the default Going tab. This makes the run deterministic on a warm DB.
  const seeded = await page.request.put(`/api/events/${EVENT_ID}/attendances/${TEAMMATE_ID}`, {
    data: { state: 'ATTENDING' },
  })
  expect(seeded.ok()).toBeTruthy()

  // 1. Open the seeded event; the Going tab is active by default, so the teammate's row is visible.
  await page.goto('/')
  await page.getByText('E2E Training').first().click()
  const teammateRow = page.getByRole('button', { name: /E2E Teammate/ })
  await expect(teammateRow).toBeVisible()

  // 2. Tap the teammate's row and set *their* answer to Can't go — scoped to their own control, so it
  //    is never confused with the viewer's own "Your response" toggle.
  await teammateRow.click()
  await page
    .getByRole('group', { name: "E2E Teammate's answer" })
    .getByRole('button', { name: "Can't go", exact: true })
    .click()

  // 3. The write persists: after a full reload the teammate is under the Absent tab, attributed to the
  //    admin who changed it (⑪ — you learn who set it right where you'd change it back).
  await page.reload()
  await page.getByRole('button', { name: /Absent/ }).click()
  await expect(page.getByRole('button', { name: /E2E Teammate/ })).toBeVisible({ timeout: 10_000 })
  await expect(page.getByText('set by E2E Tester')).toBeVisible()
})
