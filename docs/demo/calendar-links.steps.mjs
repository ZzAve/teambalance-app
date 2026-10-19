/**
 * Steps for the calendar-links demo (ADR-0039/0040): the real SPA against api-fixture.mjs, driven by
 * the demo-video skill's record-harness.
 *
 *   cd app && VITE_API_URL= npm run build && npx vite preview --port 4173
 *   STEPS=docs/demo/calendar-links.steps.mjs BASE_URL=http://localhost:4173 VIDEO_DIR=/tmp/demo/seg1 \
 *     node .agents/skills/demo-video/scripts/record-harness.mjs
 *
 * Portrait (phone) take: the same steps at a phone viewport, recorded at 3x for a crisp video.
 *   WIDTH=390 HEIGHT=844 DSF=3 STEPS=… node .agents/skills/demo-video/scripts/record-harness.mjs
 *
 * Narrated take: the feature-promo-video skill voices calendar-links.narration.json into clips.json
 * ({ caption: { file, seconds } }); pass it as NARRATION=…. The take then holds each caption for its
 * line and prints CAPTION_AT lines, which the skill's assemble.py uses to lay the clips onto the video.
 */
import { readFileSync } from 'node:fs'
import { installFixtureApi } from './api-fixture.mjs'

const TEAM_SLUG = 'heren-3'

