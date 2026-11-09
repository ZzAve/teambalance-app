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
import { toppers, type Topper, type TopperPeriod } from '../lib/toppers'

interface ToppersViewProps {
  /** Newest first, as the pool returns them. */
  payments: Payment[]
  /** ISO calendar date; the end of the Last 30 days period. */
  today: string
  /** The team roster. A ranked member who is not in it left the team and shows as "Former member". */
  members: Member[]
  /** The payments run from the season start (true) or are the last 90 days (false); the period is named after that. */
  seasonSet?: boolean
}

const ROW_HEIGHT = 52
/** The whole playback takes about this long, however many payment days it steps through. */
const PLAYBACK_MS = 2500
const REDUCED_MOTION_STEP_MS = 700
const PODIUM_STEP_HEIGHTS = [52, 36, 24] as const // by rank 1, 2, 3
const RANK_TOKENS = ['--color-rank-1', '--color-rank-2', '--color-rank-3'] as const

const prefersReducedMotion = () => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface Playback {
  /** Frame indexes this playback visits. */
  steps: number[]
  stepMs: number
  /** The frames this playback indexes; a refetch builds new ones and ends the playback. */
  frames: PlaybackFrame[]
  /** Position in `steps`. */
  step: number
}

/** The money pool's Toppers: who topped up most as a podium and a ranking list, and a replay of how the ranking grew. */
export function ToppersView({ payments, today, members, seasonSet }: ToppersViewProps) {
  const { t } = useTranslation()
  const headingId = useId()
  const [period, setPeriod] = useState<TopperPeriod>('season')
  // Null while no playback ran: the ranking is then as of today.
  const [started, setPlayback] = useState<Playback | null>(null)
  const playButton = useRef<HTMLButtonElement>(null)
  const [paused, setPaused] = useState(false)

  const memberById = useMemo(() => new Map(members.map((m) => [m.userId, m])), [members])
  const formerMember = t('money.toppers.formerMember')
  const nameOf = useCallback((memberId: string) => memberById.get(memberId)?.displayName ?? formerMember, [memberById, formerMember])
  const result = useMemo(() => toppers(payments, period, today, nameOf), [payments, period, today, nameOf])
  const frames = useMemo(() => playbackFrames(payments, period, today, nameOf), [payments, period, today, nameOf])

  const playback = started && started.frames === frames ? started : null
  const atEnd = playback !== null && playback.step >= playback.steps.length - 1
  const playing = playback !== null && !paused && !atEnd
  const frame = playback && frames[playback.steps[playback.step]]
  const ranking = frame ? frame.ranking : result.ranking
  const seasonName = seasonSet === false ? t('money.last90Days') : t('money.toppers.season')
  // Said once when the playback pauses or ends, not on every step.
  const summary =
    playback && (paused || atEnd) && ranking[0]
      ? t('money.toppers.onTop', { name: nameOf(ranking[0].memberId), amount: formatEuro(ranking[0].total) })
      : ''

  useEffect(() => {
    if (!playing) return
    const id = window.setTimeout(() => setPlayback({ ...playback, step: playback.step + 1 }), playback.stepMs)
    return () => window.clearTimeout(id)
  }, [playing, playback])

  const choosePeriod = (next: TopperPeriod) => {
    setPeriod(next)
    setPlayback(null)
  }
  const onPlay = () => {
    if (playing) return setPaused(true)
    setPaused(false)
    if (playback && !atEnd) return // resume
    const reduced = prefersReducedMotion()
    const steps = playbackSteps(frames.length, reduced)
    setPlayback({ frames, steps, step: 0, stepMs: reduced ? REDUCED_MOTION_STEP_MS : PLAYBACK_MS / Math.max(steps.length - 1, 1) })
  }

  const playLabel = playing ? t('money.toppers.pause') : atEnd ? t('money.toppers.playAgain') : playback ? t('money.toppers.resume') : t('money.toppers.play')
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
        {result.ranking.length === 0 ? (
          <p className="p-4 text-center text-small text-muted-foreground">{period === 'season' ? t('money.toppers.empty') : t('money.toppers.emptyLast30Days')}</p>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Button ref={playButton} variant="ghost" size="icon" aria-label={playLabel} disabled={frames.length < 2} onClick={onPlay}>
                <PlayIcon aria-hidden="true" />
              </Button>
              {playback && (
                <Button variant="ghost" size="icon" aria-label={t('money.toppers.reset')} onClick={() => {
                  setPlayback(null)
                  setPaused(false)
                  // The reset button unmounts with the playback; keep focus on a control that stays.
                  playButton.current?.focus()
                }}>
                  <RotateCcw aria-hidden="true" />
                </Button>
              )}
              <span className="text-small font-semibold tabular-nums">
                {frame ? formatPaymentDate(frame.date) : period === 'last30' ? t('money.toppers.nowLast30Days') : seasonSet === false ? t('money.toppers.nowLast90Days') : t('money.toppers.nowSeason')}
              </span>
              <span aria-hidden="true" className="ml-auto pr-2 text-caption text-muted-foreground">{t('money.toppers.totalToppedUp')}</span>
            </div>
            <Podium top={ranking.slice(0, 3)} memberById={memberById} nameOf={nameOf} />
            <RankingList rest={ranking.slice(3)} memberById={memberById} nameOf={nameOf} />
            {/* The text version of the ranking, complete at every step of the playback. */}
            <ol aria-label={t('money.toppers.ranking')} className="sr-only">
              {ranking.map((r) => (
                <li key={r.memberId}>{t('money.toppers.rankItem', { rank: r.rank, name: nameOf(r.memberId), amount: formatEuro(r.total) })}</li>
              ))}
            </ol>
            <p aria-live="polite" className="sr-only">
              {summary}
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

interface PartProps {
  memberById: Map<string, Member>
  nameOf: (memberId: string) => string
}

/** Second, first and third place side by side; the visual stands in for the ranking list, which carries the text. */
function Podium({ top, memberById, nameOf }: PartProps & { top: Topper[] }) {
  const slots = [top[1], top[0], top[2]].filter((r) => r !== undefined)
  return (
    <div aria-hidden="true" className="flex items-end justify-center gap-2 px-2 pt-5 pb-3">
      {slots.map((r) => {
        const place = Math.min(r.rank, 3) as 1 | 2 | 3
        return (
          <div key={r.memberId} className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
            {r.rank === 1 && <Trophy size={18} className="text-gold-ink" />}
            <Face memberId={r.memberId} member={memberById.get(r.memberId)} name={nameOf(r.memberId)} size={r.rank === 1 ? 'md' : 'sm'} />
            <span className="max-w-full truncate text-caption font-semibold">{nameOf(r.memberId)}</span>
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

/** Fourth place and below. Rows keep their DOM order and move by transform, so a rank change slides (off under reduced motion). */
function RankingList({ rest, memberById, nameOf }: PartProps & { rest: Topper[] }) {
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
          <span className="min-w-0 flex-1 truncate text-small font-semibold">{nameOf(r.memberId)}</span>
          <span className="text-small font-semibold tabular-nums">{formatEuro(r.total)}</span>
        </div>
      ))}
    </div>
  )
}
