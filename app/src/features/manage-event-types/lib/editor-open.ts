/**
 * Whether the event-type editor is on screen.
 *
 * It hides optimistically the moment a save is submitted, and comes BACK if the server rejects it.
 * Closing outright on submit would throw away the whole draft — name, colour, every roster target —
 * at exactly the moment the admin needs it in front of them to fix and retry.
 *
 * A pure rule rather than an effect: "did the save succeed?" is derivable from the props the
 * container already passes down, and deriving beats a setState watching a falling edge.
 */
export function isEditorOpen(args: {
  hasDraft: boolean
  submitted: boolean
  errorCode?: string | null
}): boolean {
  return args.hasDraft && (!args.submitted || !!args.errorCode)
}
