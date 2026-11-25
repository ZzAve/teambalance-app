// DOM wiring for the landing page: event answers and the sign-in form. Logic lives in landing-state.mjs.
import { answer, initialState, showOldWay, statusText } from './landing-state.mjs'

const copy = JSON.parse(document.getElementById('copy').textContent)
const $ = (sel, root = document) => root.querySelector(sel)
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]

// ---- chat scene ----
const scene = $('#scene')
let state = initialState()

const render = () => {
  for (const [ev, counts] of Object.entries(state.counts)) {
    const root = $(`.ev[data-ev="${ev}"]`)
    for (const [k, n] of Object.entries(counts)) {
      $(`[data-n="${k}"]`, root).textContent = n
      $(`[data-b="${k}"]`, root).style.flexGrow = n
    }
    $$('.ans', root).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.a === state.answers[ev])))
  }
  scene.classList.toggle('quiet', state.quiet)
  $('#unread').textContent = state.quiet ? copy.unreadQuiet : copy.unread
  $('#sceneFoot').hidden = !state.quiet
  $('#status').textContent = statusText(state, copy)
}

$$('.ans').forEach((btn) =>
  btn.addEventListener('click', () => {
    state = answer(state, btn.closest('.ev').dataset.ev, btn.dataset.a)
    render()
  }),
)
$('#bringBack').addEventListener('click', () => {
  state = showOldWay(state)
  render()
  $('#status').focus() // the button hides itself, so focus would otherwise fall back to the page
})

// ---- app clips: play while on screen, start paused for reduced motion; the button pauses (WCAG 2.2.2) ----
const reduced = matchMedia('(prefers-reduced-motion: reduce)')
for (const fig of $$('[data-clip]')) {
  const video = $('video', fig)
  const toggle = $('.clip-toggle', fig)
  let paused = reduced.matches
  let visible = false
  fig.classList.add('pre') // CSS tilts the phone until .in; without this script it stays upright
  const sync = () => {
    if (visible && !paused) {
      // Blocked autoplay (e.g. iOS Low Power Mode): show Play, so one tap starts it.
      video.play().catch(() => {
        paused = true
        sync()
      })
    } else video.pause()
    toggle.textContent = paused ? copy.clipPlay : copy.clipPause
  }
  // A quarter of the clip is enough, so it also plays in a short landscape window.
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) fig.classList.add('in')
    sync()
  }, { threshold: 0.25 }).observe(video)
  toggle.addEventListener('click', () => {
    paused = !paused
    sync()
  })
  reduced.addEventListener('change', () => {
    if (reduced.matches) paused = true
    sync()
  })
  toggle.hidden = false
  sync()
}

// ---- sign-in form: sends a magic link (POST, JSON) ----
const apiBase = document.querySelector('meta[name="api-base"]')?.content ?? 'https://api.teambalance.nl'
const language = document.documentElement.lang === 'en' ? 'EN' : 'NL'

$$('[data-request]').forEach((form) => {
  const input = $('input[type="email"]', form)
  const msg = $('.form-msg', form)
  const button = $('button[type="submit"]', form)
  const say = (kind, text) => {
    msg.className = `form-msg ${kind}`
    msg.textContent = text
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = input.value.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      say('err', email ? copy.formInvalid : copy.formEmpty)
      input.setAttribute('aria-invalid', 'true')
      input.focus()
      return
    }
    input.removeAttribute('aria-invalid')
    button.disabled = true
    say('', copy.formSending)
    try {
      const res = await fetch(`${apiBase}/api/auth/magic-link/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language }),
        signal: AbortSignal.timeout(30000),
      })
      if (res.ok) say('ok', copy.formSent)
      else say('err', res.status === 429 ? copy.formRateLimited : copy.formFailed)
    } catch {
      say('err', copy.formUnsure)
    } finally {
      button.disabled = false
    }
  })
})
