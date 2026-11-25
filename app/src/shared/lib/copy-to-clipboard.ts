import { useState } from 'react'

/**
 * Writes `text` to the clipboard and says whether it worked. The write is refused on an insecure
 * origin, without permission and in some in-app browsers, so callers get a boolean to show a fallback
 * on instead of an unhandled rejection.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'failed'

/** The browser has a native share sheet: most phones yes, most desktop browsers no. */
export const canShare = () => typeof navigator !== 'undefined' && typeof navigator.share === 'function'

/**
 * Opens the native share sheet for `url`, or copies it where there is none. A dismissed sheet
 * (AbortError) is the user's choice, so it neither errors nor copies; any other share failure falls
 * back to the clipboard. `failed` means the clipboard refused too.
 */
export async function shareOrCopy(data: { title?: string; text?: string; url: string }): Promise<ShareOutcome> {
  if (canShare()) {
    try {
      await navigator.share(data)
      return 'shared'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled'
    }
  }
  return (await copyToClipboard(data.url)) ? 'copied' : 'failed'
}

/**
 * The outcome of the last copy: the key of what was copied, or of what the browser refused. A screen
 * with several copy buttons passes each one's own key; a screen with one can leave it out. `share`
 * records only a clipboard fallback: a shared or cancelled sheet leaves nothing to show.
 */
export function useCopyToClipboard() {
  const [last, setLast] = useState<{ key: string; ok: boolean } | null>(null)
  return {
    copiedKey: last?.ok ? last.key : null,
    failedKey: last && !last.ok ? last.key : null,
    copy: async (text: string, key = '') => setLast({ key, ok: await copyToClipboard(text) }),
    share: async (data: Parameters<typeof shareOrCopy>[0], key = '') => {
      const outcome = await shareOrCopy(data)
      setLast(outcome === 'copied' || outcome === 'failed' ? { key, ok: outcome === 'copied' } : null)
    },
    reset: () => setLast(null),
  }
}
