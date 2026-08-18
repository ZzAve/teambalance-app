import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@shared/ui/button'

interface QueryErrorStateProps {
  title: string
  description?: string
  onRetry: () => void
  retryLabel?: string
  /** Extra actions rendered beside Retry — e.g. a Back link. */
  children?: ReactNode
}

/**
 * The shell shown when a query fails to load — distinct from an empty state, so a real failure
 * never reads as "there's nothing here". Always offers a Retry that re-runs the query; callers pass
 * any secondary action (a Back link, say) as children.
 */
export function QueryErrorState({
  title,
  description,
  onRetry,
  retryLabel = 'Retry',
  children,
}: QueryErrorStateProps) {
  return (
    <div role="alert" className="mt-10 flex flex-col items-center gap-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red/10 text-red">
        <AlertTriangle size={22} />
      </div>
      <div>
        <p className="font-display text-lg font-semibold">{title}</p>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onRetry}>{retryLabel}</Button>
        {children}
      </div>
    </div>
  )
}
