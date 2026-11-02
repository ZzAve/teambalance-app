import { wakeMessageFor } from '@shared/lib/wake-notice'

interface WakeToastProps {
  /** Whether the wake notice is shown. Hidden renders nothing. */
  show: boolean
  elapsedMs: number
}

/**
 * Tells the user a request is taking long enough that the backend is probably waking from a cold
 * start. Presentational — visibility and elapsed time come in as props. Occupies the same slot as
 * UpdateToast (above the bottom nav) and ignores pointer events so it never blocks a tap.
 */
export function WakeToast({ show, elapsedMs }: WakeToastProps) {
  if (!show) return null
  return (
    <div
      role="status"
      aria-label="Server status"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-50 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-lg"
    >
      <span
        aria-hidden
        className="inline-block size-3.5 animate-spin rounded-full border-2 border-blue/30 border-t-blue motion-reduce:animate-none"
      />
      <span className="text-small">{wakeMessageFor(elapsedMs)}</span>
    </div>
  )
}
