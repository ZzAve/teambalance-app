import { useEffect, useState } from 'react'

// The boot splash, but time-aware. The prod backend scales to zero, so a cold first load can stall
// ~12s while the container wakes. A frozen wordmark for that long reads as a hang, so the splash
// escalates as it waits — warm loads (<~2.5s) never see anything but the brand mark.
//
// Everything here is driven by an injected `elapsedMs` so it stays pure and story-able: the stories
// pass fixed elapsed values, the pure stage helpers are unit-testable, and only <WakingSplash> owns
// a real clock. Playful-and-warm voice to match the app (a volleyball team tool).

export type SplashStage = 'brand' | 'waking' | 'warming'

/** Warm loads resolve before this — no "waking" copy for the common case. */
export const WAKING_AFTER_MS = 2_500
/** Past this we're clearly in a cold-start; swap the looped motion for a concrete step indicator. */
export const WARMING_AFTER_MS = 10_000

export function splashStageFor(elapsedMs: number): SplashStage {
  if (elapsedMs >= WARMING_AFTER_MS) return 'warming'
  if (elapsedMs >= WAKING_AFTER_MS) return 'waking'
  return 'brand'
}

// Stage 2 rotates its line so it reads as motion, not a stuck frame (per the loading-states guidance:
// prefer changing text over a frozen spinner in the 5–10s band).
export function wakingMessageFor(elapsedMs: number): string {
  return elapsedMs < 6_000 ? 'Rounding up the team…' : 'Almost there…'
}

/** Stage 3 step indicator — honest discrete steps, no fake percentage bar. */
export const WARMING_STEPS = ['Waking the server', 'Connecting', 'Loading your team'] as const

/**
 * Which step is currently in flight. Earlier steps render checked, later ones dim. The final step
 * ("Loading your team") stays active until the route actually resolves and the splash unmounts —
 * so the one milestone we truly know (real completion) is never faked.
 */
export function activeWarmingStep(elapsedMs: number): number {
  if (elapsedMs < 15_000) return 1
  if (elapsedMs < 22_000) return 2
  return WARMING_STEPS.length - 1
}

function Wordmark() {
  return (
    <span className="font-display text-2xl font-bold text-blue">
      Team<span className="text-green">Balance</span>
    </span>
  )
}

function StepIndicator({ elapsedMs }: { elapsedMs: number }) {
  const active = activeWarmingStep(elapsedMs)
  return (
    <ul className="flex flex-col gap-2 text-sm">
      {WARMING_STEPS.map((step, i) => {
        const done = i < active
        const isActive = i === active
        return (
          <li key={step} className="flex items-center gap-2">
            <span
              aria-hidden
              className={
                done
                  ? 'h-2 w-2 rounded-full bg-green'
                  : isActive
                    ? 'h-2 w-2 animate-pulse rounded-full bg-gold'
                    : 'h-2 w-2 rounded-full bg-muted-foreground/30'
              }
            />
            <span
              className={
                done
                  ? 'text-muted-foreground'
                  : isActive
                    ? 'font-semibold text-foreground'
                    : 'text-muted-foreground/50'
              }
            >
              {step}
              {isActive ? '…' : ''}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

/** Presentational splash for a given elapsed time. Pure — no timers, fully controlled by props. */
export function ColdStartSplash({ elapsedMs = 0 }: { elapsedMs?: number }) {
  const stage = splashStageFor(elapsedMs)

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <Wordmark />
        <span className={stage === 'brand' ? '' : 'animate-bounce'} aria-hidden>
          🏐
        </span>
      </div>

      {stage === 'waking' && (
        <p className="animate-pulse text-sm text-muted-foreground">{wakingMessageFor(elapsedMs)}</p>
      )}

      {stage === 'warming' && (
        <div className="flex flex-col items-center gap-4">
          <StepIndicator elapsedMs={elapsedMs} />
          <p className="max-w-xs text-xs text-muted-foreground">
            Still warming up the court — this happens after a quiet spell. Hang tight! 🏐
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * The splash the router mounts while a route is pending. Owns the only real clock: it ticks the
 * elapsed time so the presentational <ColdStartSplash> escalates through its stages. Unmounts the
 * moment the route resolves (the real completion signal), so nothing here needs to fake progress.
 */
export function WakingSplash() {
  const [elapsedMs, setElapsedMs] = useState(0)

  useEffect(() => {
    const startedAt = Date.now()
    const id = window.setInterval(() => setElapsedMs(Date.now() - startedAt), 500)
    return () => window.clearInterval(id)
  }, [])

  return <ColdStartSplash elapsedMs={elapsedMs} />
}
