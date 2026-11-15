/**
 * Steps for the out-of-pocket expense promo (ADR-0048/0049): a member records what they paid for the team
 * with their own money, the total is read from the photo of the receipt, the expense is changed, and the
 * pool works without a Bunq connection. The real SPA against api-fixture.mjs; the text recognition is the
 * real one, served by the build under /ocr. Recorded and voiced with the feature-promo-video skill (its
 * SKILL.md explains the steps). One take serves both phones; only the frame differs.
 *
 * Regenerate from the repo root. PORT is any free port, OUT a scratch directory.
 *   SK=.agents/skills/feature-promo-video
 *   uv run $SK/scripts/narrate.py docs/demo/out-of-pocket.narration.json $OUT/voice
 *   node $SK/scripts/cards.mjs docs/demo/out-of-pocket.narration.json $OUT/cards
 *   VITE_API_URL= npm --prefix app run build
 *   app/node_modules/.bin/vite preview "$PWD/app" --port $PORT --strictPort   # in the background
 *   PROBE=1 $SK/scripts/record.sh docs/demo/out-of-pocket.steps.mjs $OUT $PORT
 *   $SK/scripts/record.sh docs/demo/out-of-pocket.steps.mjs $OUT $PORT
 *   uv run $SK/scripts/assemble.py $OUT/take $OUT/take.log $OUT/voice/clips.json $OUT/cards out-of-pocket-promo-ios.mp4 \
 *     --song $SK/music/teambalance-theme.json --phone ios        # --phone android; add --cut once the user picked one
 */
import { fileURLToPath } from 'node:url'
import { disconnectBunq, installFixtureApi } from './api-fixture.mjs'
import { narratedTake } from './narrated-take.mjs'

const TEAM_SLUG = 'heren-3'
const RECEIPT = fileURLToPath(new URL('./receipt.jpg', import.meta.url))
const WHAT = 'Team drinks'

export default async function script({ page, caption, section, sleep, click, type, scrollTo, BASE }) {
  const { speak, say, untilLineEnds, captionAt } = await narratedTake({ page, caption, sleep })
  await installFixtureApi(page, { role: 'MEMBER' })
  const balance = page.getByRole('region', { name: 'Balance' })
  const payments = page.getByRole('region', { name: 'Payments' })
  const toppers = page.getByRole('region', { name: 'Toppers' })
  const expense = payments.getByRole('listitem').filter({ hasText: WHAT })
  const sheet = page.getByRole('dialog')

  await section('pool', async () => {
    await page.goto(`${BASE}/t/${TEAM_SLUG}`)
    await page.getByRole('heading', { name: 'Events' }).waitFor()
    await page.waitForLoadState('networkidle')
    await sleep(page, 600)
    await speak('Paid with your own money? Open Money.', 2800)
    await sleep(page, 400)
    await click(page, page.getByRole('link', { name: 'Money', exact: true }))
    await balance.getByText('Pool balance', { exact: true }).waitFor()
    await untilLineEnds()
  })

  await section('record', async () => {
    await speak('Tap "Add an expense you paid".', 2200)
    await sleep(page, 300)
    await click(page, page.getByRole('button', { name: 'Add an expense you paid' }))
    await sheet.getByRole('heading', { name: 'Add an expense you paid' }).waitFor()
    await captionAt('top')
    await untilLineEnds()

    await speak('Start with a photo of the receipt.', 2400)
    await sleep(page, 300)
    const chooser = page.waitForEvent('filechooser')
    await click(page, sheet.getByRole('button', { name: 'Add receipt' }))
    await (await chooser).setFiles(RECEIPT)
    await sheet.getByRole('img', { name: 'The receipt you added' }).waitFor()
    await untilLineEnds()

    await speak('The app reads the total for you.', 3000)
    await sheet.getByText('Read from the receipt. Check that it is the total.').waitFor({ timeout: 90_000 })
    await scrollTo(page, sheet.getByLabel('Amount (€)'))
    await untilLineEnds()
    await sleep(page, 900)

    await speak('Say what it was for, and save.', 2600)
    await type(page, sheet.getByLabel('What was it for?'), WHAT)
    await sleep(page, 400)
    await click(page, sheet.getByRole('button', { name: 'Save expense' }))
    await sheet.waitFor({ state: 'hidden' })
    await captionAt('bottom')
    await untilLineEnds()
  })

  await section('result', async () => {
    // The line starts as the sheet closes; the row scrolls into view while it is spoken.
    await speak('One row: what it was, and that you paid.', 3200)
    await scrollTo(page, expense)
    await untilLineEnds()
    await scrollTo(page, balance)
    await sleep(page, 400)
    await say('It counts as spent, and as your contribution.', 3000)
    await sleep(page, 300)
    await say('So the balance stays the same.', 3000)
    await speak('And you climb the Toppers.', 2600)
    await scrollTo(page, toppers)
    await untilLineEnds()
  })

  await section('change', async () => {
    await speak('Made a mistake? Open it again.', 2600)
    await scrollTo(page, expense)
    await click(page, expense.getByRole('button', { name: `Change expense ${WHAT}` }))
    await sheet.getByRole('heading', { name: 'Change this expense' }).waitFor()
    await captionAt('top')
    await untilLineEnds()
    await speak('Fix the amount, and save.', 2400)
    const amount = sheet.getByLabel('Amount (€)')
    await amount.fill('')
    await type(page, amount, '36,60')
    await click(page, sheet.getByRole('button', { name: 'Save changes' }))
    await sheet.waitFor({ state: 'hidden' })
    await captionAt('bottom')
    await expense.getByText('€36.60').waitFor()
    await untilLineEnds()
  })

  await section('without Bunq', async () => {
    disconnectBunq()
    await page.goto(`${BASE}/t/${TEAM_SLUG}/money`)
    await page.getByRole('region', { name: 'Paid by members' }).waitFor()
    await say('No Bunq account for the team? It still works.', 3400)
    await speak('Everyone sees who paid what.', 2600)
    await scrollTo(page, toppers)
    await untilLineEnds()
    await sleep(page, 800)
  })
}
