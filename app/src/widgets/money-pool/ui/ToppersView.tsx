import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type Ref } from 'react'
import { ChevronDown, ChevronUp, Pause, Play, RotateCcw, Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Member } from '@shared/api/members'
import type { Payment } from '@shared/api/money-pool'
import { Button } from '@shared/ui/button'
import { Chip } from '@shared/ui/chip'
import { formatEuro, formatPaymentDate } from '../lib/format'
import { playbackFrames, playbackSteps, rankDeltas, type PlaybackFrame } from '../lib/ranking-at'
import { splitPodium, toppers, type Topper, type TopperPeriod } from '../lib/toppers'
import { useCountUp } from '../lib/use-count-up'
import { MemberAvatar } from './MemberAvatar'

interface ToppersViewProps {
  /** Newest first, as the pool returns them. */
  payments: Payment[]
  /** ISO calendar date; the end of the Last 30 days period. */
  today: string
  /** The team roster: every member is ranked, at zero without a top-up. A ranked id that is not in it left the team and shows as "Former member". */
  members: Member[]
  /** The payments run from the season start (true) or are the last 90 days (false); the period is named after that. */
  seasonSet?: boolean
  /** The viewer's member id, marked with a "You" badge. Absent when the viewer is not a member (act-as). */
  youId?: string
}

const ROW_HEIGHT = 52
/** The whole playback takes about this long, however many payment days it steps through. */
const PLAYBACK_MS = 2500
const REDUCED_MOTION_STEP_MS = 700
/** The summary line is said this long after the slider stopped moving. */
const SETTLE_MS = 400
const PODIUM_STEP_HEIGHTS = [52, 36, 24] as const // by rank 1, 2, 3
const RANK_TOKENS = ['--color-rank-1', '--color-rank-2', '--color-rank-3'] as const
/** The entrance (global.css .toppers-enter) is over by then: the trophy lands at 940ms. */
const ENTRANCE_MS = 1000
/** The podium amounts count up from zero in the entrance, after their step has grown (by place 1, 2, 3). */
const ENTRANCE_COUNT_MS = 600
const ENTRANCE_COUNT_DELAYS = [340, 250, 160] as const
/** Between two frames of the playback or the time bar the amounts tick this long. */
const TICK_MS = 250
/** A rank-change arrow shows this long (global.css .toppers-move). */
const MOVE_MS = 1100
/** List rows past this one rise together in the entrance, so a long roster does not drag it out. */
const ENTRANCE_ROW_CAP = 8

const prefersReducedMotion = () => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Where the time bar stands, as a frame index; no position means now. `frames` ties it to the frames it indexes, so a refetch drops it. */
interface Position {
  frames: PlaybackFrame[]
  index: number
}

/**
 * The entrance: `pending` holds the podium and the list at the entrance's start until the podium scrolls into
 * view, `entering` runs it, `done` is the final state. Without motion, or without IntersectionObserver to start
 * it, it is `done` from the first render, so nothing is ever left hidden.
 */
type Entrance = 'pending' | 'entering' | 'done'

/** A rank change on a list row: places moved (up as positive), and when its arrow goes. */
interface Move {
  places: number
  until: number
}

