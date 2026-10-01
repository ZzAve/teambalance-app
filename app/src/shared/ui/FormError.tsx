import type { ReactNode } from 'react'

export function FormError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="text-small text-destructive">
      {children}
    </p>
  )
}