export default async function script({ page, caption, section, sleep, click, type, scrollTo, moveTo, BASE }) {
  await installFixtureApi(page)
  // The Copy button writes to the clipboard; without the permission it shows its fallback instead.
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])

  // A phone-width take (WIDTH=390 DSF=3): a smaller caption, and the arrow pointer drawn as a touch
  // dot, since a phone has no cursor.
  const phone = page.viewportSize().width < 600

  // The harness only styles the caption pill when it has to create it. Pre-create it above the fixed
  // bottom nav, in the app's own body font and brand accent.
  const ensureCaption = () =>
    page.evaluate((phone) => {
      if (phone && !document.getElementById('__demo_touch__')) {
        const style = document.createElement('style')
        style.id = '__demo_touch__'
        style.textContent =
          '#__demo_cursor__ svg{display:none}' +
          '#__demo_cursor__{width:30px!important;height:30px!important;margin:-13px 0 0 -11px;border-radius:50%;' +
          'background:rgba(30,41,59,.32);border:2px solid rgba(255,255,255,.9);filter:none!important}' +
          '#__demo_ring__{border-color:#225C9C!important;border-width:3px!important}'
        document.head.appendChild(style)
      }
      if (document.getElementById('__demo_caption__')) return
      const el = document.createElement('div')
      el.id = '__demo_caption__'
      el.style.cssText = [
        'position:fixed', 'left:50%', phone ? 'bottom:96px' : 'bottom:118px', 'transform:translateX(-50%)',
        'z-index:2147483647', 'background:rgba(30,41,59,0.94)', 'color:#fff',
        phone ? "font:600 15px/1.35 'DM Sans Variable','DM Sans',sans-serif" : "font:600 19px/1.4 'DM Sans Variable','DM Sans',sans-serif",
        phone ? 'padding:10px 16px' : 'padding:13px 24px', 'border-radius:12px', phone ? 'width:max-content;max-width:92vw' : 'max-width:720px',
        'text-align:center', 'box-shadow:0 8px 28px rgba(0,0,0,0.3)', 'border-left:5px solid #F4B400',
        'pointer-events:none',
      ].join(';')
      document.body.appendChild(el)
    }, phone)
  // With NARRATION=<json of caption text → { seconds }>, a caption stays up at least as long as its
  // spoken line, and every caption's start is logged (ms since the take began) so the clips can be
  // laid onto the recording afterwards.
  const narration = process.env.NARRATION ? JSON.parse(readFileSync(process.env.NARRATION, 'utf8')) : {}
  const startedAt = Date.now()
  let lineEndsAt = 0
  // Shows a caption and returns at once, so the action it names can run while the line is spoken.
  const speak = async (text, hold) => {
    await ensureCaption()
    await caption(page, text)
    console.log(`CAPTION_AT ${Date.now() - startedAt} ${text}`)
    const spoken = narration[text]?.seconds
    lineEndsAt = Date.now() + (spoken ? Math.max(hold, spoken * 1000 + 300) : hold)
  }
  const untilLineEnds = () => sleep(page, Math.max(0, lineEndsAt - Date.now()))
  const say = async (text, hold) => {
    await speak(text, hold)
    await untilLineEnds()
  }
  const onScreen = { scroll: false }

  const form = page.locator('form').last()
  const presetGroup = page.getByRole('radiogroup', { name: 'Who is this calendar for?' })

  await section('events', async () => {
    await page.goto(`${BASE}/t/${TEAM_SLUG}`)
    await page.getByRole('heading', { name: 'Events' }).waitFor()
    await page.waitForLoadState('networkidle')
    await sleep(page, 600)
    await say('Our schedule lives in TeamBalance: trainings, matches, drinks.', 2600)
    await say('New: subscribe to it from your own calendar app.', 2200)
    await speak('Open Events and tap the calendar icon.', 1500)
    await sleep(page, 1000)
    await click(page, page.getByRole('link', { name: 'Calendar links' }), onScreen)
    await page.getByRole('heading', { name: 'Calendar', exact: true }).waitFor()
    await untilLineEnds()
    await sleep(page, 300)
  })

  await section('me-link', async () => {
    await say('A calendar link is a personal subscription.', 1800)
    await sleep(page, 500)
    await say("To create one, start with who it's for.", 1600)
    await speak('"Me" is everything the team schedules, with your own answer marked.', 3000)
    await sleep(page, 300)
    await click(page, page.getByRole('button', { name: 'About Me and Partner' }), onScreen)
    await untilLineEnds()
    await page.keyboard.press('Escape')
    await sleep(page, 300)
    await speak('Give it a name so you know which device it is on…', 1500)
    await sleep(page, 300)
    await type(page, page.getByLabel('Label (optional)'), 'My phone', onScreen)
    await untilLineEnds()
    await speak('…and generate it.', 600)
    await click(page, page.getByRole('button', { name: 'Generate link' }), onScreen)
    const row = page.getByRole('listitem', { name: 'My phone' })
    await row.waitFor()
    await scrollTo(page, row)
    await untilLineEnds()
    await say('That is it. The link is valid for a year and follows every schedule change.', 3000)
    // One line for all three buttons; the pointer moves to each as it is named.
    await speak('Open it in your calendar app, add it to Google Calendar, or copy the link.', 4000)
    await sleep(page, 300)
    await moveTo(page, row.getByRole('link', { name: 'Open in Calendar' }))
    await sleep(page, 1100)
    await moveTo(page, row.getByRole('link', { name: 'Add to Google Calendar' }))
    await sleep(page, 1100)
    await click(page, row.getByRole('button', { name: 'Copy link' }), onScreen)
    await row.getByRole('button', { name: 'Copied!' }).waitFor()
    await untilLineEnds()
    await sleep(page, 600)
  })

  await section('partner-link', async () => {
    await scrollTo(page, presetGroup)
    await say('Sharing with a partner? They want to know when you are out.', 2600)
    await speak('"Partner" shows only events you are going to, without the ✓ ? ✗ marks.', 2000)
    await sleep(page, 400)
    await click(page, presetGroup.getByText('Partner', { exact: true }), onScreen)
    await untilLineEnds()
    await speak('Tune it under "Advanced": maybe your partner only cares about matches.', 3000)
    await sleep(page, 300)
    await click(page, form.getByRole('button', { name: 'Advanced' }), onScreen)
    await scrollTo(page, form.getByText('Include event types'))
    await sleep(page, 900)
    await click(page, form.getByRole('button', { name: 'Match' }), onScreen)
    await untilLineEnds()
    await speak('Generate it like any other link.', 1000)
    await click(page, form.getByRole('button', { name: 'Generate link' }))
    const row = page.getByRole('listitem', { name: 'Partner' })
    await row.waitFor()
    await scrollTo(page, row)
    await untilLineEnds()
    await say('Each link says what it serves, and under which calendar name.', 3200)
  })

  await section('edit-link', async () => {
    const row = page.getByRole('listitem', { name: 'My phone' })
    await speak('Changed your mind? Edit a link in place: switch off the marks, and save.', 3000)
    await sleep(page, 300)
    await click(page, row.getByRole('button', { name: 'Edit' }))
    await click(page, row.getByRole('button', { name: 'Advanced' }))
    await click(page, row.getByRole('switch', { name: 'Mark your answer on titles' }))
    await click(page, row.getByRole('button', { name: 'Save' }))
    await row.getByText('no ✓/✗ marks').waitFor()
    await scrollTo(page, row)
    await untilLineEnds()
    await say('Saved. The URL stays the same, so your calendar follows.', 2500)
  })
}
