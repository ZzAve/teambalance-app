/**
 * Steps for the passkeys promo (ADR-0045): the real SPA against api-fixture.mjs, recorded and voiced
 * with the feature-promo-video skill. The browser's WebAuthn ceremony runs for real against Chromium's
 * virtual authenticator; os-passkey-sheet.mjs draws the phone's sheet and os-mail-app.mjs the inbox,
 * iOS by default or Android with PHONE_OS=android.
 *
 * Render choices of the published videos (2026-11-09), so a regeneration needs no new listening round:
 *
 *   S=.agents/skills/feature-promo-video/scripts; OUT=/tmp/passkeys-ios      # or -android
 *   uv run $S/narrate.py docs/demo/passkeys.narration.json $OUT/voice
 *   node $S/cards.mjs docs/demo/passkeys.narration.json $OUT/cards
 *   PHONE_OS=ios $S/record.sh docs/demo/passkeys.steps.mjs $OUT                # PHONE_OS=android
 *   uv run $S/assemble.py $OUT/take $OUT/take.log $OUT/voice/clips.json $OUT/cards passkeys-promo.mp4 \
 *     --song $S/../music/teambalance-theme.json --cut 20.38 --phone ios        # --phone android
 *
 * Each transcript in docs/demo/passkeys*.transcript.md repeats the assemble command it came from.
 * Copy drift: the mail mock checks its wording against MagicLinkEmail.kt and fails if it changed; the
 * OS sheet texts imitate iOS/Android, not app copy; the app's own prompt and buttons are clicked by
 * their real labels, so a copy change there fails the probe instead of showing stale text.
 */
import { installFixtureApi, signOut } from './api-fixture.mjs'
import { narratedTake } from './narrated-take.mjs'
import { showPasskeySheet } from './os-passkey-sheet.mjs'
import { showMailApp } from './os-mail-app.mjs'

const OS = process.env.PHONE_OS === 'android' ? 'android' : 'ios'

