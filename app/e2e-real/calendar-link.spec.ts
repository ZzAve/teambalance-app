import { test, expect } from '@playwright/test'

// Real e2e: calendar link — starts authenticated via the storageState fixture (auth.setup.ts).
// Seam uniquely covered: the calendar feed is the one tenant read reached WITHOUT a session — the
// token in the URL is the only credential — so it is fetched from a fresh, cookie-less request
// context. Generate → copy → fetch, then delete → the same fetch is refused.
//
// Mutation-tolerant: a member holds at most three links, so a warm local DB may still carry the
// link a previous run left behind. Any "E2E phone" link is deleted before generating a new one.

const LABEL = 'E2E phone'

test('calendar link: generate one, the feed serves it without a session, delete it and it stops', async ({
  page,
  context,
  playwright,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])

  // 1. Events overview → the calendar-links button.
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible()
  await page.getByRole('link', { name: 'Calendar links' }).click()
  await expect(page.getByRole('heading', { name: 'Calendar', exact: true })).toBeVisible()

  const generate = page.getByRole('button', { name: 'Generate link' })
  await expect(generate).toBeVisible()
  const ourLinks = page.getByRole('listitem', { name: LABEL })

  const deleteLink = async () => {
    await ourLinks.first().getByRole('button', { name: 'Delete' }).click()
    await page.getByRole('button', { name: 'Delete link' }).click()
  }

  // 2. Clear leftovers from earlier runs.
  for (let leftover = await ourLinks.count(); leftover > 0; leftover--) {
    await deleteLink()
    await expect(ourLinks).toHaveCount(leftover - 1)
  }

  // 3. Generate a labelled link.
  await page.getByLabel('Label (optional)').fill(LABEL)
  await generate.click()
  await expect(ourLinks).toHaveCount(1)

  // 4. The copy action puts the https feed URL on the clipboard.
  await ourLinks.getByRole('button', { name: 'Copy link' }).click()
  await expect(ourLinks.getByRole('button', { name: 'Copied!' })).toBeVisible()
  const feedUrl = await page.evaluate(() => navigator.clipboard.readText())
  expect(feedUrl).toMatch(/^https?:\/\/.+\/api\/calendar\/.+\.ics$/)

  // 5. A calendar client has no session: fetch from a context that never logged in.
  const anonymous = await playwright.request.newContext()
  try {
    const feed = await anonymous.get(feedUrl)
    expect(feed.status()).toBe(200)
    expect(feed.headers()['content-type']).toContain('text/calendar')
    const body = await feed.text()
    expect(body).toContain('BEGIN:VCALENDAR')
    // The summary carries the member's own answer as a prefix, which attendance.spec.ts flips.
    expect(body).toMatch(/^SUMMARY:.*E2E Training/m)

    // 6. Delete it, and the same URL stops serving.
    await deleteLink()
    await expect(ourLinks).toHaveCount(0)
    expect((await anonymous.get(feedUrl)).status()).toBe(404)
  } finally {
    await anonymous.dispose()
  }
})
