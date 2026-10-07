import { test, expect } from '@playwright/test'

// Real e2e: a member calls in a Substitute for an event (ADR-0033, #359 slice 1).
//
// Seam uniquely covered: attendance for someone WITHOUT an account, written inside the tenant. Every
// other attendance flow writes a Member's row keyed by their user id; a Substitute's state lives in
// its own tenant table and reaches the event page through a separate read, so neither the login nor
// the attendance flow exercises it.
//
// Runs as the seeded admin (shared storageState) on the seeded "E2E Training". Deterministic across
// warm-DB re-runs: the Substitute gets a name unique to this run, the flow ends by taking them off
// the event again, and afterEach removes them from the Team's list, so the list does not grow by one
// per run. That removal is cleanup through the API, not part of the flow under test.

const name = `Sub ${Date.now()}`

test.afterEach(async ({ page }) => {
  const res = await page.request.get('/api/substitutes')
  const { substitutes } = (await res.json()) as { substitutes: { id: string; name: string }[] }
  const created = substitutes.find((s) => s.name === name)
  if (created) expect((await page.request.delete(`/api/substitutes/${created.id}`)).status()).toBe(204)
})

test('a member calls in a new substitute, confirms them, and takes them off again', async ({ page }) => {

  await page.goto('/')
  await page.getByText('E2E Training').first().click()
  const block = page.getByRole('region', { name: 'Substitutes' })

  // 1. Someone not on the Team's list yet joins the event as Maybe: they were asked, not confirmed.
  await block.getByRole('button', { name: 'Call in substitutes' }).click()
  const picker = page.getByRole('dialog', { name: 'Call in substitutes' })
  await picker.getByRole('button', { name: /New substitute/ }).click()
  await picker.getByLabel('Name', { exact: true }).fill(name)
  await picker.getByRole('button', { name: 'Add as Maybe' }).click()
  await expect(picker.getByRole('group', { name }).getByRole('button', { name: 'Maybe' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await picker.getByRole('button', { name: 'Done' }).click()

  // 2. They confirm: Going, inline in the Substitutes block.
  await block.getByRole('group', { name }).getByRole('button', { name: 'Going' }).click()

  // 3. The write persists: after a reload they sit in their Position group (none, so Unassigned),
  //    tagged, attributed to the member who called them in.
  await page.reload()
  await expect(page.getByRole('button', { name: new RegExp(`^${name}, substitute — Going`) })).toBeVisible({
    timeout: 10_000,
  })
  await expect(block.getByRole('group', { name }).getByText('Unassigned · set by E2E Tester')).toBeVisible()

  // 4. Taking them off the event removes them from it; they stay on the Team's list.
  await block.getByRole('button', { name: new RegExp(`^${name}`) }).click()
  await page.getByRole('dialog', { name }).getByRole('button', { name: 'Take off this event' }).click()
  await page.reload()
  await expect(block).toBeVisible({ timeout: 10_000 })
  await expect(block.getByRole('group', { name })).toHaveCount(0)
})
