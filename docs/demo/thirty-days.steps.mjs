/**
 * Steps for the "thirty days" recap (12 Oct to 11 Nov 2026): today's SPA against api-fixture.mjs, with
 * screenshots of the SPA as it was at commit 6aa00793 wiped over it (then-and-now.mjs), and cards for
 * the work that has no screen. Recorded and voiced with the feature-promo-video skill.
 *
 * The old screenshots in thirty-days/ come from the SPA built at 6aa00793 in a detached worktree,
 * served with `vite preview` and opened with that commit's own api-fixture.mjs at 390x844, DSF 3:
 * /login (signed out), /t/heren-3, /t/heren-3/money and /t/heren-3/profile. Their event dates are the
 * dates of the day they were taken.
 *
 *   S=.agents/skills/feature-promo-video/scripts; OUT=/tmp/thirty-days
 *   uv run $S/narrate.py docs/demo/thirty-days.narration.json $OUT/voice
 *   node $S/cards.mjs docs/demo/thirty-days.narration.json $OUT/cards
 *   $S/record.sh docs/demo/thirty-days.steps.mjs $OUT
 *   uv run $S/assemble.py $OUT/take $OUT/take.log $OUT/voice/clips.json $OUT/cards thirty-days-promo.mp4 \
 *     --song $S/../music/teambalance-theme.json            # no --phone: the cards in the take are full-screen
 */
import { installFixtureApi, signOut } from './api-fixture.mjs'
import { narratedTake } from './narrated-take.mjs'
import { card, thenAndNow } from './then-and-now.mjs'

const chips = (names) => names.map((n, i) => `<div class="chip" style="--d:${(0.9 + i * 0.32).toFixed(2)}s">${n}</div>`).join('')
const rows = (items) => items.map(([head, sub], i) => `<div class="row in" style="--d:${(0.5 + i * 0.9).toFixed(1)}s"><div>${head}<small>${sub}</small></div></div>`).join('')

const CARDS = {
  jooq: `<div class="kicker">Under the hood</div><h1>Hibernate is gone. <em>jOOQ</em> runs every query.</h1><p class="in" style="--d:.3s;margin:-10px 0 14px;color:#64748B">Grey is JPA. Green is jOOQ.</p><div class="grid">${chips([
    'BunqConnection', 'BunqOAuthState', 'Invitation', 'Attendance', 'MoneyPoolSettings', 'Season', 'CalendarLink', 'Position',
    'Substitute', 'TeamMember', 'MemberProfile', 'Photo', 'User', 'MagicLink', 'EventType', 'Event',
  ])}</div>`,
  secrets: `<div class="kicker">Under the hood</div><h1>Secrets are <em>bound to their team</em>.</h1>
    <pre class="in" style="--d:.4s">encrypt(secret,\n  aad = <b>team id</b> + <b>purpose</b>)</pre>${rows([
    ['Bunq grant and API context', 'Stored on another team, they do not decrypt'],
    ['Invite and calendar link tokens', 'Existing rows were rebound at startup'],
    ['One user per email address', 'Julia@ and julia@ are the same account'],
  ])}`,
  bunq: `<div class="kicker">Under the hood</div><h1>The money pool reads <em>real Bunq</em>.</h1>
    <div class="flow in" style="--d:.4s"><span>App</span><u>→</u><span>API</span><u>→</u><span>Cache<small>30 s refresh</small></span><u>→</u><span>Bunq SDK</span></div>${rows([
    ['A timeout on every call', 'A slow Bunq does not hold the page'],
    ['A pause after a 429', 'The API waits when Bunq says slow down'],
    ['Rejected or unavailable', 'The Money page says which, and an admin reconnects'],
  ])}`,
  numbers: `<div class="kicker">12 Oct to 11 Nov</div><h1><em>Thirty days</em> in numbers.</h1>
    <div class="stats in" style="--d:.4s"><div><strong>148</strong>commits</div><div><strong>909</strong>files changed</div><div><strong>7</strong>new ADRs</div></div>${rows([
    ['CI in three parallel jobs', 'Backend, frontend and end-to-end'],
    ['Staging on demand', 'The production image with its own database'],
    ['A demo team for everyone', 'demo.teambalance.nl, reset every hour'],
  ])}`,
}

