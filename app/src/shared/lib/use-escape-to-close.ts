import { useEffect } from 'react'

/**
 * Closes a popover on Escape. The key is caught on the document because focus stays on the trigger,
 * a sibling of the popover, so a handler on the popover itself would never see it.
 */
export function useEscapeToClose(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, close])
}
