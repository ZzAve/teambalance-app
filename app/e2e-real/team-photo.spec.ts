import { test, expect, type Page } from '@playwright/test'
import { csrfHeader } from './helpers'

// Real e2e: a member uploads a Team Photo and the roster shows it (ADR-0038).
//
// Seam uniquely covered: binary image bytes, cropped in the browser and stored in the tenant, then
// served back from their own endpoint outside the Wirespec contract. No other flow sends or fetches
// anything but JSON.
//
// Runs as the seeded admin (shared storageState). afterEach removes the photo through the API so a
// warm-DB re-run starts with initials again.

test.afterEach(async ({ page }) => {
  const me = (await (await page.request.get('/api/members/me')).json()) as { userId: string }
  expect((await page.request.delete(`/api/members/${me.userId}/photo`, { headers: await csrfHeader(page.context()) })).status()).toBe(204)
})

// A 400×300 picture drawn in the page, so the test needs no binary fixture file.
async function landscapePicture(page: Page) {
  const base64 = await page.evaluate(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 300
    const context = canvas.getContext('2d')!
    context.fillStyle = '#2f6f4f'
    context.fillRect(0, 0, 400, 300)
    context.fillStyle = '#f2c14e'
    context.fillRect(150, 100, 100, 100)
    return canvas.toDataURL('image/png').split(',')[1]
  })
  return { name: 'me.png', mimeType: 'image/png', buffer: Buffer.from(base64, 'base64') }
}

test('a member crops and uploads a team photo, and the roster shows it', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Team', exact: true }).click()
  await page.getByRole('link', { name: 'E2E Tester' }).click()

  await page.getByLabel('Upload photo').setInputFiles(await landscapePicture(page))
  const dialog = page.getByRole('dialog', { name: 'Crop your photo' })
  await dialog.getByRole('button', { name: 'Use photo' }).click()
  await expect(dialog).toBeHidden()
  await expect(page.getByRole('button', { name: 'Upload a different photo' })).toBeVisible()

  // The roster face is the stored photo, served back at the size the browser cropped it to.
  await page.getByRole('link', { name: 'Team', exact: true }).first().click()
  const face = page.getByRole('link', { name: 'E2E Tester' }).locator('img')
  await expect(face).toHaveAttribute('src', /\/api\/members\/[^/]+\/photo\?v=/)
  await expect.poll(() => face.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(256)
})
