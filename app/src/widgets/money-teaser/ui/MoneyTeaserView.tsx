import { Check, Heart, PlusCircle, Receipt, Wallet, type LucideIcon } from 'lucide-react'
import { PiggyBankArt } from './PiggyBankArt'

interface MoneyTeaserViewProps {
  /** Whether this viewer has already tapped "I want this" (remembered per-device by the container). */
  hasVoted: boolean
  /**
   * The interest tally to show. This is deliberately-fake theatre, not real data — a deterministic
   * function of the clock the container computes (see lib/interest-count) plus the viewer's own +1.
   * The View just renders whatever number it's handed.
   */
  count: number
  /** Register interest. A no-op once `hasVoted` — the button is held so a vote can't double-fire. */
  onVote: () => void
}

interface Pillar {
  icon: LucideIcon
  title: string
  blurb: string
}

// The three things the money feature will eventually do, in the order they matter to a player:
// the pool exists, you can put money in, and you can see where it went. Deliberately Bunq-free —
// "shared team money", not "Bunq", until the integration is real.
const PILLARS: Pillar[] = [
  { icon: Wallet, title: 'One shared pot', blurb: "The whole team's money, in one place" },
  { icon: PlusCircle, title: 'Chip in fast', blurb: 'Top up your share in a couple of taps' },
  { icon: Receipt, title: 'Every euro tracked', blurb: 'See what was paid, and where it went' },
]

/**
 * The Money tab's coming-soon teaser: a playful "reveal card" that tells the team a shared money
 * pool is on its way, and lets a member tap "I want this" to register interest.
 *
 * Prop-only (ADR-0017): the vote's on/off state, the interest `count` and the tap handler all come
 * in as props, so every state renders with no network. The thin container (MoneyTeaser) owns the
 * per-device memory and computes the count.
 *
 * The count is knowingly fake — a deterministic, ever-climbing bit of theatre while the feature has
 * no backend (see lib/interest-count). It is labelled as such in code so nobody mistakes it for a
 * real tally; when the money feature ships it gets swapped for a genuine number.
 */
export function MoneyTeaserView({ hasVoted, count, onVote }: MoneyTeaserViewProps) {
  return (
    <section aria-labelledby="money-teaser-heading" className="mx-auto flex max-w-sm flex-col items-center text-center">
      <span
        className="rounded-full bg-gold/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]"
        style={{ color: 'var(--color-gold-dark)' }}
      >
        Coming soon
      </span>

      <h1 id="money-teaser-heading" className="font-display mt-4 text-balance text-3xl font-bold leading-[1.05]">
        A shared team pot is{' '}
        <span style={{ color: 'var(--color-orange)' }}>on its way.</span>
      </h1>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Soon you'll all chip into one pool, top up in seconds, and see exactly where every euro went —
        right here in the app.
      </p>

      <PiggyBankArt className="my-7" />

      <ul className="flex w-full flex-col gap-3 text-left">
        {PILLARS.map(({ icon: Icon, title, blurb }) => (
          <li key={title} className="flex items-center gap-3">
            <span
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold/12 ring-1 ring-inset ring-gold/25"
              style={{ color: 'var(--color-gold-dark)' }}
            >
              <Icon size={20} />
            </span>
            <span>
              <span className="block text-sm font-semibold leading-tight text-foreground">{title}</span>
              <span className="text-xs text-muted-foreground">{blurb}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-8 w-full">
        <p className="mb-3 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <Heart size={15} fill="currentColor" className="shrink-0" style={{ color: 'var(--color-gold)' }} />
          {/* tabular-nums so the width doesn't jitter as the number climbs. */}
          <span className="font-display text-base font-bold tabular-nums text-foreground">
            {count.toLocaleString('nl-NL')}
          </span>
          <span>{hasVoted ? 'want this — including you' : 'want this so far'}</span>
        </p>

        <button
          type="button"
          onClick={onVote}
          disabled={hasVoted}
          aria-pressed={hasVoted}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-bold transition-transform duration-150 active:scale-[0.98] disabled:active:scale-100"
          style={
            hasVoted
              ? { background: 'color-mix(in srgb, var(--color-gold) 20%, var(--color-card))', color: 'var(--color-gold-dark)' }
              : {
                  background: 'linear-gradient(180deg, var(--color-gold-light), var(--color-gold))',
                  color: '#4a3400',
                  boxShadow: '0 8px 18px -6px color-mix(in srgb, var(--color-gold) 70%, transparent)',
                }
          }
        >
          {hasVoted ? <Check size={19} /> : <Heart size={19} />}
          {hasVoted ? "You're in!" : 'I want this'}
        </button>

        <p className="mt-3 min-h-4 text-xs text-muted-foreground" aria-live="polite">
          {hasVoted
            ? "Nice — we'll let you know the moment it goes live."
            : 'Tap to let us know a shared pot would help your team.'}
        </p>
      </div>
    </section>
  )
}
