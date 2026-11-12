/**
 * Steps for the events-tab promo: the events overview, answering attendance on it, the lineup, the
 * filters, the event page and the admin actions. The real SPA against api-fixture.mjs, recorded and
 * voiced with the feature-promo-video skill (its SKILL.md explains the steps).
 *
 * Regenerate from the repo root. PORT is any free port (check with `lsof -i :$PORT`), OUT a scratch directory.
 * The user picked the music cut at 13.32 s; the take is not played inside a phone (no --phone, no PHONE_OS).
 *   SK=.agents/skills/feature-promo-video
 *   uv run $SK/scripts/narrate.py docs/demo/events.narration.json $OUT/voice
 *   node $SK/scripts/cards.mjs docs/demo/events.narration.json $OUT/cards
 *   VITE_API_URL= npm --prefix app run build
 *   app/node_modules/.bin/vite preview "$PWD/app" --port $PORT --strictPort   # in the background
 *   PROBE=1 $SK/scripts/record.sh docs/demo/events.steps.mjs $OUT $PORT
 *   $SK/scripts/record.sh docs/demo/events.steps.mjs $OUT $PORT
 *   uv run $SK/scripts/assemble.py $OUT/take $OUT/take.log $OUT/voice/clips.json $OUT/cards events-promo.mp4 \
 *     --song $SK/music/teambalance-theme.json --cut 13.32
 */
import { installFixtureApi } from './api-fixture.mjs'
import { narratedTake } from './narrated-take.mjs'

const TEAM_SLUG = 'heren-3'

