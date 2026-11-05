import { afterEach, describe, expect, it } from 'vitest'
import { i18n } from '@shared/i18n/i18n'
import { ESCALATE_AFTER_MS, initialWakeState, MIN_VISIBLE_MS, nextWakeState, wakeMessageFor } from './wake-notice'

const STEP_MS = 100

interface Sample {
  at: number
  show: boolean
  elapsedMs: number
}

function simulate(isBusy: (at: number) => boolean, untilMs: number): Sample[] {
  const samples: Sample[] = []
  let state = initialWakeState
  for (let at = 0; at <= untilMs; at += STEP_MS) {
    state = nextWakeState(state, { busy: isBusy(at), now: at })
    samples.push({ at, show: state.show, elapsedMs: state.elapsedMs })
  }
  return samples
}

const shownAt = (samples: Sample[]) => samples.filter((s) => s.show).map((s) => s.at)

describe('nextWakeState', () => {
  it('stays hidden for a request that ends before the warm-backend window', () => {
    expect(shownAt(simulate((at) => at < 2_400, 6_000))).toEqual([])
  })

  it('shows from 2.5 s and holds until the minimum visible time after a request that ends at 2.6 s', () => {
    const visible = shownAt(simulate((at) => at < 2_600, 6_000))
    expect(visible[0]).toBe(2_500)
    expect(visible.at(-1)).toBe(2_600 + MIN_VISIBLE_MS - STEP_MS)
  })

  it('treats a short gap between requests as one continuous wait', () => {
    const samples = simulate((at) => at < 5_000 || (at >= 5_100 && at < 12_000), 14_000)
    const visible = shownAt(samples)
    expect(visible[0]).toBe(2_500)
    expect(visible.filter((at) => at >= 2_500 && at < 12_000)).toHaveLength((12_000 - 2_500) / STEP_MS)
  })

  it('stays shown when a new request starts during the hold', () => {
    const samples = simulate((at) => at < 2_600 || (at >= 3_000 && at < 6_000), 8_000)
    const visible = shownAt(samples)
    expect(visible.filter((at) => at >= 2_500 && at < 6_000)).toHaveLength((6_000 - 2_500) / STEP_MS)
  })

  it('keeps the escalated elapsed time during the hold', () => {
    const samples = simulate((at) => at < 9_000, 10_000)
    const held = samples.find((s) => s.at === 9_300)
    expect(held?.show).toBe(true)
    expect(held?.elapsedMs).toBeGreaterThanOrEqual(ESCALATE_AFTER_MS)
  })

  it('does not accumulate fast warm requests into a false notice', () => {
    expect(shownAt(simulate((at) => at % 700 < 400, 5_000))).toEqual([])
  })

  it('shows at exactly 2.5 s and not a millisecond before', () => {
    const start = nextWakeState(initialWakeState, { busy: true, now: 0 })
    expect(nextWakeState(start, { busy: true, now: 2_499 }).show).toBe(false)
    expect(nextWakeState(start, { busy: true, now: 2_500 }).show).toBe(true)
  })

  it('holds until exactly the minimum visible time after going idle', () => {
    const shown = nextWakeState(nextWakeState(initialWakeState, { busy: true, now: 0 }), { busy: true, now: 3_000 })
    const idle = nextWakeState(shown, { busy: false, now: 3_100 })
    expect(nextWakeState(idle, { busy: false, now: 3_100 + MIN_VISIBLE_MS - 1 }).show).toBe(true)
    expect(nextWakeState(idle, { busy: false, now: 3_100 + MIN_VISIBLE_MS })).toEqual(initialWakeState)
  })

  it('resets after a full idle minimum visible time, so the next short request does not show', () => {
    const samples = simulate((at) => at < 1_000 || (at >= 2_000 && at < 4_000), 6_000)
    expect(shownAt(samples)).toEqual([])
  })
})

describe('wakeMessageFor', () => {
  it('uses the first line from the start up to the escalation point', () => {
    expect(wakeMessageFor(-1)).toBe('Waking the server back up…')
    expect(wakeMessageFor(0)).toBe('Waking the server back up…')
    expect(wakeMessageFor(ESCALATE_AFTER_MS - 1)).toBe('Waking the server back up…')
  })

  it('switches to the second line at the escalation point', () => {
    expect(wakeMessageFor(ESCALATE_AFTER_MS)).toBe('Still on it — thanks for hanging in there')
  })

  it('never claims anything was saved', () => {
    expect(wakeMessageFor(0)).not.toMatch(/saved/i)
    expect(wakeMessageFor(ESCALATE_AFTER_MS)).not.toMatch(/saved/i)
  })
})

describe('wakeMessageFor in Dutch', () => {
  afterEach(() => i18n.changeLanguage('en'))

  it('says both lines in Dutch', async () => {
    await i18n.changeLanguage('nl')
    expect(wakeMessageFor(0)).toBe('De server wordt wakker…')
    expect(wakeMessageFor(ESCALATE_AFTER_MS)).toBe('Nog even bezig — bedankt voor je geduld')
  })
})
