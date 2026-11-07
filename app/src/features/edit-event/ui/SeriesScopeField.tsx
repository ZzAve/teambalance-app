import { Lock, Split } from 'lucide-react'
import type { Event, EventSeriesScope } from '@shared/api/events'
import { buildAffectedPreview } from '@entities/event/lib/series-affected'
import { SectionLabel } from '@shared/ui/SectionLabel'
import { useTranslation } from 'react-i18next'
import { formatLocale } from '@shared/i18n/i18n'

interface SeriesScopeFieldProps {
  /** Every occurrence sharing the current event's recurring group (any order). */
  siblings: Event[]
  currentId: string
  scope: EventSeriesScope
  onScopeChange: (scope: EventSeriesScope) => void
  /** 'edit' shows the accent/date-lock treatment; 'delete' shows the removed/kept treatment. */
  variant?: 'edit' | 'delete'
}

const SCOPES: EventSeriesScope[] = ['THIS', 'THIS_AND_FOLLOWING', 'ALL']

// Plain-language split semantics per scope (`seriesScope.editCaption` / `deleteCaption`) — accurate
// to the backend (a delete never splits).

function formatOccurrence(iso: string): string {
  return new Date(iso).toLocaleDateString(formatLocale(), { day: 'numeric', month: 'short' })
}

/**
 * The scope selector + live affected-preview shown when editing or deleting one occurrence of a
 * recurring series (ADR-0014, Phase 3 — the guided scope prompt from prototype A over prototype B's
 * before│this│after timeline). Presentational: `scope` and its setter are owned by the dialog, so
 * every state is a plain render arg. Standalone events don't render this at all.
 */
export function SeriesScopeField({
  siblings,
  currentId,
  scope,
  onScopeChange,
  variant = 'edit',
}: SeriesScopeFieldProps) {
  const { t } = useTranslation()
  const preview = buildAffectedPreview(siblings, currentId, scope)
  if (!preview) return null

  const danger = variant === 'delete'
  const caption = t(danger ? `seriesScope.deleteCaption.${scope}` : `seriesScope.editCaption.${scope}`)
  // Full literal classes — Tailwind can't see interpolated names.
  const panelClass = danger ? 'border-red/20 bg-red/5' : 'border-blue/20 bg-blue/5'
  const countClass = danger ? 'text-red-ink' : 'text-blue'

  return (
    <div className="flex flex-col gap-3">
      <div>
        <SectionLabel as="p" className="mb-1.5">
          {danger ? t('seriesScope.delete') : t('seriesScope.applyTo')}
        </SectionLabel>
        {/* Segmented scope control — exactly one is pressed. */}
        <div role="group" aria-label={t('seriesScope.label')} className="flex gap-1.5">
          {SCOPES.map((value) => {
            const active = scope === value
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => onScopeChange(value)}
                className={[
                  'flex-1 rounded-lg border px-2 py-2 text-caption font-semibold transition-colors',
                  active
                    ? danger
                      ? 'border-red bg-red text-white'
                      : 'border-blue bg-blue text-white'
                    : 'border-border text-muted-foreground hover:bg-muted/60',
                ].join(' ')}
              >
                {t(`seriesScope.scope.${value}`)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Affected panel: count + before│this│after timeline + split caption. */}
      <div className={`rounded-md border p-3 ${panelClass}`}>
        <p className={`text-small font-bold ${countClass}`}>
          {t(danger ? 'seriesScope.removes' : 'seriesScope.affects', { affected: preview.affectedCount, count: preview.total })}
        </p>

        <AffectedTimeline preview={preview} danger={danger} />

        <p className="mt-2.5 flex items-start gap-1.5 text-caption text-muted-foreground">
          <Split size={13} className="mt-0.5 shrink-0" />
          <span>{caption}</span>
        </p>
      </div>

      {/* Bulk edit locks the per-occurrence date — a changed time still propagates. */}
      {!danger && scope !== 'THIS' && (
        <p className="flex items-start gap-1.5 rounded-lg bg-muted/60 px-3 py-2 text-caption text-muted-foreground">
          <Lock size={13} className="mt-0.5 shrink-0" />
          <span>{t('seriesScope.dateLocked')}</span>
        </p>
      )}
    </div>
  )
}

function AffectedTimeline({
  preview,
  danger,
}: {
  preview: NonNullable<ReturnType<typeof buildAffectedPreview>>
  danger: boolean
}) {
  const hit = danger ? 'bg-red' : 'bg-blue'
  return (
    <div className="mt-2 flex items-center gap-1" aria-hidden="true">
      {preview.nodes.map((node, i) => {
        // A split marker sits where affected and unaffected occurrences meet (edit's visual split).
        const prev = preview.nodes[i - 1]
        const boundary = prev && prev.affected !== node.affected
        return (
          <div key={node.id} className="flex items-center gap-1">
            {boundary && <span className="h-4 w-px shrink-0 bg-border" data-testid="split-marker" />}
            <span
              title={formatOccurrence(node.startTime)}
              className={[
                'h-2.5 w-2.5 rounded-full transition-colors',
                node.affected ? hit : 'bg-border',
                node.isCurrent ? (danger ? 'ring-2 ring-red/40' : 'ring-2 ring-blue/40') : '',
              ].join(' ')}
            />
          </div>
        )
      })}
    </div>
  )
}
