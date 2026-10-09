import { afterEach, describe, expect, it, vi } from 'vitest'
import { copyToClipboard } from './copy-to-clipboard'

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
