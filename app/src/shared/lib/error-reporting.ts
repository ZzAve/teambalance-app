import * as Sentry from '@sentry/react'
import type { Breadcrumb, BrowserOptions, ErrorEvent } from '@sentry/react'

/**
 * Error tracking with Bugsink (EU, hosted), through the Sentry SDK. Only the production deploy sets
 * VITE_BUGSINK_DSN; every other build (dev, e2e, demo, Storybook, tests) has no DSN and never starts
 * the SDK. Events are uncaught errors, unhandled promise rejections and what RootErrorBoundary catches.
 *
 * Privacy: no member ID, email or name (no `setUser`, and `dataCollection` turns off user info, so the
 * server does not infer the IP either), no cookies, headers or bodies, no traces, no replay, no browser
 * sessions. URLs lose their query, hash and invite token: the magic-link and invite tokens
 * would otherwise be in Bugsink.
 */
export interface ErrorReportingEnv {
  dsn: string | undefined
  /** The commit SHA of the build, the same value as the API's release. */
  release: string | undefined
}

const ENVIRONMENT = 'prod'
const INVITE_TOKEN = /\/invite\/[^/?#]+/

/** Drops the query string, the hash and the token of an invite path. */
export function withoutSecrets(url: string): string {
  return url.replace(/[?#].*$/, '').replace(INVITE_TOKEN, '/invite/:token')
}

function scrubEvent(event: ErrorEvent): ErrorEvent {
  if (event.request) {
    event.request = event.request.url ? { url: withoutSecrets(event.request.url) } : {}
  }
  return event
}

const URL_KEYS = ['url', 'from', 'to'] as const

function scrubBreadcrumb(breadcrumb: Breadcrumb): Breadcrumb {
  const data = breadcrumb.data
  if (!data) return breadcrumb
  const scrubbed = { ...data }
  for (const key of URL_KEYS) {
    if (typeof scrubbed[key] === 'string') scrubbed[key] = withoutSecrets(scrubbed[key])
  }
  return { ...breadcrumb, data: scrubbed }
}

/** The SDK options, or null when there is no DSN: then the SDK must not start. */
export function bugsinkOptions({ dsn, release }: ErrorReportingEnv): BrowserOptions | null {
  if (!dsn?.trim()) return null
  return {
    dsn,
    release,
    environment: ENVIRONMENT,
    // SDK v11 replaced sendDefaultPii with this; each default is on.
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
      stackFrameVariables: false,
    },
    tracesSampleRate: 0,
    // Bugsink ignores sessions; without this integration the SDK sends none.
    integrations: (defaults) => defaults.filter((i) => i.name !== 'BrowserSession'),
    beforeSend: scrubEvent,
    beforeBreadcrumb: scrubBreadcrumb,
  }
}

/** Starts the SDK when the build has a DSN. Call once, before the app renders. */
export function startErrorReporting(
  env: ErrorReportingEnv = {
    dsn: import.meta.env.VITE_BUGSINK_DSN,
    release: import.meta.env.VITE_BUGSINK_RELEASE,
  },
) {
  const options = bugsinkOptions(env)
  if (options) Sentry.init(options)
}

/** Reports an error that the app caught itself. A no-op while the SDK is not started. */
export function reportError(error: unknown) {
  Sentry.captureException(error)
}
