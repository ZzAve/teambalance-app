import { describe, expect, it } from 'vitest'
import { shouldReloadForChunkError } from './chunk-reload'

// The pure half of the chunk-error recovery: reload once, then fall back. The window/sessionStorage
// wiring in installChunkErrorHandler is a thin shell around this decision (manual-verified).
describe('shouldReloadForChunkError', () => {
  it('reloads when no sentinel is set yet — the first stale-chunk failure this session', () => {
    expect(shouldReloadForChunkError(false)).toBe('reload')
  })

  it('falls back when the sentinel is already set — the fresh shell failed too, a real outage', () => {
    expect(shouldReloadForChunkError(true)).toBe('fallback')
  })
})
