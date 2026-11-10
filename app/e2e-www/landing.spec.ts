import { expect, test } from '@playwright/test'

const MAGIC_LINK = '**/api/auth/magic-link/request'

test('nl page: answering an event removes only the attendance messages, updates its tally, and can be undone', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Blijf kletsen')
  const noHorizontalScroll = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
  expect(await noHorizontalScroll()).toBe(true)

  // A collapsed message has an empty box (opacity alone would still count as visible).
  const attendance = page.locator('.msg.att')
  const teamTalk = page.locator('.msg:not(.att)')
  await expect(attendance.first()).toBeVisible()

  const training = page.locator('.ev[data-ev="training"]')
  const match = page.locator('.ev[data-ev="match"]')
  await expect(training.locator('.tally')).toContainText('8 aanwezig')

  await training.getByRole('button', { name: 'Aanwezig' }).click()

  await expect(attendance.first()).toBeHidden()
  await expect(teamTalk.first()).toBeVisible()
  await expect(training.locator('.tally')).toContainText('9 aanwezig')
  await expect(training.locator('.tally')).toContainText('2 geen reactie')
  await expect(match.locator('.tally')).toContainText('5 aanwezig')
  await expect(match.locator('.tally')).toContainText('4 geen reactie')

  await page.getByRole('button', { name: 'Toon de oude manier' }).click()
  await expect(attendance.first()).toBeVisible()
  await expect(training.locator('.tally')).toContainText('9 aanwezig')
  expect(await noHorizontalScroll()).toBe(true)
})

test('en page: language, headline, event words', async ({ page }) => {
  await page.goto('/en/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Keep the chat. Skip the scroll-back.')
  const training = page.locator('.ev[data-ev="training"]')
  await training.getByRole('button', { name: 'Maybe' }).click()
  await expect(training.locator('.tally')).toContainText('3 maybe')
  await expect(page.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/en/privacy/')
})

test('sign-in form: empty submit shows an error and sends nothing', async ({ page }) => {
  let requests = 0
  await page.route(MAGIC_LINK, (route) => {
    requests++
    return route.fulfill({ status: 202 })
  })
  await page.goto('/')
  const hero = page.locator('form[data-request]').first()
  await hero.getByRole('button', { name: 'Aan de slag' }).click()
  await expect(hero.locator('.form-msg')).toContainText('Vul je e-mailadres in')
  await expect(hero.locator('input[type="email"]')).toHaveAttribute('aria-invalid', 'true')
  expect(requests).toBe(0)
})

test('sign-in form: a valid email posts the language and shows the confirmation', async ({ page }) => {
  let body: unknown
  await page.route(MAGIC_LINK, (route) => {
    body = route.request().postDataJSON()
    return route.fulfill({ status: 202, headers: { 'access-control-allow-origin': '*' } })
  })
  await page.goto('/')
  const hero = page.locator('form[data-request]').first()
  await hero.locator('input[type="email"]').fill('speler@example.com')
  await hero.getByRole('button', { name: 'Aan de slag' }).click()
  await expect(hero.locator('.form-msg')).toContainText('Check je mail')
  expect(body).toEqual({ email: 'speler@example.com', language: 'NL' })
})

test('demo link points at the demo team', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Probeer het demoteam' }).first()).toHaveAttribute(
    'href',
    'https://demo.teambalance.nl/',
  )
})
