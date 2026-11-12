/**
 * Steps for the language promo (#464): one switch in Profile puts the whole SPA in Dutch. The real SPA
 * against api-fixture.mjs, recorded and voiced with the feature-promo-video skill.
 *
 * Render choices of the published videos (2026-11-12), so a regeneration needs no new listening round.
 * One take, framed twice:
 *
 *   S=.agents/skills/feature-promo-video/scripts; OUT=/tmp/language
 *   uv run $S/narrate.py docs/demo/language.narration.json $OUT/voice
 *   node $S/cards.mjs docs/demo/language.narration.json $OUT/cards
 *   $S/record.sh docs/demo/language.steps.mjs $OUT
 *   uv run $S/assemble.py $OUT/take $OUT/take.log $OUT/voice/clips.json $OUT/cards language-promo-ios.mp4 \
 *     --song $S/../music/teambalance-theme.json --cut 18.02 --phone ios        # -android.mp4, --phone android
 *
 * docs/demo/language*.transcript.md repeat the assemble command they came from.
 */
import { installFixtureApi } from './api-fixture.mjs'
import { narratedTake } from './narrated-take.mjs'

const TEAM_SLUG = 'heren-3'

export default async function script({ page, caption, section, sleep, click, scrollTo, BASE }) {
  const { speak, say, untilLineEnds } = await narratedTake({ page, caption, sleep })
  await installFixtureApi(page)
  const nav = (name) => page.getByRole('navigation').getByRole('link', { name, exact: true })
  const top = () => page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }))

  await section('english', async () => {
    await page.goto(`${BASE}/t/${TEAM_SLUG}`)
    await page.getByRole('heading', { name: 'Events' }).waitFor()
    await page.waitForLoadState('networkidle')
    await sleep(page, 600)
    await say('Dutch players, international teammates: one app for both.', 3200)
    await speak('Pick your language in Profile, under Preferences.', 2600)
    await sleep(page, 300)
    await click(page, nav('Profile'))
    await click(page, page.getByRole('link', { name: /Preferences/ }))
    const nl = page.getByText('Nederlands', { exact: true })
    await nl.waitFor()
    await page.waitForLoadState('networkidle')
    await scrollTo(page, nl)
    await untilLineEnds()
  })

  await section('switch', async () => {
    await sleep(page, 300)
    await speak('Nederlands or English: tap one.', 2200)
    await sleep(page, 700)
    await click(page, page.getByText('Nederlands', { exact: true }), { scroll: false })
    await page.getByRole('heading', { name: 'Taal' }).waitFor()
    await untilLineEnds()
    await sleep(page, 300)
    await top()
    await sleep(page, 500)
    await say('The page and the nav switch at once.', 2800)
  })

  await section('events', async () => {
    await speak('Events: dates, answers and filters in Dutch.', 3000)
    await sleep(page, 400)
    await click(page, nav('Events'))
    await page.getByRole('region', { name: 'Volgende' }).waitFor()
    await top()
    await untilLineEnds()
    await sleep(page, 400)
    await say('"Event" stays "Event". That is what Dutch teams say.', 2800)
  })

  await section('detail', async () => {
    await speak('Open an event: the full date, who is coming, the lineup.', 3200)
    await sleep(page, 500)
    await click(page, page.getByRole('link', { name: /League Match vs Smash United/ }).first())
    await page.getByRole('heading', { name: /Smash United/, level: 1 }).waitFor()
    await page.waitForLoadState('networkidle')
    await untilLineEnds()
    await sleep(page, 400)
    await page.mouse.wheel(0, 500)
    await sleep(page, 900)
    await say('Team names, titles and notes stay as your team wrote them.', 3200)
  })

  await section('money', async () => {
    await speak('Teampot: Dutch money format, down to the beer count.', 3000)
    await sleep(page, 400)
    await click(page, nav('Teampot'))
    await page.getByText('Café De Zwaluw').waitFor()
    await page.waitForLoadState('networkidle')
    await untilLineEnds()
    await sleep(page, 800)
  })

  await section('team', async () => {
    await speak('Team: members, substitutes and the invite link.', 2800)
    await sleep(page, 400)
    await click(page, nav('Team'))
    await page.getByText('Invallers').first().waitFor()
    await page.waitForLoadState('networkidle')
    await untilLineEnds()
    await sleep(page, 600)
  })

  await section('reload', async () => {
    await speak('Saved on your account: it stays after a reload, on every device.', 3400)
    await sleep(page, 900)
    await page.reload()
    await page.getByText('Invallers').first().waitFor()
    await page.waitForLoadState('networkidle')
    await untilLineEnds()
    await sleep(page, 400)
    await say('Emails come in your language too.', 2600)
    await sleep(page, 500)
  })
}
