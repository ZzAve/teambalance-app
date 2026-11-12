/**
 * Steps for the money pool promo (ADR-0007/0042/0044/0046): the real SPA against api-fixture.mjs,
 * recorded and voiced with the feature-promo-video skill (its SKILL.md has the commands). Julia is a
 * member here, so an unknown payment offers "That's mine". bunq.me is drawn by a neutral stand-in page
 * (no bunq branding); paying there lands the top-up in the fixture's pool.
 *
 * Render choices of the published videos (2026-11-12), so a regeneration needs no new listening round.
 * One take serves both phones; only the frame differs. PORT is any free port, OUT a scratch directory:
 *
 *   S=.agents/skills/feature-promo-video/scripts
 *   uv run $S/narrate.py docs/demo/money-pool.narration.json $OUT/voice
 *   node $S/cards.mjs docs/demo/money-pool.narration.json $OUT/cards
 *   VITE_API_URL= npm --prefix app run build
 *   app/node_modules/.bin/vite preview "$PWD/app" --port $PORT --strictPort   # in the background
 *   PROBE=1 $S/record.sh docs/demo/money-pool.steps.mjs $OUT $PORT
 *   $S/record.sh docs/demo/money-pool.steps.mjs $OUT $PORT
 *   uv run $S/assemble.py $OUT/take $OUT/take.log $OUT/voice/clips.json $OUT/cards money-pool-promo-ios.mp4 \
 *     --song $S/../music/teambalance-theme.json --cut 18.02 --phone ios        # --phone android
 */
import { fileURLToPath } from 'node:url'
import { installFixtureApi, paidTopUp } from './api-fixture.mjs'
import { narratedTake } from './narrated-take.mjs'

const TEAM_SLUG = 'heren-3'
const RECEIPT = fileURLToPath(new URL('./receipt.jpg', import.meta.url))

// What the browser shows at the bunq.me link: the amount and the description the app put in it, without
// the user id at its end.
const handOffPage = (url) => {
  const [, , euros, description] = new URL(url).pathname.split('/')
  return `<!doctype html><html style="background:#F8F6F0"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<style>body{margin:0;font:16px/1.4 -apple-system,'Helvetica Neue',sans-serif;color:#1E293B;display:flex;flex-direction:column;align-items:center;padding:150px 24px 0;text-align:center}
.amount{font-size:48px;font-weight:800;margin:12px 0 4px}.muted{color:#64748B;font-size:14px}
button{margin-top:40px;width:100%;max-width:320px;height:52px;border:0;border-radius:12px;background:#225C9C;color:#fff;font:600 17px/1 inherit}
.paid{display:none;margin-top:40px;font-size:20px;font-weight:700;color:#249E6C}</style></head>
<body><p class="muted">bunq.me/heren3</p><p>Pay to <b>Heren 3</b></p><p class="amount">€${euros},00</p>
<p class="muted">${decodeURIComponent(description).split(' · ').slice(0, -1).join(' · ')}</p>
<button onclick="this.style.display='none';document.querySelector('.paid').style.display='block'">Pay €${euros}</button>
<p class="paid">✓ Paid</p></body></html>`
}

