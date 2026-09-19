import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@shared/lib/utils'

type SectionLabelTag = 'h2' | 'h3' | 'span' | 'p'

interface SectionLabelProps extends HTMLAttributes<HTMLElement> {
  /** Which element to render as (default `h3`) — callers keep correct heading semantics. */
  as?: SectionLabelTag
  children: ReactNode
}

/**
 * The app-wide "eyebrow" / section-label treatment settled by the #339 UX review (variant B):
 * sentence case, `text-caption font-semibold text-muted-foreground`, never `uppercase` or tracked.
 * `className` merges in via `cn` (twMerge), so a call site can override the size/colour (e.g. a
 * label on a tinted hero) or add spacing without fighting the defaults.
 */
export function SectionLabel({ as: Tag = 'h3', className, children, ...rest }: SectionLabelProps) {
  return (
    <Tag className={cn('text-caption font-semibold text-muted-foreground', className)} {...rest}>
      {children}
    </Tag>
  )
}
