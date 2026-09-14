import { RosterChips } from './VariantD'
import type { LineupPanelProps } from './types'

/**
 * PROTOTYPE variant G — "Names". Throwaway.
 *
 * D without the identity dot, because the review asked for exactly this comparison: "avatar plus
 * first name, **or just the name**". Dropping the dot buys roughly two more characters per chip at
 * the same width, which is the whole trade — more of the name for less of the recognition colour.
 *
 * It is the same layout on purpose. This is the one place in the prototype where two variants share
 * their rendering, because the question is not which layout wins but whether a 20px colour dot earns
 * its width; two drawings that differed in anything else could not answer that.
 */
export function VariantG(props: LineupPanelProps) {
  return <RosterChips {...props} withAvatar={false} />
}
