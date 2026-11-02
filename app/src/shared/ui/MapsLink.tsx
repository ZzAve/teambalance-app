import type { ReactNode } from 'react'
import { mapsUrl } from '@shared/lib/maps-url'

/**
 * Opens `location` in a maps app. A web map opens in a new tab; a `geo:` link stays in the current
 * one, since the OS hands it to an app and a new tab would be left blank behind it.
 */
export function MapsLink({ location, className, children }: { location: string; className?: string; children: ReactNode }) {
  const href = mapsUrl(location)
  const isWeb = href.startsWith('https:')
  return (
    <a
      href={href}
      target={isWeb ? '_blank' : undefined}
      rel={isWeb ? 'noopener noreferrer' : undefined}
      className={className}
    >
      {children}
    </a>
  )
}
