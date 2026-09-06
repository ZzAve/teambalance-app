#!/usr/bin/env node
// Captures the manifest `screenshots` (src/app/pwa/manifest.ts) from the running app: the events
// overview — v1's value proposition (ADR-0004) — once per form factor. Run on demand and commit the
// PNGs under public/screenshots/; the manifest's `sizes` must match the dimensions printed here.
//
// Needs the full stack up, like `make e2e` but with demo data:
//   docker compose up -d
//   ./gradlew :api:bootRun --args='--spring.profiles.active=dev,e2e'   # demo team + token endpoint
//   cd app && npm run dev
//   npm run generate-pwa-screenshots
//
// `dev` seeds the demo team (Setpoint VT, six members); `e2e` exposes the magic-link token so the
// script can sign those members in without a mailbox. The demo seed has no events, so the script
// creates a few upcoming ones and answers as every member — an overview with nobody coming would
// not show what the app is for.

import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const APP_URL = process.env.APP_URL ?? 'http://localhost:5173'
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'
const ADMIN = 'jan@example.com'
const MEMBERS = ['lisa@example.com', 'tom@example.com', 'emma@example.com', 'daan@example.com', 'sophie@example.com']
const OUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../public/screenshots')

const inDays = (days, hour) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(hour, 0, 0, 0)
  return date
}
const SAMPLE_EVENTS = [
  { type: 'Training', title: 'Training', start: inDays(2, 20), hours: 2, location: 'Sporthal De Vliet' },
  { type: 'Match', title: 'Setpoint VT — VC Zaanstad D2', start: inDays(5, 19), hours: 2, location: 'Sporthal De Vliet' },
  { type: 'Training', title: 'Training', start: inDays(9, 20), hours: 2, location: 'Sporthal De Vliet' },
  { type: 'Other', title: 'Team dinner', start: inDays(12, 18), hours: 3, location: 'Café Balans' },
]
// One answer per member per event, spread so the overview shows every attendance colour.
const RESPONSES = ['ATTENDING', 'ATTENDING', 'MAYBE', 'ATTENDING', 'ABSENT', 'ATTENDING']

const ok = async (response, what) => {
  if (!response.ok()) throw new Error(`${what} failed: ${response.status()} ${await response.text()}`)
  return response
}

// Same login as e2e-real/helpers.ts: request a magic link, read its token back, verify it.
async function signIn(request, email) {
  await ok(await request.post(`${APP_URL}/api/auth/magic-link/request`, { data: { email } }), `magic-link request for ${email}`)
  const { token } = await (await ok(await request.get(`${BACKEND_URL}/internal/e2e/magic-link-token`, { params: { email } }), `token for ${email}`)).json()
  await ok(await request.post(`${APP_URL}/api/auth/magic-link/verify`, { data: { token } }), `verify for ${email}`)
  return (await (await ok(await request.get(`${APP_URL}/api/auth/me`), 'auth/me')).json()).id
}

async function ensureEvents(request) {
  const { events } = await (await ok(await request.get(`${APP_URL}/api/events?include-past=false`), 'list events')).json()
  if (events.length >= SAMPLE_EVENTS.length) return events
  const { eventTypes } = await (await ok(await request.get(`${APP_URL}/api/event-types`), 'list event types')).json()
  const typeId = (name) => (eventTypes.find((type) => type.name === name) ?? eventTypes[0]).id
  for (const sample of SAMPLE_EVENTS) {
    const startTime = sample.start.toISOString()
    const endTime = new Date(sample.start.getTime() + sample.hours * 3_600_000).toISOString()
    await ok(
      await request.post(`${APP_URL}/api/events`, {
        data: { eventTypeId: typeId(sample.type), title: sample.title, startTime, endTime, location: sample.location },
      }),
      `create ${sample.title}`,
    )
  }
  return (await (await ok(await request.get(`${APP_URL}/api/events?include-past=false`), 'list events')).json()).events
}

async function respond(browser, email, events, state) {
  const context = await browser.newContext()
  const userId = await signIn(context.request, email)
  for (const event of events) {
    await ok(await context.request.put(`${APP_URL}/api/events/${event.id}/attendances/${userId}`, { data: { state } }), `${email} → ${event.title}`)
  }
  await context.close()
}

async function capture(browser, name, options) {
  const context = await browser.newContext({ ...options, colorScheme: 'light' })
  await signIn(context.request, ADMIN)
  const page = await context.newPage()
  await page.goto(`${APP_URL}/`)
  await page.getByRole('heading', { name: 'Events' }).waitFor()
  await page.waitForLoadState('networkidle')
  const file = resolve(OUT_DIR, `${name}.png`)
  await page.screenshot({ path: file })
  const scale = options.deviceScaleFactor ?? 1
  console.log(`${file}: ${options.viewport.width * scale}x${options.viewport.height * scale}`)
  await context.close()
}

mkdirSync(OUT_DIR, { recursive: true })
const browser = await chromium.launch()
try {
  const admin = await browser.newContext()
  await signIn(admin.request, ADMIN)
  const events = await ensureEvents(admin.request)
  await admin.close()

  await Promise.all([ADMIN, ...MEMBERS].map((email, i) => respond(browser, email, events, RESPONSES[i])))

  await capture(browser, 'events-narrow', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await capture(browser, 'events-wide', { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 })
} finally {
  await browser.close()
}
