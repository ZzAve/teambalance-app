import { Plus, X } from 'lucide-react'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import type { ReferenceRow } from '../lib/references'
import { useTranslation } from 'react-i18next'

interface ReferenceRowsEditorProps {
  rows: ReferenceRow[]
  onChange: (rows: ReferenceRow[]) => void
  /** Helper line under the label — lets a caller clarify e.g. that links apply to a whole series. */
  hint?: string
}

/**
 * Repeatable label + URL rows for an event's links (references, ADR-0016). Purely presentational:
 * it owns no state, just renders the current rows and reports edits up. Blank rows and URL
 * normalization are handled by cleanReferences at submit time, not here.
 */
export function ReferenceRowsEditor({ rows, onChange, hint }: ReferenceRowsEditorProps) {
  const { t } = useTranslation()
  const update = (index: number, field: 'title' | 'url', value: string) =>
    onChange(rows.map((r, i) => (i === index ? { ...r, [field]: value } : r)))
  const add = () => onChange([...rows, { title: '', url: '' }])
  const remove = (index: number) => onChange(rows.filter((_, i) => i !== index))

  return (
    <div>
      <Label>{t('references.heading')}</Label>
      <p className="mb-1 text-caption text-muted-foreground">{hint ?? t('references.hint')}</p>
      <div className="flex flex-col gap-2">
        {rows.map((ref, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              aria-label={t('references.label', { n: i + 1 })}
              placeholder={t('references.labelPlaceholder')}
              value={ref.title}
              onChange={(e) => update(i, 'title', e.target.value)}
              className="w-2/5"
            />
            <Input
              aria-label={t('references.url', { n: i + 1 })}
              placeholder="https://…"
              value={ref.url}
              onChange={(e) => update(i, 'url', e.target.value)}
              className="flex-1"
            />
            <Button type="button" variant="ghost" size="icon" aria-label={t('references.remove', { n: i + 1 })} onClick={() => remove(i)}>
              <X size={16} />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="ghost" size="sm" className="mt-2 gap-1.5" onClick={add}>
        <Plus size={15} />
        {t('references.add')}
      </Button>
    </div>
  )
}
