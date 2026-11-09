import { test, expect } from '@playwright/test'
import { authenticateViaApi } from './helpers'

// Real e2e (ADR-0045): the passkey seam the magic-link and attendance flows never exercise. Chromium's
// virtual authenticator (CDP) plays the device, so this is the one place the ceremony's signature
// verification and the bridge from Spring's /login/webauthn to the app's own session run end to end.
// It also covers the add-a-passkey prompt (the /me field reaching the UI) inside the same flow.
const EMAIL = `passkey-${Date.now()}@example.com`

// A throwaway teamless user, so no shared session is touched.
test.use({ storageState: { cookies: [], origins: [] } })

test('add a passkey after a magic-link sign-in, then sign in with it', async ({ page }) => {
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('WebAuthn.enable')
  const { authenticatorId } = await cdp.send('WebAuthn.addVirtualAuthenticator', {
    options: {
      protocol: 'ctap2',
      transport: 'internal',
      hasResidentKey: true,
      hasUserVerification: true,
      isUserVerified: true,
      automaticPresenceSimulation: true,
    },
  })

  // 0. A fresh profile remembers no sign-in method, so /login marks none.
  await page.goto('/login')
  await expect(page.getByRole('button', { name: 'Sign in with a passkey' })).toBeVisible()
  await expect(page.getByText('Last', { exact: true })).toBeHidden()

  // 1. A magic-link sign-in with no passkey yet: the first screen offers one; "Not now" sticks on this device.
  await authenticateViaApi(page.request, EMAIL)
  await page.goto('/')
  const prompt = page.getByRole('alert').filter({ hasText: 'Add a passkey' })
  await expect(prompt).toBeVisible({ timeout: 10_000 })
  await prompt.getByRole('button', { name: 'Not now' }).click()
  await expect(prompt).toBeHidden()
  await page.reload()
  await expect(page.getByRole('heading', { name: /Welcome to TeamBalance/ })).toBeVisible()
  await expect(prompt).toBeHidden()

  // 2. Add one on the Account tab.
  await page.goto('/account')
  await page.getByRole('button', { name: 'Add a passkey' }).click()
  await expect(page.getByText('This device')).toBeVisible()

  // 3. Log out, then sign in with the passkey: the app's session exists and /me reports the passkey.
  await page.getByRole('button', { name: 'Log out' }).click()
  await expect(page).toHaveURL('/login')
  await page.evaluate(() => localStorage.clear())
  await page.getByRole('button', { name: 'Sign in with a passkey' }).click()
  await expect(page.getByRole('heading', { name: /Welcome to TeamBalance/ })).toBeVisible({ timeout: 10_000 })
  const me = await page.request.get('/api/auth/me')
  expect(me.status()).toBe(200)
  expect((await me.json()).passkeyCount).toBe(1)

  // 4. With a passkey registered the prompt is not offered, even on a device that never dismissed it.
  await expect(page.getByRole('alert').filter({ hasText: 'Add a passkey' })).toBeHidden()

  // 5. The device now remembers the passkey: after a logout /login marks it and does not start by itself, once...
  await page.goto('/account')
  await page.getByRole('button', { name: 'Log out' }).click()
  await expect(page).toHaveURL('/login')
  await expect(page.getByText('Last', { exact: true })).toBeVisible()
  await page.waitForTimeout(2_000)
  await expect(page).toHaveURL('/login')

  // 6. ...and a reload starts the ceremony without a click, against the same virtual authenticator.
  await page.reload()
  await expect(page.getByRole('heading', { name: /Welcome to TeamBalance/ })).toBeVisible({ timeout: 10_000 })

  // 7. A passkey removed on the server but still on the device: the sign-in fails, the browser is told to drop it
  // (Signal API) and the device stops marking and auto-starting it.
  await page.goto('/account')
  await page.getByRole('button', { name: 'Remove' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Remove' }).click()
  await expect(page.getByText('No passkeys yet.')).toBeVisible()
  await page.getByRole('button', { name: 'Log out' }).click()
  await expect(page).toHaveURL('/login')
  await page.getByRole('button', { name: 'Sign in with a passkey' }).click()
  await expect(page.getByText('Signing in with a passkey failed. Use your email link instead.')).toBeVisible()
  await expect.poll(async () => (await cdp.send('WebAuthn.getCredentials', { authenticatorId })).credentials.length).toBe(0)
  await page.reload()
  await expect(page.getByText('Last', { exact: true })).toBeHidden()
})
