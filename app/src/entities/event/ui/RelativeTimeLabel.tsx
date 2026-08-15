import type { RelativeLabel } from '../lib/relative-event-label'

/**
 * The graduated relative-time label, right-aligned on the card's tag row.
 *
 * `solid` is a hue-neutral ink pill — deliberately not a semantic colour, so an imminent event
 * reads as urgent without competing with the attendance greens/golds/reds. `quiet` is muted grey
 * text with no pill: present, but not shouting. Events past the window render nothing at all
 * (`relativeEventLabel` returns null), so this component is never asked to render an empty state.
 */
export function RelativeTimeLabel({ label }: { label: RelativeLabel }) {
  if (label.emphasis === 'solid') {
    return (
      <span className="ml-auto shrink-0 whitespace-nowrap rounded-full bg-[rgba(30,41,59,0.08)] px-2.5 py-0.5 text-[11px] font-bold tracking-[0.01em] text-foreground">
        {label.text}
      </span>
    )
  }

  return (
    <span className="ml-auto shrink-0 whitespace-nowrap text-[11px] font-semibold text-muted-foreground">
      {label.text}
    </span>
  )
}
