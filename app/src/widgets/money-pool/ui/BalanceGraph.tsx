import { useTranslation } from 'react-i18next'
import type { BalancePoint } from '../lib/balance-timeline'
import { formatEuro, formatPaymentDate } from '../lib/format'

interface BalanceGraphProps {
  /** Oldest first, at least one. */
  points: BalancePoint[]
}

const W = 326
const H = 48
const PAD = 4

/** The pot balance as a static step line (ADR-0042: rebuilt from the payment list, nothing stored). */
export function BalanceGraph({ points }: BalanceGraphProps) {
  const { t } = useTranslation()
  const first = points[0]
  const last = points[points.length - 1]
  const start = Date.parse(first.date)
  const span = Date.parse(last.date) - start
  const x = (i: number) =>
    PAD + ((span > 0 ? (Date.parse(points[i].date) - start) / span : i / Math.max(points.length - 1, 1)) * (W - 2 * PAD))
  const max = Math.max(...points.map((p) => p.balance), 1)
  const min = Math.min(...points.map((p) => p.balance), 0)
  const y = (v: number) => PAD + (1 - (v - min) / (max - min)) * (H - 2 * PAD)

  const line = points.map((p, i) => (i === 0 ? `M${x(0)},${y(p.balance)}` : `H${x(i)}V${y(p.balance)}`)).join('')

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={t('money.graphSummary', {
          from: formatEuro(first.balance),
          fromDate: formatPaymentDate(first.date),
          to: formatEuro(last.balance),
          toDate: formatPaymentDate(last.date),
        })}
        className="w-full"
      >
        <path d={`${line}V${y(min)}H${x(0)}Z`} fill="var(--color-blue)" fillOpacity={0.1} />
        <path d={line} fill="none" stroke="var(--color-blue)" strokeWidth={2} strokeLinejoin="round" />
        <line x1={0} x2={W} y1={y(min)} y2={y(min)} stroke="var(--color-border)" />
        <circle cx={x(points.length - 1)} cy={y(last.balance)} r={3.5} fill="var(--color-blue)" stroke="var(--color-card)" strokeWidth={2} />
      </svg>
      <div className="flex justify-between text-caption text-muted-foreground" aria-hidden="true">
        <span>{formatPaymentDate(first.date)}</span>
        <span>{formatPaymentDate(last.date)}</span>
      </div>
    </div>
  )
}
