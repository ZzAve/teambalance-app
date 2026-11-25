/**
 * One short buzz to confirm a tap. Android Chrome implements the Vibration API; iOS Safari and
 * desktop Firefox do not expose it, so there the call is skipped.
 */
export function hapticTap(): void {
  if ('vibrate' in navigator) navigator.vibrate(10)
}