/** The money pool's Toppers: every member ranked as a podium and a list, a time bar through the season and a replay of how the ranking grew. */
export function ToppersView({ payments, today, members, seasonSet, youId }: ToppersViewProps) {
  const { t } = useTranslation()
  const headingId = useId()
  const [period, setPeriod] = useState<TopperPeriod>('season')
  const [stored, setPosition] = useState<Position | null>(null)
  const [playRequested, setPlayRequested] = useState(false)
  const [announced, setAnnounced] = useState('')
  const [entrance, setEntrance] = useState<Entrance>(() => (!prefersReducedMotion() && typeof IntersectionObserver !== 'undefined' ? 'pending' : 'done'))
  const [moves, setMoves] = useState<ReadonlyMap<string, Move>>(new Map())
  const playButton = useRef<HTMLButtonElement>(null)
  const podiumRef = useRef<HTMLDivElement>(null)
  const resetHadFocus = useRef(false)
  const motion = !prefersReducedMotion()
  // Reduced motion switched on meanwhile shows the final state at once.
  const phase: Entrance = motion ? entrance : 'done'
  const endEntrance = () => setEntrance('done')

  const memberById = useMemo(() => new Map(members.map((m) => [m.userId, m])), [members])
  const memberIds = useMemo(() => members.map((m) => m.userId), [members])
  const formerMember = t('money.toppers.formerMember')
  const nameOf = useCallback((memberId: string) => memberById.get(memberId)?.displayName ?? formerMember, [memberById, formerMember])
  const result = useMemo(() => toppers(payments, period, today, nameOf, memberIds), [payments, period, today, nameOf, memberIds])
  const frames = useMemo(() => playbackFrames(payments, period, today, nameOf, memberIds), [payments, period, today, nameOf, memberIds])

  const last = frames.length - 1
  // The last frame is now: a bar at its end, or a playback that got there, is the same as no position at all.
  const position = stored && stored.frames === frames && stored.index < last ? stored : null
  const index = position?.index ?? last
  const playing = playRequested && position !== null
  const frame = position ? frames[position.index] : undefined
  const ranking = frame ? frame.ranking : result.ranking
  const { podium, rest } = splitPodium(ranking)
  const seasonName = seasonSet === false ? t('money.last90Days') : t('money.toppers.season')
  const summaryText = ranking[0] && ranking[0].total > 0 ? t('money.toppers.onTop', { name: nameOf(ranking[0].memberId), amount: formatEuro(ranking[0].total) }) : ''
  const showSummary = position !== null && !playing
  const labelOf = (memberId: string) => (memberId === youId ? t('money.toppers.self', { name: nameOf(memberId) }) : nameOf(memberId))
  const nowLabel = period === 'last30' ? t('money.toppers.nowLast30Days') : seasonSet === false ? t('money.toppers.nowLast90Days') : t('money.toppers.nowSeason')

  // Said once, shortly after the playback pauses or ends or the slider stops, not on every step.
  useEffect(() => {
    const id = window.setTimeout(() => setAnnounced(showSummary ? summaryText : ''), showSummary ? SETTLE_MS : 0)
    return () => window.clearTimeout(id)
  }, [showSummary, summaryText])

  // "Back to now" unmounts when the position ends (reset, a refetch, the bar or a playback reaching now); focus then moves to the play button, not <body>.
  const atNow = position === null
  useEffect(() => {
    if (atNow && resetHadFocus.current) {
      resetHadFocus.current = false
      playButton.current?.focus()
    }
  }, [atNow])

  // The entrance plays once, the first time the podium is mostly in view (Toppers sit below the fold). The
  // podium may only appear later (a refetch with the first top-up), so the observer starts when it renders.
  const hasPodium = result.toppedUp > 0
  const pending = phase === 'pending'
  useEffect(() => {
    const podium = podiumRef.current
    if (!pending || !hasPodium || !podium) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        observer.disconnect()
        setEntrance('entering')
      },
      { threshold: 0.35 },
    )
    observer.observe(podium)
    return () => observer.disconnect()
  }, [pending, hasPodium])

  useEffect(() => {
    if (entrance !== 'entering') return
    const id = window.setTimeout(() => setEntrance('done'), ENTRANCE_MS)
    return () => window.clearTimeout(id)
  }, [entrance])

  // Each step of the playback or the time bar marks the rows that changed rank, for MOVE_MS.
  const noteMoves = useCallback((from: Topper[], to: Topper[]) => {
    if (prefersReducedMotion()) return
    const deltas = rankDeltas(from, to)
    if (deltas.size === 0) return
    const until = performance.now() + MOVE_MS
    setMoves((current) => new Map([...current, ...[...deltas].map(([memberId, places]) => [memberId, { places, until }] as const)]))
  }, [])
  useEffect(() => {
    if (moves.size === 0) return
    const first = Math.min(...[...moves.values()].map((m) => m.until))
    const id = window.setTimeout(() => setMoves((current) => new Map([...current].filter(([, m]) => m.until > performance.now()))), first - performance.now())
    return () => window.clearTimeout(id)
  }, [moves])

  useEffect(() => {
    if (!playing) return
    const reduced = prefersReducedMotion()
    const next = playbackSteps(frames.length, reduced).find((s) => s > index)
    if (next === undefined) return
    const stepMs = reduced ? REDUCED_MOTION_STEP_MS : PLAYBACK_MS / Math.max(frames.length - 1, 1)
    const id = window.setTimeout(() => {
      noteMoves(frames[index].ranking, frames[next].ranking)
      setPosition({ frames, index: next })
    }, stepMs)
    return () => window.clearTimeout(id)
  }, [playing, frames, index, noteMoves])

  // Play, the time bar, reset and the period all end the entrance at its final state, so two motions never overlap.
  const choosePeriod = (next: TopperPeriod) => {
    endEntrance()
    setMoves(new Map())
    setPeriod(next)
    setPosition(null)
    setPlayRequested(false)
  }
  const onPlay = () => {
    endEntrance()
    if (playing) return setPlayRequested(false)
    setPlayRequested(true)
    if (position === null) setPosition({ frames, index: 0 }) // from now, start over
  }
  const onSlide = (next: number) => {
    endEntrance()
    setPlayRequested(false)
    noteMoves(ranking, frames[next].ranking)
    setPosition({ frames, index: next })
  }

  const playLabel = playing ? t('money.toppers.pause') : position ? t('money.toppers.resume') : t('money.toppers.play')
  const PlayIcon = playing ? Pause : Play

  return (
    <section aria-labelledby={headingId}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 id={headingId} className="font-display text-body font-bold">
          {t('money.toppers.title')}
        </h3>
        <div role="group" aria-label={t('money.toppers.period')} className="flex gap-1">
          <Chip
            pressed={period === 'season'}
            onToggle={() => choosePeriod('season')}
            activeClassName="border-foreground bg-foreground text-background"
            inactiveClassName="border-border bg-card text-muted-foreground"
          >
            {seasonName}
          </Chip>
          <Chip
            pressed={period === 'last30'}
            onToggle={() => choosePeriod('last30')}
            activeClassName="border-foreground bg-foreground text-background"
            inactiveClassName="border-border bg-card text-muted-foreground"
          >
            {t('money.toppers.last30Days')}
          </Chip>
        </div>
      </div>

      <div className={`rounded-lg bg-card p-2${phase === 'done' ? '' : ` toppers-${phase === 'pending' ? 'pending' : 'enter'}`}`}>
        {result.toppedUp === 0 ? (
          <p className="p-4 text-center text-small text-muted-foreground">{period === 'season' ? t('money.toppers.empty') : t('money.toppers.emptyLast30Days')}</p>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Button ref={playButton} variant="ghost" size="icon" aria-label={playLabel} disabled={frames.length < 2} onClick={onPlay}>
                <PlayIcon aria-hidden="true" />
              </Button>
              {position && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t('money.toppers.reset')}
                  onFocus={() => (resetHadFocus.current = true)}
                  onBlur={() => (resetHadFocus.current = false)}
                  onClick={() => {
                    endEntrance()
                    setPosition(null)
                    setPlayRequested(false)
                  }}
                >
                  <RotateCcw aria-hidden="true" />
                </Button>
              )}
              <span className="text-small font-semibold tabular-nums">
                {frame ? formatPaymentDate(frame.date) : nowLabel}
              </span>
              <span aria-hidden="true" className="ml-auto pr-2 text-caption text-muted-foreground">{t('money.toppers.totalToppedUp')}</span>
            </div>
            {frames.length >= 2 && (
              <input
                type="range"
                aria-label={t('money.toppers.day')}
                aria-valuetext={frame ? formatPaymentDate(frame.date) : nowLabel}
                min={0}
                max={last}
                step={1}
                value={index}
                onChange={(e) => onSlide(Number(e.target.value))}
                className="mt-1 h-11 w-full"
                style={{ accentColor: 'var(--color-blue)' }}
              />
            )}
            <Podium ref={podiumRef} top={podium} memberById={memberById} nameOf={nameOf} youId={youId} motion={motion} phase={phase} />
            <RankingList rest={rest} memberById={memberById} nameOf={nameOf} youId={youId} motion={motion} moves={moves} />
            {/* The text version of the ranking, complete at every step of the playback. */}
            <ol aria-label={t('money.toppers.ranking')} className="sr-only">
              {ranking.map((r) => (
                <li key={r.memberId}>{t('money.toppers.rankItem', { rank: r.rank, name: labelOf(r.memberId), amount: formatEuro(r.total) })}</li>
              ))}
            </ol>
            <p aria-live="polite" className="sr-only">
              {announced}
            </p>
          </>
        )}
      </div>
      {result.unmatched > 0 && (
        <p className="mx-1 mt-2 text-caption text-muted-foreground">{t('money.toppers.unmatched', { amount: formatEuro(result.unmatched) })}</p>
      )}
    </section>
  )
}