export default async function script({ page, caption, section, sleep, click, scrollTo, moveTo, BASE }) {
  const { speak, say, untilLineEnds, captionAt } = await narratedTake({ page, caption, sleep })
  await installFixtureApi(page)
  const onScreen = { scroll: false }
  // `.card-enter` is EventCard's root; the title link says which event (two cards share a title).
  const card = (id) => page.locator('.card-enter').filter({ has: page.locator(`a[href$="/events/${id}"]`) })
  const nextTraining = card('evt-2')
  const drinks = card('evt-3')
  const laterTraining = card('evt-4')
  const listHeading = page.getByRole('heading', { name: 'Upcoming' })

  await section('overview', async () => {
    await page.goto(`${BASE}/t/${TEAM_SLUG}`)
    await page.getByRole('heading', { name: 'Events' }).waitFor()
    await page.waitForLoadState('networkidle')
    await sleep(page, 600)
    await say('Who is coming to the next match?', 2600)
    await speak('Events lists every training, match and social.', 3000)
    await sleep(page, 300)
    await scrollTo(page, laterTraining, { settle: 1300 })
    await scrollTo(page, listHeading, { settle: 900 })
    await untilLineEnds()
    await speak('The next event is on top. Tap Going, and you are in.', 3200)
    await sleep(page, 900)
    await click(page, page.getByRole('button', { name: 'Going', exact: true }), onScreen)
    await page.getByText("8 going · you're in").waitFor()
    await untilLineEnds()
    await sleep(page, 500)
  })

  await section('answers', async () => {
    await scrollTo(page, laterTraining)
    // The last card cannot scroll clear of the bottom caption, so the caption goes to the top for it.
    await captionAt('top')
    await sleep(page, 300)
    await speak('An event you have not answered says "Respond". Tap it.', 3000)
    await sleep(page, 900)
    await click(page, laterTraining.getByRole('button', { name: /Respond/ }), onScreen)
    const maybe = laterTraining.getByRole('button', { name: 'Maybe', exact: true })
    await maybe.waitFor()
    await scrollTo(page, maybe, { settle: 500 })
    await untilLineEnds()
    // One line for all three options; the pointer moves to each as it is named.
    await speak("Green is going, gold is maybe, red is can't.", 3400)
    await sleep(page, 200)
    await moveTo(page, laterTraining.getByRole('button', { name: 'Going', exact: true }))
    await sleep(page, 1100)
    await moveTo(page, maybe)
    await sleep(page, 1100)
    await moveTo(page, laterTraining.getByRole('button', { name: "Can't", exact: true }))
    await untilLineEnds()
    await speak('Not sure yet: pick Maybe.', 2000)
    await sleep(page, 400)
    await click(page, maybe, onScreen)
    await laterTraining.getByRole('button', { name: /You said maybe/ }).waitFor()
    await untilLineEnds()
    await sleep(page, 400)
    await scrollTo(page, drinks)
    await sleep(page, 300)
    await captionAt('bottom')
    await speak('Plans change. Tap your answer and pick again.', 3000)
    await sleep(page, 500)
    await click(page, drinks.getByRole('button', { name: /You said maybe/ }), onScreen)
    await sleep(page, 700)
    await click(page, drinks.getByRole('button', { name: "Can't", exact: true }), onScreen)
    await drinks.getByRole('button', { name: /You're out/ }).waitFor()
    await untilLineEnds()
    await sleep(page, 500)
  })

  await section('lineup', async () => {
    await scrollTo(page, nextTraining)
    await sleep(page, 300)
    const verdict = nextTraining.getByRole('button', { name: /Show lineup/ })
    await speak('The badge on the right says if the team is complete.', 2800)
    await sleep(page, 300)
    await moveTo(page, verdict)
    await untilLineEnds()
    await speak('Tap it for the lineup: who is coming, per position.', 3000)
    await sleep(page, 400)
    await click(page, verdict, onScreen)
    await scrollTo(page, nextTraining.getByText('Libero'))
    await untilLineEnds()
    await sleep(page, 500)
    await click(page, nextTraining.getByRole('button', { name: /Hide lineup/ }), { settle: 300 })
  })

  await section('filters', async () => {
    const filters = page.getByRole('button', { name: 'Filters', exact: true })
    const panel = page.getByRole('region', { name: 'Filters' })
    await scrollTo(page, listHeading, { settle: 400 })
    // One line for the three chip groups; the pointer moves to each as it is named.
    await speak('Filters narrow the list: by type, by your answer, or by turnout.', 3600)
    await sleep(page, 300)
    await click(page, filters, onScreen)
    await panel.waitFor()
    await sleep(page, 600)
    await moveTo(page, panel.getByText('Event types'))
    await sleep(page, 900)
    await moveTo(page, panel.getByText('Your answer'))
    await sleep(page, 900)
    await moveTo(page, panel.getByText('Turnout'))
    await untilLineEnds()
    await speak('One tap on Training leaves only the trainings.', 2800)
    await sleep(page, 400)
    await click(page, panel.getByRole('button', { name: 'Training', exact: true }), onScreen)
    await sleep(page, 500)
    // The hero follows the filters: the next training moves up into it, and the list keeps the later one.
    await scrollTo(page, laterTraining, { settle: 900 })
    await untilLineEnds()
    await sleep(page, 400)
    await speak('"Clear filters" brings everything back.', 2000)
    await sleep(page, 300)
    await click(page, page.getByRole('button', { name: 'Clear filters' }), { block: 'start', settle: 500 })
    await click(page, filters, onScreen)
    await panel.waitFor({ state: 'hidden' })
    await untilLineEnds()
  })

  await section('event-page', async () => {
    await scrollTo(page, nextTraining)
    await speak("Open an event for the details and everyone's answer.", 3000)
    await sleep(page, 500)
    await click(page, page.locator('a[href$="/events/evt-2"]'), onScreen)
    await page.getByRole('heading', { name: 'Tuesday Training', level: 1 }).waitFor()
    await page.waitForLoadState('networkidle')
    await sleep(page, 700)
    await scrollTo(page, page.getByText('Libero', { exact: true }), { settle: 900 })
    await untilLineEnds()
    await sleep(page, 600)
  })

  await section('admin', async () => {
    const edit = page.getByRole('button', { name: 'Edit event' })
    await scrollTo(page, edit)
    // The buttons are at the bottom of the page, under the bottom caption.
    await captionAt('top')
    // One line for the three admin buttons; the pointer moves to each as it is named.
    await speak('Admins edit or delete the event here, or reset the responses.', 3600)
    await sleep(page, 300)
    await moveTo(page, edit)
    await sleep(page, 1000)
    await moveTo(page, page.getByRole('button', { name: 'Delete', exact: true }))
    await sleep(page, 1000)
    await moveTo(page, page.getByRole('button', { name: 'Reset responses' }))
    await untilLineEnds()
    await sleep(page, 300)
    await captionAt('bottom')
    // Spoken over the way back to the list, so the navigation is not a silence.
    await speak('The plus button adds one event, or a whole series.', 3200)
    await click(page, page.getByRole('link', { name: 'Events', exact: true }))
    await listHeading.waitFor()
    await sleep(page, 300)
    await click(page, page.getByRole('button', { name: 'New Event' }), onScreen)
    const sheet = page.getByRole('dialog')
    await sheet.getByRole('button', { name: /Single event/ }).waitFor()
    await captionAt('top')
    await sleep(page, 500)
    await moveTo(page, sheet.getByRole('button', { name: /Single event/ }))
    await sleep(page, 1000)
    await moveTo(page, sheet.getByRole('button', { name: /Recurring series/ }))
    await untilLineEnds()
    await sleep(page, 800)
    await page.keyboard.press('Escape')
    await sheet.waitFor({ state: 'hidden' })
    await captionAt('bottom')
    await sleep(page, 400)
  })
}
