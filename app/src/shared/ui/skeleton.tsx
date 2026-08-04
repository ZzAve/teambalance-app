import * as React from "react"

import { cn } from "@shared/lib/utils"

/**
 * A pulsing placeholder block. Compose several to sketch the shape of content that is still
 * loading, so an async surface shows its layout instead of a bare "Loading…" line.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />
}

export { Skeleton }
