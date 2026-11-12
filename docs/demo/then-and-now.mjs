/**
 * Two overlays for a "then and now" take, drawn inside the recorded page:
 *
 *   then.preload(name)      the next full page load starts under the old screenshot (once)
 *   then.show(name, pos)    put the old screenshot up at once; pos 100 = all old, 0 = all new
 *   then.to(pos, ms)        move the dividing line: the old screen is left of it, the live app right
 *   card(page, html)        a full-screen card over the app, for work that has no screen
 *
 * The old screens are PNGs in ./thirty-days/, taken from the SPA built at an older commit (see the
 * header of thirty-days.steps.mjs).
 * shortcut: the old side is a still picture, not a running app; serve the old build in an iframe if a
 * take ever has to scroll or click in it.
 */
import { readFileSync } from 'node:fs'

const dataUrl = (name) =>
  'data:image/png;base64,' + readFileSync(new URL(`./thirty-days/${name}.png`, import.meta.url)).toString('base64')

// Runs in the page.
const mount = async ({ src, pos, ms, label }) => {
  let root = document.getElementById('__then__')
  if (!root) {
    root = document.createElement('div')
    root.id = '__then__'
    root.innerHTML =
      '<style>#__then__{position:fixed;inset:0;z-index:2147483000;pointer-events:none}' +
      '#__then__ img{position:absolute;inset:0;width:100%;height:100%;clip-path:inset(0 100% 0 0)}' +
      '#__then__ i{position:absolute;top:0;bottom:0;left:0;width:4px;margin-left:-2px;background:#F4B400;box-shadow:0 0 12px rgba(0,0,0,.35);opacity:0}' +
      "#__then__ b{position:absolute;top:50px;padding:4px 10px;border-radius:999px;font:700 12px/1.3 'DM Sans Variable','DM Sans',sans-serif;" +
      'letter-spacing:.04em;text-transform:uppercase;color:#fff;opacity:0;transition:opacity .3s}' +
      '#__then__ b.then{left:10px;background:#64748B}#__then__ b.now{right:10px;background:#225C9C}</style>' +
      `<img alt=""><i></i><b class="then">${label}</b><b class="now">Today</b>`
    document.documentElement.appendChild(root)
  }
  const [, img, line, then, now] = root.children
  if (src) {
    img.src = src
    await img.decode().catch(() => {})
  }
  const transition = `${ms}ms cubic-bezier(.65,0,.35,1)`
  img.style.transition = `clip-path ${transition}`
  line.style.transition = `left ${transition}, opacity .3s`
  root.getBoundingClientRect()
  img.style.clipPath = `inset(0 ${100 - pos}% 0 0)`
  line.style.left = `${pos}%`
  line.style.opacity = pos > 0 && pos < 100 ? 1 : 0
  then.style.opacity = pos > 0 ? 1 : 0
  now.style.opacity = pos > 0 && pos < 100 ? 1 : 0
}

export function thenAndNow(page, sleep, label) {
  return {
    preload: (name) =>
      page.addInitScript(
        // An init script can run before <html> exists; wait for it.
        `if (!sessionStorage.getItem('__then_${name}')) { sessionStorage.setItem('__then_${name}', '1')
          const go = () => (${mount})(${JSON.stringify({ src: dataUrl(name), pos: 100, ms: 0, label })})
          if (document.documentElement) go()
          else new MutationObserver((_, o) => { if (document.documentElement) { o.disconnect(); go() } }).observe(document, { childList: true }) }`,
      ),
    show: (name, pos = 100) => page.evaluate(mount, { src: dataUrl(name), pos, ms: 0, label }),
    to: async (pos, ms = 1100) => {
      await page.evaluate(mount, { pos, ms, label })
      await sleep(page, ms)
    },
  }
}

const CARD_CSS = `
#__card__{position:fixed;inset:0;z-index:2147483600;background:#F8F6F0;color:#1E293B;padding:64px 22px 0;opacity:0;transition:opacity .45s;
  font:500 15px/1.4 'DM Sans Variable','DM Sans',sans-serif}
#__card__.on{opacity:1}
#__card__ .body{transition:opacity .3s}
#__card__.swap .body{opacity:0}
body:has(#__card__) #__demo_cursor__,body:has(#__card__) #__demo_ring__{display:none!important}
#__card__ .kicker{font-weight:700;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#B58500}
#__card__ h1{font:800 31px/1.12 'Grandstander Variable','Grandstander',sans-serif;margin:8px 0 22px}
#__card__ h1 em{font-style:normal;color:#225C9C}
#__card__ .in{opacity:0;transform:translateY(10px);animation:cardIn .5s ease-out forwards;animation-delay:var(--d,0s)}
@keyframes cardIn{to{opacity:1;transform:none}}
#__card__ .grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
#__card__ .chip{position:relative;padding:8px 10px;border-radius:10px;background:#E8E5DC;color:#64748B;font-weight:600;font-size:13px;
  animation:toJooq .4s ease-out forwards;animation-delay:var(--d)}
#__card__ .chip::after{content:'';position:absolute;right:10px;font-size:11px;letter-spacing:.05em;animation:toJooqTag 0s forwards;animation-delay:var(--d)}
@keyframes toJooq{50%{transform:scale(1.06)}to{background:#DCF1E7;color:#17694A}}
@keyframes toJooqTag{to{content:'✓';font-size:13px}}
#__card__ .row{display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border-radius:12px;background:#fff;margin-bottom:10px;box-shadow:0 1px 2px rgba(0,0,0,.06)}
#__card__ .row::before{content:'✓';flex:none;width:22px;height:22px;border-radius:50%;background:#225C9C;color:#fff;font-size:13px;font-weight:700;text-align:center;line-height:22px}
#__card__ .row small{display:block;color:#64748B;font-size:13px}
#__card__ pre{margin:0 0 14px;padding:14px;border-radius:12px;background:#1E293B;color:#E2E8F0;font:500 12.5px/1.6 ui-monospace,Menlo,monospace;white-space:pre-wrap}
#__card__ pre b{color:#F4B400;font-weight:600}
#__card__ .flow{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
#__card__ .flow span{padding:10px 9px;border-radius:10px;background:#fff;font-weight:700;font-size:13px;text-align:center;box-shadow:0 1px 2px rgba(0,0,0,.06)}
#__card__ .flow span small{display:block;font-weight:500;font-size:10.5px;color:#64748B}
#__card__ .flow u{text-decoration:none;color:#225C9C;font-weight:800}
#__card__ .stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px}
#__card__ .stats div{padding:12px 4px;border-radius:12px;background:#225C9C;color:#fff;text-align:center;font-size:12px}
#__card__ .stats strong{display:block;font:800 30px/1 'Grandstander Variable','Grandstander',sans-serif}
`

/** Show a card; a second call replaces the content with a short fade. */
export async function card(page, html) {
  await page.evaluate(
    async ({ html, css }) => {
      let el = document.getElementById('__card__')
      if (el) {
        // Fade the content only: the card stays opaque, so the app does not show through.
        el.classList.add('swap')
        await new Promise((r) => setTimeout(r, 300))
      } else {
        el = document.createElement('div')
        el.id = '__card__'
        document.body.appendChild(el)
      }
      el.innerHTML = `<style>${css}</style><div class="body">${html}</div>`
      el.getBoundingClientRect()
      el.classList.add('on')
      el.classList.remove('swap')
    },
    { html, css: CARD_CSS },
  )
}
