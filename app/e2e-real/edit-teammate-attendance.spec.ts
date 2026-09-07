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
  //    the run is deterministic on a warm DB. The list shows everyone regardless of answer, so the
  //    starting state only decides the row's tint, not whether it is on screen.
  const seeded = await page.request.put(`/api/events/${EVENT_ID}/attendances/${TEAMMATE_ID}`, {
    data: { state: 'ATTENDING' },
  })
  expect(seeded.ok()).toBeTruthy()

  // 1. Open the seeded event. There are no tabs: everyone is listed under their position, and each row
  //    is a collapsed pill. Expand the teammate's (position-less → Unassigned) to reveal their control.
  await page.goto('/')
  await page.getByText('E2E Training').first().click()
  await page.getByRole('button', { name: "Change E2E Teammate's answer" }).click()
  const teammateControl = page.getByRole('group', { name: "E2E Teammate's answer" })
  await expect(teammateControl).toBeVisible()
  // A cross-member change announces itself — you should know whose answer you're setting.
  await expect(teammateControl.getByText(/Changing/)).toBeVisible()

  // 2. Set *their* answer to Can't go — scoped to their own control, so it is never confused with the
  //    viewer's own "Your response" toggle.
  await teammateControl.getByRole('button', { name: "Can't go", exact: true }).click()

  // 3. The write persists: after a full reload the teammate is still on screen (now tinted absent),
  //    attributed to the admin who changed it (⑪ — you learn who set it right where you'd change it back).
  await page.reload()
  // exact: the row's trigger carries an sr-only "Change E2E Teammate's answer", so a substring
  // match would be ambiguous — the visible name is the exact one.
  await expect(page.getByText('E2E Teammate', { exact: true })).toBeVisible({ timeout: 10_000 })
  await expect(page.getByText('set by E2E Tester')).toBeVisible()
})
