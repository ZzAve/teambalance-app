import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Pause, Play, RotateCcw, Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Member } from '@shared/api/members'
import type { Payment } from '@shared/api/money-pool'
import { teamPhotoUrl } from '@shared/api/photos'
import { Avatar } from '@shared/ui/avatar'
import { Button } from '@shared/ui/button'
import { Chip } from '@shared/ui/chip'
import { formatEuro, formatPaymentDate } from '../lib/format'
import { playbackFrames, playbackSteps, type PlaybackFrame } from '../lib/ranking-at'
import { splitPodium, toppers, type Topper, type TopperPeriod } from '../lib/toppers'

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

const prefersReducedMotion = () => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Where the time bar stands, as a frame index; no position means now. `frames` ties it to the frames it indexes, so a refetch drops it. */
interface Position {
  frames: PlaybackFrame[]
  index: number
}

/** The money pool's Toppers: every member ranked as a podium and a list, a time bar through the season and a replay of how the ranking grew. */
export function ToppersView({ payments, today, members, seasonSet, youId }: ToppersViewProps) {
  const { t } = useTranslation()
  const headingId = useId()
  const [period, setPeriod] = useState<TopperPeriod>('season')
  const [stored, setPosition] = useState<Position | null>(null)
  const [playRequested, setPlayRequested] = useState(false)
  const [announced, setAnnounced] = useState('')
  const playButton = useRef<HTMLButtonElement>(null)
  const resetHadFocus = useRef(false)

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

  useEffect(() => {
    if (!playing) return
    const reduced = prefersReducedMotion()
    const next = playbackSteps(frames.length, reduced).find((s) => s > index)
    if (next === undefined) return
    const stepMs = reduced ? REDUCED_MOTION_STEP_MS : PLAYBACK_MS / Math.max(frames.length - 1, 1)
    const id = window.setTimeout(() => setPosition({ frames, index: next }), stepMs)
    return () => window.clearTimeout(id)
  }, [playing, frames, index])

  const choosePeriod = (next: TopperPeriod) => {
    setPeriod(next)
    setPosition(null)
    setPlayRequested(false)
  }
  const onPlay = () => {
    if (playing) return setPlayRequested(false)
    setPlayRequested(true)
    if (position === null) setPosition({ frames, index: 0 }) // from now, start over
  }
  const onSlide = (next: number) => {
    setPlayRequested(false)
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

      <div className="rounded-lg bg-card p-2">
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
            <Podium top={podium} memberById={memberById} nameOf={nameOf} youId={youId} />
            <RankingList rest={rest} memberById={memberById} nameOf={nameOf} youId={youId} />
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

function Face({ memberId, member, name, size }: { memberId: string; member: Member | undefined; name: string; size: 'sm' | 'md' }) {
  const photoVersion = member?.photoVersion
  return <Avatar userId={memberId} name={name} size={size} photoUrl={photoVersion ? teamPhotoUrl(memberId, photoVersion) : undefined} />
}

function YouBadge() {
  const { t } = useTranslation()
  return <span className="ml-1.5 rounded-full bg-blue/10 px-1.5 py-0.5 align-[1px] text-caption font-bold tracking-wide text-blue">{t('money.toppers.you')}</span>
}

interface PartProps {
  memberById: Map<string, Member>
  nameOf: (memberId: string) => string
  youId?: string
}

/** Second, first and third place side by side; the visual stands in for the ranking list, which carries the text. */
function Podium({ top, memberById, nameOf, youId }: PartProps & { top: Topper[] }) {
  const { t } = useTranslation()
  const slots = [top[1], top[0], top[2]].filter((r) => r !== undefined)
  return (
    <div aria-hidden="true" className="flex items-end justify-center gap-2 px-2 pt-5 pb-3">
      {slots.map((r) => {
        const place = Math.min(r.rank, 3) as 1 | 2 | 3
        return (
          <div key={r.memberId} className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
            {r.rank === 1 && <Trophy size={18} className="text-gold-ink" />}
            <Face memberId={r.memberId} member={memberById.get(r.memberId)} name={nameOf(r.memberId)} size={r.rank === 1 ? 'md' : 'sm'} />
            <span className="max-w-full truncate text-caption font-semibold">{r.memberId === youId ? t('money.toppers.you') : nameOf(r.memberId)}</span>
            <span className="font-display text-lead font-bold tabular-nums">{formatEuro(r.total)}</span>
            <span
              className="w-full rounded-t-sm pt-1 font-display font-bold"
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
function RankingList({ rest, memberById, nameOf, youId }: PartProps & { rest: Topper[] }) {
  if (rest.length === 0) return null
  const byMember = [...rest].sort((a, b) => a.memberId.localeCompare(b.memberId))
  return (
    <div aria-hidden="true" className="relative" style={{ height: rest.length * ROW_HEIGHT }}>
      {byMember.map((r) => (
        <div
          key={r.memberId}
          className="absolute inset-x-0 flex items-center gap-3 px-2 transition-transform duration-200 motion-reduce:transition-none"
          style={{ height: ROW_HEIGHT, transform: `translateY(${rest.indexOf(r) * ROW_HEIGHT}px)` }}
        >
          <span className="w-6 text-center text-small font-bold text-muted-foreground tabular-nums">{r.rank}</span>
          <Face memberId={r.memberId} member={memberById.get(r.memberId)} name={nameOf(r.memberId)} size="sm" />
          <span className="min-w-0 flex-1 truncate text-small font-semibold">
            {nameOf(r.memberId)}
            {r.memberId === youId && <YouBadge />}
          </span>
          <span className="text-small font-semibold tabular-nums">{formatEuro(r.total)}</span>
        </div>
      ))}
    </div>
  )
}