export default async function script({ page, caption, section, sleep, click, scrollTo, moveTo, BASE }) {
  const { speak, say, untilLineEnds, captionAt } = await narratedTake({ page, caption, sleep })
  await installFixtureApi(page, { role: 'MEMBER' })
  await page.route('https://bunq.me/**', (route) => route.fulfill({ contentType: 'text/html; charset=utf-8', body: handOffPage(route.request().url()) }))
  const onScreen = { scroll: false }
  const balance = page.getByRole('region', { name: 'Balance' })
  const payments = page.getByRole('region', { name: 'Payments' })
  const row = (name) => payments.getByRole('listitem').filter({ hasText: name }).first()

  await section('pool', async () => {
    await page.goto(`${BASE}/t/${TEAM_SLUG}`)
    await page.getByRole('heading', { name: 'Events' }).waitFor()
    await page.waitForLoadState('networkidle')
    await sleep(page, 600)
    await say('Beer money used to mean scrolling the group chat.', 3000)
    await speak('Now it is one tap: Money.', 2200)
    await sleep(page, 400)
    await click(page, page.getByRole('link', { name: 'Money', exact: true }))
    await balance.getByText('Pool balance', { exact: true }).waitFor()
    await untilLineEnds()
    await speak('The team pot, live from its Bunq account.', 2600)
    await moveTo(page, balance.getByText('€243.10'))
    await untilLineEnds()
    await speak('What it buys in beers, and how it moved.', 2600)
    await moveTo(page, balance.getByRole('group', { name: 'Beer Counter' }))
    await sleep(page, 1100)
    await moveTo(page, balance.locator('svg').last())
    await untilLineEnds()
  })

  await section('top-up', async () => {
    const sheet = page.getByRole('dialog')
    // Before the sheet opens, so the caption never covers it while it slides in.
    await captionAt('top')
    await speak('Your turn to chip in: tap Top up.', 2400)
    await sleep(page, 400)
    await click(page, page.getByRole('button', { name: 'Top up', exact: true }))
    await sheet.getByRole('heading', { name: 'Top up the pool' }).waitFor()
    await untilLineEnds()
    await speak('Pick an amount. €20 will do.', 2200)
    await moveTo(page, sheet.getByRole('group', { name: 'Amounts' }))
    await sleep(page, 900)
    await click(page, sheet.getByRole('button', { name: '€20', exact: true }), onScreen)
    await page.waitForURL(/bunq\.me/)
    await untilLineEnds()
    await speak('You pay on the team\'s bunq.me page.', 2400)
    await sleep(page, 500)
    await click(page, page.getByRole('button', { name: 'Pay €20' }), onScreen)
    await untilLineEnds()
    await sleep(page, 500)
    paidTopUp()
    await page.goto(`${BASE}/t/${TEAM_SLUG}/money`)
    await captionAt('bottom')
    await balance.getByText('Pool balance', { exact: true }).waitFor()
    await page.waitForLoadState('networkidle')
    await sleep(page, 400)
    await speak('Back in the app, your €20 is in the pot.', 2800)
    await moveTo(page, balance.getByText('€263.10'))
    await sleep(page, 1300)
    await scrollTo(page, row('Julia Vermeer'))
    await moveTo(page, row('Julia Vermeer'))
    await untilLineEnds()
  })

  await section('receipt', async () => {
    const dialog = page.getByRole('dialog')
    await speak('The pot paid for something: add the receipt.', 2400)
    await scrollTo(page, row('Café De Zwaluw'))
    await sleep(page, 300)
    await captionAt('top')
    await click(page, page.getByRole('button', { name: 'Receipt for Café De Zwaluw' }), onScreen)
    await dialog.getByRole('heading', { name: 'Receipt' }).waitFor()
    await sleep(page, 400)
    const [chooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      click(page, dialog.getByRole('button', { name: 'Add receipt' }), onScreen),
    ])
    await chooser.setFiles(RECEIPT)
    await dialog.getByRole('img', { name: 'Receipt for Café De Zwaluw' }).waitFor()
    await untilLineEnds()
    await say('Now the whole team sees what it was for.', 2400)
    await page.keyboard.press('Escape')
    await dialog.waitFor({ state: 'hidden' })
    await captionAt('bottom')
  })

  await section('claim', async () => {
    const sheet = page.getByRole('dialog')
    const transfer = row('J. VERMEER')
    await speak('A bank transfer without your name: tap That\'s mine.', 2600)
    await scrollTo(page, transfer)
    await sleep(page, 300)
    await captionAt('top')
    await click(page, transfer.getByRole('button', { name: 'That\'s mine: J. VERMEER' }), onScreen)
    await sheet.getByRole('heading', { name: 'Is this payment yours?' }).waitFor()
    await untilLineEnds()
    await speak('Link your name and IBAN once. The next one links itself.', 3000)
    await moveTo(page, sheet.getByRole('switch', { name: 'Name: J. VERMEER' }))
    await sleep(page, 700)
    await moveTo(page, sheet.getByRole('switch', { name: 'The IBAN of this payment' }))
    await sleep(page, 700)
    await click(page, sheet.getByRole('button', { name: 'Link payment' }), onScreen)
    await sheet.waitFor({ state: 'hidden' })
    await captionAt('bottom')
    await page.getByText(/^Linked to Julia Vermeer/).waitFor()
    await untilLineEnds()
  })

  await section('toppers', async () => {
    const toppers = page.getByRole('heading', { name: 'Toppers' })
    // The podium fills the lower half of the screen; keep the caption off it.
    await captionAt('top')
    await speak('And the Toppers: who keeps the pot full.', 3200)
    // The entrance (the podium grows, the trophy lands) starts when the podium scrolls into view.
    await scrollTo(page, toppers, { block: 'start' })
    await untilLineEnds()
    await sleep(page, 400)
    await speak('Press play to watch the race for first place.', 3200)
    await sleep(page, 300)
    await click(page, page.getByRole('button', { name: 'Play the ranking' }), onScreen)
    await untilLineEnds()
    await sleep(page, 300)
    await say('Two linked transfers later, you are on top.', 2600)
    await sleep(page, 600)
  })
}