export default async function script({ page, caption, section, sleep, click, type, scrollTo, moveTo, BASE }) {
  const { speak, say, untilLineEnds, captionAt } = await narratedTake({ page, caption, sleep })
  await installFixtureApi(page, { passkeyPrompt: true })
  signOut()
  const onScreen = { scroll: false }

  const cdp = await page.context().newCDPSession(page)
  await cdp.send('WebAuthn.enable')
  await cdp.send('WebAuthn.addVirtualAuthenticator', {
    options: { protocol: 'ctap2', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: true, automaticPresenceSimulation: true },
  })
  // The options request waits until the mock sheet has been approved, so the app's "Waiting for your
  // device..." state and the sheet are on screen together, and the result lands as the sheet closes.
  let gate = null
  await page.route((url) => /\/webauthn\/(register|authenticate)\/options$/.test(url.pathname), async (route) => {
    if (gate) await gate
    await route.fallback()
  })
  const holdCeremony = () => {
    let release
    gate = new Promise((r) => { release = r })
    return () => { gate = null; release() }
  }
  // The phone's own passkey sheet, over the app, while the real ceremony waits.
  const ceremony = async (mode, button) => {
    const release = holdCeremony()
    await click(page, button, onScreen)
    const sheet = await showPasskeySheet(page, mode, OS)
    await captionAt('top')
    await untilLineEnds()
    return async (line) => {
      await speak(line, 3000)
      await sleep(page, 500)
      await click(page, sheet.continueButton, onScreen)
      await sheet.approve()
      release()
      await sheet.close()
    }
  }
  // A caption does not survive a full page load; put the current one back.
  const restoreCaption = async (text) => { await captionAt('bottom'); await caption(page, text) }

  const sendLink = page.getByRole('button', { name: 'Send magic link' })
  const passkeyButton = page.getByRole('button', { name: 'Sign in with a passkey' })
  const logOut = page.getByRole('button', { name: 'Log out' })

  await section('email', async () => {
    await page.goto(`${BASE}/login`)
    await sendLink.waitFor()
    await sleep(page, 600)
    await moveTo(page, sendLink)
    await say('Until now, every sign-in started with an email.', 2800)
    await speak('Type your address and send the link.', 2600)
    await type(page, page.getByLabel('Email'), 'julia@example.com', onScreen)
    await sleep(page, 200)
    await click(page, sendLink, onScreen)
    await page.getByRole('heading', { name: 'Check your email' }).waitFor()
    await untilLineEnds()
    await sleep(page, 500)
    await speak('Then open your inbox and find the mail.', 2800)
    const mail = await showMailApp(page, OS)
    await sleep(page, 700)
    await click(page, mail.row, onScreen)
    await mail.link.waitFor()
    await untilLineEnds()
    await sleep(page, 300)
    await speak('It works. But it is a wait, every time.', 2600)
    await sleep(page, 1400)
    await click(page, mail.link, onScreen)
    await untilLineEnds()
    // The link opens the app.
    await page.goto(`${BASE}/auth/verify?token=demo`)
    await page.getByRole('heading', { name: 'Events' }).waitFor()
    await page.waitForLoadState('networkidle')
  })

  const prompt = page.getByRole('alert').filter({ hasText: 'Add a passkey' })

  await section('add', async () => {
    await prompt.waitFor()
    await captionAt('top')
    await sleep(page, 400)
    await moveTo(page, prompt)
    await say("Once you're in, TeamBalance offers a faster way.", 3000)
    await speak('Tap "Add a passkey".', 1400)
    const confirm = await ceremony('create', prompt.getByRole('button', { name: 'Add a passkey' }))
    await confirm('Your phone asks once. Confirm with your face or your fingerprint.')
    await prompt.waitFor({ state: 'hidden' })
    await untilLineEnds()
    await sleep(page, 300)
    await say("Done. That's all the setup there is.", 2400)
    await captionAt('bottom')
  })

  await section('account', async () => {
    await speak('Your passkeys live on the Profile tab.', 2600)
    await sleep(page, 300)
    await click(page, page.getByRole('link', { name: 'Profile', exact: true }))
    const passkeys = page.getByRole('heading', { name: 'Passkeys' })
    await passkeys.waitFor()
    await page.getByText('This device').waitFor()
    await scrollTo(page, passkeys)
    await untilLineEnds()
    await sleep(page, 300)
    await moveTo(page, page.getByRole('button', { name: 'Remove' }))
    await say('This device is listed. Every phone or laptop gets its own, and Remove is right there.', 4000)
    await speak('Now sign out, and back in.', 2400)
    await sleep(page, 300)
    await click(page, logOut, onScreen)
    await passkeyButton.waitFor()
    await restoreCaption('Now sign out, and back in.')
    await untilLineEnds()
  })

  await section('signin', async () => {
    await sleep(page, 300)
    await speak('Tap "Sign in with a passkey".', 1600)
    const confirm = await ceremony('signin', passkeyButton)
    await confirm('A glance at your phone is all it takes...')
    await page.getByRole('heading', { name: 'Events' }).waitFor()
    await page.waitForLoadState('networkidle')
    await captionAt('bottom')
    await say("...and you're in. No email, no link.", 2800)
    await speak('Next time, the app remembers your choice.', 2600)
    await sleep(page, 300)
    await click(page, page.getByRole('link', { name: 'Profile', exact: true }))
    await logOut.waitFor()
    await click(page, logOut, onScreen)
    await page.getByText('Last', { exact: true }).waitFor()
    await restoreCaption('Next time, the app remembers your choice.')
    await untilLineEnds()
    await sleep(page, 300)
    await moveTo(page, passkeyButton)
    await say('Your last sign-in is marked, and on your next visit your phone asks straight away.', 3600)
    await sleep(page, 800)
  })
}
