/**
 * A mock of the phone's own passkey sheet for a promo take. The browser's real ceremony runs against a
 * virtual authenticator (CDP) and shows nothing, so this draws the OS-style bottom sheet over the page:
 * `show` slides it up, `approve` plays the face-unlock and the check, `close` slides it down.
 *
 *   const sheet = await showPasskeySheet(page, 'create' | 'signin', 'ios' | 'android')
 *   await click(page, sheet.continueButton); await sheet.approve(); await sheet.close()
 */
const TEXT = {
  ios: {
    create: {
      title: 'Create a passkey?',
      body: 'A passkey for <b>julia@example.com</b> will be saved for <b>app.teambalance.nl</b>. You sign in with Face ID instead of a link.',
    },
    signin: {
      title: 'Sign in with your passkey?',
      body: 'Use Face ID to sign in to <b>app.teambalance.nl</b> as <b>julia@example.com</b>.',
    },
    verify: 'Face ID',
    done: 'Done',
  },
  android: {
    create: {
      title: 'Create a passkey?',
      body: 'Create a passkey for <b>app.teambalance.nl</b>? It is saved to your password manager, and you sign in with your fingerprint, face or screen lock.',
    },
    signin: {
      title: 'Use your passkey?',
      body: 'Sign in to <b>app.teambalance.nl</b> with the passkey saved for <b>julia@example.com</b>.',
    },
    verify: 'Touch the fingerprint sensor',
    done: 'Verified',
  },
}

const KEY = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="#fff"/></svg>'
const FACE = '<svg viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>'
const FINGER = '<svg viewBox="0 0 24 24" fill="none" stroke="#0B57D0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M2 12a10 10 0 0 1 18-6"/><path d="M2 16h.01"/><path d="M21.8 16c.2-2 .131-5.354 0-6"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/><path d="M8.65 22c.21-.66.45-1.32.57-2"/><path d="M9 6.8a6 6 0 0 1 9 5.2v2"/></svg>'
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="#34C759" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>'

const CSS = `
#__os_backdrop__{position:fixed;inset:0;z-index:2147483000;background:rgba(0,0,0,0);transition:background .3s}
#__os_backdrop__.in{background:rgba(0,0,0,.38)}
#__os_sheet__{position:fixed;left:0;right:0;bottom:0;z-index:2147483001;background:#fff;border-radius:28px 28px 0 0;
  padding:10px 20px 34px;font-family:-apple-system,'SF Pro Text','Helvetica Neue',sans-serif;color:#1C1C1E;
  transform:translateY(105%);transition:transform .34s cubic-bezier(.2,.8,.2,1);box-shadow:0 -8px 40px rgba(0,0,0,.18)}
#__os_sheet__.in{transform:translateY(0)}
#__os_sheet__ .grab{width:40px;height:5px;border-radius:3px;background:#D1D1D6;margin:0 auto 18px}
#__os_sheet__ .icon{width:64px;height:64px;border-radius:18px;background:#0A84FF;margin:6px auto 14px;padding:14px;box-sizing:border-box}
#__os_sheet__ h2{font-size:21px;font-weight:700;text-align:center;margin:0 0 8px;letter-spacing:-.2px}
#__os_sheet__ p{font-size:14.5px;line-height:1.4;text-align:center;color:#3A3A3C;margin:0 0 18px}
#__os_sheet__ p b{font-weight:600;color:#1C1C1E}
#__os_sheet__ .acct{display:flex;align-items:center;gap:12px;background:#F2F2F7;border-radius:14px;padding:12px 14px;margin-bottom:18px;font-size:15px}
#__os_sheet__ .acct .av{width:34px;height:34px;border-radius:50%;background:#225C9C;color:#fff;font-weight:700;display:grid;place-items:center;font-size:14px}
#__os_sheet__ .acct small{display:block;color:#8E8E93;font-size:12.5px}
#__os_sheet__ button{display:block;width:100%;border:0;border-radius:14px;height:50px;font:600 17px -apple-system,'SF Pro Text',sans-serif}
#__os_sheet__ button.go{background:#0A84FF;color:#fff}
#__os_sheet__ button.no{background:transparent;color:#0A84FF;margin-top:4px}
#__os_sheet__ .verify{display:none;flex-direction:column;align-items:center;padding:18px 0 10px}
#__os_sheet__ .verify .glyph{width:92px;height:92px}
#__os_sheet__ .verify .face{animation:__os_pulse .7s ease-in-out infinite alternate}
#__os_sheet__ .verify span{margin-top:14px;font-size:15px;font-weight:600}
@keyframes __os_pulse{from{transform:scale(.94);opacity:.75}to{transform:scale(1.04);opacity:1}}
/* Android: Material You, Roboto, pill buttons in Google blue, a square-ish icon tile. */
#__os_sheet__.android{font-family:Roboto,'Google Sans','Helvetica Neue',sans-serif;background:#FFF;border-radius:28px 28px 0 0;padding:14px 24px 28px}
#__os_sheet__.android .grab{width:32px;height:4px;background:#C4C7C5}
#__os_sheet__.android .icon{border-radius:50%;background:#0B57D0;width:56px;height:56px;padding:13px}
#__os_sheet__.android h2{font-size:22px;font-weight:500;letter-spacing:0}
#__os_sheet__.android p{color:#444746;font-size:14px}
#__os_sheet__.android .acct{background:transparent;border:1px solid #C4C7C5;border-radius:16px}
#__os_sheet__.android .acct .av{background:#0B57D0}
#__os_sheet__.android button{height:44px;border-radius:999px;font:500 15px Roboto,'Google Sans',sans-serif}
#__os_sheet__.android button.go{background:#0B57D0;color:#fff}
#__os_sheet__.android button.no{color:#0B57D0;margin-top:8px}
#__os_sheet__.android .verify .face{animation:none;opacity:1}
#__os_sheet__.android .verify span{font-weight:500;color:#1F1F1F}
`

