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
 * Narrated take: synthesise calendar-links.narration.json (caption text → spoken line; Piper,
 * en_GB-alan-medium, length-scale 0.92) into clips, write { caption: { file, seconds } } as JSON and
 * pass it as NARRATION=…; the take then holds each caption for its line and prints CAPTION_AT lines
 * to lay the clips onto the recording.
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
  const say = async (text, hold) => {
    await ensureCaption()
    await caption(page, text)
    console.log(`CAPTION_AT ${Date.now() - startedAt} ${text}`)
    const spoken = narration[text]?.seconds
    await sleep(page, spoken ? Math.max(hold, spoken * 1000 + 400) : hold)
  }

  const form = page.locator('form').last()
  const presetGroup = page.getByRole('radiogroup', { name: 'Who is this calendar for?' })
  const pickPreset = (name) => click(page, presetGroup.getByText(name, { exact: true }))

  await section('events', async () => {
    await page.goto(`${BASE}/t/${TEAM_SLUG}`)
    await page.getByRole('heading', { name: 'Events' }).waitFor()
    await page.waitForLoadState('networkidle')
    await sleep(page, 600)
    await say('Our schedule lives in TeamBalance: trainings, matches, drinks.', 2600)
    await say('New: subscribe to it from your own calendar app.', 2200)
    await say('Open Events and tap the calendar icon.', 900)
    await click(page, page.getByRole('link', { name: 'Calendar links' }))
    await page.getByRole('heading', { name: 'Calendar', exact: true }).waitFor()
    await sleep(page, 1000)
  })

  await section('me-link', async () => {
    await say('A calendar link is a personal subscription. Start with who it is for.', 2400)
    await say('"Me" is everything the team schedules, with your own answer marked.', 800)
    await click(page, page.getByRole('button', { name: 'About Me and Partner' }))
    await sleep(page, 3000)
    await page.keyboard.press('Escape')
    await sleep(page, 500)
    await say('Give it a name so you know which device it is on…', 600)
    await type(page, page.getByLabel('Label (optional)'), 'My phone')
    await sleep(page, 500)
    await say('…and generate it.', 500)
    await click(page, page.getByRole('button', { name: 'Generate link' }))
    const row = page.getByRole('listitem', { name: 'My phone' })
    await row.waitFor()
    await scrollTo(page, row)
    await say('That is it. The link is valid for a year and follows every schedule change.', 3000)
    await say('"Open in Calendar" subscribes your phone or Mac directly.', 500)
    await moveTo(page, row.getByRole('link', { name: 'Open in Calendar' }))
    await sleep(page, 1800)
    await say('Google Calendar users take the second button.', 500)
    await moveTo(page, row.getByRole('link', { name: 'Add to Google Calendar' }))
    await sleep(page, 1800)
    await say('Or copy the link and paste it into any calendar app.', 500)
    await click(page, row.getByRole('button', { name: 'Copy link' }))
    await row.getByRole('button', { name: 'Copied!' }).waitFor()
    await sleep(page, 2000)
  })

  await section('partner-link', async () => {
    await scrollTo(page, presetGroup)
    await say('Sharing with a partner? They want to know when you are out.', 2600)
    await say('"Partner" shows only events you are going to, without the ✓ ? ✗ marks.', 600)
    await pickPreset('Partner')
    await sleep(page, 1400)
    await say('"Advanced" shows exactly what a preset means, and lets you tune it.', 600)
    await click(page, form.getByRole('button', { name: 'Advanced' }))
    await scrollTo(page, form.getByText('Calendar name suffix (optional)'))
    await sleep(page, 3000)
    await say('Generate it like any other link.', 500)
    await click(page, form.getByRole('button', { name: 'Generate link' }))
    const row = page.getByRole('listitem', { name: 'Partner' })
    await row.waitFor()
    await scrollTo(page, row)
    await say('Each link says what it serves, and under which calendar name.', 3200)
  })

  await section('edit-link', async () => {
    const row = page.getByRole('listitem', { name: 'Partner' })
    await say('Changed your mind? Edit a link in place: the URL stays.', 1200)
    await click(page, row.getByRole('button', { name: 'Edit' }))
    await sleep(page, 900)
    await click(page, row.getByRole('button', { name: 'Advanced' }))
    await sleep(page, 900)
    await say('Say your partner only cares about matches.', 700)
    await click(page, row.getByRole('button', { name: 'Match' }))
    await sleep(page, 1600)
    await click(page, row.getByRole('button', { name: 'Save' }))
    await row.getByText('Match · Going only').waitFor()
    await scrollTo(page, row)
    await say('Saved. Their calendar now shows only your matches, same link.', 3200)
  })

  await section('outro', async () => {
    await scrollTo(page, page.getByRole('heading', { name: 'Calendar', exact: true }), { block: 'start' })
    await say('Live now: Events → calendar icon. Three links per person, a year each.', 3500)
  })
}