/** An amount that ticks to a new value (useCountUp); `from` counts it up from there instead, as in the entrance. */
function CountingEuro({ cents, className, active, from, duration, delay }: { cents: number; className: string; active: boolean; from?: number; duration: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useCountUp(ref, cents, formatEuro, { active, from, duration, delay })
  return (
    <span ref={ref} className={className}>
      {formatEuro(cents)}
    </span>
  )
}

function YouBadge() {
  const { t } = useTranslation()
  return <span className="ml-1.5 rounded-full bg-blue/10 px-1.5 py-0.5 align-[1px] text-caption font-bold tracking-wide text-blue">{t('money.toppers.you')}</span>
}

interface PartProps {
  memberById: Map<string, Member>
  nameOf: (memberId: string) => string
  youId?: string
  /** False under reduced motion: no ticks, no arrows. */
  motion: boolean
}

/**
 * Second, first and third place side by side; the visual stands in for the ranking list, which carries the text.
 * The slots are keyed by position, so a step changes height in place; the face inside is keyed by member, so a new one fades in.
 */
function Podium({ ref, top, memberById, nameOf, youId, motion, phase }: PartProps & { ref: Ref<HTMLDivElement>; top: Topper[]; phase: Entrance }) {
  const { t } = useTranslation()
  const entering = phase === 'entering'
  const slots = ([['second', top[1]], ['first', top[0]], ['third', top[2]]] as const).flatMap(([slot, r]) => (r ? [{ slot, r }] : []))
  return (
    <div ref={ref} aria-hidden="true" className="flex items-end justify-center gap-2 px-2 pt-5 pb-3">
      {slots.map(({ slot, r }) => {
        const place = Math.min(r.rank, 3) as 1 | 2 | 3
        return (
          <div key={slot} data-place={place} className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
            {r.rank === 1 && <Trophy data-podium-trophy size={18} className="text-gold-ink" />}
            {/* The rise (entrance) and the swap (a new face) are on separate elements, so ending the entrance does not restart the swap. */}
            <div data-podium-rise className="flex min-w-0 max-w-full flex-col items-center">
              <div key={r.memberId} className={`flex min-w-0 max-w-full flex-col items-center gap-1${motion ? ' toppers-swap' : ''}`}>
                <MemberAvatar memberId={r.memberId} member={memberById.get(r.memberId)} name={nameOf(r.memberId)} size={r.rank === 1 ? 'md' : 'sm'} />
                <span className="max-w-full truncate text-caption font-semibold">{r.memberId === youId ? t('money.toppers.you') : nameOf(r.memberId)}</span>
              </div>
            </div>
            <span data-podium-rise>
              <CountingEuro
                // Held at zero until the entrance counts it up.
                cents={phase === 'pending' ? 0 : r.total}
                className="font-display text-lead font-bold tabular-nums"
                active={motion}
                from={entering ? 0 : undefined}
                duration={entering ? ENTRANCE_COUNT_MS : TICK_MS}
                delay={entering ? ENTRANCE_COUNT_DELAYS[place - 1] : 0}
              />
            </span>
            <span
              data-podium-step
              className="w-full rounded-t-sm pt-1 font-display font-bold transition-[height] duration-300 ease-out motion-reduce:transition-none"
              style={{ height: PODIUM_STEP_HEIGHTS[place - 1], background: `color-mix(in srgb, var(${RANK_TOKENS[place - 1]}) 30%, transparent)` }}
            >
              {r.rank}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/** Everyone below the podium. Rows keep their DOM order and move by transform, so a rank change slides (off under reduced motion). */
function RankingList({ rest, memberById, nameOf, youId, motion, moves }: PartProps & { rest: Topper[]; moves: ReadonlyMap<string, Move> }) {
  if (rest.length === 0) return null
  const byMember = [...rest].sort((a, b) => a.memberId.localeCompare(b.memberId))
  return (
    <div aria-hidden="true" className="relative" style={{ height: rest.length * ROW_HEIGHT }}>
      {byMember.map((r) => {
        const row = rest.indexOf(r)
        const move = moves.get(r.memberId)
        return (
          <div
            key={r.memberId}
            data-ranking-row
            className="absolute inset-x-0 flex items-center gap-3 px-2 transition-transform duration-200 motion-reduce:transition-none"
            style={{ height: ROW_HEIGHT, transform: `translateY(${row * ROW_HEIGHT}px)`, '--row-i': Math.min(row, ENTRANCE_ROW_CAP) } as CSSProperties}
          >
            <span className="w-6 text-center text-small font-bold text-muted-foreground tabular-nums">{r.rank}</span>
            <MemberAvatar memberId={r.memberId} member={memberById.get(r.memberId)} name={nameOf(r.memberId)} />
            <span className="min-w-0 flex-1 truncate text-small font-semibold">
              {nameOf(r.memberId)}
              {r.memberId === youId && <YouBadge />}
              {move && (
                // Keyed by its end time, so a second move restarts the arrow.
                <span key={move.until} className={`toppers-move ml-1.5 inline-flex items-center align-[1px] text-caption font-bold tabular-nums ${move.places > 0 ? 'text-blue' : 'text-muted-foreground'}`}>
                  {move.places > 0 ? <ChevronUp size={12} strokeWidth={3} /> : <ChevronDown size={12} strokeWidth={3} />}
                  {Math.abs(move.places)}
                </span>
              )}
            </span>
            <CountingEuro cents={r.total} className="text-small font-semibold tabular-nums" active={motion} duration={TICK_MS} />
          </div>
        )
      })}
    </div>
  )
}
