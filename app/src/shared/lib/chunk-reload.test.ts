import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { installChunkErrorHandler, markAppLoaded, shouldReloadForChunkError } from './chunk-reload'

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

describe('installChunkErrorHandler', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.spyOn(window, 'location', 'get').mockReturnValue({ ...window.location, reload: vi.fn() })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const chunkError = () => window.dispatchEvent(new Event('vite:preloadError', { cancelable: true }))

  it('reloads again for a stale chunk after a later deploy, once the reloaded shell has loaded', () => {
    installChunkErrorHandler()

    chunkError()
    expect(window.location.reload).toHaveBeenCalledTimes(1)

    markAppLoaded()
    chunkError()
    expect(window.location.reload).toHaveBeenCalledTimes(2)
  })
})
