import { afterEach, describe, expect, it, vi } from 'vitest'
import { copyToClipboard, shareOrCopy } from './copy-to-clipboard'

const stubClipboard = (writeText: (text: string) => Promise<void>) =>
  vi.stubGlobal('navigator', { clipboard: { writeText } })

describe('copyToClipboard', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('writes the text and reports success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubClipboard(writeText)
    await expect(copyToClipboard('https://example.test/a')).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith('https://example.test/a')
  })

  it('reports a refused write (permission denied, insecure context) instead of throwing', async () => {
    stubClipboard(() => Promise.reject(new DOMException('denied', 'NotAllowedError')))
    await expect(copyToClipboard('x')).resolves.toBe(false)
  })

  it('reports failure where the Clipboard API is missing altogether', async () => {
    vi.stubGlobal('navigator', {})
    await expect(copyToClipboard('x')).resolves.toBe(false)
  })
})


const DATA = { title: 'Join', url: 'https://example.test/invite/a' }

const stubNavigator = (nav: { share?: (d: ShareData) => Promise<void>; writeText?: (t: string) => Promise<void> }) =>
  vi.stubGlobal('navigator', {
    ...(nav.share && { share: nav.share }),
    clipboard: { writeText: nav.writeText ?? vi.fn().mockResolvedValue(undefined) },
  })

describe('shareOrCopy', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('opens the share sheet where the browser has one, and does not copy', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    const writeText = vi.fn()
    stubNavigator({ share, writeText })
    await expect(shareOrCopy(DATA)).resolves.toBe('shared')
    expect(share).toHaveBeenCalledWith(DATA)
    expect(writeText).not.toHaveBeenCalled()
  })

  it('copies the url where navigator.share is missing', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubNavigator({ writeText })
    await expect(shareOrCopy(DATA)).resolves.toBe('copied')
    expect(writeText).toHaveBeenCalledWith(DATA.url)
  })

  it('treats a dismissed share sheet as cancelled, without copying', async () => {
    const writeText = vi.fn()
    stubNavigator({ share: () => Promise.reject(new DOMException('dismissed', 'AbortError')), writeText })
    await expect(shareOrCopy(DATA)).resolves.toBe('cancelled')
    expect(writeText).not.toHaveBeenCalled()
  })

  it('falls back to copying when the share fails for another reason', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubNavigator({ share: () => Promise.reject(new DOMException('no', 'NotAllowedError')), writeText })
    await expect(shareOrCopy(DATA)).resolves.toBe('copied')
    expect(writeText).toHaveBeenCalledWith(DATA.url)
  })

  it('reports failed when sharing is missing and the clipboard refuses', async () => {
    stubNavigator({ writeText: () => Promise.reject(new Error('denied')) })
    await expect(shareOrCopy(DATA)).resolves.toBe('failed')
  })
})
