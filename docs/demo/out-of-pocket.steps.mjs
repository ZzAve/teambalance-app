/**
 * Steps for the out-of-pocket expense demo (ADR-0048/0049): a member records what they paid for the team
 * with their own money, the total is read from the photo of the receipt, the expense is changed, and the
 * pool works without a Bunq connection. The real SPA against api-fixture.mjs; the text recognition is the
 * real one, served by the build under /ocr. Captions only, no voice: recorded with the demo-video skill.
 *
 * Regenerate from the repo root. PORT is any free port, OUT a scratch directory.
 *   SK=.agents/skills/demo-video/scripts
 *   VITE_API_URL= npm --prefix app run build
 *   app/node_modules/.bin/vite preview "$PWD/app" --port $PORT --strictPort   # in the background
 *   (cd app && WIDTH=390 HEIGHT=844 DSF=3 STEPS=../docs/demo/out-of-pocket.steps.mjs \
 *     BASE_URL=http://localhost:$PORT VIDEO_DIR=$OUT/take node ../$SK/record-harness.mjs)   # PROBE=1 first
 *   W=780 H=1688 $SK/to-mp4.sh out-of-pocket-demo.mp4 $OUT/take/*.webm   # portrait, not the 1440x900 default
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
    await speak('Paid for the team with your own money?', 2600)
    await sleep(page, 900)
    await click(page, page.getByRole('link', { name: 'Money', exact: true }))
    await balance.getByText('Pool balance', { exact: true }).waitFor()
    await untilLineEnds()
    await say('Add it to the pool. Nobody has to pay you back.', 3000)
  })

  await section('record', async () => {
    await speak('Tap "Add an expense you paid".', 2200)
    await sleep(page, 700)
    await click(page, page.getByRole('button', { name: 'Add an expense you paid' }))
    await sheet.getByRole('heading', { name: 'Add an expense you paid' }).waitFor()
    await captionAt('top')
    await untilLineEnds()

    await speak('Start with a photo of the receipt.', 2400)
    await sleep(page, 800)
    const chooser = page.waitForEvent('filechooser')
    await click(page, sheet.getByRole('button', { name: 'Add receipt' }))
    await (await chooser).setFiles(RECEIPT)
    await sheet.getByRole('img', { name: 'The receipt you added' }).waitFor()
    await untilLineEnds()

    await speak('The app reads the total from the photo, on your phone.', 3200)
    await sheet.getByText('Read from the receipt. Check that it is the total.').waitFor({ timeout: 90_000 })
    await scrollTo(page, sheet.getByLabel('Amount (€)'))
    await untilLineEnds()
    await sleep(page, 1800)

    await speak('Say what it was for, and save.', 2600)
    await type(page, sheet.getByLabel('What was it for?'), WHAT)
    await sleep(page, 600)
    await click(page, sheet.getByRole('button', { name: 'Save expense' }))
    await sheet.waitFor({ state: 'hidden' })
    await captionAt('bottom')
    await untilLineEnds()
  })

  await section('result', async () => {
    await scrollTo(page, expense)
    await sleep(page, 500)
    await say('One row: the expense, and who paid it.', 3200)
    await scrollTo(page, balance)
    await sleep(page, 500)
    await say('It counts as spent and as your contribution. The balance stays the same.', 4200)
    await scrollTo(page, toppers)
    await sleep(page, 500)
    await say('It counts for you in the Toppers.', 3200)
  })

  await section('change', async () => {
    await scrollTo(page, expense)
    await sleep(page, 500)
    await speak('Made a mistake? Change it, or delete it.', 2800)
    await sleep(page, 900)
    await click(page, expense.getByRole('button', { name: `Change expense ${WHAT}` }))
    await sheet.getByRole('heading', { name: 'Change this expense' }).waitFor()
    await captionAt('top')
    await untilLineEnds()
    const amount = sheet.getByLabel('Amount (€)')
    await amount.fill('')
    await type(page, amount, '36,60')
    await sleep(page, 700)
    await click(page, sheet.getByRole('button', { name: 'Save changes' }))
    await sheet.waitFor({ state: 'hidden' })
    await captionAt('bottom')
    await expense.getByText('€36.60').waitFor()
    await say('The row and the totals follow.', 2600)
  })

  await section('without Bunq', async () => {
    disconnectBunq()
    await page.goto(`${BASE}/t/${TEAM_SLUG}/money`)
    await page.getByRole('region', { name: 'Paid by members' }).waitFor()
    await sleep(page, 600)
    await say('No Bunq account for the team? It works without one.', 3800)
    await scrollTo(page, toppers)
    await sleep(page, 500)
    await say('The team still sees who paid what.', 3200)
  })
}