export default async function script({ page, caption, section, sleep, click, scrollTo, moveTo, BASE }) {
  const { speak, say, untilLineEnds, captionAt } = await narratedTake({ page, caption, sleep })
  await installFixtureApi(page)
  signOut()
  const then = thenAndNow(page, sleep, '12 Oct')
  const onScreen = { scroll: false }
  const nav = (name) => page.getByRole('link', { name, exact: true })

  await section('sign-in', async () => {
    await then.preload('login')
    await page.goto(`${BASE}/login`)
    const passkey = page.getByRole('button', { name: 'Sign in with a passkey' })
    await passkey.waitFor()
    await sleep(page, 500)
    await say('This was TeamBalance on the twelfth of October.', 2800)
    await speak('Signing in meant waiting for an email.', 2400)
    await sleep(page, 900)
    await then.to(0)
    await untilLineEnds()
    await speak('Today, a passkey signs you in with one tap.', 2600)
    await moveTo(page, passkey)
    await untilLineEnds()
  })

  await section('events', async () => {
    await then.preload('events')
    await page.goto(`${BASE}/auth/verify?token=demo`)
    await page.getByRole('heading', { name: 'Events' }).waitFor()
    await page.waitForLoadState('networkidle')
    await speak('The events page, a month ago...', 2000)
    await sleep(page, 1300)
    await then.to(50)
    await untilLineEnds()
    await speak('...and now. The same team, the same match.', 2600)
    await sleep(page, 1200)
    await then.to(0)
    await untilLineEnds()
    await say('The next event takes the colour of its type, and the header names the page.', 3600)
  })

  await section('money', async () => {
    await speak('The Money tab was a promise.', 2200)
    await moveTo(page, nav('Money'))
    await then.show('money')
    await click(page, nav('Money'), onScreen)
    await page.getByRole('region', { name: 'Balance' }).waitFor()
    await untilLineEnds()
    await sleep(page, 500)
    await speak("Now it is the team's Bunq account.", 2400)
    await then.to(0)
    await untilLineEnds()
    await moveTo(page, page.getByRole('group', { name: 'Beer Counter' }))
    await say('The balance, the pot over time, and how many beers it buys.', 3200)
    await speak('Top up with one button.', 1800)
    await moveTo(page, page.getByRole('button', { name: 'Top up' }))
    await untilLineEnds()
  })

  await section('assign', async () => {
    const assign = page.getByRole('button', { name: 'Assign J. VERMEER to a member' }).first()
    await captionAt('top')
    await speak('A payment without a member? An admin assigns it.', 2800)
    await sleep(page, 300)
    await click(page, assign, onScreen)
    const sheet = page.getByRole('dialog')
    await sheet.waitFor()
    await sheet.getByLabel('Member').selectOption({ label: 'Julia Vermeer' })
    await untilLineEnds()
    await speak('The next payment like it links itself.', 2400)
    await sleep(page, 400)
    await click(page, sheet.getByRole('button', { name: 'Link payment' }), onScreen)
    await sheet.waitFor({ state: 'hidden' })
    await captionAt('bottom')
    await untilLineEnds()
    const toppers = page.getByRole('heading', { name: 'Toppers' })
    await scrollTo(page, toppers)
    await page.evaluate(() => window.scrollBy({ top: 230, behavior: 'smooth' }))
    await sleep(page, 400)
    await say('And Toppers ranks who put in the most.', 2800)
  })

  await section('nevobo', async () => {
    await click(page, nav('Events'))
    await speak('Back on Events, open the match.', 2200)
    const match = page.locator('a[href$="/events/evt-1"]').first()
    await match.waitFor()
    await click(page, match, onScreen)
    const notice = page.getByRole('note').filter({ hasText: 'differs from Nevobo' })
    await notice.waitFor()
    await untilLineEnds()
    await moveTo(page, notice)
    await say('The league moved it by an hour. TeamBalance reads the Nevobo feed and noticed.', 4200)
    await speak('One tap takes over the new time.', 2400)
    await click(page, notice.getByRole('button', { name: 'Apply Nevobo values' }), onScreen)
    const dialog = page.getByRole('dialog')
    await dialog.waitFor()
    await captionAt('top')
    await sleep(page, 700)
    await click(page, dialog.getByRole('button', { name: 'Apply Nevobo values' }), onScreen)
    await dialog.waitFor({ state: 'hidden' })
    await captionAt('bottom')
    await untilLineEnds()
    await sleep(page, 600)
  })

  await section('profile', async () => {
    await speak('The profile was one long page.', 2200)
    await moveTo(page, nav('Profile'))
    await then.show('profile')
    await click(page, nav('Profile'), onScreen)
    const preferences = page.getByRole('link', { name: /Preferences/ })
    await preferences.waitFor()
    await untilLineEnds()
    await speak('Now it is four short rows.', 2000)
    await then.to(0)
    await untilLineEnds()
    await speak('Under Preferences, pick your language.', 2400)
    await click(page, preferences, onScreen)
    const dutch = page.getByText('Nederlands', { exact: true })
    await dutch.waitFor()
    await untilLineEnds()
    await click(page, dutch, onScreen)
    await page.getByRole('link', { name: 'Teampot', exact: true }).waitFor()
    await say('The whole app turns Dutch, and so do the emails.', 3000)
    await speak('Every screen is translated.', 2000)
    await click(page, nav('Teampot'))
    await page.getByRole('heading', { name: 'Betalingen' }).waitFor()
    await untilLineEnds()
    await sleep(page, 600)
  })

  await section('under-the-hood', async () => {
    await speak('Not everything shows. Hibernate is gone:', 2600)
    await card(page, CARDS.jooq)
    await untilLineEnds()
    await say('sixteen repositories moved to jOOQ, one at a time.', 4200)
    await sleep(page, 800)
    await speak('Stored secrets are now bound to their team.', 2800)
    await card(page, CARDS.secrets)
    await untilLineEnds()
    await say('Copied to another team, they do not decrypt.', 3000)
    await speak('The money pool reads the real Bunq API.', 2600)
    await card(page, CARDS.bunq)
    await untilLineEnds()
    await say('Cached, with timeouts, and a pause when Bunq says slow down.', 3600)
    await speak('A hundred and forty-eight commits in thirty days.', 3000)
    await card(page, CARDS.numbers)
    await untilLineEnds()
    await say('Tests run in parallel, staging deploys on demand, and anyone can try the demo team.', 4400)
    await sleep(page, 600)
  })
}
