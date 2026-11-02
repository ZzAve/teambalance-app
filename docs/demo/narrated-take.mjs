/**
 * Helpers for a narrated promo take (feature-promo-video skill). Call once, first thing in a steps
 * module: `const { speak, say, untilLineEnds, captionAt } = await narratedTake({ page, caption, sleep })`.
 *
 *   speak(text, hold)  show a caption and return at once, so the action it names runs while the line
 *                      is spoken; logs `CAPTION_AT <ms> <text>` for assemble.py
 *   untilLineEnds()    wait until the current line (plus 300 ms) has been spoken
 *   say(text, hold)    speak + untilLineEnds, for a line with no action
 *   captionAt(spot)    'top' while a sheet or dialog covers the bottom of the screen, 'bottom' after
 *
 * With NARRATION=<clips.json> a caption stays up at least as long as its spoken line; without it,
 * `hold` (ms) is used, so a take can be probed before the voice exists.
 */
import { readFileSync } from 'node:fs'

const APP_BACKGROUND = '#F8F6F0'

export async function narratedTake({ page, caption, sleep }) {
  const phone = page.viewportSize().width < 600
  // The recording starts on about:blank, white until the app paints; the cut from the intro card
  // then flashes. Start on the app's background colour instead.
  await page.setContent(`<html style="background:${APP_BACKGROUND}"></html>`)

  let spot = 'bottom'
  // The harness only styles the caption pill when it creates it, so create it here: above the fixed
  // bottom nav, in the app's body font and accent. On a phone the arrow pointer becomes a touch dot.
  const ensureCaption = () =>
    page.evaluate(({ phone, spot }) => {
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
      let el = document.getElementById('__demo_caption__')
      if (!el) {
        el = document.createElement('div')
        el.id = '__demo_caption__'
        el.style.cssText = [
          'position:fixed', 'left:50%', 'transform:translateX(-50%)',
          'z-index:2147483647', 'background:rgba(30,41,59,0.94)', 'color:#fff',
          phone ? "font:600 15px/1.35 'DM Sans Variable','DM Sans',sans-serif" : "font:600 19px/1.4 'DM Sans Variable','DM Sans',sans-serif",
          phone ? 'padding:10px 16px' : 'padding:13px 24px', 'border-radius:12px', phone ? 'width:max-content;max-width:92vw' : 'max-width:720px',
          'text-align:center', 'box-shadow:0 8px 28px rgba(0,0,0,0.3)', 'border-left:5px solid #F4B400',
          'pointer-events:none',
        ].join(';')
        document.body.appendChild(el)
      }
      const offset = phone ? (spot === 'top' ? '72px' : '96px') : '118px'
      el.style.top = spot === 'top' ? offset : ''
      el.style.bottom = spot === 'top' ? '' : offset
    }, { phone, spot })

  const narration = process.env.NARRATION ? JSON.parse(readFileSync(process.env.NARRATION, 'utf8')) : {}
  const startedAt = Date.now()
  let lineEndsAt = 0

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
  const captionAt = async (where) => {
    spot = where
    await ensureCaption()
  }

  return { speak, say, untilLineEnds, captionAt, phone }
}