export async function showPasskeySheet(page, mode, os = 'ios') {
  const { title, body } = TEXT[os][mode]
  const glyph = os === 'android' ? FINGER : FACE
  await page.evaluate(({ css, title, body, KEY, FACE, os, verify }) => {
    if (!document.getElementById('__os_css__')) {
      const style = document.createElement('style')
      style.id = '__os_css__'
      style.textContent = css
      document.head.appendChild(style)
    }
    const backdrop = document.createElement('div')
    backdrop.id = '__os_backdrop__'
    const sheet = document.createElement('div')
    sheet.id = '__os_sheet__'
    sheet.className = os
    sheet.innerHTML = `<div class="grab"></div><div class="ask"><div class="icon">${KEY}</div><h2>${title}</h2><p>${body}</p>
      <div class="acct"><div class="av">JV</div><div>julia@example.com<small>Julia Vermeer</small></div></div>
      <button class="go" data-continue>Continue</button><button class="no">Cancel</button></div>
      <div class="verify"><div class="glyph face">${FACE}</div><span>${verify}</span></div>`
    document.body.append(backdrop, sheet)
    requestAnimationFrame(() => { backdrop.classList.add('in'); sheet.classList.add('in') })
  }, { css: CSS, title, body, KEY, FACE: glyph, os, verify: TEXT[os].verify })
  await page.waitForTimeout(380)

  return {
    continueButton: page.locator('#__os_sheet__ [data-continue]'),
    async approve() {
      await page.evaluate(() => {
        const sheet = document.getElementById('__os_sheet__')
        sheet.querySelector('.ask').style.display = 'none'
        sheet.querySelector('.verify').style.display = 'flex'
      })
      await page.waitForTimeout(1300)
      await page.evaluate(({ CHECK, done }) => {
        const glyph = document.querySelector('#__os_sheet__ .glyph')
        glyph.classList.remove('face')
        glyph.innerHTML = CHECK
        document.querySelector('#__os_sheet__ .verify span').textContent = done
      }, { CHECK, done: TEXT[os].done })
      await page.waitForTimeout(650)
    },
    async close() {
      await page.evaluate(() => {
        document.getElementById('__os_sheet__').classList.remove('in')
        document.getElementById('__os_backdrop__').classList.remove('in')
      })
      await page.waitForTimeout(380)
      await page.evaluate(() => { document.getElementById('__os_sheet__').remove(); document.getElementById('__os_backdrop__').remove() })
    },
  }
}
