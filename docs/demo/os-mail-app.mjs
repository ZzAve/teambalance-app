/**
 * A mock mail app for a promo take: the inbox slides over the page with the TeamBalance sign-in mail on
 * top; tapping it opens the message with the real email's wording and its "Sign in" button.
 *
 *   const mail = await showMailApp(page, 'ios' | 'android')
 *   await click(page, mail.row); await mail.link.waitFor(); await click(page, mail.link)
 */
const CSS = `
#__mail__{position:fixed;inset:0;z-index:2147483000;background:#fff;color:#1C1C1E;overflow:hidden;
  font-family:-apple-system,'SF Pro Text','Helvetica Neue',sans-serif;transform:translateY(100%) scale(.92);opacity:0;
  transition:transform .42s cubic-bezier(.2,.8,.2,1),opacity .3s}
#__mail__.in{transform:none;opacity:1}
#__mail__ .top{padding:14px 18px 6px;display:flex;justify-content:space-between;align-items:baseline;color:#0A84FF;font-size:16px}
#__mail__ h1{font-size:30px;font-weight:700;margin:4px 18px 10px;letter-spacing:-.3px}
#__mail__ .search{margin:0 18px 10px;background:#EEEEF0;border-radius:12px;padding:9px 12px;color:#8E8E93;font-size:15px}
#__mail__ .row{display:flex;gap:12px;padding:12px 18px 12px 14px;border-bottom:1px solid #E5E5EA;position:relative}
#__mail__ .row .dot{width:10px;height:10px;border-radius:50%;background:#0A84FF;margin-top:7px;flex:none}
#__mail__ .row .dot.read{background:transparent}
#__mail__ .row .av{display:none}
#__mail__ .row .who{display:flex;justify-content:space-between;font-size:16px;font-weight:600}
#__mail__ .row .who small{font-weight:400;color:#8E8E93;font-size:14px}
#__mail__ .row .subj{font-size:15px;margin-top:1px}
#__mail__ .row .prev{font-size:14px;color:#8E8E93;margin-top:1px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
#__mail__ .row.read .who,#__mail__ .row.read .subj{font-weight:400;color:#3A3A3C}
#__mail__ .msg{position:absolute;inset:0;background:#fff;padding:14px 18px;transform:translateX(100%);transition:transform .32s cubic-bezier(.2,.8,.2,1)}
#__mail__ .msg.in{transform:none}
#__mail__ .msg .back{color:#0A84FF;font-size:16px;margin-bottom:14px}
#__mail__ .msg h2{font-size:20px;font-weight:700;margin:0 0 14px}
#__mail__ .msg .from{display:flex;gap:12px;align-items:center;margin-bottom:18px;font-size:15px}
#__mail__ .msg .from .av{width:40px;height:40px;border-radius:50%;background:#225C9C;color:#fff;font-weight:700;display:grid;place-items:center}
#__mail__ .msg .from small{display:block;color:#8E8E93;font-size:13px}
#__mail__ .msg p{font-size:15px;line-height:1.5;margin:0 0 14px;color:#1C1C1E}
#__mail__ .msg .btn{display:inline-block;padding:12px 20px;background:#1a1a1a;color:#fff;border-radius:8px;font-weight:700;font-size:15px;margin:2px 0 16px}
#__mail__ .msg .fine{font-size:13px;color:#8E8E93}
/* Android: Roboto, a search pill, avatars instead of unread dots, Material blue. */
#__mail__.android{font-family:Roboto,'Google Sans','Helvetica Neue',sans-serif;color:#1F1F1F}
#__mail__.android .top,#__mail__.android h1{display:none}
#__mail__.android .search{margin:14px 14px 8px;background:#EEF1F6;border-radius:999px;padding:13px 18px;font-size:16px;color:#444746}
#__mail__.android .section{padding:10px 18px 4px;font-size:13px;font-weight:500;color:#444746}
#__mail__.android .row{border:0;padding:10px 16px}
#__mail__.android .row .dot{display:none}
#__mail__.android .row .av{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;color:#fff;font-weight:500;flex:none}
#__mail__.android .row .who{font-size:15px;font-weight:700}
#__mail__.android .row .subj{font-weight:700;font-size:14px}
#__mail__.android .row .prev{-webkit-line-clamp:1;font-size:14px}
#__mail__.android .msg .back{color:#444746}
#__mail__.android .msg h2{font-weight:400;font-size:22px}
#__mail__.android .msg .btn{border-radius:8px}
`
const ROWS = [
  { who: 'TeamBalance', when: 'now', subj: 'Your TeamBalance sign-in link', prev: 'Click the button below to sign in to TeamBalance: Sign in. This link is valid for 15 minutes and works once.', av: '#225C9C', mail: true },
  { who: 'Sporthal De Toekomst', when: '08:12', subj: 'Booking confirmed: Tuesday 20:00', prev: 'Your weekly booking for court 2 is confirmed. See you Tuesday!', av: '#8E8E93', read: true },
  { who: 'Nevobo', when: 'Yesterday', subj: 'Match schedule update', prev: 'The match of 9 November now starts at 14:30 instead of 15:00.', av: '#E07A2B', read: true },
]

export async function showMailApp(page, os = 'ios') {
  await page.evaluate(({ css, os, rows }) => {
    if (!document.getElementById('__mail_css__')) {
      const style = document.createElement('style')
      style.id = '__mail_css__'
      style.textContent = css
      document.head.appendChild(style)
    }
    const app = document.createElement('div')
    app.id = '__mail__'
    app.className = os
    const row = (r) => `<div class="row${r.read ? ' read' : ''}"${r.mail ? ' data-mail' : ''}>
      <div class="dot${r.read ? ' read' : ''}"></div><div class="av" style="background:${r.av}">${r.who[0]}</div>
      <div style="min-width:0;flex:1"><div class="who"><span>${r.who}</span><small>${r.when}</small></div>
      <div class="subj">${r.subj}</div><div class="prev">${r.prev}</div></div></div>`
    app.innerHTML = `<div class="top"><span>Mailboxes</span><span>Edit</span></div><h1>Inbox</h1>
      <div class="search">Search${os === 'android' ? ' in mail' : ''}</div><div class="section">Today</div>${rows.map(row).join('')}
      <div class="msg"><div class="back">‹ Inbox</div><h2>Your TeamBalance sign-in link</h2>
      <div class="from"><div class="av">TB</div><div><b>TeamBalance</b><small>to julia@example.com · now</small></div></div>
      <p>Click the button below to sign in to TeamBalance:</p><span class="btn" data-link>Sign in</span>
      <p class="fine">Button not working? Copy this link:<br>https://app.teambalance.nl/auth/verify?token=…</p>
      <p class="fine">This link is valid for 15 minutes and works once.</p></div>`
    document.body.appendChild(app)
    app.querySelector('[data-mail]').addEventListener('click', () => app.querySelector('.msg').classList.add('in'))
    requestAnimationFrame(() => app.classList.add('in'))
  }, { css: CSS, os, rows: ROWS })
  await page.waitForTimeout(480)
  return { row: page.locator('#__mail__ [data-mail]'), link: page.locator('#__mail__ .msg.in [data-link]') }
}
