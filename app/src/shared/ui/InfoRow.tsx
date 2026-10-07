import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

/**
 * One detail line inside a `<dl>`: the icon marks what the line is, the label names it for screen
 * readers. Icon and row height follow the surrounding font size, so the same row fits a 13px card
 * and a 15px page.
 */
export function InfoRow({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <dt className="flex h-[1lh] shrink-0 items-center text-muted-foreground">
        <Icon className="size-[1.2em]" aria-hidden />
        <span className="sr-only">{label}</span>
      </dt>
      <dd className="min-w-0 flex-1">{children}</dd>
    </div>
  )
}
